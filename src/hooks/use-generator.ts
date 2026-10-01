import { useCallback, useState } from "react";
import { PROVINCE_CODES, type ProvinceCode } from "@/data/provinces";
import { loadAddressPools } from "@/lib/addresses";
import type { GenerateOptions, Person } from "@/lib/generators";

export interface GeneratorSettings {
  provinces: ProvinceCode[];
  ageRange: [number, number];
}

export function useGenerator({ provinces, ageRange }: GeneratorSettings) {
  const [loading, setLoading] = useState(false);

  const generate = useCallback(
    async (count: number): Promise<Person[]> => {
      setLoading(true);
      try {
        // Faker's locale data is large, so the generator is code-split and loaded in
        // parallel with the address files.
        const [{ generatePeople }, pools] = await Promise.all([
          import("@/lib/generators"),
          loadAddressPools(provinces.length ? provinces : PROVINCE_CODES),
        ]);
        const options: GenerateOptions = { provinces, ageMin: ageRange[0], ageMax: ageRange[1] };
        return generatePeople(count, options, pools);
      } finally {
        setLoading(false);
      }
    },
    [provinces, ageRange],
  );

  return { generate, loading };
}
