import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A1014",
          deep: "#070B0E",
          panel: "#0E161B",
          panel2: "#111B21",
          line: "#1B2A33",
        },
        acid: {
          DEFAULT: "#9FFF6B",
          dim: "#6FCC44",
          deep: "#3F8A22",
        },
        amber: {
          warn: "#FFB347",
          deep: "#C8841F",
        },
        bone: {
          DEFAULT: "#D9E2DC",
          dim: "#8A9A92",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 18px rgba(159,255,107,0.35), 0 0 6px rgba(159,255,107,0.5)",
        glowAmber: "0 0 14px rgba(255,179,71,0.35)",
      },
      keyframes: {
        blink: {
          "0%, 60%": { opacity: "1" },
          "61%, 100%": { opacity: "0.15" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.92" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        blink: "blink 1.2s steps(1) infinite",
        scan: "scan 7s linear infinite",
        flicker: "flicker 4.5s ease-in-out infinite",
        ticker: "ticker 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
