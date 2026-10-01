import { PROVINCE_CODES, PROVINCES, type ProvinceCode } from "@/data/provinces";
import type { Rng } from "./rng";

/** Compact on-disk format of a real address: [line1, city, postalCode]. */
export type AddressRecord = readonly [line1: string, city: string, postalCode: string];

export type AddressPools = Partial<Record<ProvinceCode, readonly AddressRecord[]>>;

export interface Address {
  line1: string;
  city: string;
  province: ProvinceCode;
  postalCode: string;
}

/** Picks one of the allowed provinces, weighted by population. */
export function pickProvince(
  rng: Rng,
  allowed: readonly ProvinceCode[] = PROVINCE_CODES,
): ProvinceCode {
  return rng.weighted(allowed, (code) => PROVINCES[code].population);
}

export function generateAddress(rng: Rng, province: ProvinceCode, pools: AddressPools): Address {
  const pool = pools[province];
  if (!pool?.length) throw new Error(`No addresses loaded for ${province}`);
  const [line1, city, postalCode] = rng.pick(pool);
  return { line1, city, province, postalCode };
}
