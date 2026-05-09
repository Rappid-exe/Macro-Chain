import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import type { EventSummary } from "@/lib/types";
import { SectorBadge } from "./sector-badge";

function formatVolume(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export function EventCard({ event }: { event: EventSummary }) {
  const pct = Math.round(event.yes_price * 100);
  const delta = event.delta_24h * 100;
  const isUp = delta >= 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-border bg-bg-raised p-4 transition",
        "hover:border-border-strong hover:bg-bg-raised/80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SectorBadge sector={event.sector} />
          <span className="text-[10px] uppercase tracking-wider text-fg-faint">
            {event.source}
          </span>
        </div>
        {event.impact_score !== null && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-fg-faint">
              Impact
            </span>
            <span className="text-xs font-semibold tabular-nums text-fg">
              {event.impact_score}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm leading-snug text-fg group-hover:text-white">
        {event.question}
      </p>

      <div className="mt-auto flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold tabular-nums text-fg">
            {pct}
            <span className="text-sm text-fg-muted">%</span>
          </div>
          <div
            className={cn(
              "mt-0.5 flex items-center gap-1 text-xs tabular-nums",
              isUp ? "text-accent" : "text-accent-down",
            )}
          >
            {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(delta).toFixed(1)}pp 24h
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-fg-faint">
            Vol 24h
          </div>
          <div className="text-xs tabular-nums text-fg-muted">
            {formatVolume(event.volume_24h)}
          </div>
        </div>
      </div>
    </Link>
  );
}
