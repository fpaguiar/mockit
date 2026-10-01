import type { ProvinceCode } from "@/data/provinces";
import { type Address, type AddressPools, generateAddress, pickProvince } from "./address";
import { generateEmail } from "./email";
import { type Employment, generateEmployment } from "./employment";
import { type Financials, generateFinancials } from "./financials";
import { generatePhone } from "./phone";
import { createRng, type Rng } from "./rng";
import { generateSin } from "./sin";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  /** ISO date, YYYY-MM-DD. */
  dateOfBirth: string;
  age: number;
  email: string;
  phone: string;
  sin: string;
  address: Address;
  employment: Employment;
  financials: Financials;
}

export interface GenerateOptions {
  /** Restrict to these provinces; all provinces when empty or omitted. */
  provinces?: readonly ProvinceCode[];
  ageMin: number;
  ageMax: number;
  /** Date ages are computed against. Defaults to now. */
  refDate?: Date;
}

/** Share of Quebec residents given French names. */
const QC_FRENCH_NAME_RATE = 0.75;

export function generatePerson(rng: Rng, options: GenerateOptions, pools: AddressPools): Person {
  const refDate = options.refDate ?? new Date();
  const province = pickProvince(rng, options.provinces?.length ? options.provinces : undefined);
  const faker = province === "QC" && rng.chance(QC_FRENCH_NAME_RATE) ? rng.fr : rng.en;

  const sex = rng.chance(0.5) ? "female" : "male";
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const dob = faker.date.birthdate({
    mode: "age",
    min: options.ageMin,
    max: options.ageMax,
    refDate,
  });
  const age = ageOn(dob, refDate);
  const employment = generateEmployment(rng, age);

  return {
    id: rng.en.string.uuid(),
    firstName,
    lastName,
    dateOfBirth: toIsoDate(dob),
    age,
    email: generateEmail(rng, firstName, lastName),
    phone: generatePhone(rng, province),
    sin: generateSin(rng, province),
    address: generateAddress(rng, province, pools),
    employment,
    financials: generateFinancials(rng, age, province, employment),
  };
}

export function generatePeople(
  count: number,
  options: GenerateOptions,
  pools: AddressPools,
  seed?: number,
): Person[] {
  const rng = createRng(seed);
  return Array.from({ length: count }, () => generatePerson(rng, options, pools));
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function ageOn(dob: Date, refDate: Date): number {
  let age = refDate.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = refDate.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}
