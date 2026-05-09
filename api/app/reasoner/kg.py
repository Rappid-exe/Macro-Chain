"""Seed knowledge graph loader.

Loads `kg/seed.json` once at import time and exposes typed helpers. The
graph is small enough (<1k nodes) that we keep it in memory; no DB needed.

Node id convention:
    theme:<slug>      macro / structural themes
    com:<slug>        commodities, rates, indices
    sec:<slug>        sectors / ETFs
    tkr:<SYMBOL>      equity tickers

This convention lets the reasoner refer to nodes unambiguously and lets
the UI look up node kind from the id prefix alone.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

_KG_PATH = Path(__file__).resolve().parents[3] / "kg" / "seed.json"

NodeKind = Literal["theme", "commodity", "sector", "ticker"]
Direction = Literal["up", "down", "mixed"]
Confidence = Literal["direct", "inferred", "speculative"]


@dataclass(frozen=True)
class KGNode:
    id: str
    kind: NodeKind
    label: str
    # For tickers only
    symbol: str | None = None
    name: str | None = None
    sector_ids: tuple[str, ...] = ()


@dataclass(frozen=True)
class KGEdge:
    source: str
    target: str
    kind: str
    confidence: Confidence
    direction: Direction
    rationale: str


@dataclass(frozen=True)
class KG:
    nodes: dict[str, KGNode]
    edges: list[KGEdge]
    # Adjacency: from node_id -> list of outbound edges
    out: dict[str, list[KGEdge]]

    def neighbors(self, node_id: str) -> list[KGEdge]:
        return self.out.get(node_id, [])


def _kind_from_id(node_id: str) -> NodeKind:
    prefix = node_id.split(":", 1)[0]
    mapping: dict[str, NodeKind] = {
        "theme": "theme",
        "com": "commodity",
        "sec": "sector",
        "tkr": "ticker",
    }
    if prefix not in mapping:
        raise ValueError(f"unknown node id prefix in {node_id!r}")
    return mapping[prefix]


def load_kg(path: Path = _KG_PATH) -> KG:
    with path.open(encoding="utf-8") as fh:
        raw = json.load(fh)

    nodes: dict[str, KGNode] = {}
    for group in ("themes", "commodities", "sectors"):
        for n in raw.get(group, []):
            nid = n["id"]
            nodes[nid] = KGNode(id=nid, kind=_kind_from_id(nid), label=n["label"])
    for t in raw.get("tickers", []):
        nid = t["id"]
        nodes[nid] = KGNode(
            id=nid,
            kind="ticker",
            label=t["symbol"],
            symbol=t["symbol"],
            name=t.get("name"),
            sector_ids=tuple(t.get("sector_ids", [])),
        )

    edges: list[KGEdge] = []
    out: dict[str, list[KGEdge]] = {}
    for e in raw.get("edges", []):
        edge = KGEdge(
            source=e["source"],
            target=e["target"],
            kind=e["kind"],
            confidence=e["confidence"],
            direction=e.get("direction", "mixed"),
            rationale=e["rationale"],
        )
        edges.append(edge)
        out.setdefault(edge.source, []).append(edge)

    return KG(nodes=nodes, edges=edges, out=out)


# Module-level singleton. Cheap to load, convenient to import.
KG_SINGLETON = load_kg()
