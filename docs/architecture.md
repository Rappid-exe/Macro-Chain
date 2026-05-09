# Architecture

## Principles

1. **Auditability over magic.** Every edge in the causal graph must have a
   source: a supplier disclosure, a macro relationship, or an explicit LLM
   inference. The user should always be able to ask "why is this ticker here"
   and get a grounded answer.
2. **Pluggable data sources.** Polymarket and Kalshi today. News wires,
   earnings transcripts, SEC filings tomorrow. The reasoner should not care
   where the event text came from.
3. **Fast triage, deep on demand.** The event list is for scanning. The
   detail view is for understanding. The report is for committing. Each layer
   adds detail but never hides the previous one.

## Components

### Event ingestion (api/app/sources)

One module per source. Each exposes:

```python
def list_events(sector: Sector | None = None, limit: int = 50) -> list[Event]
def get_event(event_id: str) -> EventDetail
```

An `Event` is normalized into a common schema regardless of source:
`id`, `source`, `question`, `yes_price`, `volume_24h`, `resolution_date`,
`sector_hint`, `raw`.

### Sector classifier

Polymarket and Kalshi don't publish a clean sector taxonomy. We classify
events into `{tech, energy, economy, geopolitics, other}` using a small LLM
prompt with the event question as input. Cached by event id.

### Causal chain reasoner (api/app/reasoner)

Input: a normalized event + the seed knowledge graph.
Output: a directed graph of nodes (events, commodities, sectors, tickers)
and edges (each labeled with a rationale and a confidence tier).

Confidence tiers:
- `direct` — edge comes from a factual source (10-K supplier relationship,
  commodity price index membership, etc.). Rendered as solid line.
- `inferred` — LLM connected two graph nodes via plausible economic
  reasoning. Rendered as dashed line.
- `speculative` — LLM proposed a node not in the seed graph. Rendered as
  dotted line, flagged in the report.

The reasoner must emit its chain-of-thought as structured JSON, not prose.
This is what lets the UI highlight paths and what lets us audit for
hallucination.

### Knowledge graph (kg/)

Hackathon scope: hand-curated JSON covering ~50 tickers across three
sectors. Nodes:

- **Ticker**: `{symbol, name, sector, sub_industry, country}`
- **Commodity**: `{name, tickers_exposed}`
- **Sector**: `{name, macro_sensitivities}`
- **Theme**: `{name, description}` — e.g. "AI capex", "rate cuts"

Edges are typed: `supplies`, `consumes`, `competes_with`, `correlated_with`,
`sensitive_to`. Each edge carries a rationale string.

Post-hackathon: ingest from FactSet Revere or SEC 10-K supplier sections.

### Web UI (web/)

- **Event list page** — filter by sector, sort by probability / volume /
  impact score. Cards show question, Δprice 24h, volume, tradeable-impact
  badge.
- **Event detail** — 2-pane. Left: price chart + metadata. Right: knowledge
  graph with tickers as nodes, directional arrows, confidence styling.
- **Report slide-over** — triggered from the event detail. Contains
  executive summary, primary (1st-order) impacts, secondary impacts, per-
  ticker thesis, assumptions, caveats.

## Data flow

```
user → event list → click event → detail view
                                    ↓
                              fetch detail + run reasoner (cached)
                                    ↓
                              render graph + summary
                                    ↓
                              user clicks "Full report" → slide-over
```

Reasoner output is cached keyed by event id + graph version. Re-running is
cheap for the user, expensive for us.

## Non-goals (hackathon)

- Real-time updates. Poll on demand.
- Actual trade execution. Display only.
- News ingestion beyond the event question text. Mention as roadmap.
- Coverage of non-US equities beyond a handful of obvious names.
