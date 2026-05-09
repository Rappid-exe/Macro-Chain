# Macro-Chain

> Map prediction market events to equity impacts via causal reasoning chains.

Macro-Chain surfaces Polymarket and Kalshi events alongside the equities and
sectors they would plausibly move — not just first-order reactions, but the
second- and third-order effects that ripple through supply chains, macro
channels, and commodity exposure.

Built for the Numinous SN6 hackathon.

## The problem

Prediction markets price the *probability* of an event. They don't tell you
which equities move when that event resolves — and the obvious first-order
names are usually already priced in. The alpha is in the causal chain:

> *"Red Sea shipping disruption resolves YES"*
> → shipping rates stay elevated (MAERSK, ZIM)
> → packaging / input costs rise (WRK, PKG)
> → thin-margin retailers compress (DG, FIVE)

Macro-Chain reasons these chains explicitly, grounded in a supply-chain and
macro knowledge graph, and presents them as an auditable report.

## Architecture

```
┌────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│  Next.js web   │◄────►│  FastAPI service │◄────►│  LLM reasoner     │
│  (App Router)  │      │  (Python)        │      │  (Claude / GPT)   │
└────────────────┘      └──────────────────┘      └───────────────────┘
        │                       │                          │
        │                       ▼                          ▼
        │               ┌──────────────┐          ┌──────────────────┐
        └──────────────►│ Polymarket   │          │  Knowledge graph │
                        │ Kalshi APIs  │          │  (seed: JSON)    │
                        └──────────────┘          └──────────────────┘
```

- **web/**: Next.js 15 + TypeScript + Tailwind + shadcn/ui + React Flow.
- **api/**: FastAPI service. Polymarket/Kalshi ingestion, causal-chain reasoner.
- **kg/**: Seed knowledge graph (tickers, suppliers, commodities, sectors).
- **docs/**: Architecture notes, demo script, roadmap.

## Status

Hackathon MVP. Scope:

- [x] Project scaffold
- [ ] Polymarket event ingestion
- [ ] Kalshi event ingestion
- [ ] Event list UI with sector filter + sort
- [ ] Event detail view (chart + knowledge graph)
- [ ] Causal chain reasoner (LLM)
- [ ] Report slide-over
- [ ] Backtest on resolved markets (stretch)

## Development

Requires Node 20+, Python 3.11+.

```bash
# web
cd web
npm install
npm run dev

# api
cd api
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

See `docs/architecture.md` for design notes.

## License

TBD.
