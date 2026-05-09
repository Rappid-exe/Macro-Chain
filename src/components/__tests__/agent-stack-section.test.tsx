import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("framer-motion", () => ({
  motion: { div: "div", path: "path" },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 0 }),
  useInView: () => true,
}));

vi.mock("@/hooks/use-reduced-motion", () => ({
  usePreferReducedMotion: vi.fn(() => false),
}));

import AgentStackSection from "../agent-stack-section";

describe("AgentStackSection", () => {
  describe("agent card content (Req 4.5)", () => {
    it('renders "The Scraper" card with correct description', () => {
      render(<AgentStackSection />);
      expect(screen.getByText("The Scraper")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Real-time monitoring of Polymarket, Kalshi, and industrial news APIs."
        )
      ).toBeInTheDocument();
    });

    it('renders "The Auditor" card with correct description', () => {
      render(<AgentStackSection />);
      expect(screen.getByText("The Auditor")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Autonomous parsing of 10-K filings and global shipping manifests to find hidden dependencies."
        )
      ).toBeInTheDocument();
    });

    it('renders "The Entropy Model" card with correct description', () => {
      render(<AgentStackSection />);
      expect(screen.getByText("The Entropy Model")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Mathematical modelling of 'Information Decay' to determine if a link is already priced in."
        )
      ).toBeInTheDocument();
    });

    it('renders "The Reporter" card with correct description', () => {
      render(<AgentStackSection />);
      expect(screen.getByText("The Reporter")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Institutional-grade briefs delivered instantly to your existing workflow."
        )
      ).toBeInTheDocument();
    });

    it("renders exactly four agent cards", () => {
      render(<AgentStackSection />);
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(4);
    });
  });

  describe("skew card layout", () => {
    it("renders cards in a flex container", () => {
      const { container } = render(<AgentStackSection />);
      const flexContainer = container.querySelector(".flex.justify-center");
      expect(flexContainer).not.toBeNull();
    });

    it("each card has gradient accent spans", () => {
      const { container } = render(<AgentStackSection />);
      // Each card wrapper has 2 gradient spans (solid + blurred)
      const gradientSpans = container.querySelectorAll("[style*='linear-gradient']");
      expect(gradientSpans.length).toBe(8); // 4 cards × 2 spans each
    });

    it("highlighted cards have signal-green border class", () => {
      const { container } = render(<AgentStackSection />);
      const highlightedCards = container.querySelectorAll("article.border-signal-green\\/40");
      expect(highlightedCards.length).toBeGreaterThanOrEqual(1);
    });
  });
});
