import { INDUSTRIES } from "@/data/industries";
import type { Rng } from "./rng";

export type EmploymentStatus = "Employed" | "Self-employed" | "Unemployed" | "Student" | "Retired";

export interface Employment {
  status: EmploymentStatus;
  employer: string | null;
  jobTitle: string | null;
  industry: string | null;
  annualIncome: number;
}

const STATUS_WEIGHTS: { maxAge: number; weights: [EmploymentStatus, number][] }[] = [
  {
    maxAge: 24,
    weights: [
      ["Employed", 50],
      ["Student", 35],
      ["Unemployed", 10],
      ["Self-employed", 5],
    ],
  },
  {
    maxAge: 64,
    weights: [
      ["Employed", 79],
      ["Self-employed", 13],
      ["Unemployed", 6],
      ["Student", 1],
      ["Retired", 1],
    ],
  },
  {
    maxAge: Number.POSITIVE_INFINITY,
    weights: [
      ["Retired", 80],
      ["Employed", 14],
      ["Self-employed", 6],
    ],
  },
];

/** Earnings peak mid-career. */
function ageIncomeFactor(age: number): number {
  if (age < 25) return 0.6;
  if (age < 35) return 0.9;
  if (age < 55) return 1.1;
  return 1.0;
}

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function generateEmployment(rng: Rng, age: number): Employment {
  const bracket = STATUS_WEIGHTS.find((b) => age <= b.maxAge) ?? STATUS_WEIGHTS[0];
  const [status] = rng.weighted(bracket?.weights ?? [], ([, weight]) => weight);

  switch (status) {
    case "Employed":
    case "Self-employed": {
      const industry = rng.weighted(INDUSTRIES, (i) => i.share);
      const selfEmployed = status === "Self-employed";
      const median = industry.medianIncome * ageIncomeFactor(age);
      return {
        status,
        employer: selfEmployed ? "Self-employed" : rng.en.company.name(),
        jobTitle: rng.pick(industry.jobTitles),
        industry: industry.name,
        annualIncome: roundTo(rng.logNormal(median, selfEmployed ? 0.6 : 0.35), 100),
      };
    }
    case "Retired":
      // CPP + OAS + private pension.
      return nullJob(status, roundTo(rng.logNormal(38_000, 0.4), 100));
    case "Student":
      return nullJob(status, roundTo(rng.next() * 18_000, 100));
    default:
      // Employment insurance or nothing.
      return nullJob(status, rng.chance(0.6) ? roundTo(rng.next() * 15_000, 100) : 0);
  }
}

function nullJob(status: EmploymentStatus, annualIncome: number): Employment {
  return { status, employer: null, jobTitle: null, industry: null, annualIncome };
}
