import { cn } from "@/lib/cn";
import type { Sector } from "@/lib/types";

const styles: Record<Sector, string> = {
  tech: "bg-accent-info/10 text-accent-info border-accent-info/30",
  energy: "bg-accent-warn/10 text-accent-warn border-accent-warn/30",
  economy: "bg-accent/10 text-accent border-accent/30",
  geopolitics: "bg-accent-down/10 text-accent-down border-accent-down/30",
  other: "bg-fg-muted/10 text-fg-muted border-fg-muted/30",
};

const labels: Record<Sector, string> = {
  tech: "Tech",
  energy: "Energy",
  economy: "Economy",
  geopolitics: "Geopolitics",
  other: "Other",
};

export function SectorBadge({ sector }: { sector: Sector }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        styles[sector],
      )}
    >
      {labels[sector]}
    </span>
  );
}
