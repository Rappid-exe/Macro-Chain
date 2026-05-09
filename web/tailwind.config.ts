import type { Config } from "tailwindcss";

/**
 * Godel Terminal–inspired palette. Pure black base, amber accent, green
 * for bullish signals, red for bearish. Monospace is the default body
 * font — this is a Bloomberg-style tool, not a consumer web app.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
          DEFAULT: "#ffa940", // amber — Godel / Bloomberg signature
          up: "#7cf0a0",
          down: "#ff5555",
          info: "#6ea8ff",
          warn: "#f5c563",
        },
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
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
