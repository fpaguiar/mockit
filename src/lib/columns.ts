import type { Person } from "@/lib/generators";

export type ColumnGroup = "Identity" | "Address" | "Employment" | "Financials";
export type CellValue = string | number | null;

export interface Column {
  key: string;
  label: string;
  group: ColumnGroup;
  kind?: "currency";
  get: (p: Person) => CellValue;
}

/** Single source of truth for field order, labels and flattening (table, CSV, JSON). */
export const COLUMNS: readonly Column[] = [
  { key: "firstName", label: "First name", group: "Identity", get: (p) => p.firstName },
  { key: "lastName", label: "Last name", group: "Identity", get: (p) => p.lastName },
  { key: "dateOfBirth", label: "Date of birth", group: "Identity", get: (p) => p.dateOfBirth },
  { key: "age", label: "Age", group: "Identity", get: (p) => p.age },
  { key: "email", label: "Email", group: "Identity", get: (p) => p.email },
  { key: "phone", label: "Phone", group: "Identity", get: (p) => p.phone },
  { key: "sin", label: "SIN", group: "Identity", get: (p) => p.sin },
  { key: "addressLine1", label: "Street", group: "Address", get: (p) => p.address.line1 },
  { key: "city", label: "City", group: "Address", get: (p) => p.address.city },
  { key: "province", label: "Province", group: "Address", get: (p) => p.address.province },
  { key: "postalCode", label: "Postal code", group: "Address", get: (p) => p.address.postalCode },
  {
    key: "employmentStatus",
    label: "Status",
    group: "Employment",
    get: (p) => p.employment.status,
  },
  { key: "employer", label: "Employer", group: "Employment", get: (p) => p.employment.employer },
  { key: "jobTitle", label: "Job title", group: "Employment", get: (p) => p.employment.jobTitle },
  { key: "industry", label: "Industry", group: "Employment", get: (p) => p.employment.industry },
  {
    key: "annualIncome",
    label: "Annual income",
    group: "Employment",
    kind: "currency",
    get: (p) => p.employment.annualIncome,
  },
  {
    key: "liquidAssets",
    label: "Liquid assets",
    group: "Financials",
    kind: "currency",
    get: (p) => p.financials.liquidAssets,
  },
  {
    key: "fixedAssets",
    label: "Fixed assets",
    group: "Financials",
    kind: "currency",
    get: (p) => p.financials.fixedAssets,
  },
  {
    key: "mortgageDebt",
    label: "Mortgage debt",
    group: "Financials",
    kind: "currency",
    get: (p) => p.financials.mortgageDebt,
  },
  {
    key: "otherDebts",
    label: "Other debts",
    group: "Financials",
    kind: "currency",
    get: (p) => p.financials.otherDebts,
  },
  {
    key: "netWorth",
    label: "Net worth",
    group: "Financials",
    kind: "currency",
    get: (p) => p.financials.netWorth,
  },
];

export const COLUMN_GROUPS: readonly ColumnGroup[] = [
  "Identity",
  "Address",
  "Employment",
  "Financials",
];

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export function formatCell(column: Column, value: CellValue): string {
  if (value === null) return "—";
  if (column.kind === "currency" && typeof value === "number") return currency.format(value);
  return String(value);
}
