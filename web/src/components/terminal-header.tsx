export function TerminalHeader({ eventCount }: { eventCount: number }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-bg-sunken px-4 py-2 text-[11px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-accent" />
          <span className="font-semibold tracking-wide text-fg">
            MACRO<span className="text-accent">-</span>CHAIN
          </span>
        </div>
        <span className="text-fg-faint">|</span>
        <span className="text-fg-muted">
          prediction market &rarr; equity reasoner
        </span>
      </div>
      <div className="flex items-center gap-4 text-fg-muted">
        <Stat label="src" value="polymarket · kalshi" />
        <Stat label="events" value={eventCount.toString()} />
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-up blink" />
          <span className="text-[10px] uppercase tracking-wider text-fg-muted">
            live
          </span>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[9px] uppercase tracking-wider text-fg-faint">
        {label}
      </span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
}
