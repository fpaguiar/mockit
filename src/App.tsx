import { BracesIcon, Loader2Icon, RefreshCwIcon } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BulkPanel } from "@/components/bulk-panel";
import { Controls } from "@/components/controls";
import { CopyButton } from "@/components/copy-button";
import { PersonCard } from "@/components/person-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GeneratorSettings, useGenerator } from "@/hooks/use-generator";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { COLUMNS } from "@/lib/columns";
import type { Person } from "@/lib/generators";

const DEFAULT_SETTINGS: GeneratorSettings = { provinces: [], ageRange: [18, 80] };

function Mockit() {
  const [settings, setSettings] = usePersistentState("mockit:settings", DEFAULT_SETTINGS);
  const [tab, setTab] = usePersistentState<"single" | "bulk">("mockit:tab", "single");
  const [bulkCount, setBulkCount] = usePersistentState("mockit:bulkCount", 100);
  const [visibleKeys, setVisibleKeys] = usePersistentState(
    "mockit:columns",
    COLUMNS.map((c) => c.key),
  );
  const [person, setPerson] = useState<Person | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const { generate, loading } = useGenerator(settings);

  const run = useCallback(
    async (count: number, onDone: (people: Person[]) => void) => {
      try {
        onDone(await generate(count));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      }
    },
    [generate],
  );

  const generateOne = useCallback(() => run(1, ([p]) => setPerson(p ?? null)), [run]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only auto-generate on first load
  useEffect(() => {
    generateOne();
  }, []);

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold tracking-tight">Mockit</h1>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Realistic Canadian test data
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6">
        <Card>
          <CardContent>
            <Controls settings={settings} onChange={setSettings} />
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={(value) => setTab(value as "single" | "bulk")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="single">Single</TabsTrigger>
              <TabsTrigger value="bulk">Bulk</TabsTrigger>
            </TabsList>
            {tab === "single" && (
              <div className="flex items-center gap-2">
                {person && (
                  <span className="flex items-center text-sm text-muted-foreground">
                    <BracesIcon className="mr-1 size-4" />
                    JSON
                    <CopyButton value={JSON.stringify(person, null, 2)} label="person as JSON" />
                  </span>
                )}
                <Button onClick={generateOne} disabled={loading}>
                  {loading ? <Loader2Icon className="animate-spin" /> : <RefreshCwIcon />}
                  Generate
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="single" className="mt-4">
            {person ? (
              <PersonCard person={person} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">Generating…</p>
            )}
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <BulkPanel
              people={people}
              count={bulkCount}
              onCountChange={setBulkCount}
              visibleKeys={visibleKeys}
              onVisibleKeysChange={setVisibleKeys}
              onGenerate={() => run(bulkCount, setPeople)}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-8 text-xs text-muted-foreground">
        All data is fictional except addresses, which are sampled from Statistics Canada's{" "}
        <a
          className="underline underline-offset-2"
          href="https://www150.statcan.gc.ca/n1/pub/46-26-0002/462600022022001-eng.htm"
          target="_blank"
          rel="noreferrer"
        >
          National Address Register
        </a>{" "}
        (Statistics Canada Open Licence). Phone numbers use the reserved 555-01XX range and emails
        use reserved example domains.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Mockit />
      <Toaster position="bottom-center" />
    </ThemeProvider>
  );
}
