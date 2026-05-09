"""FastAPI entrypoint.

Endpoints (MVP):

    GET  /health                 -> {"ok": true}
    GET  /events                 -> list[EventSummary]
    GET  /events/{id}            -> EventDetail
    GET  /events/{id}/graph      -> CausalGraph       [todo]
    GET  /events/{id}/report     -> Report            [todo]

Source selection is driven by settings.use_fixtures. When False, events
are fetched live from Polymarket (and eventually Kalshi). On upstream
failure we fall back to fixtures so a demo never hits a blank page.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.reasoner.chain import build_graph, build_report
from app.schemas import CausalGraph, EventDetail, EventSummary, Report
from app.sources import fixtures, polymarket

log = logging.getLogger(__name__)

app = FastAPI(title="macro-chain", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    # Next.js dev server. Tighten before any non-local deploy.
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/events", response_model=list[EventSummary])
async def list_events(limit: int = 50) -> list[EventSummary]:
    if settings.use_fixtures:
        return fixtures.list_events()
    try:
        return await polymarket.list_events(limit=limit)
    except Exception as exc:  # noqa: BLE001 — degrade gracefully
        log.warning("polymarket live fetch failed, falling back to fixtures: %s", exc)
        return fixtures.list_events()


@app.get("/events/{event_id}", response_model=EventDetail)
async def get_event(event_id: str) -> EventDetail:
    summary: EventSummary | None = None

    if settings.use_fixtures:
        summary = fixtures.get_event(event_id)
    elif event_id.startswith("pm-"):
        try:
            summary = await polymarket.get_event(event_id)
        except Exception as exc:  # noqa: BLE001
            log.warning("polymarket fetch of %s failed: %s", event_id, exc)
            summary = fixtures.get_event(event_id)
    else:
        summary = fixtures.get_event(event_id)

    if summary is None:
        raise HTTPException(404, "event not found")

    # History and description are populated later by the source-specific
    # detail fetch (CLOB prices for polymarket, trade-api for kalshi).
    return EventDetail(**summary.model_dump(), description="", history=[])


@app.get("/events/{event_id}/graph", response_model=CausalGraph)
async def get_event_graph(event_id: str) -> CausalGraph:
    detail = await get_event(event_id)
    return build_graph(detail)


@app.get("/events/{event_id}/report", response_model=Report)
async def get_event_report(event_id: str) -> Report:
    detail = await get_event(event_id)
    return build_report(detail)
