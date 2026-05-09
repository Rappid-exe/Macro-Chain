"""Tradeable-impact scoring.

The impact score answers: "how many distinct equities would plausibly move
if this event resolves, weighted by chain confidence?" It's not a forecast
of return, it's a relevance ranker. We compute it fast and deterministically
so the event list can show it for every card.

Scoring recipe:
    +6 per unique ticker in the seed-KG traversal
    +2 per theme that matched
    -10 if the event's Yes price is near 0 or 1 (already priced in)
    clamp to [0, 95]

This gives events that touch many sectors (geopolitics, Taiwan-risk) the
highest scores, events that touch only narrow themes a middling score, and
events outside our KG a 0. A 0 score is useful information — it tells the
analyst "the reasoner can't help here" rather than faking a number.
"""

from __future__ import annotations

from app.reasoner.matchers import match_themes
from app.reasoner.kg import KG_SINGLETON
from app.schemas import EventSummary


def score_event(event: EventSummary) -> float:
    themes = match_themes(event)
    if not themes:
        return 0.0

    # BFS out from themes up to 3 hops, counting unique tickers.
    visited = set(themes)
    frontier = list(themes)
    ticker_count = 0
    depth = 0
    while frontier and depth < 3:
        nxt: list[str] = []
        for src in frontier:
            for edge in KG_SINGLETON.neighbors(src):
                if edge.target in visited:
                    continue
                visited.add(edge.target)
                node = KG_SINGLETON.nodes.get(edge.target)
                if node is None:
                    continue
                if node.kind == "ticker":
                    ticker_count += 1
                nxt.append(edge.target)
        frontier = nxt
        depth += 1

    base = ticker_count * 6 + len(themes) * 2

    # Penalize events that are already priced in (yes near 0 or 1). The
    # prediction-market information value is proportional to variance.
    yes = event.yes_price
    certainty_penalty = 0
    if yes < 0.05 or yes > 0.95:
        certainty_penalty = 10

    score = base - certainty_penalty
    return float(max(0, min(95, score)))
