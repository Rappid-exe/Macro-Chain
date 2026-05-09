"""Pydantic models mirroring web/src/lib/types.ts.

The API is the source of truth; the TS types are a hand-copy kept in sync.
When contracts shift, update both sides or we get a silent divergence bug in
the demo. This file should stay small and obvious.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

Sector = Literal["tech", "energy", "economy", "geopolitics", "other"]
EventSourceT = Literal["polymarket", "kalshi"]
EdgeConfidence = Literal["direct", "inferred", "speculative"]
EdgeKind = Literal[
    "supplies",
    "consumes",
    "competes_with",
    "correlated_with",
    "sensitive_to",
    "impacts",
]
Direction = Literal["up", "down", "mixed"]


class EventSummary(BaseModel):
    id: str
    source: EventSourceT
    question: str
    yes_price: float = Field(ge=0.0, le=1.0)
    delta_24h: float = Field(ge=-1.0, le=1.0)
    volume_24h: float = 0.0
    resolution_date: datetime | None = None
    sector: Sector = "other"
    impact_score: float | None = None


class PricePoint(BaseModel):
    t: datetime
    yes: float = Field(ge=0.0, le=1.0)


class EventDetail(EventSummary):
    description: str = ""
    history: list[PricePoint] = []


class GraphNode(BaseModel):
    id: str
    kind: Literal["event", "theme", "commodity", "sector", "ticker"]
    label: str
    sublabel: str | None = None
    direction: Direction | None = None
    magnitude: float | None = None


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    kind: EdgeKind
    confidence: EdgeConfidence
    rationale: str


class CausalGraph(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class TickerImpact(BaseModel):
    symbol: str
    name: str
    order: Literal[1, 2, 3]
    direction: Direction
    magnitude_bps: float
    thesis: str
    chain: list[str]


class Report(BaseModel):
    event_id: str
    scenario: Literal["yes", "no"]
    executive_summary: str
    horizon_days: int
    confidence: Literal["low", "medium", "high"]
    impacts: list[TickerImpact]
    assumptions: list[str] = []
    caveats: list[str] = []
