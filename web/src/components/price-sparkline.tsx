"use client";

import { useMemo } from "react";
import type { PricePoint } from "@/lib/types";

/**
 * Minimal SVG sparkline for Polymarket Yes-price history.
 *
 * The SVG is force-sized via a wrapper <div style={{ height }}> and then
 * preserveAspectRatio="none" so the line scales independently in x/y.
 * This prevents the SVG from growing taller than requested when the
 * column widens.
 */
export function PriceSparkline({
  history,
  height = 90,
}: {
  history: PricePoint[];
  height?: number;
}) {
  const w = 400; // viewBox width; real pixel width is governed by the wrapper
  const path = useMemo(() => buildPath(history, w, height), [history, height]);

  if (history.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-xs text-fg-faint"
        style={{ height }}
      >
        insufficient history
      </div>
    );
  }

  const first = history[0].yes;
  const last = history[history.length - 1].yes;
  const isUp = last >= first;
  const stroke = isUp ? "#7cf0a0" : "#ff5555";
  const fill = isUp ? "rgba(124,240,160,0.10)" : "rgba(255,85,85,0.10)";

  return (
    <div style={{ height }} className="w-full">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
      >
        {/* 50% baseline */}
        <line
          x1={0}
          x2={w}
          y1={height / 2}
          y2={height / 2}
          stroke="#1a1a1a"
          strokeDasharray="2 3"
        />
        {/* area */}
        <path d={path.area} fill={fill} />
        {/* line */}
        <path
          d={path.line}
          fill="none"
          stroke={stroke}
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* last-point marker */}
        <circle
          cx={path.lastX}
          cy={path.lastY}
          r={2.5}
          fill={stroke}
          stroke="#000"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}

function buildPath(history: PricePoint[], width: number, height: number) {
  const n = history.length;
  if (n < 2) return { line: "", area: "", lastX: 0, lastY: 0 };

  const xs = (i: number) => (i / (n - 1)) * width;
  // yes=0 at bottom, yes=1 at top
  const ys = (yes: number) => (1 - Math.max(0, Math.min(1, yes))) * height;

  const pts = history.map((p, i) => [xs(i), ys(p.yes)] as const);

  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const [firstX] = pts[0];
  const [lastX, lastY] = pts[pts.length - 1];
  const area = `${line} L${lastX.toFixed(1)} ${height} L${firstX.toFixed(1)} ${height} Z`;

  return { line, area, lastX, lastY };
}
