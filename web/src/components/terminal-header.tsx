export function TerminalHeader({ eventCount }: { eventCount: number }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-bg-sunken px-4 py-1.5 text-[11px]">
      <div className="flex items-center gap-4">
        <span className="text-accent">macro-chain</span>
        <span className="text-fg-faint">&#47;&#47;</span>
        <span className="text-fg-muted">prediction market → equity reasoner</span>
      </div>
      <div className="flex items-center gap-4 text-fg-muted">
        <span>src: polymarket · kalshi</span>
        <span>events: {eventCount}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-up blink" />
          live
        </span>
      </div>
    </header>
  );
}
