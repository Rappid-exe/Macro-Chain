"""Exercise the reasoner end-to-end against fixture events and one real
Polymarket event. Prints the graph and the top-ranked ticker impacts.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import app
from app.reasoner.chain import build_graph, build_report
from app.schemas import EventDetail
from app.sources.fixtures import list_events as list_fixtures

client = TestClient(app)


def run(event: EventDetail) -> None:
    g = build_graph(event)
    r = build_report(event)

    print(f"\n=== {event.question}")
    print(f"    sector={event.sector}  yes={event.yes_price:.2f}")
    print(f"    graph: {len(g.nodes)} nodes, {len(g.edges)} edges")

    themes = [n.label for n in g.nodes if n.kind == "theme"]
    print(f"    themes matched: {themes or '—'}")

    if not r.impacts:
        print("    no ticker impacts")
        return

    for imp in r.impacts[:6]:
        arrow = {"up": "↑", "down": "↓", "mixed": "?"}[imp.direction]
        print(
            f"      {arrow} {imp.symbol:6}  {int(imp.magnitude_bps):>3} bps  order={imp.order}"
        )


# Fixtures
for ev in list_fixtures():
    detail = EventDetail(**ev.model_dump(), description="", history=[])
    run(detail)

# One live Polymarket event for smell test
resp = client.get("/events", params={"limit": 5})
resp.raise_for_status()
for ev_json in resp.json()[:2]:
    detail_resp = client.get(f"/events/{ev_json['id']}")
    if detail_resp.status_code == 200:
        run(EventDetail(**detail_resp.json()))
