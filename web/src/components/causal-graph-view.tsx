"use client";

import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
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

function layout(graph: CausalGraph): Node[] {
  const columns: Record<number, GraphNode[]> = {};
  for (const n of graph.nodes) {
    const col = KIND_ORDER[n.kind] ?? 3;
    (columns[col] ||= []).push(n);
  }

  const colGap = 240;
  const rowGap = 72;
  const maxRowsPerCol = 7;

  const out: Node[] = [];
  for (const [colStr, nodes] of Object.entries(columns)) {
    const col = Number(colStr);
    const subCols = Math.ceil(nodes.length / maxRowsPerCol);
    nodes.forEach((n, i) => {
      const subCol = Math.floor(i / maxRowsPerCol);
      const rowInCol = i % maxRowsPerCol;
      const rowsInThisSubCol =
        subCol === subCols - 1
          ? nodes.length - subCol * maxRowsPerCol
          : maxRowsPerCol;
      const x = col * colGap + subCol * (colGap * 0.7);
      const y = (rowInCol - (rowsInThisSubCol - 1) / 2) * rowGap;
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
  direct: "#ffa940",
  inferred: "#888888",
  speculative: "#444444",
};

function toRFEdges(graph: CausalGraph): Edge[] {
  return graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    className: e.confidence,
    style: {
      stroke: CONF_STROKE[e.confidence],
      strokeWidth: 1.25,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: CONF_STROKE[e.confidence],
    },
    data: { rationale: e.rationale, confidence: e.confidence, kind: e.kind },
  }));
}

/**
 * Child of ReactFlowProvider that re-fits the viewport whenever the
 * underlying node set changes. Without this, React Flow keeps its
 * previous viewport when the event changes and the new graph either
 * looks squished in a corner or is entirely off-screen.
 */
function AutoFit({ nodeIds }: { nodeIds: string }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    // Defer one frame so React Flow has mounted the new nodes before
    // we ask for a fit. Without the rAF, fitView runs against the old
    // node positions and the viewport lands in the wrong place.
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 250 });
    });
    return () => cancelAnimationFrame(id);
  }, [nodeIds, fitView]);
  return null;
}

export function CausalGraphView({ graph }: { graph: CausalGraph }) {
  const rfNodes = useMemo(() => layout(graph), [graph]);
  const rfEdges = useMemo(() => toRFEdges(graph), [graph]);

  // Stable token of the current node set; changes when event switches.
  const nodeIds = useMemo(
    () => graph.nodes.map((n) => n.id).join("|"),
    [graph],
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnDrag
        >
          <Background color="#111111" gap={24} />
          <Controls showInteractive={false} />
          <AutoFit nodeIds={nodeIds} />
        </ReactFlow>
      </ReactFlowProvider>
      <GraphLegend />
    </div>
  );
}

function GraphLegend() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 flex flex-col gap-1 border border-border bg-bg-sunken/90 p-2 text-[9px] uppercase tracking-wider text-fg-muted backdrop-blur">
      <div className="mb-0.5 text-fg-faint">edges</div>
      <LegendRow color="#ffa940" label="direct" />
      <LegendRow color="#888888" label="inferred" dashed />
      <LegendRow color="#444444" label="speculative" dashed />
    </div>
  );
}

function LegendRow({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-px w-6"
        style={{
          background: dashed
            ? `repeating-linear-gradient(to right,${color} 0 3px,transparent 3px 6px)`
            : color,
        }}
      />
      {label}
    </div>
  );
}
