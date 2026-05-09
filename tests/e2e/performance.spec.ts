import { test, expect, type CDPSession } from "@playwright/test";

/**
 * Performance E2E Tests
 * Validates: Requirements 12.1, 12.2, 12.5
 *
 * These are aspirational performance tests that validate the architecture
 * supports good Core Web Vitals. They use CDP (Chrome DevTools Protocol)
 * to emulate network conditions and collect performance metrics.
 */

// Network throttling profile: 25 Mbps download, 50ms RTT
const NETWORK_CONDITIONS = {
  offline: false,
  downloadThroughput: 25_000_000 / 8, // 25 Mbps in bytes/sec
  uploadThroughput: 5_000_000 / 8, // 5 Mbps upload in bytes/sec
  latency: 50, // 50ms RTT
};

test.describe("Performance - Core Web Vitals", () => {
  test("LCP should be ≤ 2.5s at 25 Mbps / 50ms RTT @perf", async ({
    page,
    browser,
  }) => {
    // Create a CDP session for network throttling
    const context = page.context();
    const cdpSession: CDPSession = await context.newCDPSession(page);

    // Enable network emulation
    await cdpSession.send("Network.enable");
    await cdpSession.send("Network.emulateNetworkConditions", NETWORK_CONDITIONS);

    // Clear cache to simulate cold load
    await cdpSession.send("Network.clearBrowserCache");

    // Navigate and wait for load
    await page.goto("/", { waitUntil: "load" });

    // Collect LCP using PerformanceObserver
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        // Check if LCP entries already exist
        const existingEntries = performance.getEntriesByType(
          "largest-contentful-paint"
        );
        if (existingEntries.length > 0) {
          const lastEntry = existingEntries[existingEntries.length - 1];
          resolve(lastEntry.startTime);
          return;
        }

        // Otherwise observe for LCP
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            observer.disconnect();
            resolve(lastEntry.startTime);
          }
        });
        observer.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });

        // Timeout fallback — resolve with a high value if no LCP observed
        setTimeout(() => {
          observer.disconnect();
          resolve(Infinity);
        }, 10_000);
      });
    });

    // LCP should be ≤ 2500ms (Requirement 12.1)
    expect(lcp).toBeLessThanOrEqual(2500);

    await cdpSession.detach();
  });

  test("CLS should be ≤ 0.1 across full page scroll @perf", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Inject CLS observer before scrolling
    await page.evaluate(() => {
      (window as unknown as { __cls: number }).__cls = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          // Only count shifts without recent user input
          if (!layoutShift.hadRecentInput) {
            (window as unknown as { __cls: number }).__cls +=
              layoutShift.value;
          }
        }
      });

      observer.observe({ type: "layout-shift", buffered: true });
      (window as unknown as { __clsObserver: PerformanceObserver }).__clsObserver = observer;
    });

    // Scroll through the entire page in increments to trigger layout shifts
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = 900;
    const scrollStep = viewportHeight / 2;

    for (let y = 0; y < pageHeight; y += scrollStep) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      // Allow time for layout shifts to be reported
      await page.waitForTimeout(100);
    }

    // Scroll to the very bottom
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await page.waitForTimeout(500);

    // Collect final CLS value
    const cls = await page.evaluate(() => {
      const win = window as unknown as {
        __cls: number;
        __clsObserver: PerformanceObserver;
      };
      win.__clsObserver.disconnect();
      return win.__cls;
    });

    // CLS should be ≤ 0.1 (Requirement 12.2)
    expect(cls).toBeLessThanOrEqual(0.1);
  });

  test("Hero section (h1 + CTA buttons) should be visible without scroll at 1024×768 @perf", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Verify h1 is within the viewport
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    const h1BoundingBox = await h1.boundingBox();
    expect(h1BoundingBox).not.toBeNull();
    expect(h1BoundingBox!.y).toBeGreaterThanOrEqual(0);
    expect(h1BoundingBox!.y + h1BoundingBox!.height).toBeLessThanOrEqual(768);

    // Verify CTA buttons are within the viewport
    const ctaButtons = page.locator(
      'section[aria-labelledby="hero-heading"] button'
    );
    const buttonCount = await ctaButtons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < buttonCount; i++) {
      const button = ctaButtons.nth(i);
      await expect(button).toBeVisible();

      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      // Button must be fully within the 768px viewport height
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(768);
    }
  });
});
