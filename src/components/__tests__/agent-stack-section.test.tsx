import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  describe("bento layout at desktop viewport (Req 4.1)", () => {
    it("applies lg:grid-cols-2 class for bento layout", () => {
      const { container } = render(<AgentStackSection />);
      const grid = container.querySelector(".grid-cols-1");
      expect(grid).not.toBeNull();
      expect(grid!.className).toContain("lg:grid-cols-2");
    });

    it("applies lg:grid-rows-[auto_auto] class for bento layout", () => {
      const { container } = render(<AgentStackSection />);
      const grid = container.querySelector(".grid-cols-1");
      expect(grid).not.toBeNull();
      expect(grid!.className).toContain("lg:grid-rows-");
    });

    it("applies lg:row-span-2 to highlighted cards for asymmetric sizing", () => {
      const { container } = render(<AgentStackSection />);
      const highlightedCards = container.querySelectorAll(".lg\\:row-span-2");
      expect(highlightedCards.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("single-column layout at mobile viewport (Req 4.2)", () => {
    it("applies grid-cols-1 as the base grid class", () => {
      const { container } = render(<AgentStackSection />);
      const grid = container.querySelector(".grid-cols-1");
      expect(grid).not.toBeNull();
      expect(grid!.className).toContain("grid-cols-1");
    });
  });
});
