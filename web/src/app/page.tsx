import { EventList } from "@/components/event-list";
import { FIXTURE_EVENTS } from "@/lib/fixtures";

export default function Home() {
  // Server component. When the API is live, swap FIXTURE_EVENTS for a
  // fetch(`${process.env.PY_API_URL}/events`, { cache: "no-store" }).
  const events = FIXTURE_EVENTS;

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
