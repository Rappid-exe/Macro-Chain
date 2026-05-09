import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FooterSection from "../footer-section";

describe("FooterSection", () => {
  describe("three-column layout", () => {
    it("renders left column with Macro-Chain text and tagline", () => {
      render(<FooterSection />);

      expect(screen.getByText("Macro-Chain")).toBeInTheDocument();
      expect(
        screen.getByText("The Causal Intelligence Engine.")
      ).toBeInTheDocument();
    });

    it("renders centre column with Product links (Terminal, API, Backtesting)", () => {
      render(<FooterSection />);

      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(screen.getByText("Terminal")).toBeInTheDocument();
      expect(screen.getByText("API")).toBeInTheDocument();
      expect(screen.getByText("Backtesting")).toBeInTheDocument();
    });

    it("renders centre column with Company links (About, Ethics, Research)", () => {
      render(<FooterSection />);

      expect(screen.getByText("Company")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Ethics")).toBeInTheDocument();
      expect(screen.getByText("Research")).toBeInTheDocument();
    });
  });

  describe("social links", () => {
    it("renders 3 social links with correct accessible names", () => {
      render(<FooterSection />);

      expect(
        screen.getByLabelText("Follow Macro-Chain on X (formerly Twitter)")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Connect with Macro-Chain on LinkedIn")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("View Macro-Chain source on GitHub")
      ).toBeInTheDocument();
    });

    it("all social links open in a new tab with target=_blank", () => {
      render(<FooterSection />);

      const twitterLink = screen.getByLabelText(
        "Follow Macro-Chain on X (formerly Twitter)"
      );
      const linkedinLink = screen.getByLabelText(
        "Connect with Macro-Chain on LinkedIn"
      );
      const githubLink = screen.getByLabelText(
        "View Macro-Chain source on GitHub"
      );

      expect(twitterLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("target", "_blank");
    });

    it("all social links have rel=noopener noreferrer", () => {
      render(<FooterSection />);

      const twitterLink = screen.getByLabelText(
        "Follow Macro-Chain on X (formerly Twitter)"
      );
      const linkedinLink = screen.getByLabelText(
        "Connect with Macro-Chain on LinkedIn"
      );
      const githubLink = screen.getByLabelText(
        "View Macro-Chain source on GitHub"
      );

      expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("bottom bar", () => {
    it("contains copyright text", () => {
      render(<FooterSection />);

      expect(screen.getByText("© 2026 Macro-Chain.")).toBeInTheDocument();
    });

    it("contains legal links (Terms & Conditions, Privacy Policy, Cookie Settings)", () => {
      render(<FooterSection />);

      expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
      expect(screen.getByText("Cookie Settings")).toBeInTheDocument();
    });
  });
});
