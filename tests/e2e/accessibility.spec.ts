import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility E2E Tests
 * Validates: Requirements 13.1, 13.3, 13.7, 13.8
 *
 * @a11y
 */

const VIEWPORTS = [
  { width: 375, height: 812, label: "mobile" },
  { width: 768, height: 1024, label: "tablet" },
  { width: 1024, height: 768, label: "laptop" },
  { width: 1440, height: 900, label: "desktop" },
] as const;

test.describe("Accessibility - axe-core audit @a11y", () => {
  for (const viewport of VIEWPORTS) {
    test(`should have no WCAG 2.1 AA violations at ${viewport.width}px (${viewport.label})`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/");
      // Wait for lazy-loaded sections to render
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

test.describe("Accessibility - Keyboard navigation order @a11y", () => {
  test("Tab order follows visual top-to-bottom, left-to-right reading order", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Collect focused elements in Tab order
    const focusedElements: string[] = [];
    const maxTabs = 30;

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press("Tab");

      const elementInfo = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;

        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text:
            el.textContent?.trim().slice(0, 50) ||
            el.getAttribute("aria-label") ||
            "",
          top: rect.top,
          left: rect.left,
        };
      });

      if (!elementInfo) break;
      focusedElements.push(
        `${elementInfo.tag}[${elementInfo.top},${elementInfo.left}]`
      );
    }

    // Verify elements are in top-to-bottom order (allowing left-to-right within same row)
    const positions = await page.evaluate(() => {
      const elements: { top: number; left: number }[] = [];
      // Reset focus to body
      (document.activeElement as HTMLElement)?.blur?.();
      document.body.focus();

      for (let i = 0; i < 30; i++) {
        // Simulate tab by finding next focusable
        const event = new KeyboardEvent("keydown", {
          key: "Tab",
          bubbles: true,
        });
        document.dispatchEvent(event);
      }
      return elements;
    });

    // Re-verify by tabbing through and checking vertical order
    // Each focused element should have a top >= previous element's top
    // (with tolerance for elements on the same visual row)
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    let previousTop = -Infinity;
    const ROW_TOLERANCE = 50; // pixels - elements within this are considered same row

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");

      const currentTop = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return el.getBoundingClientRect().top;
      });

      if (currentTop === null) break;

      // Allow elements on the same row (within tolerance) or below
      if (currentTop < previousTop - ROW_TOLERANCE) {
        // Element is significantly above the previous one — order violation
        const elementDesc = await page.evaluate(() => {
          const el = document.activeElement;
          return el?.textContent?.trim().slice(0, 40) || el?.tagName || "";
        });
        expect
          .soft(currentTop)
          .toBeGreaterThanOrEqual(
            previousTop - ROW_TOLERANCE,
            // @ts-expect-error -- custom message
            `Focus moved backwards: "${elementDesc}" at top=${currentTop} after previous top=${previousTop}`
          );
      }

      previousTop = currentTop;
    }
  });
});

test.describe("Accessibility - Focus indicators @a11y", () => {
  test("all interactive elements have visible focus indicators", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Get all interactive elements
    const interactiveSelectors = [
      'a[href]',
      'button',
      'input',
      '[tabindex="0"]',
      '[role="button"]',
    ];

    const interactiveElements = page.locator(
      interactiveSelectors.join(", ")
    );
    const count = await interactiveElements.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);

      // Skip hidden elements
      const isVisible = await element.isVisible().catch(() => false);
      if (!isVisible) {
        // Check if it becomes visible on focus (like skip-nav)
        await element.focus();
        const visibleAfterFocus = await element
          .isVisible()
          .catch(() => false);
        if (!visibleAfterFocus) continue;
      } else {
        await element.focus();
      }

      // Check for visible focus indicator (outline, box-shadow, or ring)
      const hasFocusIndicator = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const outline = styles.outline;
        const outlineWidth = parseFloat(styles.outlineWidth);
        const outlineStyle = styles.outlineStyle;
        const boxShadow = styles.boxShadow;

        // Has visible outline (not "none" and width >= 2px)
        const hasOutline =
          outlineStyle !== "none" && outlineWidth >= 2;

        // Has box-shadow (used by Tailwind ring utilities)
        const hasBoxShadow =
          boxShadow !== "none" && boxShadow !== "";

        return hasOutline || hasBoxShadow;
      });

      if (!hasFocusIndicator) {
        const desc = await element.evaluate((el) => {
          const tag = el.tagName.toLowerCase();
          const text = el.textContent?.trim().slice(0, 30) || "";
          const ariaLabel = el.getAttribute("aria-label") || "";
          return `${tag}: "${text || ariaLabel}"`;
        });

        expect
          .soft(hasFocusIndicator, `Missing focus indicator on ${desc}`)
          .toBe(true);
      }
    }
  });
});

test.describe("Accessibility - Skip navigation @a11y", () => {
  test("skip-nav link is the first focusable element", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Press Tab once — first focusable element should be the skip-nav link
    await page.keyboard.press("Tab");

    const activeElement = page.locator(":focus");
    await expect(activeElement).toHaveAttribute("href", "#main-content");
    await expect(activeElement).toHaveText(/skip to main content/i);
  });

  test("skip-nav link is visually hidden by default and visible on focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const skipLink = page.locator('a[href="#main-content"]');

    // Should be visually hidden initially (sr-only class)
    const initiallyVisible = await skipLink.isVisible();
    expect(initiallyVisible).toBe(false);

    // Focus the skip link
    await page.keyboard.press("Tab");

    // Should become visible on focus (focus:not-sr-only)
    await expect(skipLink).toBeVisible();
  });

  test("activating skip-nav link moves focus to main content", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Tab to skip-nav link
    await page.keyboard.press("Tab");

    // Activate the skip link
    await page.keyboard.press("Enter");

    // Focus should now be on or within #main-content
    const focusedId = await page.evaluate(() => {
      const el = document.activeElement;
      // Check if focused element is #main-content or is inside it
      if (el?.id === "main-content") return "main-content";
      if (el?.closest("#main-content")) return "inside-main-content";
      return el?.id || el?.tagName || "unknown";
    });

    expect(["main-content", "inside-main-content"]).toContain(focusedId);
  });
});
