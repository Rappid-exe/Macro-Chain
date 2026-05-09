import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BackgroundPaths } from "../background-paths";

vi.mock("@/hooks/use-reduced-motion", () => ({
  usePreferReducedMotion: vi.fn(() => false),
}));

describe("BackgroundPaths", () => {
  it("renders exactly 36 SVG path elements", () => {
    const { container } = render(<BackgroundPaths />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(36);
  });

  it("has pointer-events-none class on the container", () => {
    const { container } = render(<BackgroundPaths />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass("pointer-events-none");
  });

  it('has aria-hidden="true" on the container', () => {
    const { container } = render(<BackgroundPaths />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("all paths have stroke-opacity ≤ 0.15", () => {
    const { container } = render(<BackgroundPaths />);
    const paths = container.querySelectorAll("path");
    paths.forEach((path) => {
      const strokeOpacity = path.getAttribute("stroke-opacity");
      const styleOpacity = path.style.opacity;
      if (strokeOpacity) {
        expect(Number(strokeOpacity)).toBeLessThanOrEqual(0.15);
      } else if (styleOpacity) {
        expect(Number(styleOpacity)).toBeLessThanOrEqual(0.15);
      }
    });
  });
});

describe("BackgroundPaths (reduced motion)", () => {
  it("renders static path elements with stroke-opacity when reduced motion is preferred", async () => {
    // Override the mock to return true for reduced motion
    const { usePreferReducedMotion } = await import(
      "@/hooks/use-reduced-motion"
    );
    vi.mocked(usePreferReducedMotion).mockReturnValue(true);

    const { container } = render(<BackgroundPaths />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(36);

    // Static paths should have stroke-opacity attribute directly set
    paths.forEach((path) => {
      const strokeOpacity = path.getAttribute("stroke-opacity");
      expect(strokeOpacity).not.toBeNull();
      expect(Number(strokeOpacity)).toBeLessThanOrEqual(0.15);
    });

    // Restore default mock behavior
    vi.mocked(usePreferReducedMotion).mockReturnValue(false);
  });
});
