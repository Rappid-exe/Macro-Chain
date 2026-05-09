"""Polymarket ingestion via the Gamma API.

Gamma is the public data API: https://docs.polymarket.com/developers/gamma

This module is a stub; flesh out once the UI is stable. The idea is:

    GET {gamma}/markets?active=true&closed=false&limit=...

and normalize each market into EventSummary. Sector classification is done
by a separate pass (LLM) and cached.
"""

from __future__ import annotations

from app.schemas import EventSummary


async def list_events(limit: int = 50) -> list[EventSummary]:  # pragma: no cover - stub
    raise NotImplementedError("Polymarket ingestion not yet implemented")


async def get_event(event_id: str) -> EventSummary | None:  # pragma: no cover - stub
    raise NotImplementedError("Polymarket ingestion not yet implemented")
