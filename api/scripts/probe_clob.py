"""Probe the Polymarket CLOB prices-history endpoint to confirm shape."""

import httpx

TOKEN = "79574854225464477884287524461980167393583915155475895540399834902850789709576"

resp = httpx.get(
    "https://clob.polymarket.com/prices-history",
    params={"market": TOKEN, "interval": "max", "fidelity": 60},
    timeout=20.0,
)
resp.raise_for_status()
body = resp.json()
history = body.get("history", [])
print(f"points: {len(history)}")
for p in history[:3]:
    print(f"  t={p['t']}  p={p['p']:.4f}")
print("...")
for p in history[-3:]:
    print(f"  t={p['t']}  p={p['p']:.4f}")
