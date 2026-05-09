"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
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

// Grid the auto-layout snaps to. Matches the visible Background grid
// (GRID_SIZE * GRID_DOTS) so auto-placed nodes land on dot intersections.
const GRID_SIZE = 20;
const COL_STEP = GRID_SIZE * 12; // 240px, divisible by GRID_SIZE
const ROW_STEP = GRID_SIZE * 4; //  80px

function layout(graph: CausalGraph): Node[] {
  const columns: Record<number, GraphNode[]> = {};
  for (const n of graph.nodes) {
    const col = KIND_ORDER[n.kind] ?? 3;
    (columns[col] ||= []).push(n);
  }

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
      // Offset sub-columns by half a step so parallel tickers fit
      const x = col * COL_STEP + subCol * Math.round(COL_STEP * 0.7);
      const y = Math.round(
        (rowInCol - (rowsInThisSubCol - 1) / 2) * ROW_STEP,
      );
      // Snap to grid
      out.push({
        id: n.id,
        type: "card",
        position: {
          x: Math.round(x / GRID_SIZE) * GRID_SIZE,
          y: Math.round(y / GRID_SIZE) * GRID_SIZE,
        },
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

function AutoFit({ sig }: { sig: string }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 300 });
    });
    return () => cancelAnimationFrame(id);
  }, [sig, fitView]);
  return null;
}

/**
 * Internal component that owns the mutable node/edge state. Lives
 * inside ReactFlowProvider so hooks work. Dragging updates only the
 * local node positions; switching events reseeds from the fresh
 * layout (keyed by the graph's node id set).
 */
function GraphInner({ graph }: { graph: CausalGraph }) {
  const baseNodes = useMemo(() => layout(graph), [graph]);
  const baseEdges = useMemo(() => toRFEdges(graph), [graph]);

  // useNodesState / useEdgesState give us the mutable state React Flow
  // needs for drag + selection. We seed them from the deterministic
  // layout and reseed whenever the event (and thus the graph) changes.
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);

  const nodeSig = useMemo(
    () => graph.nodes.map((n) => n.id).join("|"),
    [graph],
  );

  useEffect(() => {
    setNodes(baseNodes);
    setEdges(baseEdges);
  }, [nodeSig, baseNodes, baseEdges, setNodes, setEdges]);

  // Hover path highlighting — applied as a transform over whatever
  // positions the user currently has (dragged or not).
  const [hoverId, setHoverId] = useState<string | null>(null);

  const displayNodes = useMemo(() => {
    if (!hoverId) {
      return nodes.map((n) =>
        n.data?.highlighted || n.data?.dimmed
          ? { ...n, data: { ...n.data, highlighted: false, dimmed: false } }
          : n,
      );
    }
    const { nodes: onPath } = upstreamPathFrom(hoverId, graph);
    return nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        highlighted: onPath.has(n.id),
        dimmed: !onPath.has(n.id),
      },
    }));
  }, [nodes, hoverId, graph]);

  const displayEdges = useMemo(() => {
    if (!hoverId) {
      return edges.map((e) =>
        e.animated || (e.style?.opacity ?? 1) !== 1
          ? {
              ...e,
              animated: false,
              style: { ...e.style, strokeWidth: 1.25, opacity: 1 },
            }
          : e,
      );
    }
    const { edges: onPath } = upstreamPathFrom(hoverId, graph);
    return edges.map((e) => {
      const on = onPath.has(e.id);
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
  }, [edges, hoverId, graph]);

  return (
    <>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, duration: 300 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.25}
        maxZoom={1.75}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        panOnDrag
        onNodeMouseEnter={(_, n) => setHoverId(n.id)}
        onNodeMouseLeave={() => setHoverId(null)}
        onNodeDragStart={() => setHoverId(null)}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={GRID_SIZE}
          size={1}
          color="#1a1a1a"
        />
        <Controls showInteractive={false} />
        <AutoFit sig={nodeSig} />
      </ReactFlow>
      <HoverHint show={!!hoverId} />
    </>
  );
}

export function CausalGraphView({ graph }: { graph: CausalGraph }) {
  return (
    <div className="relative h-full w-full">
      <ReactFlowProvider>
        <GraphInner graph={graph} />
      </ReactFlowProvider>
      <GraphLegend />
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
      <div className="mt-1 border-t border-border/60 pt-1 text-[8px] text-fg-faint">
        drag nodes to rearrange
      </div>
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
