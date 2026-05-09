"""LLM enrichment pass.

The deterministic reasoner produces a solid base graph from our hand-curated
seed. This module layers an LLM on top to:

1.  Propose **speculative** 2nd/3rd-order tickers that aren't in our seed
    graph, with an explicit per-ticker rationale. Rendered as dotted edges
    in the UI so the user can see they're not grounded.
2.  Write the executive summary in prose tailored to this specific event
    rather than a templated one.

Provider preference: Gemini first (cheaper, fast enough, strict JSON via
response_schema), Anthropic as fallback. If no key is configured at all,
we return the base graph/report unchanged — the demo must never depend on
network calls to a paid provider.

Design rules:
- The LLM never overrides confidence=direct or confidence=inferred edges.
  Those come from structured sources and are more trustworthy than free-
  text reasoning.
- LLM output is strictly structured JSON validated with pydantic before
  merging. Anything malformed is dropped with a warning.
- For Gemini we use `response_mime_type="application/json"` +
  `response_schema` which gives near-100% valid-JSON output.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Literal

from pydantic import BaseModel, Field, ValidationError

from app.config import settings
from app.schemas import CausalGraph, EventDetail, GraphEdge, GraphNode, Report

log = logging.getLogger(__name__)

MAX_SPECULATIVE_TICKERS = 5


class SpecTicker(BaseModel):
    # Relaxed from 10 to 15 chars to accommodate tickers like MAERSK-B.CO,
    # 7974.T (Tokyo). We filter out non-US exotic tickers at merge time if
    # we want to, but we don't let one malformed symbol nuke the whole
    # payload.
    symbol: str = Field(..., max_length=15)
    name: str
    direction: Literal["up", "down", "mixed"]
    rationale: str
    via_node_id: str  # must reference an existing graph node


class EnrichmentPayload(BaseModel):
    executive_summary: str
    speculative_tickers: list[SpecTicker] = []


class _RawPayload(BaseModel):
    """Looser shape for initial parse. We validate SpecTickers one by one
    after so a single bad symbol doesn't nuke the whole response."""

    executive_summary: str = ""
    speculative_tickers: list[dict] = []


_SYSTEM_INSTRUCTION = """You are an equities analyst assistant. You receive a prediction market event, a prebuilt causal graph of impacted equities, and a list of existing graph node ids.

Your job is two things:

1. Write a concise 2-3 sentence EXECUTIVE SUMMARY that explains how this event would plausibly propagate to markets. Ground it in the actual event text; do not be generic.

2. Propose up to 5 SPECULATIVE tickers NOT already in the graph that would plausibly move on this event via 2nd- or 3rd-order effects. For each, specify:
   - via_node_id: the existing graph node id it hangs off (must be one of the provided ids)
   - symbol: the ticker (US equity or well-known ETF)
   - name: company/ETF name
   - direction: "up", "down", or "mixed"
   - rationale: one sentence tied to the event mechanism

Rules:
- Do not repeat tickers already in the existing graph.
- Be specific with rationale; say WHY, not just WHAT.
- If you cannot think of non-obvious additions, return an empty list.
- Respond as strict JSON matching the provided schema."""


def _render_graph_for_prompt(graph: CausalGraph) -> str:
    lines = ["Existing graph nodes (id: label [kind]):"]
    for n in graph.nodes:
        extra = f" dir={n.direction}" if n.direction else ""
        lines.append(f"  {n.id}: {n.label} [{n.kind}]{extra}")
    tickers = sorted({n.label for n in graph.nodes if n.kind == "ticker"})
    lines.append("")
    lines.append("Existing tickers (do NOT repeat these):")
    lines.append("  " + ", ".join(tickers) if tickers else "  (none)")
    return "\n".join(lines)


def _user_prompt(event: EventDetail, graph: CausalGraph) -> str:
    return (
        f"EVENT: {event.question}\n"
        f"Sector: {event.sector}\n"
        f"Yes price: {event.yes_price:.2f}\n"
        f"Scenario: {'YES resolves' if event.yes_price >= 0.5 else 'NO resolves'}\n\n"
        f"{_render_graph_for_prompt(graph)}"
    )


async def enrich_with_llm(
    event: EventDetail,
    graph: CausalGraph,
    report: Report,
) -> tuple[CausalGraph, Report]:
    """Return a (graph, report) pair enriched by the LLM, or the originals
    if no provider is configured or the call fails.
    """
    payload: EnrichmentPayload | None = None

    if settings.google_api_key:
        payload = await _call_gemini(event, graph)
    elif settings.anthropic_api_key:
        payload = await _call_anthropic(event, graph)
    else:
        log.info("no LLM provider configured; skipping enrichment")
        return graph, report

    if payload is None:
        return graph, report

    return _merge(graph, report, payload)


# --------------------------------------------------------------------------- #
# Providers                                                                   #
# --------------------------------------------------------------------------- #


async def _call_gemini(
    event: EventDetail,
    graph: CausalGraph,
) -> EnrichmentPayload | None:
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        log.warning("google-genai not installed; skipping Gemini")
        return None

    client = genai.Client(api_key=settings.google_api_key)

    # Gemini's response_schema enforces structured JSON output.
    response_schema = {
        "type": "OBJECT",
        "properties": {
            "executive_summary": {"type": "STRING"},
            "speculative_tickers": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "symbol": {"type": "STRING"},
                        "name": {"type": "STRING"},
                        "direction": {
                            "type": "STRING",
                            "enum": ["up", "down", "mixed"],
                        },
                        "rationale": {"type": "STRING"},
                        "via_node_id": {"type": "STRING"},
                    },
                    "required": [
                        "symbol",
                        "name",
                        "direction",
                        "rationale",
                        "via_node_id",
                    ],
                },
            },
        },
        "required": ["executive_summary", "speculative_tickers"],
    }

    try:
        resp = await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=_user_prompt(event, graph),
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0.4,
                max_output_tokens=4096,
                # Gemini 2.5 Flash does "thinking" by default which eats
                # the output budget. We don't need deep reasoning for this
                # structured transform, so disable it for speed + reliability.
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
    except Exception as exc:  # noqa: BLE001
        log.warning("gemini call failed: %s", exc)
        return None

    text = getattr(resp, "text", "") or ""
    if not text:
        # Log why — finish_reason tells us if it hit a limit or was blocked
        try:
            cand = resp.candidates[0] if resp.candidates else None
            log.warning(
                "gemini returned empty text. finish_reason=%s, usage=%s",
                getattr(cand, "finish_reason", None) if cand else None,
                getattr(resp, "usage_metadata", None),
            )
        except Exception:  # noqa: BLE001
            pass
    return _parse_payload(text)


async def _call_anthropic(
    event: EventDetail,
    graph: CausalGraph,
) -> EnrichmentPayload | None:
    try:
        from anthropic import AsyncAnthropic
    except ImportError:
        log.warning("anthropic package not installed; skipping")
        return None

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    user = _user_prompt(event, graph) + (
        "\n\nRespond with JSON only:\n"
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
            model="claude-haiku-4-5",
            max_tokens=1024,
            system=_SYSTEM_INSTRUCTION,
            messages=[{"role": "user", "content": user}],
        )
    except Exception as exc:  # noqa: BLE001
        log.warning("anthropic call failed: %s", exc)
        return None

    text = _extract_anthropic_text(resp)
    return _parse_payload(text)


# --------------------------------------------------------------------------- #
# Parsing + merging                                                           #
# --------------------------------------------------------------------------- #


def _extract_anthropic_text(resp: Any) -> str:
    parts: list[str] = []
    for block in getattr(resp, "content", []) or []:
        text = getattr(block, "text", None)
        if text:
            parts.append(text)
    return "\n".join(parts)


def _parse_payload(text: str) -> EnrichmentPayload | None:
    """Extract and validate the JSON object from any LLM reply.

    We parse into a loose schema first and then validate SpecTickers one
    at a time. This way, a single malformed ticker row (bad symbol, wrong
    direction string, missing field) doesn't throw away the exec summary
    and all the other good rows.
    """
    if not text:
        return None
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        log.warning("llm reply contained no JSON object: %r", text[:300])
        return None
    blob = text[start : end + 1]
    try:
        data = json.loads(blob)
    except json.JSONDecodeError as exc:
        log.warning(
            "llm JSON decode failed at %s: ...%r",
            exc,
            blob[max(0, exc.pos - 80) : exc.pos + 80],
        )
        return None

    try:
        raw = _RawPayload.model_validate(data)
    except ValidationError as exc:
        log.warning("llm payload top-level validation failed: %s", exc)
        return None

    validated: list[SpecTicker] = []
    for row in raw.speculative_tickers:
        try:
            validated.append(SpecTicker.model_validate(row))
        except ValidationError as exc:
            log.info("dropping malformed spec ticker %r: %s", row, exc.errors())
    return EnrichmentPayload(
        executive_summary=raw.executive_summary,
        speculative_tickers=validated,
    )


def _merge(
    graph: CausalGraph,
    report: Report,
    payload: EnrichmentPayload,
) -> tuple[CausalGraph, Report]:
    """Fold the LLM's additions into the graph and report."""
    existing_ids = {n.id for n in graph.nodes}
    existing_symbols = {n.label for n in graph.nodes if n.kind == "ticker"}

    new_nodes = list(graph.nodes)
    new_edges = list(graph.edges)
    for i, spec in enumerate(payload.speculative_tickers[:MAX_SPECULATIVE_TICKERS]):
        if spec.via_node_id not in existing_ids:
            continue
        if spec.symbol in existing_symbols:
            continue

        node_id = f"spec:tkr:{spec.symbol}"
        new_nodes.append(
            GraphNode(
                id=node_id,
                kind="ticker",
                label=spec.symbol,
                sublabel=spec.name,
                direction=spec.direction,
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
