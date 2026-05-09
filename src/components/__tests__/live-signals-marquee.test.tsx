import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/hooks/use-reduced-motion", () => ({
  usePreferReducedMotion: vi.fn(() => false),
}));

import { usePreferReducedMotion } from "@/hooks/use-reduced-motion";
import { LiveSignalsMarquee } from "../live-signals-marquee";

const mockedUsePreferReducedMotion = vi.mocked(usePreferReducedMotion);

describe("LiveSignalsMarquee", () => {
  beforeEach(() => {
    mockedUsePreferReducedMotion.mockReturnValue(false);
  });

  it("renders exactly 4 unique signal texts", () => {
    const { container } = render(<LiveSignalsMarquee />);

    const expectedTexts = [
      "Hormuz Blockade: +14% Signal Strength",
      "Lithium Supply Cut: 3rd Order Impact Detected",
      "TSMC Fab Delay: Entropy Score 0.87",
      "Baltic Dry Index Spike: Causal Map Updated",
    ];

    // Each unique text should appear at least once (items are duplicated 3× for seamless looping)
    for (const text of expectedTexts) {
      const matches = screen.getAllByText(text);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }

    // Verify exactly 4 unique texts by collecting all span texts and deduplicating
    const allSpans = container.querySelectorAll("span");
    const uniqueTexts = new Set(
      Array.from(allSpans).map((span) => span.textContent)
    );
    expect(uniqueTexts.size).toBe(4);
  });

  it("renders two rows with opposite direction attributes", () => {
    const { container } = render(<LiveSignalsMarquee />);
    const marqueeElements = container.querySelectorAll('[role="marquee"]');

    expect(marqueeElements).toHaveLength(2);

    // First marquee scrolls left, second scrolls right
    const firstTrack = marqueeElements[0].querySelector(".marquee-track");
    const secondTrack = marqueeElements[1].querySelector(".marquee-track");

    expect(firstTrack).not.toBeNull();
    expect(secondTrack).not.toBeNull();

    const firstAnimation = (firstTrack as HTMLElement).style.animation;
    const secondAnimation = (secondTrack as HTMLElement).style.animation;

    expect(firstAnimation).toContain("marquee-scroll-left");
    expect(secondAnimation).toContain("marquee-scroll-right");
  });

  it('has aria-live="off" attribute on marquee elements', () => {
    const { container } = render(<LiveSignalsMarquee />);
    const marqueeElements = container.querySelectorAll('[role="marquee"]');

    expect(marqueeElements).toHaveLength(2);

    marqueeElements.forEach((el) => {
      expect(el).toHaveAttribute("aria-live", "off");
    });
  });

  it("has marquee-container class for pause on hover/focus", () => {
    const { container } = render(<LiveSignalsMarquee />);
    const marqueeContainers = container.querySelectorAll(".marquee-container");

    // Both marquee rows should have the marquee-container class for CSS pause behaviour
    expect(marqueeContainers).toHaveLength(2);
  });

  describe("when prefers-reduced-motion is enabled", () => {
    beforeEach(() => {
      mockedUsePreferReducedMotion.mockReturnValue(true);
    });

    it("renders a static layout without animation", () => {
      const { container } = render(<LiveSignalsMarquee />);

      // In reduced motion mode, the Marquee renders a static flex-wrap layout
      const marqueeElements = container.querySelectorAll('[role="marquee"]');
      expect(marqueeElements).toHaveLength(2);

      // Should NOT have marquee-container class (static layout uses flex-wrap)
      const animatedContainers =
        container.querySelectorAll(".marquee-container");
      expect(animatedContainers).toHaveLength(0);

      // Should NOT have marquee-track elements (no animation track)
      const tracks = container.querySelectorAll(".marquee-track");
      expect(tracks).toHaveLength(0);

      // Should still render the signal texts
      const allSpans = container.querySelectorAll("span");
      expect(allSpans.length).toBeGreaterThanOrEqual(4);
    });
  });
});
