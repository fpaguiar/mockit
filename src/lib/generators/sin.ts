import { PROVINCES, type ProvinceCode } from "@/data/provinces";
import { luhnCheckDigit } from "./luhn";
import type { Rng } from "./rng";

/** Generates a Luhn-valid SIN whose first digit matches the province of registration. */
export function generateSin(rng: Rng, province: ProvinceCode): string {
  let payload = String(rng.pick(PROVINCES[province].sinFirstDigits));
  for (let i = 0; i < 7; i++) payload += rng.int(0, 9);
  const sin = payload + luhnCheckDigit(payload);
  return `${sin.slice(0, 3)} ${sin.slice(3, 6)} ${sin.slice(6)}`;
}
