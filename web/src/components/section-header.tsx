import { cn } from "@/lib/cn";

/**
 * Tight terminal section label. Amber left rule + uppercase caption.
 */
export function SectionHeader({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted",
        compact ? "" : "",
      )}
    >
      <span className="h-2 w-[2px] bg-accent" />
      {children}
    </div>
  );
}
