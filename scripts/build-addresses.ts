/**
 * Builds public/addresses/{PROVINCE}.json from Statistics Canada's National Address Register.
 *
 *   1. Download the NAR zip (~1.7 GB) from
 *      https://www150.statcan.gc.ca/n1/pub/46-26-0002/462600022022001-eng.htm
 *      to scripts/.cache/nar.zip (or pass a path as the first argument).
 *   2. npm run build:addresses
 *
 * Each province's CSVs are streamed through `unzip -p` and reservoir-sampled with a fixed
 * seed, so re-running against the same release produces identical output.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { PROVINCES, type ProvinceCode } from "../src/data/provinces.ts";

const ZIP_PATH = process.argv[2] ?? "scripts/.cache/nar.zip";
const OUT_DIR = "public/addresses";
const SAMPLE_SIZE = 1500;
const TERRITORY_SAMPLE_SIZE = 500;
const SEED = 20260601;

/** Statistics Canada SGC province codes used in NAR file names. */
const SGC_CODES: Record<ProvinceCode, string> = {
  NL: "10",
  PE: "11",
  NS: "12",
  NB: "13",
  QC: "24",
  ON: "35",
  MB: "46",
  SK: "47",
  AB: "48",
  BC: "59",
  YT: "60",
  NT: "61",
  NU: "62",
};

/** French street types are written in lowercase before the name ("rue Viau"). */
const FRENCH_STREET_TYPES: Record<string, string> = {
  ALLÉE: "allée",
  AUT: "autoroute",
  AV: "avenue",
  BOUL: "boulevard",
  CAR: "carré",
  CERCLE: "cercle",
  CH: "chemin",
  COUR: "cour",
  COURS: "cours",
  CROIS: "croissant",
  CÔTE: "côte",
  IMP: "impasse",
  MONTÉE: "montée",
  PASSGE: "passage",
  PLACE: "place",
  PLAT: "plateau",
  PROM: "promenade",
  RANG: "rang",
  RLE: "ruelle",
  ROUTE: "route",
  RTE: "route",
  RUE: "rue",
  SENT: "sentier",
  TSSE: "terrasse",
};

/** Words kept lowercase inside place names, e.g. Saint-Jean-sur-Richelieu, Niagara-on-the-Lake. */
const PARTICLES = new Set([
  "de",
  "des",
  "du",
  "la",
  "le",
  "les",
  "sur",
  "en",
  "aux",
  "à",
  "on",
  "the",
  "of",
  "d",
  "l",
]);

const POSTAL_CODE = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;
const RESIDENTIAL_USES = new Set(["1", "2"]); // residential, partially residential
/** Skips free-form unit labels such as "LOT 1 BLOCK 30 TESLIN". */
const UNIT_LABEL = /^[A-Z0-9]{1,6}$/i;

type AddressRecord = [line1: string, city: string, postalCode: string];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      fields.push(field);
      field = "";
    } else field += ch;
  }
  fields.push(field);
  return fields;
}

/** "SAINT-JEAN-SUR-RICHELIEU" → "Saint-Jean-sur-Richelieu", "ST. JOHN'S" → "St. John's". */
export function titleCasePlace(value: string): string {
  let wordIndex = 0;
  return value.toLowerCase().replace(/[\p{L}\p{N}]+/gu, (word, offset: number, full: string) => {
    const prev = full[offset - 1];
    const isFirst = wordIndex++ === 0;
    // Possessive "'s" stays lowercase; elided "l'" / "d'" prefixes are handled by PARTICLES.
    if (prev === "'" && word === "s") return word;
    if (!isFirst && PARTICLES.has(word) && prev !== " ") return word;
    return word[0]?.toUpperCase() + word.slice(1);
  });
}

function formatLine1(row: Record<string, string>): string | null {
  const civic = row.CIVIC_NO + row.CIVIC_NO_SUFFIX;
  const name = row.OFFICIAL_STREET_NAME?.trim();
  if (!row.CIVIC_NO || !name) return null;
  if (row.APT_NO_LABEL && !UNIT_LABEL.test(row.APT_NO_LABEL)) return null;

  const type = row.OFFICIAL_STREET_TYPE ?? "";
  const frenchType = FRENCH_STREET_TYPES[type];
  const street = frenchType
    ? `${frenchType} ${name}`
    : type
      ? `${name} ${type[0]}${type.slice(1).toLowerCase()}`
      : name;
  const direction = row.OFFICIAL_STREET_DIR ? ` ${row.OFFICIAL_STREET_DIR}` : "";
  const unit = row.APT_NO_LABEL ? `${row.APT_NO_LABEL}-` : "";
  return `${unit}${civic} ${street}${direction}`;
}

function toRecord(row: Record<string, string>, province: ProvinceCode): AddressRecord | null {
  if (!RESIDENTIAL_USES.has(row.BU_USE ?? "")) return null;
  const postal = (row.MAIL_POSTAL_CODE ?? "").replace(/\s/g, "");
  if (!POSTAL_CODE.test(postal) || !PROVINCES[province].postalLetters.includes(postal[0] ?? "")) {
    return null;
  }
  const city = row.MAIL_MUN_NAME?.trim();
  const line1 = formatLine1(row);
  if (!city || !line1) return null;
  return [line1, titleCasePlace(city), `${postal.slice(0, 3)} ${postal.slice(3)}`];
}

async function listEntries(): Promise<string[]> {
  const output = await new Promise<string>((resolve, reject) => {
    let out = "";
    const proc = spawn("unzip", ["-Z1", ZIP_PATH]);
    proc.stdout.on("data", (chunk) => {
      out += chunk;
    });
    proc.on("error", reject);
    proc.on("close", (code) =>
      code === 0 ? resolve(out) : reject(new Error(`unzip exited ${code}`)),
    );
  });
  return output.split("\n").filter(Boolean);
}

async function sampleProvince(province: ProvinceCode, entries: string[]): Promise<AddressRecord[]> {
  const pattern = new RegExp(`^Addresses/Address_${SGC_CODES[province]}(_part_\\d+)?\\.csv$`);
  const files = entries.filter((e) => pattern.test(e));
  if (!files.length) throw new Error(`No NAR files found for ${province}`);

  const size = ["YT", "NT", "NU"].includes(province) ? TERRITORY_SAMPLE_SIZE : SAMPLE_SIZE;
  const random = mulberry32(SEED + Number(SGC_CODES[province]));
  const reservoir: AddressRecord[] = [];
  let seen = 0;

  for (const file of files) {
    const proc = spawn("unzip", ["-p", ZIP_PATH, file]);
    let header: string[] | null = null;
    for await (const rawLine of createInterface({
      input: proc.stdout,
      crlfDelay: Number.POSITIVE_INFINITY,
    })) {
      const line = rawLine.replace(/^﻿/, "");
      if (!header) {
        header = parseCsvLine(line);
        continue;
      }
      const values = parseCsvLine(line);
      const row = Object.fromEntries(header.map((h, i) => [h, values[i] ?? ""]));
      const record = toRecord(row, province);
      if (!record) continue;

      seen++;
      if (reservoir.length < size) reservoir.push(record);
      else {
        const j = Math.floor(random() * seen);
        if (j < size) reservoir[j] = record;
      }
    }
  }

  console.log(
    `${province}: sampled ${reservoir.length} of ${seen.toLocaleString()} residential addresses`,
  );
  return reservoir.sort((a, b) => a[2].localeCompare(b[2]) || a[0].localeCompare(b[0]));
}

async function main() {
  const entries = await listEntries();
  mkdirSync(OUT_DIR, { recursive: true });
  const provinces = Object.keys(SGC_CODES) as ProvinceCode[];
  await Promise.all(
    provinces.map(async (province) => {
      const records = await sampleProvince(province, entries);
      writeFileSync(`${OUT_DIR}/${province}.json`, `${JSON.stringify(records)}\n`);
    }),
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
