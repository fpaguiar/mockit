import type { Column } from "@/lib/columns";
import type { Person } from "@/lib/generators";

function escapeCsv(value: string | number | null): string {
  if (value === null) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(people: readonly Person[], columns: readonly Column[]): string {
  const header = columns.map((c) => escapeCsv(c.key)).join(",");
  const rows = people.map((p) => columns.map((c) => escapeCsv(c.get(p))).join(","));
  return [header, ...rows].join("\r\n");
}
