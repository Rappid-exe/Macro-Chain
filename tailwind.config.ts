import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#050505",
        surface: "#1A1A1A",
        border: "rgba(42, 42, 42, 0.2)",
        "text-primary": "#EAEAEA",
        "text-secondary": "#BDBDBD",
        "signal-green": "#00E676",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "'SF Pro Display'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
        lg: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
