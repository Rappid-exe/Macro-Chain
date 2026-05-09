import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FAQSection from "../faq-section";

describe("FAQSection", () => {
  it("renders exactly 3 question-and-answer pairs", () => {
    const { container } = render(<FAQSection />);
    const dtElements = container.querySelectorAll("dt");
    const ddElements = container.querySelectorAll("dd");

    expect(dtElements).toHaveLength(3);
    expect(ddElements).toHaveLength(3);
  });

  it("renders the correct question text content", () => {
    render(<FAQSection />);

    expect(
      screen.getByText("How does Macro-Chain prevent hallucinations?")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "What is the average latency between a trigger and a 3rd-order alert?"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Can I customise the sectors monitored?")
    ).toBeInTheDocument();
  });

  it("renders the correct answer text content", () => {
    render(<FAQSection />);

    expect(
      screen.getByText(
        "Our Auditor agent cross-references 10-K filings with global shipping manifests. We do not generate links; we verify existing industrial dependencies."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Our stack delivers validated causal maps in under 180 seconds."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Yes, the Terminal allows for vertical-specific focus on Energy, Semis, or Ag-Tech."
      )
    ).toBeInTheDocument();
  });

  it("uses semantic dl/dt/dd markup", () => {
    const { container } = render(<FAQSection />);

    const dlElement = container.querySelector("dl");
    expect(dlElement).toBeInTheDocument();

    const dtElements = container.querySelectorAll("dt");
    const ddElements = container.querySelectorAll("dd");

    expect(dtElements).toHaveLength(3);
    expect(ddElements).toHaveLength(3);

    // Each dt should be followed by a dd within the same parent div
    dtElements.forEach((dt, index) => {
      const parentDiv = dt.parentElement;
      expect(parentDiv).not.toBeNull();
      expect(parentDiv!.querySelector("dd")).toBe(ddElements[index]);
    });
  });

  it("applies font-semibold and text-text-primary classes to questions", () => {
    const { container } = render(<FAQSection />);
    const dtElements = container.querySelectorAll("dt");

    dtElements.forEach((dt) => {
      expect(dt).toHaveClass("font-semibold");
      expect(dt).toHaveClass("text-text-primary");
    });
  });

  it("applies pl-4 class to answers for 16px left indentation", () => {
    const { container } = render(<FAQSection />);
    const ddElements = container.querySelectorAll("dd");

    ddElements.forEach((dd) => {
      expect(dd).toHaveClass("pl-4");
    });
  });
});
