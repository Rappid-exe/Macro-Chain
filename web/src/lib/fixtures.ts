// Hand-rolled fixture data so the web UI can be built and demoed before the
// Python API is wired. Once api/ is live these are replaced by fetch calls.

import type { EventSummary } from "./types";

export const FIXTURE_EVENTS: EventSummary[] = [
  {
    id: "pm-fed-june-cut",
    source: "polymarket",
    question: "Will the Fed cut rates at the June FOMC meeting?",
    yes_price: 0.67,
    delta_24h: 0.04,
    volume_24h: 1_240_000,
    resolution_date: "2026-06-18",
    sector: "economy",
    impact_score: 82,
  },
  {
    id: "pm-nvidia-q2-beat",
    source: "polymarket",
    question: "Will NVIDIA beat Q2 revenue consensus?",
    yes_price: 0.71,
    delta_24h: -0.02,
    volume_24h: 890_000,
    resolution_date: "2026-08-21",
    sector: "tech",
    impact_score: 78,
  },
  {
    id: "ka-opec-cut",
    source: "kalshi",
    question: "Will OPEC+ announce a production cut before July?",
    yes_price: 0.42,
    delta_24h: 0.08,
    volume_24h: 410_000,
    resolution_date: "2026-07-01",
    sector: "energy",
    impact_score: 74,
  },
  {
    id: "pm-taiwan-semi-disruption",
    source: "polymarket",
    question:
      "Will a Taiwan Strait incident disrupt semiconductor shipments in 2026?",
    yes_price: 0.18,
    delta_24h: 0.01,
    volume_24h: 520_000,
    resolution_date: "2026-12-31",
    sector: "geopolitics",
    impact_score: 91,
  },
  {
    id: "ka-cpi-above-3",
    source: "kalshi",
    question: "Will May CPI print above 3.0% YoY?",
    yes_price: 0.38,
    delta_24h: -0.03,
    volume_24h: 680_000,
    resolution_date: "2026-06-12",
    sector: "economy",
    impact_score: 68,
  },
  {
    id: "pm-ai-capex-cut",
    source: "polymarket",
    question:
      "Will any hyperscaler cut AI capex guidance in next earnings cycle?",
    yes_price: 0.23,
    delta_24h: 0.05,
    volume_24h: 340_000,
    resolution_date: "2026-08-01",
    sector: "tech",
    impact_score: 85,
  },
];
