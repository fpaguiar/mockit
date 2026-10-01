import { describe, expect, it } from "vitest";
import { COLUMNS } from "@/lib/columns";
import type { Person } from "@/lib/generators";
import { toCsv } from "./csv";
import { toRecords } from "./json";

const person = {
  firstName: 'Jean "JJ"',
  lastName: "Tremblay, Jr.",
  employment: { employer: null, annualIncome: 50_000 },
} as unknown as Person;

const columns = COLUMNS.filter((c) =>
  ["firstName", "lastName", "employer", "annualIncome"].includes(c.key),
);

describe("export", () => {
  it("escapes CSV values and leaves nulls empty", () => {
    expect(toCsv([person], columns)).toBe(
      'firstName,lastName,employer,annualIncome\r\n"Jean ""JJ""","Tremblay, Jr.",,50000',
    );
  });

  it("flattens records to visible columns", () => {
    expect(toRecords([person], columns)).toEqual([
      { firstName: 'Jean "JJ"', lastName: "Tremblay, Jr.", employer: null, annualIncome: 50000 },
    ]);
  });
});
