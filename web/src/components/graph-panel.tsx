"use client";

import { useEffect, useState } from "react";
import type { CausalGraph, Report } from "@/lib/types";
import { CausalGraphView } from "./causal-graph-view";
import { SectionHeader } from "./section-header";

/**
 * Right column. Causal graph on top, summary block on bottom.
 * Matches the sketch: graph sized large, with a boxed "G" caption area
 * beneath showing the reasoner's take in plain text.
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

  return (
    <section className="flex min-h-0 flex-col bg-bg">
      {/* Graph area */}
      <div className="min-h-0 flex-1 border-b border-border">
        <div className="flex items-center justify-between border-b border-border bg-bg-sunken px-4 py-1.5">
          <SectionHeader>Causal Graph</SectionHeader>
          {graph && (
            <span className="text-[10px] text-fg-faint">
              {graph.nodes.length} nodes · {graph.edges.length} edges
            </span>
          )}
        </div>
        <div className="relative h-[calc(100%-28px)]">
          {!eventId ? (
            <EmptyState label="Select an event to render its causal graph." />
          ) : err ? (
            <EmptyState label={`Graph error: ${err}`} tone="down" />
          ) : !graph ? (
            <EmptyState label="Building causal chain…" />
          ) : (
            <CausalGraphView graph={graph} />
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="max-h-[30%] min-h-[120px] overflow-y-auto px-4 py-3">
        <SectionHeader>Reasoner Summary</SectionHeader>
        <div className="mt-2 text-[11px] leading-relaxed text-fg-muted">
          {report ? (
            <>
              <p>{report.executive_summary}</p>
              {report.assumptions.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] uppercase tracking-wider text-fg-faint">
                    Assumptions:
                  </span>{" "}
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
