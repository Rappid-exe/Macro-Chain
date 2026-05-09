"use client";

import { cn } from "@/lib/cn";
import type { EventSummary, Sector } from "@/lib/types";

type SectorFilter = Sector | "all";

const SECTORS: { value: SectorFilter; label: string; short: string }[] = [
  { value: "all", label: "All", short: "ALL" },
  { value: "tech", label: "Tech", short: "TECH" },
  { value: "energy", label: "Energy", short: "ENG" },
  { value: "economy", label: "Economy", short: "ECO" },
  { value: "geopolitics", label: "Geopolitics", short: "GEO" },
];

/**
 * Left column. Terminal-style dense list. Sector tabs at top, then a
 * scrolling table of events with probability, 24h delta, impact score,
 * and volume. Monospace tabular-nums everywhere so numbers line up.
 */
export function EventListPanel({
  events,
  filtered,
  sector,
  onSectorChange,
  selected,
  onSelect,
}: {
  events: EventSummary[];
  filtered: EventSummary[];
  sector: SectorFilter;
  onSectorChange: (s: SectorFilter) => void;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const sortedBySector: EventSummary[] = [...filtered].sort(
    (a, b) => (b.impact_score ?? 0) - (a.impact_score ?? 0),
  );

  const countBySector = (s: SectorFilter) =>
    s === "all" ? events.length : events.filter((e) => e.sector === s).length;

  return (
    <aside className="flex min-h-0 flex-col bg-bg">
      {/* Sector tabs */}
      <div className="flex border-b border-border text-[10px] uppercase tracking-wider">
        {SECTORS.map((s) => {
          const active = sector === s.value;
          return (
            <button
              key={s.value}
              onClick={() => onSectorChange(s.value)}
              className={cn(
                "flex-1 border-r border-border px-2 py-2 last:border-r-0",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-fg-muted hover:bg-bg-raised hover:text-fg",
              )}
            >
              <div>{s.short}</div>
              <div className="mt-0.5 text-[9px] text-fg-faint">
                {countBySector(s.value)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Column headers */}
      <div className="flex border-b border-border bg-bg-sunken px-3 py-1 text-[9px] uppercase tracking-wider text-fg-faint">
        <span className="flex-1">Event</span>
        <span className="w-10 text-right">P%</span>
        <span className="w-12 text-right">Δ24h</span>
        <span className="w-10 text-right">IMP</span>
      </div>

      {/* Event rows */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {sortedBySector.length === 0 ? (
          <div className="p-4 text-center text-[11px] text-fg-faint">
            No events match the current filter.
          </div>
        ) : (
          sortedBySector.map((e) => (
            <EventRow
              key={e.id}
              event={e}
              selected={e.id === selected}
              onSelect={() => onSelect(e.id)}
            />
          ))
        )}
      </div>

      <div className="border-t border-border bg-bg-sunken px-3 py-1 text-[9px] uppercase tracking-wider text-fg-faint">
        {sortedBySector.length} of {events.length} · sorted by impact
      </div>
    </aside>
  );
}

function EventRow({
  event,
  selected,
  onSelect,
}: {
  event: EventSummary;
  selected: boolean;
  onSelect: () => void;
}) {
  const pct = Math.round(event.yes_price * 100);
  const delta = event.delta_24h * 100;
  const isUp = delta >= 0;
  const imp = event.impact_score ?? 0;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center border-b border-border/50 px-3 py-1.5 text-left text-[11px] transition",
        selected
          ? "bg-accent/10 text-fg"
          : "text-fg-muted hover:bg-bg-raised hover:text-fg",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className={cn(
            "h-3 w-[2px]",
            selected ? "bg-accent" : "bg-transparent",
          )}
        />
        <span className="truncate">{event.question}</span>
      </div>
      <span className="w-10 text-right font-semibold tabular-nums text-fg">
        {pct}
      </span>
      <span
        className={cn(
          "w-12 text-right tabular-nums",
          isUp ? "text-accent-up" : "text-accent-down",
        )}
      >
        {isUp ? "+" : ""}
        {delta.toFixed(1)}
      </span>
      <span
        className={cn(
          "w-10 text-right tabular-nums",
          imp >= 50 ? "text-accent" : imp >= 20 ? "text-fg" : "text-fg-faint",
        )}
      >
        {Math.round(imp)}
      </span>
    </button>
  );
}
