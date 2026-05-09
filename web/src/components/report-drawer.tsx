"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Minus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { EventSummary, Report, TickerImpact } from "@/lib/types";

export function ReportDrawer({
  open,
  onClose,
  event,
}: {
  open: boolean;
  onClose: () => void;
  event: EventSummary;
}) {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setReport(null);
    setError(null);

    fetch(`/api/py/events/${encodeURIComponent(event.id)}/report`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`api ${r.status}`);
        return (await r.json()) as Report;
      })
      .then((rep) => !cancelled && setReport(rep))
      .catch((err) => !cancelled && setError(String(err)));

    return () => {
      cancelled = true;
    };
  }, [open, event.id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close report"
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-sm"
      />
      <aside className="flex h-full w-full max-w-[640px] flex-col overflow-hidden border-l border-border bg-bg-raised shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-fg-faint">
              Detailed report
            </div>
            <h2 className="mt-0.5 truncate text-sm font-medium text-fg">
              {event.question}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-fg-muted hover:bg-bg-sunken hover:text-fg"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {error ? (
            <div className="rounded-md border border-accent-down/30 bg-accent-down/5 p-3 text-xs text-accent-down">
              Failed to load report: {error}
            </div>
          ) : !report ? (
            <div className="text-xs text-fg-muted">Reasoning chain…</div>
          ) : (
            <ReportBody report={report} />
          )}
        </div>
      </aside>
    </div>
  );
}

function ReportBody({ report }: { report: Report }) {
  const firstOrder = report.impacts.filter((i) => i.order === 1);
  const secondOrder = report.impacts.filter((i) => i.order === 2);
  const thirdOrder = report.impacts.filter((i) => i.order === 3);

  return (
    <div className="space-y-6 text-sm">
      <section>
        <SectionLabel>Executive summary</SectionLabel>
        <p className="mt-2 text-fg-muted">{report.executive_summary}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-fg-faint">
          <span>
            Scenario <span className="text-fg">{report.scenario.toUpperCase()}</span>
          </span>
          <span>
            Horizon <span className="text-fg">{report.horizon_days}d</span>
          </span>
          <span>
            Confidence <span className="text-fg">{report.confidence}</span>
          </span>
        </div>
      </section>

      {firstOrder.length > 0 && (
        <ImpactSection title="Primary impacts (1st order)" impacts={firstOrder} />
      )}
      {secondOrder.length > 0 && (
        <ImpactSection title="Secondary impacts (2nd order)" impacts={secondOrder} />
      )}
      {thirdOrder.length > 0 && (
        <ImpactSection title="Tertiary impacts (3rd order)" impacts={thirdOrder} />
      )}
      {report.impacts.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-fg-muted">
          No tradeable impacts identified in the seed graph.
        </div>
      )}

      <section>
        <SectionLabel>Assumptions</SectionLabel>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-fg-muted">
          {report.assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      <section>
        <SectionLabel>Caveats</SectionLabel>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-fg-muted">
          {report.caveats.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ImpactSection({
  title,
  impacts,
}: {
  title: string;
  impacts: TickerImpact[];
}) {
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <ul className="mt-2 space-y-2">
        {impacts.map((i) => (
          <ImpactRow key={`${i.symbol}-${i.order}-${i.chain.join("-")}`} impact={i} />
        ))}
      </ul>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
      {children}
    </h3>
  );
}

function ImpactRow({ impact }: { impact: TickerImpact }) {
  const ArrowIcon =
    impact.direction === "up"
      ? ArrowUp
      : impact.direction === "down"
        ? ArrowDown
        : Minus;
  const tone =
    impact.direction === "up"
      ? "text-accent border-accent/30"
      : impact.direction === "down"
        ? "text-accent-down border-accent-down/30"
        : "text-accent-warn border-accent-warn/30";

  return (
    <li className="flex items-start gap-3 rounded-md border border-border bg-bg-sunken p-3">
      <span
        className={cn(
          "flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs",
          tone,
        )}
      >
        <ArrowIcon size={11} />
        {impact.symbol}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-xs text-fg">{impact.name}</span>
          <span className="shrink-0 font-mono text-[10px] text-fg-faint">
            {Math.round(impact.magnitude_bps)} bps
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">
          {impact.thesis}
        </p>
      </div>
    </li>
  );
}
