"""Fixture data mirroring web/src/lib/fixtures.ts.

Returned when settings.use_fixtures is True, i.e. the default for hackathon
development so we can iterate on the UI without burning rate limits.
"""

from __future__ import annotations

from datetime import datetime, timezone

from app.schemas import EventSummary

_FIXTURES: list[EventSummary] = [
    EventSummary(
        id="pm-fed-june-cut",
        source="polymarket",
        question="Will the Fed cut rates at the June FOMC meeting?",
        yes_price=0.67,
        delta_24h=0.04,
        volume_24h=1_240_000,
        resolution_date=datetime(2026, 6, 18, tzinfo=timezone.utc),
        sector="economy",
        impact_score=82,
    ),
    EventSummary(
        id="pm-nvidia-q2-beat",
        source="polymarket",
        question="Will NVIDIA beat Q2 revenue consensus?",
        yes_price=0.71,
        delta_24h=-0.02,
        volume_24h=890_000,
        resolution_date=datetime(2026, 8, 21, tzinfo=timezone.utc),
        sector="tech",
        impact_score=78,
    ),
    EventSummary(
        id="ka-opec-cut",
        source="kalshi",
        question="Will OPEC+ announce a production cut before July?",
        yes_price=0.42,
        delta_24h=0.08,
        volume_24h=410_000,
        resolution_date=datetime(2026, 7, 1, tzinfo=timezone.utc),
        sector="energy",
        impact_score=74,
    ),
    EventSummary(
        id="pm-taiwan-semi-disruption",
        source="polymarket",
        question=(
            "Will a Taiwan Strait incident disrupt semiconductor shipments in"
            " 2026?"
        ),
        yes_price=0.18,
        delta_24h=0.01,
        volume_24h=520_000,
        resolution_date=datetime(2026, 12, 31, tzinfo=timezone.utc),
        sector="geopolitics",
        impact_score=91,
    ),
    EventSummary(
        id="ka-cpi-above-3",
        source="kalshi",
        question="Will May CPI print above 3.0% YoY?",
        yes_price=0.38,
        delta_24h=-0.03,
        volume_24h=680_000,
        resolution_date=datetime(2026, 6, 12, tzinfo=timezone.utc),
        sector="economy",
        impact_score=68,
    ),
    EventSummary(
        id="pm-ai-capex-cut",
        source="polymarket",
        question=(
            "Will any hyperscaler cut AI capex guidance in next earnings"
            " cycle?"
        ),
        yes_price=0.23,
        delta_24h=0.05,
        volume_24h=340_000,
        resolution_date=datetime(2026, 8, 1, tzinfo=timezone.utc),
        sector="tech",
        impact_score=85,
    ),
]


def list_events() -> list[EventSummary]:
    return _FIXTURES


def get_event(event_id: str) -> EventSummary | None:
    return next((e for e in _FIXTURES if e.id == event_id), None)
