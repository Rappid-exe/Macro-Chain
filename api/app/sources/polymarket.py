"""Polymarket ingestion via the Gamma API.

Gamma is Polymarket's public read-only data API. Base URL:
https://gamma-api.polymarket.com

We use /events (not /markets) because an Event is the higher-level unit a
user reasons about ("Will the Fed cut rates in June?"), and /events gives us:
    - tags: sector-adjacent labels we can map to our taxonomy
    - markets: the binary sub-markets with outcomePrices and volumes
    - volume24hr / volume / liquidity
    - endDate

For a binary yes/no event we pull the first market's outcomePrices. For
multi-outcome events (rare in our sector slice) we currently fall back to
the event-level "yes-equivalent" price if available, else skip.

The Gamma API surfaces `oneDayPriceChange` on markets, which is what we
map to our normalized `delta_24h`.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from app.config import settings
from app.schemas import EventSummary, Sector

log = logging.getLogger(__name__)

# Tag slug -> normalized sector. Order matters: first match wins, so put the
# more specific tags first. This is deliberately conservative; anything we
# don't recognize falls through to "other" and can be re-bucketed by an LLM
# pass later.
TAG_SECTOR_MAP: dict[str, Sector] = {
    # Geopolitics
    "geopolitics": "geopolitics",
    "ukraine": "geopolitics",
    "russia": "geopolitics",
    "israel": "geopolitics",
    "iran": "geopolitics",
    "china": "geopolitics",
    "taiwan": "geopolitics",
    "middle-east": "geopolitics",
    "ukraine-peace-deal": "geopolitics",
    # Energy
    "energy": "energy",
    "oil": "energy",
    "opec": "energy",
    "gas": "energy",
    "climate": "energy",
    # Economy
    "economy": "economy",
    "fed": "economy",
    "interest-rates": "economy",
    "inflation": "economy",
    "recession": "economy",
    "jobs": "economy",
    "cpi": "economy",
    "gdp": "economy",
    # Tech
    "tech": "tech",
    "ai": "tech",
    "artificial-intelligence": "tech",
    "crypto": "tech",
    "bitcoin": "tech",
    "ethereum": "tech",
}

# Map of sectors we surface in the UI. Everything else becomes "other".
SUPPORTED_SECTORS: set[Sector] = {"tech", "energy", "economy", "geopolitics"}


def _classify_sector(tags: list[dict[str, Any]]) -> Sector:
    """Return a sector based on tag slugs; falls back to 'other'."""
    for tag in tags or []:
        slug = (tag.get("slug") or "").lower()
        if slug in TAG_SECTOR_MAP:
            return TAG_SECTOR_MAP[slug]
    return "other"


def _parse_float(value: Any, default: float = 0.0) -> float:
    """Gamma returns numerics as strings sometimes. Coerce safely."""
    if value is None:
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _parse_end_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        # Gamma returns ISO-8601 with Z suffix
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _primary_market(event: dict[str, Any]) -> dict[str, Any] | None:
    """Pick the market whose yes_price we show on the card.

    For binary events there's typically a single market. For multi-outcome
    events we pick the market with the highest `outcomePrice[yes]`, which
    is a rough approximation of "the most likely outcome". The reasoner
    can then scope to the full event if needed.
    """
    markets = event.get("markets") or []
    if not markets:
        return None

    def yes_price(m: dict[str, Any]) -> float:
        # outcomePrices ships as a JSON-encoded string on /markets responses
        # and as a list on /events responses. Handle both defensively.
        raw = m.get("outcomePrices")
        if isinstance(raw, str):
            try:
                raw = json.loads(raw)
            except json.JSONDecodeError:
                return 0.0
        if isinstance(raw, list) and raw:
            return _parse_float(raw[0])
        return 0.0

    return max(markets, key=yes_price)


def _normalize(event: dict[str, Any]) -> EventSummary | None:
    """Convert a Gamma /events entry into our EventSummary shape.

    Returns None if the event is missing the fields we need (which happens
    for a small number of malformed or deploying entries).
    """
    market = _primary_market(event)
    if market is None:
        return None

    # outcomePrices: [yes, no] as strings
    raw_prices = market.get("outcomePrices")
    if isinstance(raw_prices, str):
        try:
            raw_prices = json.loads(raw_prices)
        except json.JSONDecodeError:
            raw_prices = []
    if not isinstance(raw_prices, list) or not raw_prices:
        return None
    yes_price = _parse_float(raw_prices[0])

    # Price change over 24h is in ABSOLUTE units (0.04 = +4pp), not percent.
    delta_24h = _parse_float(market.get("oneDayPriceChange"))

    sector = _classify_sector(event.get("tags") or [])

    return EventSummary(
        id=f"pm-{event['id']}",
        source="polymarket",
        question=event.get("title") or market.get("question") or "",
        yes_price=max(0.0, min(1.0, yes_price)),
        delta_24h=max(-1.0, min(1.0, delta_24h)),
        volume_24h=_parse_float(event.get("volume24hr")),
        resolution_date=_parse_end_date(event.get("endDate")),
        sector=sector,
        # Impact score is computed later by the reasoner. Leave null so the
        # card shows "—" rather than a fake number.
        impact_score=None,
    )


async def list_events(
    limit: int = 50,
    fetch_pool: int = 200,
    include_other: bool = False,
) -> list[EventSummary]:
    """Fetch active Polymarket events, classify, and return the most relevant.

    Polymarket's /events ordered by volume is dominated by sports and
    entertainment, which are not our target sectors. We fetch a larger pool
    (`fetch_pool`), normalize, drop anything classified as `other`, and then
    return the top `limit` by 24h volume. Set `include_other=True` to
    disable that filter.
    """
    url = f"{settings.polymarket_gamma_url.rstrip('/')}/events"
    params = {
        "active": "true",
        "closed": "false",
        "archived": "false",
        "limit": fetch_pool,
        "order": "volume24hr",
        "ascending": "false",
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        raw = resp.json()

    out: list[EventSummary] = []
    for item in raw:
        try:
            norm = _normalize(item)
        except Exception as exc:  # noqa: BLE001 — don't let one bad event kill the list
            log.warning("failed to normalize polymarket event %s: %s", item.get("id"), exc)
            continue
        if norm is None:
            continue
        if not include_other and norm.sector == "other":
            continue
        out.append(norm)

    # Already descending by volume from Gamma; keep that ordering.
    return out[:limit]


async def get_event(event_id: str) -> EventSummary | None:
    """Fetch a single event by our prefixed id (pm-<gamma-id>)."""
    gamma_id = event_id.removeprefix("pm-")
    url = f"{settings.polymarket_gamma_url.rstrip('/')}/events/{gamma_id}"
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url)
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        return _normalize(resp.json())


async def get_event_with_history(
    event_id: str,
    fidelity_minutes: int = 60,
) -> tuple[EventSummary, list[dict[str, float]], str] | None:
    """Fetch an event + its CLOB price history for the Yes token.

    Returns (summary, history_points, description) or None if not found.
    Each history point is {"t": iso_str, "yes": float}. We convert the CLOB's
    unix seconds into ISO so the wire shape matches PricePoint directly.
    """
    gamma_id = event_id.removeprefix("pm-")
    base = settings.polymarket_gamma_url.rstrip("/")

    async with httpx.AsyncClient(timeout=20.0) as client:
        ev_resp = await client.get(f"{base}/events/{gamma_id}")
        if ev_resp.status_code == 404:
            return None
        ev_resp.raise_for_status()
        ev = ev_resp.json()

        summary = _normalize(ev)
        if summary is None:
            return None

        market = _primary_market(ev)
        description = market.get("description") if market else ""
        token_ids_raw = market.get("clobTokenIds") if market else None
        yes_token: str | None = None
        if isinstance(token_ids_raw, str):
            try:
                parsed = json.loads(token_ids_raw)
                if parsed:
                    yes_token = str(parsed[0])
            except json.JSONDecodeError:
                yes_token = None
        elif isinstance(token_ids_raw, list) and token_ids_raw:
            yes_token = str(token_ids_raw[0])

        history: list[dict[str, float]] = []
        if yes_token:
            try:
                hist_resp = await client.get(
                    "https://clob.polymarket.com/prices-history",
                    params={
                        "market": yes_token,
                        "interval": "max",
                        "fidelity": fidelity_minutes,
                    },
                )
                hist_resp.raise_for_status()
                raw_hist = hist_resp.json().get("history") or []
                # Downsample: if more than 400 points, keep every Nth so the
                # chart stays snappy without losing shape.
                if len(raw_hist) > 400:
                    step = max(1, len(raw_hist) // 400)
                    raw_hist = raw_hist[::step]
                for p in raw_hist:
                    t_unix = p.get("t")
                    price = p.get("p")
                    if t_unix is None or price is None:
                        continue
                    history.append(
                        {
                            "t": datetime.fromtimestamp(float(t_unix), tz=timezone.utc).isoformat(),
                            "yes": float(price),
                        }
                    )
            except Exception as exc:  # noqa: BLE001
                log.warning("prices-history fetch failed for %s: %s", event_id, exc)

    return summary, history, description or ""
