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
from app.reasoner.llm import enrich_with_llm
from app.reasoner.scoring import score_event
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
        events = await polymarket.list_events(limit=limit)
    except Exception as exc:  # noqa: BLE001 — degrade gracefully
        log.warning("polymarket live fetch failed, falling back to fixtures: %s", exc)
        return fixtures.list_events()

    return [e.model_copy(update={"impact_score": score_event(e)}) for e in events]


@app.get("/events/{event_id}", response_model=EventDetail)
async def get_event(event_id: str) -> EventDetail:
    summary: EventSummary | None = None
    description = ""
    history: list[dict] = []

    if settings.use_fixtures:
        summary = fixtures.get_event(event_id)
    elif event_id.startswith("pm-"):
        try:
            enriched = await polymarket.get_event_with_history(event_id)
            if enriched is not None:
                summary, history, description = enriched
        except Exception as exc:  # noqa: BLE001
            log.warning("polymarket fetch of %s failed: %s", event_id, exc)
            summary = fixtures.get_event(event_id)
    else:
        summary = fixtures.get_event(event_id)

    if summary is None:
        raise HTTPException(404, "event not found")

    return EventDetail(
        **summary.model_dump(),
        description=description,
        history=history,  # type: ignore[arg-type]
    )


@app.get("/events/{event_id}/graph", response_model=CausalGraph)
async def get_event_graph(event_id: str) -> CausalGraph:
    detail = await get_event(event_id)
    graph = build_graph(detail)
    if settings.enable_llm_enrichment:
        report = build_report(detail)
        graph, _ = await enrich_with_llm(detail, graph, report)
    return graph


@app.get("/events/{event_id}/report", response_model=Report)
async def get_event_report(event_id: str) -> Report:
    detail = await get_event(event_id)
    graph = build_graph(detail)
    report = build_report(detail)
    if settings.enable_llm_enrichment:
        graph, report = await enrich_with_llm(detail, graph, report)
        # Re-rank impacts including any speculative tickers the LLM added.
        # For the report we synthesize TickerImpact entries for spec nodes
        # from the edge rationale the LLM provided.
        spec_nodes = [n for n in graph.nodes if n.id.startswith("spec:tkr:")]
        for n in spec_nodes:
            edge = next(
                (e for e in graph.edges if e.target == n.id),
                None,
            )
            if edge is None:
                continue
            from app.schemas import TickerImpact

            report.impacts.append(
                TickerImpact(
                    symbol=n.label,
                    name=n.sublabel or n.label,
                    order=3,
                    direction=n.direction or "mixed",
                    magnitude_bps=n.magnitude or 20.0,
                    thesis=edge.rationale,
                    chain=[edge.source, n.id],
                )
            )
    return report
