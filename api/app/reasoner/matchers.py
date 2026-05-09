"""Event-to-theme matcher.

Maps a Polymarket / Kalshi event's question text and sector to the seed
knowledge graph themes it touches. Deterministic, fast, free. The LLM
reasoner can layer on top later, but this alone is enough to produce a
useful graph for the demo.

Design notes
------------
- Matching is regex-based over the question text plus a fallback keyed by
  sector for events that don't trigger any pattern.
- Some themes are *signed*: "OPEC cuts production" should bias oil up;
  "OPEC raises production" should bias it down. We encode this as two
  separate theme ids (`theme:oil-supply-cut` and `theme:oil-supply-add`),
  each with its own patterns. The matcher picks the first one that fires.
- Order in THEME_KEYWORDS matters. Signed/specific themes go above the
  broad fallbacks that would otherwise swallow them.
"""

from __future__ import annotations

import re

from app.schemas import EventSummary

# theme id -> keyword patterns (case-insensitive).
THEME_KEYWORDS: list[tuple[str, list[str]]] = [
    # --- Geopolitics-specific --------------------------------------------
    (
        "theme:taiwan-risk",
        [r"\btaiwan\b", r"\btsmc\b", r"taiwan strait"],
    ),
    # --- Shipping disruption --------------------------------------------
    (
        "theme:shipping",
        [
            r"\bshipping\b",
            r"\bfreight\b",
            r"\bcontainer rates?\b",
            r"\bred sea\b",
            r"\bsuez\b",
            r"\bhormuz\b",
            r"\bhouthi\b",
            r"\bstrait\b.{0,30}(closed|blocked|disrupt)",
        ],
    ),
    # --- Oil: supply restriction ----------------------------------------
    (
        "theme:oil-supply-cut",
        [
            r"\bopec\b.{0,40}(cut|reduce|restrict|extend cut|production cut)",
            r"\bproduction cut\b",
            r"\boil.{0,20}sanction",
            r"\bsanction.{0,20}(oil|russian oil|iran|venezuela)",
            r"\boil embargo\b",
            r"\brefinery.{0,15}(fire|outage|shutdown)",
            r"(close|shut).{0,20}hormuz",
        ],
    ),
    # --- Oil: supply expansion ------------------------------------------
    (
        "theme:oil-supply-add",
        [
            r"\bopec\b.{0,40}(raise|increase|hike|add production|unwind cut)",
            r"\bopec\+.{0,40}raise",
            r"\bstrategic petroleum reserve\b.{0,20}release",
            r"\bspr release\b",
        ],
    ),
    # --- AI / semis ------------------------------------------------------
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
    # --- Crypto ---------------------------------------------------------
    (
        "theme:crypto-rally",
        [
            r"\bbitcoin\b",
            r"\bbtc\b",
            r"\bethereum\b",
            r"\beth\b(?!ic)",
            r"\bcrypto\b",
            r"\bsolana\b",
        ],
    ),
    # --- Rates / macro --------------------------------------------------
    (
        "theme:rate-cuts",
        [
            r"rate cut",
            r"\bcuts?\s+rates?\b",
            r"\bfomc\b",
            r"\bfed\b.{0,20}(cut|hold|hike|decision|meeting)",
            r"\bfederal reserve\b",
        ],
    ),
    (
        "theme:inflation",
        [r"\bcpi\b", r"\binflation\b", r"\bpce\b", r"price index", r"core.{0,10}cpi"],
    ),
    (
        "theme:usd-strength",
        [r"\busd\b", r"\bdollar\b", r"\beuro\b", r"\byen\b", r"\bfx\b"],
    ),
]


_COMPILED: list[tuple[str, list[re.Pattern[str]]]] = [
    (theme, [re.compile(p, re.IGNORECASE) for p in pats])
    for theme, pats in THEME_KEYWORDS
]


# Fallback themes by sector, used when no keyword matches.
SECTOR_FALLBACK_THEMES: dict[str, list[str]] = {
    "economy": ["theme:rate-cuts", "theme:inflation"],
    # Don't default energy events to a signed theme; absent a direction
    # signal we fall back to `oil-supply-cut` since it's the more common
    # question framing on these markets ("will OPEC cut", "sanctions on
    # Russian oil"). If this proves wrong we add a neutral theme later.
    "energy": ["theme:oil-supply-cut"],
    "tech": ["theme:ai-capex"],
    "geopolitics": ["theme:shipping"],
}


def match_themes(event: EventSummary) -> list[str]:
    """Return the themes this event touches, in priority order. Dedups."""
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
