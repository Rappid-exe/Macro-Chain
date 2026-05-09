"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { EventSummary, Sector } from "@/lib/types";
import { EventCard } from "./event-card";

type SectorFilter = Sector | "all";
type Sort = "impact" | "volume" | "prob_high" | "prob_low";

const SECTORS: { value: SectorFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tech", label: "Tech" },
  { value: "energy", label: "Energy" },
  { value: "economy", label: "Economy" },
  { value: "geopolitics", label: "Geopolitics" },
];

const SORTS: { value: Sort; label: string }[] = [
  { value: "impact", label: "Impact score" },
  { value: "volume", label: "Volume" },
  { value: "prob_high", label: "Prob high→low" },
  { value: "prob_low", label: "Prob low→high" },
];

export function EventList({ events }: { events: EventSummary[] }) {
  const [sector, setSector] = useState<SectorFilter>("all");
  const [sort, setSort] = useState<Sort>("impact");

  const filtered = useMemo(() => {
    const base = sector === "all" ? events : events.filter((e) => e.sector === sector);
    return [...base].sort((a, b) => {
      switch (sort) {
        case "impact":
          return (b.impact_score ?? 0) - (a.impact_score ?? 0);
        case "volume":
          return b.volume_24h - a.volume_24h;
        case "prob_high":
          return b.yes_price - a.yes_price;
        case "prob_low":
          return a.yes_price - b.yes_price;
      }
    });
  }, [events, sector, sort]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {SECTORS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSector(s.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition",
                sector === s.value
                  ? "bg-fg text-bg"
                  : "border border-border bg-bg-raised text-fg-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-faint">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border border-border bg-bg-raised px-2 py-1 text-xs text-fg focus:border-border-strong focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-fg-muted">
          No events match the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
