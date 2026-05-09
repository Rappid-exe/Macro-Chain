import type { Config } from "tailwindcss";

/**
 * Shared palette for both the landing page (`/`) and the terminal (`/app`).
 *
 * Landing page tokens use explicit names (bg-primary, signal-green, etc.)
 * so they don't collide with the terminal's shorthand (`bg-bg`, `text-fg`).
 * Fonts: `font-mono` drives the terminal, `font-sans` drives the landing.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Terminal (existing)
        bg: {
          DEFAULT: "#000000",
          raised: "#0a0a0a",
          sunken: "#050505",
        },
        border: {
          DEFAULT: "#1a1a1a",
          strong: "#2a2a2a",
        },
        fg: {
          DEFAULT: "#e8e8e8",
          muted: "#888888",
          faint: "#555555",
        },
        accent: {
          DEFAULT: "#ffa940",
          up: "#7cf0a0",
          down: "#ff5555",
          info: "#6ea8ff",
          warn: "#f5c563",
        },
        // Landing page
        "bg-primary": "#050505",
        surface: "#1A1A1A",
        "text-primary": "#EAEAEA",
        "text-secondary": "#BDBDBD",
        "signal-green": "#00E676",
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
