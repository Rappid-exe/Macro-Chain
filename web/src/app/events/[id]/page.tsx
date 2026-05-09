import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FIXTURE_EVENTS } from "@/lib/fixtures";
import { SectorBadge } from "@/components/sector-badge";
import { EventDetailPane } from "@/components/event-detail-pane";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = FIXTURE_EVENTS.find((e) => e.id === id);
  if (!event) notFound();

  const pct = Math.round(event.yes_price * 100);

  return (
    <main className="mx-auto flex h-screen w-full max-w-[1600px] flex-col px-6 py-4">
      <header className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg"
          >
            <ArrowLeft size={14} />
            Events
          </Link>
          <div className="h-4 w-px bg-border" />
          <SectorBadge sector={event.sector} />
          <span className="text-[10px] uppercase tracking-wider text-fg-faint">
            {event.source}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-fg-faint">
            Yes
          </div>
          <div className="text-xl font-semibold tabular-nums text-fg">
            {pct}%
          </div>
        </div>
      </header>

      <div className="mt-4 flex-1 overflow-hidden">
        <EventDetailPane event={event} />
      </div>
    </main>
  );
}
