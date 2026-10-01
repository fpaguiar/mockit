import { ChevronDownIcon, MapPinIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PROVINCE_CODES, PROVINCES, type ProvinceCode } from "@/data/provinces";
import type { GeneratorSettings } from "@/hooks/use-generator";
import { MAX_AGE, MIN_AGE } from "@/lib/generators/constants";

interface ControlsProps {
  settings: GeneratorSettings;
  onChange: (settings: GeneratorSettings) => void;
}

function provinceSummary(provinces: readonly ProvinceCode[]): string {
  if (provinces.length === 0) return "All provinces & territories";
  if (provinces.length <= 3) return provinces.map((p) => PROVINCES[p].name).join(", ");
  return `${provinces.length} provinces & territories`;
}

export function Controls({ settings, onChange }: ControlsProps) {
  const { provinces, ageRange } = settings;

  function toggleProvince(code: ProvinceCode, checked: boolean) {
    const next = checked ? [...provinces, code] : provinces.filter((p) => p !== code);
    // Selecting every province is the same as no filter.
    const normalized = next.length === PROVINCE_CODES.length ? [] : next.sort();
    onChange({ ...settings, provinces: normalized });
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>Location</Label>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="w-full justify-between font-normal">
                <span className="flex min-w-0 items-center gap-2">
                  <MapPinIcon className="text-muted-foreground" />
                  <span className="truncate">{provinceSummary(provinces)}</span>
                </span>
                <ChevronDownIcon className="text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={provinces.length === 0}
                onCheckedChange={() => onChange({ ...settings, provinces: [] })}
              >
                All provinces & territories
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Only include</DropdownMenuLabel>
              {PROVINCE_CODES.map((code) => (
                <DropdownMenuCheckboxItem
                  key={code}
                  checked={provinces.includes(code)}
                  onCheckedChange={(checked) => toggleProvince(code, checked)}
                >
                  <span className="w-7 font-mono text-xs text-muted-foreground">{code}</span>
                  {PROVINCES[code].name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>Age range</Label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {ageRange[0]} – {ageRange[1]}
          </span>
        </div>
        <div className="flex h-8 items-center">
          <Slider
            aria-label="Age range"
            min={MIN_AGE}
            max={MAX_AGE}
            minStepsBetweenValues={0}
            value={ageRange}
            onValueChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                onChange({ ...settings, ageRange: [value[0], value[1]] as [number, number] });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
