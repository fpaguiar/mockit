import { describe, expect, it } from "vitest";
import { PROVINCE_CODES, PROVINCES, type ProvinceCode } from "@/data/provinces";
import type { AddressPools } from "./address";
import { isLuhnValid } from "./luhn";
import { ageOn, generatePeople } from "./person";

const refDate = new Date("2026-10-01T12:00:00Z");

// One fake-but-well-formed address per province.
const pools: AddressPools = Object.fromEntries(
  PROVINCE_CODES.map((code) => [
    code,
    [[`1 Test St`, `${code} City`, `${PROVINCES[code].postalLetters[0]}1A 1A1`]],
  ]),
);

const people = generatePeople(10_000, { ageMin: 18, ageMax: 100, refDate }, pools, 1234);

describe("generatePeople", () => {
  it("is reproducible from a seed", () => {
    const a = generatePeople(5, { ageMin: 18, ageMax: 100, refDate }, pools, 42);
    const b = generatePeople(5, { ageMin: 18, ageMax: 100, refDate }, pools, 42);
    expect(a).toEqual(b);
  });

  it("generates Luhn-valid SINs whose first digit matches the province", () => {
    for (const p of people) {
      expect(p.sin).toMatch(/^\d{3} \d{3} \d{3}$/);
      expect(isLuhnValid(p.sin)).toBe(true);
      expect(PROVINCES[p.address.province].sinFirstDigits).toContain(Number(p.sin[0]));
    }
  });

  it("uses an area code from the person's province and a fictional local number", () => {
    for (const p of people) {
      const match = p.phone.match(/^\((\d{3})\) 555-01\d{2}$/);
      expect(match).not.toBeNull();
      expect(PROVINCES[p.address.province].areaCodes).toContain(match?.[1]);
    }
  });

  it("only uses reserved email domains", () => {
    for (const p of people) {
      expect(p.email).toMatch(/^[a-z0-9._]+@example\.(com|net|org)$/);
    }
  });

  it("respects the age range", () => {
    const narrow = generatePeople(2000, { ageMin: 30, ageMax: 40, refDate }, pools, 7);
    for (const p of narrow) {
      expect(p.age).toBeGreaterThanOrEqual(30);
      expect(p.age).toBeLessThanOrEqual(40);
      expect(ageOn(new Date(p.dateOfBirth), refDate)).toBe(p.age);
    }
  });

  it("respects the province filter", () => {
    const filter: ProvinceCode[] = ["QC", "NS"];
    const filtered = generatePeople(
      1000,
      { provinces: filter, ageMin: 18, ageMax: 100, refDate },
      pools,
      9,
    );
    expect(new Set(filtered.map((p) => p.address.province))).toEqual(new Set(filter));
  });

  it("keeps employment consistent with status", () => {
    for (const { employment: e } of people) {
      expect(e.annualIncome).toBeGreaterThanOrEqual(0);
      const working = e.status === "Employed" || e.status === "Self-employed";
      expect(e.industry !== null).toBe(working);
      expect(e.jobTitle !== null).toBe(working);
    }
  });

  it("keeps financials internally consistent", () => {
    for (const { financials: f } of people) {
      for (const value of [f.liquidAssets, f.fixedAssets, f.mortgageDebt, f.otherDebts]) {
        expect(value).toBeGreaterThanOrEqual(0);
      }
      expect(f.mortgageDebt).toBeLessThanOrEqual(f.fixedAssets);
      expect(f.netWorth).toBe(f.liquidAssets + f.fixedAssets - f.mortgageDebt - f.otherDebts);
    }
  });

  it("produces plausible distributions", () => {
    const share = (pred: (p: (typeof people)[number]) => boolean) =>
      people.filter(pred).length / people.length;
    expect(share((p) => p.address.province === "ON")).toBeGreaterThan(0.3);
    expect(share((p) => p.financials.mortgageDebt > 0)).toBeGreaterThan(0.2);
    expect(share((p) => p.employment.status === "Retired")).toBeGreaterThan(0.1);
  });
});
