import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { AddressRecord } from "@/lib/generators";
import { PROVINCE_CODES, PROVINCES } from "./provinces";

describe.each(PROVINCE_CODES)("public/addresses/%s.json", (code) => {
  const records = JSON.parse(
    readFileSync(new URL(`../../public/addresses/${code}.json`, import.meta.url), "utf8"),
  ) as AddressRecord[];

  it("has a reasonable sample size", () => {
    expect(records.length).toBeGreaterThanOrEqual(100);
  });

  it("contains well-formed addresses in the right postal district", () => {
    for (const [line1, city, postalCode] of records) {
      expect(line1).toMatch(/^\S*\d\S* \S/);
      expect(city.length).toBeGreaterThan(0);
      expect(postalCode).toMatch(/^[A-Z]\d[A-Z] \d[A-Z]\d$/);
      expect(PROVINCES[code].postalLetters).toContain(postalCode[0]);
    }
  });
});
