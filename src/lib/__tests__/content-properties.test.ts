import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as constants from "@/lib/constants";

/**
 * Recursively extracts all string values from an object or array.
 */
function extractStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(extractStrings);
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(extractStrings);
  }
  return [];
}

/** Collect all text strings from the constants module */
const allTextStrings = Object.values(constants).flatMap(extractStrings);

describe("Feature: landing-page-v2, Property 2: no subjective superlatives", () => {
  /**
   * Validates: Requirements 15.4
   *
   * For any text constant defined in the application's content module,
   * the string SHALL NOT contain any word from the banned superlatives list.
   */

  const BANNED_SUPERLATIVES = [
    "revolutionary",
    "unmatched",
    "best-in-class",
    "game-changing",
    "world-class",
    "cutting-edge",
    "groundbreaking",
    "unparalleled",
    "industry-leading",
    "next-generation",
    "state-of-the-art",
  ];

  it("no text constant contains a banned subjective superlative", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allTextStrings), (text) => {
        const lowerText = text.toLowerCase();
        for (const superlative of BANNED_SUPERLATIVES) {
          expect(lowerText).not.toContain(superlative);
        }
      }),
      { numRuns: 100 }
    );
  });
});
