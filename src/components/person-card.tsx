import { CopyButton } from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLUMN_GROUPS, COLUMNS, formatCell } from "@/lib/columns";
import type { Person } from "@/lib/generators";

export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {COLUMN_GROUPS.map((group) => (
        <Card key={group} size="sm">
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {group}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              {COLUMNS.filter((c) => c.group === group).map((column) => {
                const value = column.get(person);
                return (
                  <div
                    key={column.key}
                    className="group flex items-center justify-between gap-3 py-1.5"
                  >
                    <dt className="shrink-0 text-sm text-muted-foreground">{column.label}</dt>
                    <dd className="flex min-w-0 items-center gap-1">
                      <span className="truncate text-right text-sm font-medium tabular-nums">
                        {formatCell(column, value)}
                      </span>
                      {value !== null ? (
                        <CopyButton
                          value={String(value)}
                          label={column.label}
                          className="opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                        />
                      ) : (
                        <span className="size-7" />
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
