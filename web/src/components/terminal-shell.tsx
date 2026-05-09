"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import type { EventDetail, EventSummary, Sector } from "@/lib/types";
import { useKeyboardNav } from "@/lib/use-keyboard-nav";
import { EventListPanel } from "./event-list-panel";
import { FocusedEventPanel } from "./focused-event-panel";
import { GraphPanel } from "./graph-panel";
import { TerminalHeader } from "./terminal-header";

const SEARCH_INPUT_ID = "macro-chain-search";

export function TerminalShell({
  events,
  selectedId,
}: {
  events: EventSummary[];
  selectedId?: string;
}) {
  const [sector, setSector] = useState<Sector | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("impact");
  const [selected, setSelected] = useState<string | null>(selectedId ?? null);
  const [detail, setDetail] = useState<EventDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Single source of truth for "what the list shows", shared between the
  // left panel and the keyboard-nav hook so j/k walk the same order.
  const visible = useMemo(() => {
    const bySector =
      sector === "all" ? events : events.filter((e) => e.sector === sector);
    const searched = query
      ? bySector.filter((e) =>
          e.question.toLowerCase().includes(query.toLowerCase()),
        )
      : bySector;
    return [...searched].sort((a, b) => {
      switch (sort) {
        case "impact":
          return (b.impact_score ?? 0) - (a.impact_score ?? 0);
        case "volume":
          return b.volume_24h - a.volume_24h;
        case "prob_high":
          return b.yes_price - a.yes_price;
        case "prob_low":
          return a.yes_price - b.yes_price;
        case "delta":
          return Math.abs(b.delta_24h) - Math.abs(a.delta_24h);
      }
    });
  }, [events, sector, query, sort]);

  useEffect(() => {
    if (selected && visible.some((e) => e.id === selected)) return;
    if (visible.length > 0) setSelected(visible[0].id);
  }, [visible, selected]);

  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    fetch(`/api/py/events/${encodeURIComponent(selected)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`api ${r.status}`);
        return (await r.json()) as EventDetail;
      })
      .then((d) => !cancelled && setDetail(d))
      .catch(() => !cancelled && setDetail(null))
      .finally(() => !cancelled && setDetailLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selected]);

  useKeyboardNav({
    events: visible,
    selectedId: selected,
    onSelect: setSelected,
    onSectorChange: setSector,
    searchInputId: SEARCH_INPUT_ID,
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg text-fg">
      <TerminalHeader eventCount={events.length} />
      <PanelGroup
        direction="horizontal"
        autoSaveId="macro-chain:layout"
        className="min-h-0 flex-1"
      >
        <Panel defaultSize={22} minSize={16} maxSize={40} className="!overflow-hidden">
          <EventListPanel
            allEvents={events}
            visible={visible}
            sector={sector}
            onSectorChange={setSector}
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            selected={selected}
            onSelect={setSelected}
            searchInputId={SEARCH_INPUT_ID}
          />
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={38} minSize={24} className="!overflow-hidden">
          <FocusedEventPanel
            summary={visible.find((e) => e.id === selected) ?? null}
            detail={detail}
            loading={detailLoading}
          />
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={40} minSize={24} className="!overflow-hidden">
          <GraphPanel eventId={selected} />
        </Panel>
      </PanelGroup>
    </div>
  );
}

function ResizeHandle() {
  return (
    <PanelResizeHandle className="group relative w-px bg-border transition-colors data-[resize-handle-state=drag]:bg-accent data-[resize-handle-state=hover]:bg-accent">
      <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
    </PanelResizeHandle>
  );
}

export type Sort = "impact" | "volume" | "prob_high" | "prob_low" | "delta";
