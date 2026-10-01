import { PROVINCES, type ProvinceCode } from "@/data/provinces";
import type { Employment } from "./employment";
import type { Rng } from "./rng";

export interface Financials {
  /** Cash, TFSA, RRSP and non-registered investments. */
  liquidAssets: number;
  /** Real estate and vehicles. */
  fixedAssets: number;
  mortgageDebt: number;
  /** Credit cards, lines of credit, car and student loans. */
  otherDebts: number;
  netWorth: number;
}

const HOMEOWNERSHIP_BY_AGE: [maxAge: number, probability: number][] = [
  [24, 0.12],
  [34, 0.45],
  [44, 0.62],
  [54, 0.7],
  [64, 0.75],
  [Number.POSITIVE_INFINITY, 0.75],
];

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function generateFinancials(
  rng: Rng,
  age: number,
  province: ProvinceCode,
  employment: Employment,
): Financials {
  const workingYears = Math.max(0, Math.min(age, 65) - 22);
  // Retirees saved out of a pre-retirement income roughly 1.6x their pension.
  const careerIncome =
    employment.status === "Retired"
      ? employment.annualIncome * 1.6
      : Math.max(employment.annualIncome, 25_000);

  const liquidAssets = roundTo(
    rng.logNormal(careerIncome * 0.07 * Math.max(workingYears, 0.5), 0.8),
    100,
  );

  const ownsHome = rng.chance(HOMEOWNERSHIP_BY_AGE.find(([maxAge]) => age <= maxAge)?.[1] ?? 0);
  const homeValue = ownsHome ? rng.logNormal(PROVINCES[province].medianHomePrice, 0.35) : 0;
  const vehicleValue = rng.chance(0.75) ? rng.logNormal(18_000, 0.6) : 0;
  const fixedAssets = roundTo(homeValue + vehicleValue, 1000);

  let mortgageDebt = 0;
  if (ownsHome) {
    // Mortgages amortize over ~25 years from a purchase around age 30–40.
    const yearsSincePurchase = Math.max(0, age - rng.int(28, 40));
    const remaining = Math.max(0, 1 - yearsSincePurchase / 25);
    const initialLtv = 0.65 + rng.next() * 0.25;
    mortgageDebt = roundTo(homeValue * initialLtv * remaining, 1000);
  }

  let otherDebts = 0;
  if (employment.status === "Student" || (age < 35 && rng.chance(0.4))) {
    otherDebts += rng.next() * 35_000; // student loans
  }
  if (rng.chance(0.7)) {
    otherDebts += rng.logNormal(12_000 * Math.sqrt(careerIncome / 60_000), 0.9);
  }
  otherDebts = roundTo(otherDebts, 100);

  return {
    liquidAssets,
    fixedAssets,
    mortgageDebt,
    otherDebts,
    netWorth: liquidAssets + fixedAssets - mortgageDebt - otherDebts,
  };
}
