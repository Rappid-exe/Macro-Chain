"use client";

import { useEffect } from "react";
import type { EventSummary, Sector } from "./types";

type SectorFilter = Sector | "all";

const SECTOR_ORDER: SectorFilter[] = [
  "all",
  "tech",
  "energy",
  "economy",
  "geopolitics",
];

/**
 * Keyboard shortcuts for the terminal shell.
 *
 *   j / ArrowDown  select next event
 *   k / ArrowUp    select previous event
 *   1..5           switch sectors (ALL / TECH / ENG / ECO / GEO)
 *   /              focus the search input
 *   Escape         blur any focused input
 *
 * Shortcuts are disabled while an input/textarea/contenteditable has
 * focus (so typing doesn't eat your j/k). `/` is the exception — it
 * works everywhere and itself focuses the search input.
 */
export function useKeyboardNav({
  events,
  selectedId,
  onSelect,
  onSectorChange,
  searchInputId,
}: {
  events: EventSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSectorChange: (s: SectorFilter) => void;
  searchInputId: string;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      // `/` always focuses search, even from an input.
      if (e.key === "/" && !typing) {
        e.preventDefault();
        document.getElementById(searchInputId)?.focus();
        return;
      }

      if (e.key === "Escape") {
        if (target && "blur" in target && typeof target.blur === "function") {
          (target as HTMLElement).blur();
        }
        return;
      }

      if (typing) return;

      // Sector switch via number keys.
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= SECTOR_ORDER.length) {
        e.preventDefault();
        onSectorChange(SECTOR_ORDER[n - 1]);
        return;
      }

      if (
        e.key === "j" ||
        e.key === "ArrowDown" ||
        e.key === "k" ||
        e.key === "ArrowUp"
      ) {
        if (events.length === 0) return;
        e.preventDefault();
        const idx = events.findIndex((x) => x.id === selectedId);
        const forward = e.key === "j" || e.key === "ArrowDown";
        const next =
          idx === -1
            ? 0
            : forward
              ? Math.min(events.length - 1, idx + 1)
              : Math.max(0, idx - 1);
        onSelect(events[next].id);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [events, selectedId, onSelect, onSectorChange, searchInputId]);
}
