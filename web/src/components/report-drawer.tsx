"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { EventSummary } from "@/lib/types";

export function ReportDrawer({
  open,
  onClose,
  event,
}: {
  open: boolean;
  onClose: () => void;
  event: EventSummary;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close report"
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-sm"
      />
      <aside className="flex h-full w-full max-w-[640px] flex-col overflow-hidden border-l border-border bg-bg-raised shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-fg-faint">
              Detailed report
            </div>
            <h2 className="mt-0.5 text-sm font-medium text-fg">
              {event.question}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-fg-muted hover:bg-bg-sunken hover:text-fg"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <ReportStub />
        </div>
      </aside>
    </div>
  );
}

function ReportStub() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <SectionLabel>Executive summary</SectionLabel>
        <p className="mt-2 text-fg-muted">
          The LLM-generated thesis will render here once the reasoner API is
          wired. It will include the scenario (YES / NO), the reasoning horizon,
          and a confidence tier.
        </p>
      </section>

      <section>
        <SectionLabel>Primary impacts (1st order)</SectionLabel>
        <ul className="mt-2 space-y-2">
          <ImpactRow symbol="—" direction="up" chain="chain pending" />
          <ImpactRow symbol="—" direction="down" chain="chain pending" />
        </ul>
      </section>

      <section>
        <SectionLabel>Secondary impacts (2nd order)</SectionLabel>
        <ul className="mt-2 space-y-2">
          <ImpactRow symbol="—" direction="up" chain="chain pending" />
        </ul>
      </section>

      <section>
        <SectionLabel>Assumptions & caveats</SectionLabel>
        <ul className="mt-2 list-disc pl-4 text-fg-muted">
          <li>Horizon, base rate, and confidence tier populated by reasoner.</li>
        </ul>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
      {children}
    </h3>
  );
}

function ImpactRow({
  symbol,
  direction,
  chain,
}: {
  symbol: string;
  direction: "up" | "down";
  chain: string;
}) {
  const tone =
    direction === "up"
      ? "text-accent border-accent/30"
      : "text-accent-down border-accent-down/30";
  return (
    <li className="flex items-start gap-3 rounded-md border border-border bg-bg-sunken p-3">
      <span className={`rounded border px-1.5 py-0.5 font-mono text-xs ${tone}`}>
        {direction === "up" ? "↑" : "↓"} {symbol}
      </span>
      <span className="text-xs text-fg-muted">{chain}</span>
    </li>
  );
}
