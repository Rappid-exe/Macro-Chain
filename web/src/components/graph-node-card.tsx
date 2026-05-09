"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { GraphNode } from "@/lib/types";

/**
 * A single node in the causal graph. Styled per node kind so the
 * hierarchy reads at a glance: event (top), theme, commodity/sector,
 * ticker (leaf).
 */
export function GraphNodeCard({ data }: NodeProps<{ node: GraphNode }>) {
  const n = data.node;

  const kindStyles: Record<GraphNode["kind"], string> = {
    event: "border-fg/40 bg-fg/5 text-fg min-w-[220px]",
    theme: "border-accent-info/40 bg-accent-info/5 text-accent-info",
    commodity: "border-accent-warn/40 bg-accent-warn/5 text-accent-warn",
    sector: "border-fg-muted/30 bg-bg-sunken text-fg-muted",
    ticker: "border-border-strong bg-bg-sunken text-fg",
  };

  const arrow =
    n.direction === "up" ? (
      <ArrowUp size={12} className="text-accent" />
    ) : n.direction === "down" ? (
      <ArrowDown size={12} className="text-accent-down" />
    ) : n.direction === "mixed" ? (
      <Minus size={12} className="text-accent-warn" />
    ) : null;

  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 text-xs shadow-sm transition",
        kindStyles[n.kind],
      )}
    >
      <Handle type="target" position={Position.Left} className="!border-0 !bg-border" />
      <div className="flex items-center gap-1.5">
        {n.kind === "ticker" && arrow}
        <span className={cn("font-medium", n.kind === "ticker" && "font-mono")}>
          {n.label.length > 44 ? n.label.slice(0, 42) + "…" : n.label}
        </span>
      </div>
      {n.sublabel && (
        <div className="mt-0.5 text-[10px] text-fg-faint">{n.sublabel}</div>
      )}
      {n.kind === "ticker" && typeof n.magnitude === "number" && (
        <div className="mt-0.5 font-mono text-[10px] text-fg-faint">
          {Math.round(n.magnitude)} bps
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!border-0 !bg-border"
      />
    </div>
  );
}
