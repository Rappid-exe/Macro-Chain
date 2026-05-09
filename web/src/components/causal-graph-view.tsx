"use client";

// Placeholder graph view. When the API is wired, we fetch a CausalGraph
// (see @/lib/types) keyed by eventId, and use React Flow to render it with
// edge styling keyed to confidence tier. For now, a stub placeholder.

export function CausalGraphView({ eventId }: { eventId: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center">
      <div className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
        causal graph
      </div>
      <div className="text-sm text-fg-muted">
        Graph rendering for <code className="font-mono text-fg">{eventId}</code>{" "}
        is wired up once the reasoner API is live.
      </div>
      <div className="mt-4 max-w-sm text-xs text-fg-faint">
        Solid edges = grounded in source data · dashed = inferred ·
        dotted = speculative.
      </div>
    </div>
  );
}
