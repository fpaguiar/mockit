import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Clipboard is unavailable in this browser");
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      onClick={copy}
      className={cn("text-muted-foreground", className)}
    >
      {copied ? <CheckIcon className="text-emerald-600 dark:text-emerald-400" /> : <CopyIcon />}
    </Button>
  );
}
