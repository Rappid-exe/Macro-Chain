"""LLM enrichment pass.

The deterministic reasoner produces a solid base graph from our hand-curated
seed. This module layers an LLM on top to do two things:

1.  Propose **speculative** 2nd/3rd-order tickers that aren't in our seed
    graph, with an explicit per-ticker rationale. Rendered as dotted edges
    in the UI so the user can see they're not grounded.
2.  Write the executive summary in prose tailored to this specific event
    rather than a templated one.

Design rules:
- The LLM never overrides confidence=direct or confidence=inferred edges.
  Those come from structured sources and are more trustworthy than free-
  text reasoning.
- The LLM output is strictly structured JSON. We validate with pydantic
  before merging. Anything malformed is dropped with a warning.
- If no API key is configured, we return the base graph/report unchanged.
  The demo must never depend on network calls to a paid provider.

We prefer Anthropic/Claude because:
- Haiku is cheap and fast enough for per-event calls.
- `response_format` / tool-use gives us reliable JSON without wrapping.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from pydantic import BaseModel, Field, ValidationError

from app.config import settings
from app.schemas import CausalGraph, EventDetail, GraphEdge, GraphNode, Report

log = logging.getLogger(__name__)

# Anthropic model id. Haiku is fine for this task; we're asking for short
# structured output grounded in the event text, not a research essay.
ANTHROPIC_MODEL = "claude-haiku-4-5"
MAX_SPECULATIVE_TICKERS = 5


class SpecTicker(BaseModel):
    """LLM-proposed speculative ticker."""

    symbol: str = Field(..., max_length=10)
    name: str
    direction: str  # "up" | "down" | "mixed"
    rationale: str
    # Which existing graph node id does this ticker hang off? The LLM is
    # told to pick from the node ids we give it.
    via_node_id: str


class EnrichmentPayload(BaseModel):
    executive_summary: str
    speculative_tickers: list[SpecTicker] = []


_SYSTEM_PROMPT = """You are an equities analyst assistant. You receive a prediction market event, a prebuilt causal graph of first- and second-order impacted equities, and a list of existing graph node ids.

Your job is two things:

1. Write a 2-3 sentence EXECUTIVE SUMMARY that explains how this event would plausibly propagate to markets. Ground it in the actual event text; do not be generic.

2. Propose up to 5 SPECULATIVE tickers that are NOT already in the graph but would plausibly move on this event via 2nd- or 3rd-order effects. For each, specify:
   - the existing graph node id it hangs off (via_node_id)
   - expected direction: "up", "down", or "mixed"
   - a one-sentence rationale tied to the event mechanism

Rules:
- Only propose tickers that are publicly listed US equities or well-known ETFs.
- Do not repeat tickers already in the existing graph.
- Be specific with rationale; say WHY, not just WHAT.
- If you cannot think of any non-obvious additions, return an empty list.
- Respond in STRICT JSON matching the provided schema. No prose outside JSON."""


def _render_graph_for_prompt(graph: CausalGraph) -> str:
    lines = ["Existing graph nodes (id: label [kind]):"]
    for n in graph.nodes:
        extra = f" dir={n.direction}" if n.direction else ""
        lines.append(f"  {n.id}: {n.label} [{n.kind}]{extra}")
    lines.append("")
    lines.append("Existing tickers (do NOT repeat these):")
    tickers = sorted({n.label for n in graph.nodes if n.kind == "ticker"})
    lines.append("  " + ", ".join(tickers) if tickers else "  (none)")
    return "\n".join(lines)


async def enrich_with_llm(
    event: EventDetail,
    graph: CausalGraph,
    report: Report,
) -> tuple[CausalGraph, Report]:
    """Return a (graph, report) pair enriched by the LLM, or the originals
    if no key is configured or the call fails.
    """
    if not settings.anthropic_api_key:
        log.info("anthropic_api_key not set; skipping LLM enrichment")
        return graph, report

    try:
        from anthropic import AsyncAnthropic
    except ImportError:
        log.warning("anthropic package not installed; skipping LLM enrichment")
        return graph, report

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    user_prompt = (
        f"EVENT: {event.question}\n"
        f"Sector: {event.sector}\n"
        f"Yes price: {event.yes_price:.2f}\n"
        f"Scenario we are reasoning under: {'YES resolves' if event.yes_price >= 0.5 else 'NO resolves'}\n\n"
        f"{_render_graph_for_prompt(graph)}\n\n"
        "Respond with JSON only:\n"
        "{\n"
        '  "executive_summary": "...",\n'
        '  "speculative_tickers": [\n'
        '    {"symbol": "...", "name": "...", "direction": "up|down|mixed",\n'
        '     "via_node_id": "<one of the node ids above>", "rationale": "..."}\n'
        "  ]\n"
        "}"
    )

    try:
        resp = await client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )
    except Exception as exc:  # noqa: BLE001
        log.warning("anthropic call failed: %s", exc)
        return graph, report

    text = _extract_text(resp)
    payload = _parse_payload(text)
    if payload is None:
        return graph, report

    # Build new graph: add speculative nodes + edges hanging off existing ids.
    existing_ids = {n.id for n in graph.nodes}
    existing_symbols = {n.label for n in graph.nodes if n.kind == "ticker"}

    new_nodes = list(graph.nodes)
    new_edges = list(graph.edges)
    for i, spec in enumerate(payload.speculative_tickers[:MAX_SPECULATIVE_TICKERS]):
        if spec.via_node_id not in existing_ids:
            continue  # LLM referenced a node it invented; drop.
        if spec.symbol in existing_symbols:
            continue  # Already in graph; dedup.
        if spec.direction not in ("up", "down", "mixed"):
            continue

        node_id = f"spec:tkr:{spec.symbol}"
        new_nodes.append(
            GraphNode(
                id=node_id,
                kind="ticker",
                label=spec.symbol,
                sublabel=spec.name,
                direction=spec.direction,  # type: ignore[arg-type]
                magnitude=25.0,
            )
        )
        new_edges.append(
            GraphEdge(
                id=f"{spec.via_node_id}->{node_id}#spec{i}",
                source=spec.via_node_id,
                target=node_id,
                kind="impacts",
                confidence="speculative",
                rationale=spec.rationale,
            )
        )
        existing_symbols.add(spec.symbol)

    enriched_graph = CausalGraph(nodes=new_nodes, edges=new_edges)

    enriched_report = report.model_copy(
        update={
            "executive_summary": payload.executive_summary or report.executive_summary,
        }
    )

    return enriched_graph, enriched_report


def _extract_text(resp: Any) -> str:
    """Flatten Anthropic's content blocks to a single string."""
    parts: list[str] = []
    for block in getattr(resp, "content", []) or []:
        text = getattr(block, "text", None)
        if text:
            parts.append(text)
    return "\n".join(parts)


def _parse_payload(text: str) -> EnrichmentPayload | None:
    """Extract the first JSON object from the LLM reply and validate it."""
    if not text:
        return None
    # Find the first {...} span. Be forgiving about wrapping prose.
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        log.warning("llm reply contained no JSON object: %r", text[:200])
        return None
    blob = text[start : end + 1]
    try:
        data = json.loads(blob)
    except json.JSONDecodeError as exc:
        log.warning("llm JSON decode failed: %s", exc)
        return None
    try:
        return EnrichmentPayload.model_validate(data)
    except ValidationError as exc:
        log.warning("llm payload failed schema validation: %s", exc)
        return None
