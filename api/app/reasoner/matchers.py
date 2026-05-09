"""Rule-based event-to-theme matcher.

Maps a Polymarket / Kalshi event's question text and sector to the seed
knowledge graph themes it touches. Deterministic, fast, free. The LLM
reasoner can layer on top later, but this alone is enough to produce a
graph for the demo.

Matching is keyword-based. Order in THEME_KEYWORDS matters — first match
wins, so put more specific themes before broader ones.
"""

from __future__ import annotations

import re

from app.schemas import EventSummary

# theme id -> keyword patterns (compiled, case-insensitive). Keep these
# narrow; false positives pollute the graph.
THEME_KEYWORDS: list[tuple[str, list[str]]] = [
    (
        "theme:taiwan-risk",
        [r"\btaiwan\b", r"\btsmc\b", r"taiwan strait"],
    ),
    (
        "theme:shipping",
        [
            r"\bshipping\b",
            r"\bfreight\b",
            r"\bcontainer\b",
            r"\bred sea\b",
            r"\bsuez\b",
            r"\bhormuz\b",
            r"\bhouthi\b",
        ],
    ),
    (
        "theme:oil-supply",
        [r"\bopec\b", r"\boil\b", r"\bcrude\b", r"production cut", r"\bsanction"],
    ),
    (
        "theme:ai-capex",
        [
            r"\bai\b",
            r"artificial intelligence",
            r"hyperscaler",
            r"\bnvidia\b",
            r"data center",
            r"\bcapex\b",
        ],
    ),
    (
        "theme:semi-fab",
        [r"semiconductor", r"\bchips?\b", r"\bfab\b", r"foundry"],
    ),
    (
        "theme:rate-cuts",
        [
            r"rate cut",
            r"\bcuts?\s+rates?\b",
            r"fomc",
            r"\bfed\b.{0,20}(cut|hold|hike|decision|meeting)",
            r"\bfederal reserve\b",
        ],
    ),
    (
        "theme:inflation",
        [r"\bcpi\b", r"\binflation\b", r"\bpce\b", r"price index"],
    ),
    (
        "theme:usd-strength",
        [r"\busd\b", r"\bdollar\b", r"\beuro\b", r"\byen\b", r"fx\b"],
    ),
]


def _compile() -> list[tuple[str, list[re.Pattern[str]]]]:
    return [(theme, [re.compile(p, re.IGNORECASE) for p in pats]) for theme, pats in THEME_KEYWORDS]


_COMPILED = _compile()


# Fallback themes when no keyword matches, scoped by sector. Prevents us
# from rendering an empty graph for a matched-but-unkeyed event.
SECTOR_FALLBACK_THEMES: dict[str, list[str]] = {
    "economy": ["theme:rate-cuts", "theme:inflation"],
    "energy": ["theme:oil-supply"],
    "tech": ["theme:ai-capex"],
    "geopolitics": ["theme:shipping"],
}


def match_themes(event: EventSummary) -> list[str]:
    """Return the ordered list of theme node ids this event touches.

    Order is preserved: the first match in THEME_KEYWORDS defines the
    primary theme, subsequent matches are secondary. Duplicates are
    dropped.
    """
    text = event.question
    matched: list[str] = []
    seen: set[str] = set()
    for theme, patterns in _COMPILED:
        if any(p.search(text) for p in patterns):
            if theme not in seen:
                matched.append(theme)
                seen.add(theme)

    if not matched:
        for theme in SECTOR_FALLBACK_THEMES.get(event.sector, []):
            if theme not in seen:
                matched.append(theme)
                seen.add(theme)

    return matched
