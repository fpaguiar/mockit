export const PROVINCE_CODES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
] as const;

export type ProvinceCode = (typeof PROVINCE_CODES)[number];

export interface ProvinceInfo {
  name: string;
  /** Approximate population in thousands (2025), used to weight random province selection. */
  population: number;
  /** Area codes in service, including overlays. */
  areaCodes: readonly string[];
  /** SIN first digits for people registered in this province. */
  sinFirstDigits: readonly number[];
  /** Valid first letters of postal codes (the FSA's postal district). */
  postalLetters: readonly string[];
  /** Rough median price of a home, used to size real-estate holdings. */
  medianHomePrice: number;
}

export const PROVINCES: Record<ProvinceCode, ProvinceInfo> = {
  AB: {
    name: "Alberta",
    population: 4960,
    areaCodes: ["403", "587", "825", "368", "780"],
    sinFirstDigits: [6],
    postalLetters: ["T"],
    medianHomePrice: 500_000,
  },
  BC: {
    name: "British Columbia",
    population: 5720,
    areaCodes: ["604", "778", "236", "672", "250", "257"],
    sinFirstDigits: [7],
    postalLetters: ["V"],
    medianHomePrice: 950_000,
  },
  MB: {
    name: "Manitoba",
    population: 1500,
    areaCodes: ["204", "431", "584"],
    sinFirstDigits: [6],
    postalLetters: ["R"],
    medianHomePrice: 370_000,
  },
  NB: {
    name: "New Brunswick",
    population: 860,
    areaCodes: ["506", "428"],
    sinFirstDigits: [1],
    postalLetters: ["E"],
    medianHomePrice: 320_000,
  },
  NL: {
    name: "Newfoundland and Labrador",
    population: 545,
    areaCodes: ["709", "879"],
    sinFirstDigits: [1],
    postalLetters: ["A"],
    medianHomePrice: 330_000,
  },
  NS: {
    name: "Nova Scotia",
    population: 1090,
    areaCodes: ["902", "782"],
    sinFirstDigits: [1],
    postalLetters: ["B"],
    medianHomePrice: 450_000,
  },
  NT: {
    name: "Northwest Territories",
    population: 45,
    areaCodes: ["867"],
    sinFirstDigits: [6],
    postalLetters: ["X"],
    medianHomePrice: 450_000,
  },
  NU: {
    name: "Nunavut",
    population: 41,
    areaCodes: ["867"],
    sinFirstDigits: [6],
    postalLetters: ["X"],
    medianHomePrice: 450_000,
  },
  ON: {
    name: "Ontario",
    population: 16_200,
    areaCodes: [
      "416",
      "647",
      "437",
      "942",
      "905",
      "289",
      "365",
      "742",
      "519",
      "226",
      "548",
      "382",
      "613",
      "343",
      "753",
      "705",
      "249",
      "683",
      "807",
    ],
    sinFirstDigits: [4, 5],
    postalLetters: ["K", "L", "M", "N", "P"],
    medianHomePrice: 850_000,
  },
  PE: {
    name: "Prince Edward Island",
    population: 180,
    areaCodes: ["902", "782"],
    sinFirstDigits: [1],
    postalLetters: ["C"],
    medianHomePrice: 380_000,
  },
  QC: {
    name: "Quebec",
    population: 9050,
    areaCodes: ["418", "581", "367", "450", "579", "354", "514", "438", "263", "819", "873", "468"],
    sinFirstDigits: [2, 3],
    postalLetters: ["G", "H", "J"],
    medianHomePrice: 500_000,
  },
  SK: {
    name: "Saskatchewan",
    population: 1250,
    areaCodes: ["306", "639", "474"],
    sinFirstDigits: [6],
    postalLetters: ["S"],
    medianHomePrice: 320_000,
  },
  YT: {
    name: "Yukon",
    population: 46,
    areaCodes: ["867"],
    sinFirstDigits: [7],
    postalLetters: ["Y"],
    medianHomePrice: 550_000,
  },
};
