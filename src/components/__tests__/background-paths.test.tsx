import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BackgroundPaths } from "../ui/background-paths";

vi.mock("@/hooks/use-reduced-motion", () => ({
  usePreferReducedMotion: vi.fn(() => false),
}));

describe("BackgroundPaths (ui component)", () => {
  it("renders exactly 72 SVG path elements (36 per FloatingPaths x 2 instances)", () => {
    const { container } = render(<BackgroundPaths />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(72);
  });

  it("has pointer-events-none class on the FloatingPaths containers", () => {
    const { container } = render(<BackgroundPaths />);
    const pointerNoneElements = container.querySelectorAll(".pointer-events-none");
    expect(pointerNoneElements.length).toBeGreaterThanOrEqual(2);
  });

  it("renders SVG elements with title for accessibility", () => {
    const { container } = render(<BackgroundPaths />);
    const titles = container.querySelectorAll("title");
    expect(titles.length).toBeGreaterThanOrEqual(2);
    expect(titles[0].textContent).toBe("Background Paths");
  });

  it("all paths have strokeOpacity set", () => {
    const { container } = render(<BackgroundPaths />);
    const paths = container.querySelectorAll("path");
    paths.forEach((path) => {
      const strokeOpacity = path.getAttribute("stroke-opacity");
      const styleOpacity = path.style.opacity;
      expect(strokeOpacity || styleOpacity).toBeTruthy();
    });
  });

  it("renders the title text passed as prop", () => {
    const { container } = render(<BackgroundPaths title="Test Title" />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toContain("Test");
    expect(h1!.textContent).toContain("Title");
  });
});
