"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import type { EventSummary, Sector } from "@/lib/types";
import type { Sort } from "./terminal-shell";

type SectorFilter = Sector | "all";

const SECTORS: { value: SectorFilter; label: string; hotkey: string }[] = [
  { value: "all", label: "ALL", hotkey: "1" },
  { value: "tech", label: "TECH", hotkey: "2" },
  { value: "energy", label: "ENG", hotkey: "3" },
  { value: "economy", label: "ECO", hotkey: "4" },
  { value: "geopolitics", label: "GEO", hotkey: "5" },
];

const SORTS: { value: Sort; label: string }[] = [
  { value: "impact", label: "Impact" },
  { value: "volume", label: "Volume" },
  { value: "prob_high", label: "Prob ↓" },
  { value: "prob_low", label: "Prob ↑" },
  { value: "delta", label: "Δ24h" },
];

export function EventListPanel({
  allEvents,
  visible,
  sector,
  onSectorChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  selected,
  onSelect,
  searchInputId,
}: {
  allEvents: EventSummary[];
  visible: EventSummary[];
  sector: SectorFilter;
  onSectorChange: (s: SectorFilter) => void;
  query: string;
  onQueryChange: (q: string) => void;
  sort: Sort;
  onSortChange: (s: Sort) => void;
  selected: string | null;
  onSelect: (id: string) => void;
  searchInputId: string;
}) {
  const countBySector = (s: SectorFilter) =>
    s === "all"
      ? allEvents.length
      : allEvents.filter((e) => e.sector === s).length;

  const listRef = useRef<HTMLDivElement>(null);

  // Scroll the selected row into view when keyboard nav moves it.
  useEffect(() => {
    if (!selected || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-event-id="${selected}"]`,
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <aside className="flex h-full min-h-0 flex-col bg-bg">
      {/* Sector tabs */}
      <div className="flex border-b border-border text-[10px] tracking-wider">
        {SECTORS.map((s) => {
          const active = sector === s.value;
          return (
            <button
              key={s.value}
              onClick={() => onSectorChange(s.value)}
              title={`Hotkey: ${s.hotkey}`}
              className={cn(
                "relative flex-1 border-r border-border py-2.5 last:border-r-0 transition-colors",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-fg-muted hover:bg-bg-raised hover:text-fg",
              )}
            >
              <div className="text-[10px] font-semibold">{s.label}</div>
              <div className="mt-0.5 text-[9px] text-fg-faint">
                {countBySector(s.value)}
              </div>
              {active && (
                <div className="absolute inset-x-0 bottom-0 h-px bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search + sort */}
      <div className="flex items-center gap-2 border-b border-border bg-bg-sunken px-3 py-1.5">
        <div className="flex flex-1 items-center gap-1.5">
          <Search size={11} className="text-fg-faint" />
          <input
            id={searchInputId}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="filter... (press /)"
            className="w-full bg-transparent text-[11px] text-fg placeholder:text-fg-faint focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as Sort)}
          className="cursor-pointer bg-transparent text-[10px] uppercase tracking-wider text-fg-muted focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-bg-sunken">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_2.5rem_3rem_2.5rem] gap-2 border-b border-border px-3 py-1 text-[9px] uppercase tracking-wider text-fg-faint">
        <span>Event</span>
        <span className="text-right">P%</span>
        <span className="text-right">Δ24h</span>
        <span className="text-right">Imp</span>
      </div>

      {/* Rows */}
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="p-6 text-center text-[11px] text-fg-faint">
            {query ? `No events match "${query}"` : "No events in this sector."}
          </div>
        ) : (
          visible.map((e) => (
            <EventRow
              key={e.id}
              event={e}
              selected={e.id === selected}
              onSelect={() => onSelect(e.id)}
            />
          ))
        )}
      </div>

      {/* Footer: result count + keyboard hints */}
      <div className="flex items-center justify-between border-t border-border bg-bg-sunken px-3 py-1 text-[9px] uppercase tracking-wider text-fg-faint">
        <span>
          {visible.length} / {allEvents.length}
        </span>
        <span className="flex items-center gap-2">
          <Kbd>j</Kbd>
          <Kbd>k</Kbd>
          <Kbd>/</Kbd>
          <Kbd>1</Kbd>
          <span className="opacity-50">–</span>
          <Kbd>5</Kbd>
        </span>
      </div>
    </aside>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-3.5 min-w-[14px] items-center justify-center rounded-sm border border-border-strong px-1 font-mono text-[9px] text-fg-muted">
      {children}
    </span>
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
      data-event-id={event.id}
      onClick={onSelect}
      className={cn(
        "group grid w-full grid-cols-[1fr_2.5rem_3rem_2.5rem] gap-2 border-b border-border/40 px-3 py-1.5 text-left text-[11px] transition-colors",
        selected
          ? "bg-accent/[0.08] text-fg"
          : "text-fg-muted hover:bg-bg-raised/60 hover:text-fg",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "h-3 w-[2px] shrink-0 transition-colors",
            selected
              ? "bg-accent"
              : "bg-transparent group-hover:bg-border-strong",
          )}
        />
        <span className="truncate">{event.question}</span>
      </div>
      <span className="text-right font-semibold tabular-nums text-fg">
        {pct}
      </span>
      <span
        className={cn(
          "text-right tabular-nums",
          Math.abs(delta) < 0.1
            ? "text-fg-faint"
            : isUp
              ? "text-accent-up"
              : "text-accent-down",
        )}
      >
        {isUp ? "+" : ""}
        {delta.toFixed(1)}
      </span>
      <span
        className={cn(
          "text-right tabular-nums",
          imp >= 50
            ? "font-semibold text-accent"
            : imp >= 20
              ? "text-fg"
              : "text-fg-faint",
        )}
      >
        {Math.round(imp)}
      </span>
    </button>
  );
}
