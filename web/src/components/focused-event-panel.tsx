"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { EventDetail, EventSummary, Report, TickerImpact } from "@/lib/types";
import { PriceSparkline } from "./price-sparkline";
import { SectionHeader } from "./section-header";

/**
 * Middle column. The "F.E." (focused event) from the sketch:
 *   - executive summary
 *   - equities list broken into 1st / 2nd / 3rd order chains
 * Also shows the price sparkline and key stats so the analyst has
 * everything in one pane without needing to navigate.
 */
export function FocusedEventPanel({
  summary,
  detail,
  loading,
}: {
  summary: EventSummary | null;
  detail: EventDetail | null;
  loading: boolean;
}) {
  const [report, setReport] = useState<Report | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    if (!summary) {
      setReport(null);
      return;
    }
    let cancelled = false;
    setReportLoading(true);
    setReport(null);
    fetch(`/api/py/events/${encodeURIComponent(summary.id)}/report`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`api ${r.status}`);
        return (await r.json()) as Report;
      })
      .then((rep) => !cancelled && setReport(rep))
      .catch(() => !cancelled && setReport(null))
      .finally(() => !cancelled && setReportLoading(false));
    return () => {
      cancelled = true;
    };
    // summary.id is the meaningful dep; we intentionally exclude summary
    // object identity to avoid re-fetching on list re-orders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary?.id]);

  if (!summary) {
    return (
      <section className="flex min-h-0 flex-col items-center justify-center bg-bg text-[11px] text-fg-faint">
        No event selected.
      </section>
    );
  }

  const pct = Math.round(summary.yes_price * 100);
  const deltaPP = summary.delta_24h * 100;

  return (
    <section className="flex min-h-0 flex-col overflow-y-auto bg-bg">
      {/* Header block */}
      <div className="border-b border-border px-4 py-3">
        <SectionHeader>F.E.  Focused Event</SectionHeader>
        <h2 className="mt-2 text-[13px] leading-snug text-fg">
          {summary.question}
        </h2>
        <div className="mt-2 flex items-baseline gap-4 text-[10px] uppercase tracking-wider text-fg-faint">
          <span>{summary.source}</span>
          <span>{summary.sector}</span>
          {summary.resolution_date && (
            <span>
              resolves{" "}
              <span className="text-fg-muted">
                {new Date(summary.resolution_date).toLocaleDateString()}
              </span>
            </span>
          )}
        </div>

        {/* Stat strip */}
        <div className="mt-3 grid grid-cols-4 divide-x divide-border border border-border bg-bg-sunken">
          <Stat label="YES" value={`${pct}%`} />
          <Stat
            label="24h Δ"
            value={`${deltaPP >= 0 ? "+" : ""}${deltaPP.toFixed(1)}pp`}
            tone={deltaPP >= 0 ? "up" : "down"}
          />
          <Stat label="VOL 24H" value={formatMoney(summary.volume_24h)} />
          <Stat
            label="IMPACT"
            value={
              summary.impact_score !== null
                ? Math.round(summary.impact_score).toString()
                : "—"
            }
            tone={
              summary.impact_score && summary.impact_score >= 50
                ? "accent"
                : undefined
            }
          />
        </div>

        {/* Sparkline */}
        {detail && detail.history.length > 1 && (
          <div className="mt-3 border border-border bg-bg-sunken p-2">
            <div className="flex items-center justify-between">
              <SectionHeader compact>Yes price history</SectionHeader>
              <span className="text-[9px] text-fg-faint">
                {detail.history.length} pts
              </span>
            </div>
            <div className="mt-1">
              <PriceSparkline history={detail.history} height={70} />
            </div>
          </div>
        )}
      </div>

      {/* Executive summary */}
      <div className="border-b border-border px-4 py-3">
        <SectionHeader>Exec Summary</SectionHeader>
        <div className="mt-2 text-[12px] leading-relaxed text-fg-muted">
          {reportLoading && !report ? (
            <span className="text-fg-faint">Reasoning chain…</span>
          ) : report ? (
            <>
              <p>{report.executive_summary}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-fg-faint">
                <span>
                  scenario <span className="text-fg">{report.scenario}</span>
                </span>
                <span>
                  horizon <span className="text-fg">{report.horizon_days}d</span>
                </span>
                <span>
                  conf <span className="text-fg">{report.confidence}</span>
                </span>
              </div>
            </>
          ) : (
            <span className="text-fg-faint">No summary.</span>
          )}
        </div>
      </div>

      {/* Equities, grouped by order */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <SectionHeader>Equities</SectionHeader>
        {loading && !report ? (
          <div className="mt-3 text-[11px] text-fg-faint">Loading chains…</div>
        ) : report && report.impacts.length > 0 ? (
          <EquitiesList report={report} />
        ) : (
          <div className="mt-3 text-[11px] text-fg-faint">
            No tradeable impacts in the seed graph. Try a different event or
            enable LLM enrichment in api/.env.
          </div>
        )}
      </div>
    </section>
  );
}

function EquitiesList({ report }: { report: Report }) {
  const first = report.impacts.filter((i) => i.order === 1);
  const second = report.impacts.filter((i) => i.order === 2);
  const third = report.impacts.filter((i) => i.order === 3);

  return (
    <div className="mt-2 space-y-3">
      {first.length > 0 && <OrderGroup label="1st order" impacts={first} />}
      {second.length > 0 && <OrderGroup label="2nd order" impacts={second} />}
      {third.length > 0 && <OrderGroup label="3rd order" impacts={third} />}
    </div>
  );
}

function OrderGroup({
  label,
  impacts,
}: {
  label: string;
  impacts: TickerImpact[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-border/50 pb-1 text-[10px] uppercase tracking-wider text-fg-faint">
        <span className="text-accent">↳</span>
        {label}
        <span className="text-fg-faint">({impacts.length})</span>
      </div>
      <ul className="mt-1.5 space-y-1">
        {impacts.map((i, idx) => (
          <ImpactRow key={`${i.symbol}-${idx}`} impact={i} />
        ))}
      </ul>
    </div>
  );
}

function ImpactRow({ impact }: { impact: TickerImpact }) {
  const Icon =
    impact.direction === "up"
      ? ArrowUp
      : impact.direction === "down"
        ? ArrowDown
        : Minus;
  const tone =
    impact.direction === "up"
      ? "text-accent-up"
      : impact.direction === "down"
        ? "text-accent-down"
        : "text-accent-warn";

  return (
    <li className="flex items-start gap-2 py-1 text-[11px]">
      <span className={cn("flex w-16 shrink-0 items-center gap-1", tone)}>
        <Icon size={11} />
        <span className="font-semibold">{impact.symbol}</span>
      </span>
      <span className="w-14 shrink-0 tabular-nums text-fg-faint">
        {Math.round(impact.magnitude_bps)}bp
      </span>
      <span className="min-w-0 flex-1 leading-relaxed text-fg-muted">
        <span className="text-fg">{impact.name}</span>
        <span className="mx-1.5 text-fg-faint">—</span>
        {impact.thesis}
      </span>
    </li>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "accent";
}) {
  const toneCls =
    tone === "up"
      ? "text-accent-up"
      : tone === "down"
        ? "text-accent-down"
        : tone === "accent"
          ? "text-accent"
          : "text-fg";
  return (
    <div className="px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-fg-faint">
        {label}
      </div>
      <div className={cn("mt-0.5 text-[13px] font-semibold tabular-nums", toneCls)}>
        {value}
      </div>
    </div>
  );
}

function formatMoney(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v)}`;
}
