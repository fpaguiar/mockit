import type { ProvinceCode } from "@/data/provinces";
import type { AddressPools, AddressRecord } from "@/lib/generators";

const cache = new Map<ProvinceCode, Promise<readonly AddressRecord[]>>();

function loadProvince(code: ProvinceCode): Promise<readonly AddressRecord[]> {
  let pending = cache.get(code);
  if (!pending) {
    pending = fetch(`${import.meta.env.BASE_URL}addresses/${code}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load addresses for ${code} (${res.status})`);
      return res.json() as Promise<AddressRecord[]>;
    });
    // Let a failed request be retried on the next call.
    pending.catch(() => cache.delete(code));
    cache.set(code, pending);
  }
  return pending;
}

/** Fetches (and caches) the real-address pools for the given provinces. */
export async function loadAddressPools(codes: readonly ProvinceCode[]): Promise<AddressPools> {
  const pools = await Promise.all(codes.map(loadProvince));
  return Object.fromEntries(codes.map((code, i) => [code, pools[i]]));
}
