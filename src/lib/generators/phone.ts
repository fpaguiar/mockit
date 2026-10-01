import { PROVINCES, type ProvinceCode } from "@/data/provinces";
import type { Rng } from "./rng";

/**
 * Generates a phone number with an area code from the given province. The local part
 * is always in 555-0100–0199, the range NANP reserves for fictional use, so a
 * generated number can never ring a real person.
 */
export function generatePhone(rng: Rng, province: ProvinceCode): string {
  const areaCode = rng.pick(PROVINCES[province].areaCodes);
  return `(${areaCode}) 555-01${String(rng.int(0, 99)).padStart(2, "0")}`;
}
