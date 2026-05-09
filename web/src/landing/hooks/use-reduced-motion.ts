"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Wraps framer-motion's useReducedMotion hook for consistent usage
 * across all animated components.
 *
 * @returns `true` if the user prefers reduced motion, `false` otherwise.
 */
export function usePreferReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
