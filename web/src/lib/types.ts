// Shared type definitions between web and api. Kept narrow — API is the
// source of truth, these mirror the normalized shapes.

export type Sector = "tech" | "energy" | "economy" | "geopolitics" | "other";

export type EventSource = "polymarket" | "kalshi";

export interface EventSummary {
  id: string;
  source: EventSource;
  question: string;
  yes_price: number; // 0..1
  delta_24h: number; // -1..1, change in yes_price over 24h
  volume_24h: number; // USD
  resolution_date: string | null; // ISO
  sector: Sector;
  impact_score: number | null; // 0..100, null if not yet scored
}

export interface PricePoint {
  t: string; // ISO timestamp
  yes: number; // 0..1
}

export interface EventDetail extends EventSummary {
  description: string;
  history: PricePoint[];
}

export type EdgeConfidence = "direct" | "inferred" | "speculative";
export type EdgeKind =
  | "supplies"
  | "consumes"
  | "competes_with"
  | "correlated_with"
  | "sensitive_to"
  | "impacts";

export interface GraphNode {
  id: string;
  kind: "event" | "theme" | "commodity" | "sector" | "ticker";
  label: string;
  sublabel?: string;
  // For ticker nodes, the predicted directional impact.
  direction?: "up" | "down" | "mixed";
  // Estimated magnitude in % (not a forecast, a heuristic for ranking).
  magnitude?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  confidence: EdgeConfidence;
  rationale: string;
}

export interface CausalGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TickerImpact {
  symbol: string;
  name: string;
  order: 1 | 2 | 3;
  direction: "up" | "down" | "mixed";
  magnitude_bps: number; // basis points, rough
  thesis: string;
  chain: string[]; // list of node ids forming the path from event to ticker
}

export interface Report {
  event_id: string;
  scenario: "yes" | "no";
  executive_summary: string;
  horizon_days: number;
  confidence: "low" | "medium" | "high";
  impacts: TickerImpact[];
  assumptions: string[];
  caveats: string[];
}
