import { TerminalShell } from "@/components/terminal-shell";
import { FIXTURE_EVENTS } from "@/lib/fixtures";
import type { EventSummary } from "@/lib/types";

async function fetchEvents(): Promise<EventSummary[]> {
  const base = process.env.PY_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${base}/events?limit=50`, {
      next: { revalidate: 15 },
    });
    if (!res.ok) throw new Error(`api ${res.status}`);
    return (await res.json()) as EventSummary[];
  } catch (err) {
    console.warn("events fetch failed, using fixtures:", err);
    return FIXTURE_EVENTS;
  }
}

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const events = await fetchEvents();
  const { e: selectedId } = await searchParams;

  return <TerminalShell events={events} selectedId={selectedId} />;
}
