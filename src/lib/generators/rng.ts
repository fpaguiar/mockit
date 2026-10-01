import { base, en, en_CA, Faker, fr, fr_CA, generateMersenne53Randomizer } from "@faker-js/faker";

/**
 * A pair of Faker instances (English and French Canadian) that share one seeded
 * randomizer, so a whole generation run is reproducible from a single seed.
 */
export interface Rng {
  en: Faker;
  fr: Faker;
  /** Uniform float in [0, 1). */
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  weighted<T>(items: readonly T[], weight: (item: T) => number): T;
  chance(probability: number): boolean;
  /** Log-normal sample with the given median and sigma (spread). */
  logNormal(median: number, sigma: number): number;
}

export function createRng(seed: number = Date.now()): Rng {
  const randomizer = generateMersenne53Randomizer(seed);
  const enFaker = new Faker({ locale: [en_CA, en, base], randomizer });
  const frFaker = new Faker({ locale: [fr_CA, fr, en, base], randomizer });
  const next = () => randomizer.next();

  return {
    en: enFaker,
    fr: frFaker,
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (items) => {
      if (items.length === 0) throw new Error("Cannot pick from an empty list");
      return items[Math.floor(next() * items.length)] as (typeof items)[number];
    },
    weighted: (items, weight) => {
      const total = items.reduce((sum, item) => sum + weight(item), 0);
      let r = next() * total;
      for (const item of items) {
        r -= weight(item);
        if (r < 0) return item;
      }
      return items[items.length - 1] as (typeof items)[number];
    },
    chance: (probability) => next() < probability,
    logNormal: (median, sigma) => {
      // Box-Muller transform; 1 - next() avoids log(0).
      const z = Math.sqrt(-2 * Math.log(1 - next())) * Math.cos(2 * Math.PI * next());
      return median * Math.exp(sigma * z);
    },
  };
}
