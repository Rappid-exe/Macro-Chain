"""Causal-chain reasoner.

Given an EventDetail, produces:
    - a CausalGraph (nodes + typed/confidence-tiered edges) for the graph view
    - a Report (executive summary, ranked ticker impacts, assumptions) for
      the slide-over

Current implementation is deterministic: match themes from the event text,
then traverse the seed KG up to MAX_HOPS hops, propagating direction. The
LLM layer is a future extension that will add speculative 2nd-order nodes
and natural-language thesis text; for now thesis strings are composed from
the traversal's rationales, which are themselves authored in kg/seed.json.

Direction propagation:
    up * up = up,  up * down = down,  down * down = up
    anything touching 'mixed' stays 'mixed'

This keeps the demo honest: we never claim certainty about a directional
outcome downstream of a 'mixed' edge.
"""

from __future__ import annotations

from app.reasoner.kg import KG_SINGLETON
from app.reasoner.matchers import match_themes
from app.schemas import (
    CausalGraph,
    Direction,
    EventDetail,
    GraphEdge,
    GraphNode,
    Report,
    TickerImpact,
)

MAX_HOPS = 3

# Confidence tier weights for ranking impacts. Direct edges should outrank
# inferred chains of the same magnitude.
CONF_WEIGHT = {"direct": 1.0, "inferred": 0.6, "speculative": 0.3}
# Rough depth-based bps magnitude. Closer to event = bigger.
DEPTH_BPS = {0: 300, 1: 200, 2: 100, 3: 40}


def _compose_directions(a: Direction, b: Direction) -> Direction:
    if a == "mixed" or b == "mixed":
        return "mixed"
    return "up" if a == b else "down"


def _event_node(event: EventDetail) -> GraphNode:
    return GraphNode(
        id=f"event:{event.id}",
        kind="event",
        label=event.question,
        sublabel=f"{round(event.yes_price * 100)}% YES · {event.source}",
    )


def build_graph(event: EventDetail) -> CausalGraph:
    """BFS from matched themes out to tickers, collecting nodes and edges."""
    themes = match_themes(event)

    nodes: dict[str, GraphNode] = {}
    edges: dict[str, GraphEdge] = {}

    event_node = _event_node(event)
    nodes[event_node.id] = event_node

    # Scenario-aware seeding. If the YES price is >= 0.5 we reason under
    # "the event resolves YES" and the theme activates in its natural
    # direction (up). If YES is < 0.5 the scenario is "NO resolves",
    # which means the theme does NOT activate — we seed themes as 'down'
    # so downstream direction composition correctly inverts. For a market
    # like "Will Bitcoin hit $150k?" at 10%, the reasoned scenario is a
    # crypto downturn, so IBIT/COIN should propagate as 'down'.
    scenario_yes = event.yes_price >= 0.5
    seed_dir: Direction = "up" if scenario_yes else "down"

    for theme_id in themes:
        theme = KG_SINGLETON.nodes.get(theme_id)
        if theme is None:
            continue
        nodes[theme_id] = GraphNode(id=theme_id, kind="theme", label=theme.label)
        edge_id = f"{event_node.id}->{theme_id}"
        activation = "activates" if scenario_yes else "fails to activate"
        edges[edge_id] = GraphEdge(
            id=edge_id,
            source=event_node.id,
            target=theme_id,
            kind="impacts",
            confidence="direct",
            rationale=(
                f"Under the {('YES' if scenario_yes else 'NO')} scenario the "
                f"{theme.label} theme {activation}."
            ),
        )

    # BFS outward, tracking composed direction + shortest depth per node.
    node_direction: dict[str, Direction] = {tid: seed_dir for tid in themes}
    node_depth: dict[str, int] = {tid: 0 for tid in themes}

    frontier = list(themes)
    while frontier:
        nxt: list[str] = []
        for src_id in frontier:
            src_depth = node_depth[src_id]
            if src_depth >= MAX_HOPS:
                continue
            for e in KG_SINGLETON.neighbors(src_id):
                kg_n = KG_SINGLETON.nodes.get(e.target)
                if kg_n is None:
                    continue
                if e.target not in nodes:
                    nodes[e.target] = GraphNode(
                        id=e.target,
                        kind=kg_n.kind,
                        label=kg_n.label,
                        sublabel=kg_n.name if kg_n.kind == "ticker" else None,
                    )

                composed = _compose_directions(node_direction[src_id], e.direction)
                prev = node_direction.get(e.target)
                if prev is None:
                    node_direction[e.target] = composed
                elif prev != composed:
                    node_direction[e.target] = "mixed"

                depth = src_depth + 1
                if e.target not in node_depth or depth < node_depth[e.target]:
                    node_depth[e.target] = depth
                    if depth < MAX_HOPS:
                        nxt.append(e.target)

                edge_id = f"{e.source}->{e.target}"
                edges[edge_id] = GraphEdge(
                    id=edge_id,
                    source=e.source,
                    target=e.target,
                    kind=e.kind,  # type: ignore[arg-type]
                    confidence=e.confidence,
                    rationale=e.rationale,
                )
        frontier = nxt

    # Annotate ticker nodes with composed direction + magnitude heuristic.
    for node_id, node in list(nodes.items()):
        if node.kind != "ticker":
            continue
        nodes[node_id] = node.model_copy(
            update={
                "direction": node_direction.get(node_id),
                "magnitude": float(
                    DEPTH_BPS.get(node_depth.get(node_id, MAX_HOPS), 20)
                ),
            }
        )

    return CausalGraph(nodes=list(nodes.values()), edges=list(edges.values()))


def build_report(event: EventDetail) -> Report:
    graph = build_graph(event)

    ticker_nodes = [n for n in graph.nodes if n.kind == "ticker"]
    impacts: list[TickerImpact] = []
    for n in ticker_nodes:
        chain = _reconstruct_chain(n.id, graph)
        if not chain:
            continue
        min_conf = _min_confidence_along(chain, graph)
        order = _chain_order(chain)
        magnitude = (n.magnitude or 0) * CONF_WEIGHT.get(min_conf, 0.5)
        thesis = _compose_thesis(chain, graph)
        impacts.append(
            TickerImpact(
                symbol=n.label,
                name=n.sublabel or n.label,
                order=order,  # type: ignore[arg-type]
                direction=n.direction or "mixed",
                magnitude_bps=magnitude,
                thesis=thesis,
                chain=chain,
            )
        )

    impacts.sort(key=lambda t: (t.order, -t.magnitude_bps))

    themes = [n.label for n in graph.nodes if n.kind == "theme"][:2]
    theme_phrase = " and ".join(themes) if themes else "the event"
    scenario = "yes" if event.yes_price >= 0.5 else "no"
    summary = (
        f"Primary drivers: {theme_phrase}. Graph surfaces {len(impacts)} "
        f"impacted equities with direction inferred from the seed knowledge "
        f"graph. Solid edges are grounded in structured sources; dashed are "
        f"inferred; dotted are speculative."
    )

    return Report(
        event_id=event.id,
        scenario=scenario,  # type: ignore[arg-type]
        executive_summary=summary,
        horizon_days=5,
        confidence="medium",
        impacts=impacts[:20],
        assumptions=[
            "Horizon: 5 trading days post-resolution.",
            "Direction composition assumes edges act independently.",
            "Magnitude estimates are heuristic, not forecasts.",
        ],
        caveats=[
            "Seed graph is hand-curated; missing relationships bias the ranking.",
            "No position-sizing or risk-management logic; this is a research aid.",
        ],
    )


def _chain_order(chain: list[str]) -> int:
    """1st / 2nd / 3rd order based on count of intermediary nodes.

    event -> theme -> ticker               = 1st order
    event -> theme -> commodity -> ticker  = 2nd
    event -> theme -> sector -> ticker     = 2nd
    anything deeper                        = 3rd
    """
    intermediaries = max(0, len(chain) - 2)
    if intermediaries <= 1:
        return 1
    if intermediaries == 2:
        return 2
    return 3


def _reconstruct_chain(target: str, graph: CausalGraph) -> list[str]:
    """Walk backward from target along graph.edges to the event node, then
    return the forward path. If no path exists, returns []."""
    rev: dict[str, list[str]] = {}
    for e in graph.edges:
        rev.setdefault(e.target, []).append(e.source)

    parent: dict[str, str] = {}
    visited = {target}
    frontier = [target]
    root: str | None = None
    while frontier:
        node = frontier.pop(0)
        if node.startswith("event:"):
            root = node
            break
        for src in rev.get(node, []):
            if src in visited:
                continue
            visited.add(src)
            parent[src] = node
            frontier.append(src)

    if root is None:
        return []

    # Walk forward: parent maps src -> its BFS successor (toward target).
    chain = [root]
    cur = root
    while cur != target:
        nxt = parent.get(cur)
        if nxt is None:
            break
        chain.append(nxt)
        cur = nxt
    return chain


def _min_confidence_along(chain: list[str], graph: CausalGraph) -> str:
    order = ["direct", "inferred", "speculative"]
    worst = "direct"
    for i in range(len(chain) - 1):
        edge = next(
            (e for e in graph.edges if e.source == chain[i] and e.target == chain[i + 1]),
            None,
        )
        if edge and order.index(edge.confidence) > order.index(worst):
            worst = edge.confidence
    return worst


def _compose_thesis(chain: list[str], graph: CausalGraph) -> str:
    parts: list[str] = []
    for i in range(len(chain) - 1):
        edge = next(
            (e for e in graph.edges if e.source == chain[i] and e.target == chain[i + 1]),
            None,
        )
        if edge is not None:
            parts.append(edge.rationale)
    return " ".join(parts)
