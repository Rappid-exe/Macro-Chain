"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { EventDetail } from "@/lib/types";
import { CausalGraphView } from "./causal-graph-view";
import { PriceSparkline } from "./price-sparkline";
import { ReportDrawer } from "./report-drawer";

export function EventDetailPane({ event }: { event: EventDetail }) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
      {/* Left: event summary + price chart */}
      <aside className="flex flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-bg-raised p-4">
        <div>
          <h2 className="text-base font-medium leading-snug text-fg">
            {event.question}
          </h2>
          {event.resolution_date && (
            <p className="mt-2 text-xs text-fg-muted">
              Resolves {new Date(event.resolution_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="rounded-md border border-border bg-bg-sunken p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-wider text-fg-faint">
              Yes price (max interval)
            </span>
            <span className="text-[10px] text-fg-faint">
              {event.history.length} pts
            </span>
          </div>
          <div className="mt-2">
            <PriceSparkline history={event.history} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs">
          <Stat label="Yes" value={`${Math.round(event.yes_price * 100)}%`} />
          <Stat
            label="24h Δ"
            value={`${event.delta_24h >= 0 ? "+" : ""}${(event.delta_24h * 100).toFixed(1)}pp`}
            tone={event.delta_24h >= 0 ? "up" : "down"}
          />
          <Stat
            label="Volume 24h"
            value={formatMoney(event.volume_24h)}
          />
          <Stat
            label="Impact score"
            value={event.impact_score?.toString() ?? "—"}
          />
        </dl>

        {event.description && (
          <details className="group rounded-md border border-border bg-bg-sunken p-3 text-xs">
            <summary className="cursor-pointer select-none text-fg-muted hover:text-fg">
              Resolution criteria
            </summary>
            <p className="mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-fg-muted">
              {event.description}
            </p>
          </details>
        )}

        <button
          onClick={() => setReportOpen(true)}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-fg px-3 py-2 text-xs font-medium text-bg hover:bg-white"
        >
          <FileText size={14} />
          Open detailed report
        </button>
      </aside>

      {/* Right: knowledge graph */}
      <section className="relative overflow-hidden rounded-lg border border-border bg-bg-raised">
        <CausalGraphView eventId={event.id} />
      </section>

      <ReportDrawer
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        event={event}
      />
    </div>
  );
}

function formatMoney(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v)}`;
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  const toneCls =
    tone === "up"
      ? "text-accent"
      : tone === "down"
        ? "text-accent-down"
        : "text-fg";
  return (
    <div className="rounded-md border border-border bg-bg-sunken p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-fg-faint">
        {label}
      </div>
      <div className={`mt-0.5 text-sm font-semibold tabular-nums ${toneCls}`}>
        {value}
      </div>
    </div>
  );
}
