# Roadmap

## Hackathon (now)

- [x] Scaffold (Next.js web, FastAPI api, shared schemas, fixture data)
- [x] Event list UI with sector filter and sort
- [x] Event detail 2-pane layout
- [x] Report slide-over
- [ ] Polymarket Gamma API ingestion (api/app/sources/polymarket.py)
- [ ] Kalshi trade-api ingestion (api/app/sources/kalshi.py)
- [ ] Sector classification pass
- [ ] Seed knowledge graph (kg/seed.json, ~50 tickers)
- [ ] Causal reasoner v1 (api/app/reasoner/chain.py)
- [ ] React Flow graph render with confidence styling
- [ ] End-to-end: click event → real graph → real report

## Post-hackathon

- Real-time updates via websockets
- News ingestion: GDELT, Reuters wire, Benzinga
- 10-K supplier disclosure ingestion (SEC EDGAR)
- FactSet Revere / Bloomberg SPLC if budget allows
- Historical backtest on resolved markets (the killer slide we skip on day 3)
- Distributed reasoning on Numinous SN6 miners, consensus on chains
- Portfolio-level exposure view (user uploads positions → per-event P&L
  estimate)
