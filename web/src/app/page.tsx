import { EventList } from "@/components/event-list";
import { FIXTURE_EVENTS } from "@/lib/fixtures";
import type { EventSummary } from "@/lib/types";

async function fetchEvents(): Promise<EventSummary[]> {
  // The Next rewrite at /api/py/* proxies to the Python service in dev.
  // In production both services run on the same host. If the API is
  // unreachable we fall back to fixtures so the page never blanks out.
  const base = process.env.PY_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${base}/events?limit=24`, {
      // Keep the list warm-ish but let changes propagate on reload.
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`api ${res.status}`);
    return (await res.json()) as EventSummary[];
  } catch (err) {
    console.warn("events fetch failed, using fixtures:", err);
    return FIXTURE_EVENTS;
  }
}

export default async function Home() {
  const events = await fetchEvents();

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <header className="mb-8 flex items-baseline justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-mono text-lg tracking-tight text-fg">
            macro-chain
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Map prediction market events to equity impacts via causal reasoning
            chains.
          </p>
        </div>
        <div className="text-right text-xs text-fg-faint">
          <div>{events.length} events</div>
          <div>Polymarket · Kalshi</div>
        </div>
      </header>

      <EventList events={events} />
    </main>
  );
}
