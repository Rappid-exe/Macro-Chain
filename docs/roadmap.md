# Roadmap

## Hackathon (now)

- [x] Scaffold (Next.js web, FastAPI api, shared schemas, fixture data)
- [x] Event list UI with sector filter + sort
- [x] Event detail 2-pane layout
- [x] Report slide-over with 1st/2nd/3rd order sections
- [x] Polymarket Gamma API ingestion with sector classification
- [x] Polymarket CLOB price-history on the detail page (SVG sparkline)
- [x] Seed knowledge graph (~35 tickers across tech/energy/economy/
      geopolitics plus crypto)
- [x] Deterministic causal-chain reasoner with typed edges and confidence
      tiers (direct / inferred / speculative)
- [x] React Flow graph render with dashed/dotted edge styling
- [x] Tradeable-impact score for ranking events
- [x] Optional LLM enrichment (Anthropic Claude Haiku) that proposes
      speculative 2nd-order tickers and rewrites the executive summary
- [ ] Kalshi trade-api ingestion (stub still)
- [ ] Backtest slide: 2-3 resolved Polymarket events with realized
      equity moves on the horizon
- [ ] End-to-end polish pass with real pixels (layout edge cases, loading
      states, error states)

## Post-hackathon

- Real-time updates via websockets (Polymarket CLOB supports it)
- News ingestion pipeline: GDELT, Reuters wire, Benzinga
- 10-K supplier disclosure ingestion from SEC EDGAR to grow the KG
  organically
- FactSet Revere / Bloomberg SPLC if budget allows (industrial-strength
  supply-chain graph)
- Historical backtest harness — run the reasoner against 50+ resolved
  events, measure predicted-vs-actual direction accuracy
- Distributed reasoning on Numinous SN6: multiple miners propose chains,
  validators score consensus on direction + rationale quality
- Portfolio-level exposure view (user uploads positions → per-event P&L
  estimate)
- Sharpe-ratio–weighted impact scoring (right now it's relevance, not
  risk-adjusted return)
