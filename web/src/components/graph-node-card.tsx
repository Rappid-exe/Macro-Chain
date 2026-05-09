"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { GraphNode } from "@/lib/types";

type NodeData = { node: GraphNode; highlighted?: boolean; dimmed?: boolean };

/**
 * Graph node card with hover-path visual state.
 * - default: normal
 * - highlighted: on the current causal path, amber ring, raised
 * - dimmed: off the current path, opacity 0.25
 */
export function GraphNodeCard({ data }: NodeProps<NodeData>) {
  const n = data.node;
  const { highlighted, dimmed } = data;

  const kindStyles: Record<GraphNode["kind"], string> = {
    event:
      "border-accent bg-black text-fg max-w-[240px]",
    theme:
      "border-accent-info/60 bg-black text-accent-info max-w-[200px]",
    commodity:
      "border-accent-warn/60 bg-black text-accent-warn max-w-[180px]",
    sector:
      "border-border-strong bg-black text-fg-muted max-w-[180px]",
    ticker:
      "border-border-strong bg-black text-fg max-w-[170px]",
  };

  const kindLabel: Record<GraphNode["kind"], string> = {
    event: "EVT",
    theme: "THM",
    commodity: "COM",
    sector: "SEC",
    ticker: "TKR",
  };

  const arrow =
    n.direction === "up" ? (
      <ArrowUp size={10} className="text-accent-up" />
    ) : n.direction === "down" ? (
      <ArrowDown size={10} className="text-accent-down" />
    ) : n.direction === "mixed" ? (
      <Minus size={10} className="text-accent-warn" />
    ) : null;

  const tickerTone =
    n.direction === "up"
      ? "text-accent-up"
      : n.direction === "down"
        ? "text-accent-down"
        : n.direction === "mixed"
          ? "text-accent-warn"
          : "text-fg";

  return (
    <div
      className={cn(
        "border px-2 py-1.5 font-mono text-[11px] leading-tight transition-all duration-150",
        kindStyles[n.kind],
        highlighted && "!border-accent shadow-[0_0_0_1px_#ffa940] scale-105",
        dimmed && "opacity-25",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-0 !w-0 !border-0 !bg-transparent"
      />
      <div className="flex items-center gap-1.5">
        <span className="text-[8px] uppercase tracking-wider text-fg-faint">
          [{kindLabel[n.kind]}]
        </span>
        {n.kind === "ticker" && arrow}
        <span
          className={cn(
            "font-semibold",
            n.kind === "ticker" && tickerTone,
            n.kind === "event" && "line-clamp-3 whitespace-normal",
          )}
        >
          {n.kind === "event" ? n.label : truncate(n.label, 30)}
        </span>
      </div>
      {n.sublabel && n.kind !== "ticker" && (
        <div className="mt-0.5 text-[9px] text-fg-faint">{n.sublabel}</div>
      )}
      {n.kind === "ticker" && (
        <div className="mt-0.5 flex items-center justify-between text-[9px] text-fg-faint">
          <span className="truncate">{n.sublabel}</span>
          {typeof n.magnitude === "number" && (
            <span className="tabular-nums">{Math.round(n.magnitude)}bp</span>
          )}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-0 !w-0 !border-0 !bg-transparent"
      />
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
