"use client";

import { useEffect, useState } from "react";
import type { CausalGraph, Report } from "@/lib/types";
import { CausalGraphView } from "./causal-graph-view";
import { SectionHeader } from "./section-header";

/**
 * Right column. Causal graph on top, compact reasoner readout below.
 */
export function GraphPanel({ eventId }: { eventId: string | null }) {
  const [graph, setGraph] = useState<CausalGraph | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setGraph(null);
      setReport(null);
      return;
    }
    let cancelled = false;
    setGraph(null);
    setReport(null);
    setErr(null);

    Promise.all([
      fetch(`/api/py/events/${encodeURIComponent(eventId)}/graph`).then(
        async (r) => {
          if (!r.ok) throw new Error(`graph api ${r.status}`);
          return (await r.json()) as CausalGraph;
        },
      ),
      fetch(`/api/py/events/${encodeURIComponent(eventId)}/report`).then(
        async (r) => {
          if (!r.ok) throw new Error(`report api ${r.status}`);
          return (await r.json()) as Report;
        },
      ),
    ])
      .then(([g, r]) => {
        if (cancelled) return;
        setGraph(g);
        setReport(r);
      })
      .catch((e) => !cancelled && setErr(String(e)));

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const byKind = graph
    ? graph.nodes.reduce<Record<string, number>>((acc, n) => {
        acc[n.kind] = (acc[n.kind] ?? 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <section className="flex min-h-0 flex-col bg-bg">
      {/* Graph title bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-bg-sunken/40 px-4 py-1.5">
        <SectionHeader>Causal Graph</SectionHeader>
        {graph && (
          <div className="flex items-center gap-3 text-[9px] uppercase tracking-wider text-fg-faint">
            {["event", "theme", "commodity", "sector", "ticker"].map((k) =>
              byKind[k] ? (
                <span key={k}>
                  {k.slice(0, 3)}{" "}
                  <span className="text-fg-muted">{byKind[k]}</span>
                </span>
              ) : null,
            )}
            <span className="text-border-strong">|</span>
            <span>
              edges <span className="text-fg-muted">{graph.edges.length}</span>
            </span>
          </div>
        )}
      </div>

      {/* Graph canvas */}
      <div className="relative min-h-0 flex-1 border-b border-border">
        {!eventId ? (
          <EmptyState label="Select an event to render its causal graph." />
        ) : err ? (
          <EmptyState label={`Graph error: ${err}`} tone="down" />
        ) : !graph ? (
          <EmptyState label="Building causal chain..." />
        ) : (
          <CausalGraphView graph={graph} />
        )}
      </div>

      {/* Reasoner readout */}
      <div className="max-h-[35%] min-h-[110px] shrink-0 overflow-y-auto bg-bg-sunken/40 px-4 py-3">
        <SectionHeader>Reasoner Readout</SectionHeader>
        <div className="mt-2 space-y-2 text-[11px] leading-relaxed text-fg-muted">
          {report ? (
            <>
              <p>{report.executive_summary}</p>
              {report.assumptions.length > 0 && (
                <div className="border-l-2 border-border pl-2 text-[10px] text-fg-faint">
                  <span className="uppercase tracking-wider">Assumptions:</span>{" "}
                  {report.assumptions.join(" · ")}
                </div>
              )}
            </>
          ) : (
            <span className="text-fg-faint">No summary yet.</span>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyState({
  label,
  tone,
}: {
  label: string;
  tone?: "down";
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center p-8 text-center text-[11px] ${tone === "down" ? "text-accent-down" : "text-fg-faint"}`}
    >
      {label}
    </div>
  );
}
