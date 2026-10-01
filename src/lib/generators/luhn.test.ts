import { describe, expect, it } from "vitest";
import { isLuhnValid, luhnCheckDigit } from "./luhn";

describe("luhn", () => {
  it("computes known check digits", () => {
    // 046 454 286 is the canonical example SIN from the Government of Canada.
    expect(luhnCheckDigit("04645428")).toBe(6);
    expect(luhnCheckDigit("7992739871")).toBe(3);
  });

  it("validates numbers, ignoring formatting", () => {
    expect(isLuhnValid("046 454 286")).toBe(true);
    expect(isLuhnValid("046 454 287")).toBe(false);
    expect(isLuhnValid("4111-1111-1111-1111")).toBe(true);
    expect(isLuhnValid("1")).toBe(false);
  });
});
