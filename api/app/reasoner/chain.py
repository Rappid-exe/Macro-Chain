"""Causal-chain reasoner.

Given a normalized EventDetail and the seed knowledge graph, produce a
CausalGraph and a Report. The reasoner must emit structured output, not
prose — this is what lets the UI highlight chains and what lets us audit
for hallucination.

Plan:

1. Extract structured entities from the event question (sector, commodity,
   country, counterfactual).
2. Seed the graph with the event node.
3. Expand 1-hop via the seed KG using typed edges (supplies, consumes,
   sensitive_to, etc.). These become confidence=direct edges.
4. Ask the LLM for 2nd-order hops with explicit rationale per edge. These
   become confidence=inferred.
5. Any ticker the LLM proposes that is *not* in the seed KG is flagged as
   confidence=speculative.
6. Rank tickers by (magnitude * confidence_weight).

Output: CausalGraph (for the graph view) + Report (for the slide-over).
"""

from __future__ import annotations

from app.schemas import CausalGraph, EventDetail, Report


async def build_graph(event: EventDetail) -> CausalGraph:  # pragma: no cover - stub
    raise NotImplementedError("Reasoner not yet implemented")


async def build_report(event: EventDetail) -> Report:  # pragma: no cover - stub
    raise NotImplementedError("Reasoner not yet implemented")
