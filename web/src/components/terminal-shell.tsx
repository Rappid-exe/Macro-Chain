"use client";

import { useEffect, useMemo, useState } from "react";
import type { EventDetail, EventSummary, Sector } from "@/lib/types";
import { EventListPanel } from "./event-list-panel";
import { FocusedEventPanel } from "./focused-event-panel";
import { GraphPanel } from "./graph-panel";
import { TerminalHeader } from "./terminal-header";

/**
 * Top-level three-column terminal layout. Matches the sketch:
 *
 *  [ sector tabs + event list ] [ focused event + exec summary + chains ] [ graph + summary ]
 *
 * Selection is URL-driven via ?e=<id> so refreshes and shares work.
 * Detail + graph + report are fetched client-side when an event is
 * selected; the left list is server-rendered for fast first paint.
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

  // Default selection: first event in the current sector filter. Keeps
  // the middle and right panels populated at all times.
  const filtered = useMemo(
    () => (sector === "all" ? events : events.filter((e) => e.sector === sector)),
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
    <div className="flex h-screen flex-col bg-bg text-fg">
      <TerminalHeader eventCount={events.length} />
      <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)_minmax(0,1.15fr)] divide-x divide-border">
        <EventListPanel
          events={events}
          filtered={filtered}
          sector={sector}
          onSectorChange={setSector}
          selected={selected}
          onSelect={setSelected}
        />
        <FocusedEventPanel
          summary={filtered.find((e) => e.id === selected) ?? null}
          detail={detail}
          loading={detailLoading}
        />
        <GraphPanel eventId={selected} />
      </div>
    </div>
  );
}
