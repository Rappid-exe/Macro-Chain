"""Kalshi ingestion via the trade API.

https://trading-api.readme.io/reference/getmarkets

Stub for now. Kalshi requires auth for most endpoints; public market listings
are accessible with a key. Add when ready.
"""

from __future__ import annotations

from app.schemas import EventSummary


async def list_events(limit: int = 50) -> list[EventSummary]:  # pragma: no cover - stub
    raise NotImplementedError("Kalshi ingestion not yet implemented")


async def get_event(event_id: str) -> EventSummary | None:  # pragma: no cover - stub
    raise NotImplementedError("Kalshi ingestion not yet implemented")
