"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import type { CausalGraph, EdgeConfidence, GraphNode } from "@/lib/types";
import { GraphNodeCard } from "./graph-node-card";

const nodeTypes = { card: GraphNodeCard };

const KIND_ORDER: Record<GraphNode["kind"], number> = {
  event: 0,
  theme: 1,
  commodity: 2,
  sector: 2,
  ticker: 3,
};

// Simple column-based layout: kind determines column, then space vertically.
function layout(graph: CausalGraph): Node[] {
  const columns: Record<number, GraphNode[]> = {};
  for (const n of graph.nodes) {
    const col = KIND_ORDER[n.kind] ?? 3;
    (columns[col] ||= []).push(n);
  }

  const colGap = 280;
  const rowGap = 110;
  const out: Node[] = [];
  for (const [colStr, nodes] of Object.entries(columns)) {
    const col = Number(colStr);
    nodes.forEach((n, i) => {
      const x = col * colGap;
      const y = (i - (nodes.length - 1) / 2) * rowGap;
      out.push({
        id: n.id,
        type: "card",
        position: { x, y },
        data: { node: n },
      });
    });
  }
  return out;
}

const CONF_STROKE: Record<EdgeConfidence, string> = {
  direct: "#7cf0a0",
  inferred: "#8b93a1",
  speculative: "#596170",
};

function toRFEdges(graph: CausalGraph): Edge[] {
  return graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    className: e.confidence,
    style: { stroke: CONF_STROKE[e.confidence], strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: CONF_STROKE[e.confidence] },
    data: { rationale: e.rationale, confidence: e.confidence, kind: e.kind },
  }));
}

export function CausalGraphView({ eventId }: { eventId: string }) {
  const [graph, setGraph] = useState<CausalGraph | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setGraph(null);
    setError(null);

    fetch(`/api/py/events/${encodeURIComponent(eventId)}/graph`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`api ${r.status}`);
        return (await r.json()) as CausalGraph;
      })
      .then((g) => {
        if (!cancelled) setGraph(g);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const rfNodes = useMemo(() => (graph ? layout(graph) : []), [graph]);
  const rfEdges = useMemo(() => (graph ? toRFEdges(graph) : []), [graph]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-sm text-accent-down">
        Failed to load graph: {error}
      </div>
    );
  }
  if (!graph) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-sm text-fg-muted">
        Building causal chain…
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="#1e232b" gap={20} />
        <Controls
          showInteractive={false}
          className="!bg-bg-sunken !border-border"
        />
      </ReactFlow>
      <GraphLegend />
    </div>
  );
}

function GraphLegend() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 flex flex-col gap-1 rounded-md border border-border bg-bg-sunken/90 p-2 text-[10px] text-fg-muted backdrop-blur">
      <div className="mb-0.5 font-mono uppercase tracking-wider text-fg-faint">
        Edges
      </div>
      <div className="flex items-center gap-2">
        <span className="h-px w-6 bg-accent" /> direct
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-px w-6"
          style={{
            background:
              "repeating-linear-gradient(to right,#8b93a1 0 4px,transparent 4px 8px)",
          }}
        />{" "}
        inferred
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-px w-6"
          style={{
            background:
              "repeating-linear-gradient(to right,#596170 0 2px,transparent 2px 4px)",
          }}
        />{" "}
        speculative
      </div>
    </div>
  );
}
