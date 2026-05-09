"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type {
  EventDetail,
  EventSummary,
  Report,
  TickerImpact,
} from "@/lib/types";
import { PriceSparkline } from "./price-sparkline";
import { SectionHeader } from "./section-header";

/**
 * Middle column: the "focused event" (F.E.) from the sketch.
 * Top block: question + metadata + stat strip + sparkline.
 * Middle block: executive summary.
 * Bottom block: equities list broken into 1st/2nd/3rd order chains.
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
  const isUp = deltaPP >= 0;

  return (
    <section className="flex min-h-0 flex-col overflow-y-auto bg-bg">
      {/* Header block */}
      <div className="border-b border-border bg-bg-sunken/40 px-4 pb-3 pt-3">
        <div className="flex items-center justify-between">
          <SectionHeader>F.E. &middot; Focused Event</SectionHeader>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-fg-faint">
            <span>{summary.source}</span>
            <span className="text-border-strong">|</span>
            <span>{summary.sector}</span>
          </div>
        </div>

        <h2 className="mt-2 text-[13px] font-semibold leading-snug text-fg">
          {summary.question}
        </h2>

        {summary.resolution_date && (
          <div className="mt-1.5 text-[10px] uppercase tracking-wider text-fg-faint">
            resolves{" "}
            <span className="text-fg-muted">
              {new Date(summary.resolution_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Stat strip */}
        <div className="mt-3 grid grid-cols-4 divide-x divide-border border border-border bg-bg">
          <Stat label="YES" value={`${pct}%`} />
          <Stat
            label="24H Δ"
            value={`${isUp ? "+" : ""}${deltaPP.toFixed(1)}`}
            suffix="pp"
            tone={Math.abs(deltaPP) < 0.1 ? undefined : isUp ? "up" : "down"}
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
          <div className="mt-3 border border-border bg-bg px-2 pb-1.5 pt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[9px] uppercase tracking-wider text-fg-faint">
                Yes price history
              </span>
              <span className="text-[9px] text-fg-faint">
                {detail.history.length} points
              </span>
            </div>
            <PriceSparkline history={detail.history} height={64} />
          </div>
        )}
      </div>

      {/* Executive summary */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <SectionHeader>Executive Summary</SectionHeader>
          {report && report.executive_summary.length > 200 && (
            <span className="flex items-center gap-1 text-[9px] text-accent">
              <Sparkles size={9} /> llm
            </span>
          )}
        </div>
        <div className="mt-2 text-[12px] leading-relaxed text-fg">
          {reportLoading && !report ? (
            <SkeletonLines count={3} />
          ) : report ? (
            <>
              <p className="text-fg-muted">{report.executive_summary}</p>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-wider text-fg-faint">
                <TagPair label="scenario" value={report.scenario.toUpperCase()} />
                <TagPair label="horizon" value={`${report.horizon_days}d`} />
                <TagPair label="confidence" value={report.confidence} />
              </div>
            </>
          ) : (
            <span className="text-fg-faint">No summary.</span>
          )}
        </div>
      </div>

      {/* Equities */}
      <div className="flex-1 px-4 py-3">
        <SectionHeader>Impacted Equities</SectionHeader>
        {loading && !report ? (
          <div className="mt-3">
            <SkeletonLines count={5} />
          </div>
        ) : report && report.impacts.length > 0 ? (
          <EquitiesList report={report} />
        ) : (
          <div className="mt-3 text-[11px] text-fg-faint">
            No tradeable impacts identified.
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
    <div className="mt-2 space-y-4">
      {first.length > 0 && <OrderGroup label="1st order" impacts={first} />}
      {second.length > 0 && <OrderGroup label="2nd order" impacts={second} />}
      {third.length > 0 && <OrderGroup label="3rd order · speculative" impacts={third} />}
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
      <div className="flex items-baseline gap-2 border-b border-border/60 pb-1 text-[10px] uppercase tracking-wider">
        <span className="text-accent">↳</span>
        <span className="text-fg-muted">{label}</span>
        <span className="text-fg-faint">({impacts.length})</span>
      </div>
      <ul className="mt-1.5 divide-y divide-border/30">
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
    <li className="flex items-start gap-3 py-1.5 text-[11px]">
      <span className={cn("flex w-16 shrink-0 items-center gap-1", tone)}>
        <Icon size={11} />
        <span className="font-semibold">{impact.symbol}</span>
      </span>
      <span className="w-14 shrink-0 text-right tabular-nums text-fg-faint">
        {Math.round(impact.magnitude_bps)}bp
      </span>
      <span className="min-w-0 flex-1 leading-relaxed text-fg-muted">
        <span className="text-fg">{impact.name}</span>
        <span className="mx-1.5 text-fg-faint">&mdash;</span>
        {impact.thesis}
      </span>
    </li>
  );
}

function Stat({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
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
    <div className="px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-wider text-fg-faint">
        {label}
      </div>
      <div
        className={cn(
          "mt-0.5 text-[13px] font-semibold leading-tight tabular-nums",
          toneCls,
        )}
      >
        {value}
        {suffix && (
          <span className="ml-0.5 text-[10px] font-normal text-fg-faint">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function TagPair({ label, value }: { label: string; value: string }) {
  return (
    <span>
      {label}{" "}
      <span className="tracking-normal text-fg">{value}</span>
    </span>
  );
}

function SkeletonLines({ count }: { count: number }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 animate-pulse bg-border"
          style={{ width: `${90 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

function formatMoney(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v)}`;
}
