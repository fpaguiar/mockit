export interface Industry {
  /** NAICS 2-digit sector code. */
  naics: string;
  name: string;
  /** Approximate share of Canadian employment (%), used as a selection weight. */
  share: number;
  /** Rough median annual employment income (CAD) for a mid-career worker. */
  medianIncome: number;
  jobTitles: readonly string[];
}

export const INDUSTRIES: readonly Industry[] = [
  {
    naics: "11",
    name: "Agriculture, forestry, fishing and hunting",
    share: 2,
    medianIncome: 48_000,
    jobTitles: ["Farm Manager", "Agricultural Technician", "Forestry Technician", "Fisher"],
  },
  {
    naics: "21",
    name: "Mining, quarrying, and oil and gas extraction",
    share: 1.5,
    medianIncome: 110_000,
    jobTitles: [
      "Petroleum Engineer",
      "Geologist",
      "Heavy Equipment Operator",
      "Drilling Supervisor",
    ],
  },
  {
    naics: "22",
    name: "Utilities",
    share: 0.8,
    medianIncome: 105_000,
    jobTitles: [
      "Power Line Technician",
      "Electrical Engineer",
      "Plant Operator",
      "Water Treatment Operator",
    ],
  },
  {
    naics: "23",
    name: "Construction",
    share: 8,
    medianIncome: 68_000,
    jobTitles: ["Carpenter", "Electrician", "Plumber", "Project Manager", "Site Supervisor"],
  },
  {
    naics: "31-33",
    name: "Manufacturing",
    share: 9,
    medianIncome: 62_000,
    jobTitles: [
      "Machinist",
      "Production Supervisor",
      "Quality Assurance Technician",
      "Process Engineer",
    ],
  },
  {
    naics: "41",
    name: "Wholesale trade",
    share: 3.5,
    medianIncome: 65_000,
    jobTitles: [
      "Sales Representative",
      "Purchasing Agent",
      "Logistics Coordinator",
      "Account Manager",
    ],
  },
  {
    naics: "44-45",
    name: "Retail trade",
    share: 11,
    medianIncome: 38_000,
    jobTitles: [
      "Retail Sales Associate",
      "Cashier",
      "Store Manager",
      "Visual Merchandiser",
      "Pharmacist",
    ],
  },
  {
    naics: "48-49",
    name: "Transportation and warehousing",
    share: 5,
    medianIncome: 60_000,
    jobTitles: ["Truck Driver", "Warehouse Associate", "Dispatcher", "Airline Pilot", "Courier"],
  },
  {
    naics: "51",
    name: "Information and cultural industries",
    share: 2.5,
    medianIncome: 75_000,
    jobTitles: ["Journalist", "Video Editor", "Network Administrator", "Content Producer"],
  },
  {
    naics: "52",
    name: "Finance and insurance",
    share: 5,
    medianIncome: 85_000,
    jobTitles: [
      "Financial Advisor",
      "Insurance Underwriter",
      "Bank Teller",
      "Financial Analyst",
      "Actuary",
    ],
  },
  {
    naics: "53",
    name: "Real estate and rental and leasing",
    share: 1.5,
    medianIncome: 60_000,
    jobTitles: ["Real Estate Agent", "Property Manager", "Leasing Consultant", "Appraiser"],
  },
  {
    naics: "54",
    name: "Professional, scientific and technical services",
    share: 9,
    medianIncome: 82_000,
    jobTitles: ["Software Developer", "Accountant", "Lawyer", "Architect", "Management Consultant"],
  },
  {
    naics: "55",
    name: "Management of companies and enterprises",
    share: 0.5,
    medianIncome: 90_000,
    jobTitles: ["Operations Director", "Business Analyst", "Corporate Controller"],
  },
  {
    naics: "56",
    name: "Administrative and support, waste management and remediation services",
    share: 4,
    medianIncome: 45_000,
    jobTitles: ["Administrative Assistant", "Security Guard", "Janitor", "Call Centre Agent"],
  },
  {
    naics: "61",
    name: "Educational services",
    share: 7.5,
    medianIncome: 68_000,
    jobTitles: [
      "Elementary School Teacher",
      "High School Teacher",
      "Professor",
      "Early Childhood Educator",
    ],
  },
  {
    naics: "62",
    name: "Health care and social assistance",
    share: 13.5,
    medianIncome: 60_000,
    jobTitles: [
      "Registered Nurse",
      "Personal Support Worker",
      "Physician",
      "Physiotherapist",
      "Social Worker",
    ],
  },
  {
    naics: "71",
    name: "Arts, entertainment and recreation",
    share: 2,
    medianIncome: 40_000,
    jobTitles: ["Fitness Instructor", "Musician", "Event Coordinator", "Graphic Designer"],
  },
  {
    naics: "72",
    name: "Accommodation and food services",
    share: 6,
    medianIncome: 30_000,
    jobTitles: ["Server", "Line Cook", "Hotel Front Desk Agent", "Restaurant Manager", "Chef"],
  },
  {
    naics: "81",
    name: "Other services (except public administration)",
    share: 4,
    medianIncome: 45_000,
    jobTitles: ["Automotive Technician", "Hairstylist", "Dry Cleaner", "Program Coordinator"],
  },
  {
    naics: "91",
    name: "Public administration",
    share: 6.5,
    medianIncome: 85_000,
    jobTitles: [
      "Policy Analyst",
      "Police Officer",
      "Firefighter",
      "Program Officer",
      "Tax Auditor",
    ],
  },
];
