"use client";

import { useEffect, useMemo, useState } from "react";
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
        data: { node: n, highlighted: false, dimmed: false },
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
      transition: "stroke 160ms, stroke-width 160ms, opacity 160ms",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: CONF_STROKE[e.confidence],
    },
    data: { rationale: e.rationale, confidence: e.confidence, kind: e.kind },
  }));
}

/**
 * Re-fits the viewport whenever the underlying node set changes.
 */
function AutoFit({ nodeIds }: { nodeIds: string }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 300 });
    });
    return () => cancelAnimationFrame(id);
  }, [nodeIds, fitView]);
  return null;
}

/**
 * BFS upstream from a target to the event node, returning every node id
 * and edge id on any shortest path. Used to highlight causal chains
 * when the user hovers a ticker (or any node).
 */
function upstreamPathFrom(
  nodeId: string,
  graph: CausalGraph,
): { nodes: Set<string>; edges: Set<string> } {
  const rev = new Map<string, { src: string; edgeId: string }[]>();
  for (const e of graph.edges) {
    if (!rev.has(e.target)) rev.set(e.target, []);
    rev.get(e.target)!.push({ src: e.source, edgeId: e.id });
  }
  const seenNodes = new Set<string>([nodeId]);
  const seenEdges = new Set<string>();
  const queue = [nodeId];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const parent of rev.get(cur) ?? []) {
      seenEdges.add(parent.edgeId);
      if (!seenNodes.has(parent.src)) {
        seenNodes.add(parent.src);
        queue.push(parent.src);
      }
    }
  }
  return { nodes: seenNodes, edges: seenEdges };
}

export function CausalGraphView({ graph }: { graph: CausalGraph }) {
  const baseNodes = useMemo(() => layout(graph), [graph]);
  const baseEdges = useMemo(() => toRFEdges(graph), [graph]);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const { highlightNodes, highlightEdges } = useMemo(() => {
    if (!hoverId) {
      return { highlightNodes: null, highlightEdges: null };
    }
    const { nodes, edges } = upstreamPathFrom(hoverId, graph);
    return { highlightNodes: nodes, highlightEdges: edges };
  }, [hoverId, graph]);

  const displayNodes = useMemo(() => {
    if (!highlightNodes) return baseNodes;
    return baseNodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        highlighted: highlightNodes.has(n.id),
        dimmed: !highlightNodes.has(n.id),
      },
    }));
  }, [baseNodes, highlightNodes]);

  const displayEdges = useMemo(() => {
    if (!highlightEdges) return baseEdges;
    return baseEdges.map((e) => {
      const on = highlightEdges.has(e.id);
      return {
        ...e,
        style: {
          ...e.style,
          strokeWidth: on ? 2.25 : 1,
          opacity: on ? 1 : 0.15,
        },
        animated: on && (e.data?.confidence as string) !== "speculative",
      };
    });
  }, [baseEdges, highlightEdges]);

  const nodeIds = useMemo(
    () => graph.nodes.map((n) => n.id).join("|"),
    [graph],
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, duration: 300 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnDrag
          onNodeMouseEnter={(_, n) => setHoverId(n.id)}
          onNodeMouseLeave={() => setHoverId(null)}
        >
          <Background color="#111111" gap={24} />
          <Controls showInteractive={false} />
          <AutoFit nodeIds={nodeIds} />
        </ReactFlow>
      </ReactFlowProvider>
      <GraphLegend />
      <HoverHint show={!!hoverId} />
    </div>
  );
}

function HoverHint({ show }: { show: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute top-3 right-3 border border-border bg-bg-sunken/90 px-2 py-1 text-[9px] uppercase tracking-wider text-fg-muted transition-opacity duration-150 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      tracing causal path
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
