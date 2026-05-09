"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import type { EventDetail, EventSummary, Sector } from "@/lib/types";
import { EventListPanel } from "./event-list-panel";
import { FocusedEventPanel } from "./focused-event-panel";
import { GraphPanel } from "./graph-panel";
import { TerminalHeader } from "./terminal-header";

/**
 * Three-column layout with draggable splitters matching the sketch:
 *
 *  [ sector tabs + event list ] | [ focused event + chains ] | [ graph + sum ]
 *
 * Panel sizes are persisted to localStorage under `macro-chain:layout`
 * so users get their layout back on refresh. Default splits are tuned
 * for a 1440px+ monitor; narrower screens can drag tighter.
 */
export function TerminalShell({
  events,
  selectedId,
}: {
  events: EventSummary[];
  selectedId?: string;
}) {
  const [sector, setSector] = useState<Sector | "all">("all");
  const [selected, setSelected] = useState<string | null>(selectedId ?? null);
  const [detail, setDetail] = useState<EventDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const filtered = useMemo(
    () =>
      sector === "all" ? events : events.filter((e) => e.sector === sector),
    [events, sector],
  );

  useEffect(() => {
    if (selected && filtered.some((e) => e.id === selected)) return;
    if (filtered.length > 0) setSelected(filtered[0].id);
  }, [filtered, selected]);

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
            events={events}
            filtered={filtered}
            sector={sector}
            onSectorChange={setSector}
            selected={selected}
            onSelect={setSelected}
          />
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={38} minSize={24} className="!overflow-hidden">
          <FocusedEventPanel
            summary={filtered.find((e) => e.id === selected) ?? null}
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
      {/* Wider invisible hit target so the hairline is easy to grab */}
      <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
    </PanelResizeHandle>
  );
}
