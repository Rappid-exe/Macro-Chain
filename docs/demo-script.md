# Demo script

Target: 3 minutes. Assume judges know finance but not prediction markets.

## Hook (20s)

"Prediction markets tell you the *probability* of an event. They don't tell
you what to do with that information. The alpha isn't in knowing that the
Fed cut is 67% likely — that's priced. The alpha is in the ten equities that
move on the *second-order* effect, three days later."

## Scan (30s)

Open the event list. Filter to Economy. Sort by impact score.

"We're pulling from Polymarket and Kalshi. Sector classification is an LLM
pass. The impact score is our own — it's how many tradeable names would
plausibly move."

## Triage (30s)

Click "Will the Fed cut rates at the June FOMC meeting?"

"Left pane is what a prediction-market trader already has. The right pane
is what Macro-Chain adds: a causal graph showing first-order impacts (banks
via XLF) and second-order impacts (homebuilders via lower mortgage rates,
small caps via refinancing)."

## The chain (60s)

Point at a 2nd-order ticker. Hover — the edge highlights.

"Every edge has a confidence tier. Solid edges come from structured sources:
sector ETF composition, 10-K supplier disclosures. Dashed edges are LLM
inference with an explicit rationale. Dotted are speculative — we flag
those."

"This matters because any analyst can ask GPT 'what moves when the Fed cuts'.
What they can't do is see *why*, audit the chain, and know which parts to
trust."

## The report (40s)

Click "Open detailed report". Drawer slides in.

"Executive summary, ranked tickers with thesis, assumptions and caveats.
Every ticker has a chain — click it and the graph behind the drawer
highlights the path."

## Close (20s)

"Roadmap: live news ingestion, historical backtest on resolved markets, and
distributed reasoning on Numinous SN6. Today it's a demo on fixtures. With
the API wired, same flow, real data."
