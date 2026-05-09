"""FastAPI entrypoint.

Endpoints (MVP):

    GET  /health                 -> {"ok": true}
    GET  /events                 -> list[EventSummary]
    GET  /events/{id}            -> EventDetail
    GET  /events/{id}/graph      -> CausalGraph
    GET  /events/{id}/report     -> Report

For the hackathon the service defaults to fixtures (settings.use_fixtures).
Flip to False once polymarket.py / kalshi.py are implemented.
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import EventDetail, EventSummary
from app.sources import fixtures

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
async def list_events() -> list[EventSummary]:
    if settings.use_fixtures:
        return fixtures.list_events()
    raise HTTPException(503, "live sources not yet wired")


@app.get("/events/{event_id}", response_model=EventDetail)
async def get_event(event_id: str) -> EventDetail:
    if settings.use_fixtures:
        summary = fixtures.get_event(event_id)
        if summary is None:
            raise HTTPException(404, "event not found")
        return EventDetail(**summary.model_dump(), description="", history=[])
    raise HTTPException(503, "live sources not yet wired")
