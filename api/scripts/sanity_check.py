"""Sanity check: walk live events and audit the reasoner output.

For each event:
- does the theme matcher pick plausible themes?
- is the primary ticker direction consistent with the event + scenario?
- is the chain well-formed (event -> theme -> ... -> ticker)?
- do speculative LLM tickers look like real symbols?

Prints flags on anything that looks off so we can eyeball them.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import app

TICKER_RE = re.compile(r"^[A-Z]{1,6}(\.[A-Z]{1,4})?$")


def flag(msg: str) -> str:
    return f"  \033[33m[flag]\033[0m {msg}" if sys.stdout.isatty() else f"  [flag] {msg}"


def audit_event(client: TestClient, event_id: str) -> None:
    detail = client.get(f"/events/{event_id}").json()
    graph = client.get(f"/events/{event_id}/graph").json()
    report = client.get(f"/events/{event_id}/report").json()

    q = detail["question"]
    sector = detail["sector"]
    yes = detail["yes_price"]
    scenario = "YES" if yes >= 0.5 else "NO"

    print(f"\n=== {event_id}")
    print(f"    {q}")
    print(f"    sector={sector} yes={yes:.2f} scenario={scenario}")

    themes = [n["label"] for n in graph["nodes"] if n["kind"] == "theme"]
    tickers = [n for n in graph["nodes"] if n["kind"] == "ticker"]
    print(f"    themes:   {themes or '(none)'}")
    print(f"    tickers:  {len(tickers)}  edges: {len(graph['edges'])}")

    # Check 1: did we match any theme?
    if not themes:
        print(flag("no themes matched; graph is orphaned"))

    # Check 2: speculative-ticker symbols look real?
    for n in tickers:
        if n["id"].startswith("spec:tkr:"):
            sym = n["label"]
            if not TICKER_RE.match(sym):
                print(flag(f"bad speculative symbol: {sym!r} ({n.get('sublabel')})"))

    # Check 3: top impacts ordering and directions
    print("    top impacts:")
    for imp in report["impacts"][:6]:
        arrow = {"up": "↑", "down": "↓", "mixed": "?"}.get(imp["direction"], "—")
        order = imp["order"]
        symbol = imp["symbol"]
        thesis_head = imp["thesis"][:90].replace("\n", " ")
        print(f"      [{order}] {arrow} {symbol:>8}  {int(imp['magnitude_bps']):>3}bp  {thesis_head}")


def main() -> None:
    client = TestClient(app)
    events = client.get("/events?limit=12").json()
    print(f"Auditing {len(events)} events\n")
    for e in events[:10]:
        audit_event(client, e["id"])


if __name__ == "__main__":
    main()
