import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark analyst palette. Avoid the shadcn default slate look; it reads
        // generic. Slight warm tint on the surfaces so charts pop.
        bg: {
          DEFAULT: "#0b0d10",
          raised: "#12151a",
          sunken: "#070809",
        },
        border: {
          DEFAULT: "#1e232b",
          strong: "#2a3038",
        },
        fg: {
          DEFAULT: "#e6e8eb",
          muted: "#8b93a1",
          faint: "#596170",
        },
        accent: {
          DEFAULT: "#7cf0a0", // up / bullish
          down: "#ff7b7b",    // down / bearish
          warn: "#f5c563",
          info: "#6ea8ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
