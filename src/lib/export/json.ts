import type { CellValue, Column } from "@/lib/columns";
import type { Person } from "@/lib/generators";

export function toRecords(
  people: readonly Person[],
  columns: readonly Column[],
): Record<string, CellValue>[] {
  return people.map((p) => Object.fromEntries(columns.map((c) => [c.key, c.get(p)])));
}

export function toJson(people: readonly Person[], columns: readonly Column[]): string {
  return JSON.stringify(toRecords(people, columns), null, 2);
}
