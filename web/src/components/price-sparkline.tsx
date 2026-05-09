"use client";

import { useMemo } from "react";
import type { PricePoint } from "@/lib/types";

/**
 * Minimal SVG sparkline for Polymarket Yes-price history. Intentionally
 * dependency-free to keep the detail page bundle tiny. Shows:
 *   - the full series as a line (color keyed to net direction)
 *   - a baseline at 50%
 *   - current price as a dot
 *
 * For tooltips and richer interaction we'd swap in Recharts or Visx, but
 * this is plenty for the demo.
 */
export function PriceSparkline({
  history,
  height = 120,
}: {
  history: PricePoint[];
  height?: number;
}) {
  const path = useMemo(() => buildPath(history, 320, height), [history, height]);

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
  const stroke = isUp ? "#7cf0a0" : "#ff7b7b";
  const fill = isUp ? "rgba(124,240,160,0.08)" : "rgba(255,123,123,0.08)";

  return (
    <svg
      viewBox={`0 0 320 ${height}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      {/* 50% baseline */}
      <line
        x1={0}
        x2={320}
        y1={height / 2}
        y2={height / 2}
        stroke="#1e232b"
        strokeDasharray="2 3"
      />
      {/* Area */}
      <path d={path.area} fill={fill} />
      {/* Line */}
      <path
        d={path.line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Current point */}
      <circle
        cx={path.lastX}
        cy={path.lastY}
        r={3}
        fill={stroke}
        stroke="#0b0d10"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function buildPath(history: PricePoint[], width: number, height: number) {
  const n = history.length;
  if (n < 2) return { line: "", area: "", lastX: 0, lastY: 0 };

  const xs = (i: number) => (i / (n - 1)) * width;
  // y axis: yes=0 at bottom, yes=1 at top.
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
