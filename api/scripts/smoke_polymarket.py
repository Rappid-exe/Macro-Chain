"""Quick smoke test: hit /events through the FastAPI TestClient and print
the normalized Polymarket output. Run from api/ with the venv active.
"""

import sys
from pathlib import Path

# Allow running as a bare script (`python scripts/smoke_polymarket.py`)
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
resp = client.get("/events", params={"limit": 12})
print("status:", resp.status_code)
events = resp.json()
print("count:", len(events))
print()

sector_counts: dict[str, int] = {}
for e in events:
    sector_counts[e["sector"]] = sector_counts.get(e["sector"], 0) + 1
    pct = round(e["yes_price"] * 100)
    delta = round(e["delta_24h"] * 100, 1)
    print(f"  [{e['sector']:11}] {pct:>3}%  ({delta:+.1f}pp)  {e['question'][:80]}")

print()
print("sector distribution:", sector_counts)
