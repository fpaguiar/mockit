import { Columns3Icon, DownloadIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COLUMN_GROUPS, COLUMNS, formatCell } from "@/lib/columns";
import { toCsv } from "@/lib/export/csv";
import { downloadFile } from "@/lib/export/download";
import { toJson } from "@/lib/export/json";
import type { Person } from "@/lib/generators";

export const MAX_BULK = 1000;
const PREVIEW_ROWS = 50;

interface BulkPanelProps {
  people: Person[];
  count: number;
  onCountChange: (count: number) => void;
  visibleKeys: string[];
  onVisibleKeysChange: (keys: string[]) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function BulkPanel({
  people,
  count,
  onCountChange,
  visibleKeys,
  onVisibleKeysChange,
  onGenerate,
  loading,
}: BulkPanelProps) {
  const columns = COLUMNS.filter((c) => visibleKeys.includes(c.key));
  const stamp = new Date().toISOString().slice(0, 10);

  function toggleColumn(key: string, checked: boolean) {
    // Keep the canonical column order regardless of toggle order.
    const next = new Set(visibleKeys);
    if (checked) next.add(key);
    else next.delete(key);
    onVisibleKeysChange(COLUMNS.filter((c) => next.has(c.key)).map((c) => c.key));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-2">
          <Label htmlFor="bulk-count">Rows</Label>
          <Input
            id="bulk-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_BULK}
            value={count}
            onChange={(e) => {
              const n = Math.round(Number(e.target.value));
              onCountChange(Number.isFinite(n) ? Math.min(Math.max(n, 1), MAX_BULK) : 1);
            }}
            className="w-28"
          />
        </div>
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
          Generate {count}
        </Button>

        <div className="ml-auto flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline">
                  <Columns3Icon />
                  Columns ({columns.length})
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="max-h-96 w-60">
              {COLUMN_GROUPS.map((group, i) => (
                <DropdownMenuGroup key={group}>
                  {i > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel>{group}</DropdownMenuLabel>
                  {COLUMNS.filter((c) => c.group === group).map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.key}
                      checked={visibleKeys.includes(c.key)}
                      onCheckedChange={(checked) => toggleColumn(c.key, checked)}
                    >
                      {c.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            disabled={!people.length || !columns.length}
            onClick={() =>
              downloadFile(`mockit-${stamp}.csv`, toCsv(people, columns), "text/csv;charset=utf-8")
            }
          >
            <DownloadIcon />
            CSV
          </Button>
          <Button
            variant="outline"
            disabled={!people.length || !columns.length}
            onClick={() =>
              downloadFile(`mockit-${stamp}.json`, toJson(people, columns), "application/json")
            }
          >
            <DownloadIcon />
            JSON
          </Button>
        </div>
      </div>

      {people.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((c) => (
                    <TableHead key={c.key} className="whitespace-nowrap">
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {people.slice(0, PREVIEW_ROWS).map((p) => (
                  <TableRow key={p.id}>
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={c.kind === "currency" ? "text-right tabular-nums" : undefined}
                      >
                        {formatCell(c, c.get(p))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground">
            {people.length > PREVIEW_ROWS
              ? `Previewing ${PREVIEW_ROWS} of ${people.length} rows. Downloads include all rows.`
              : `${people.length} rows.`}
          </p>
        </>
      )}
    </div>
  );
}
