import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // light, clean SaaS palette
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F8FA",
          muted: "#F1F3F7",
          sunken: "#E9EDF3",
        },
        ink: {
          DEFAULT: "#0B0D12", // headings / near-black
          soft: "#272D3A",
          muted: "#5B6472", // body
          faint: "#8A93A3", // captions
        },
        line: {
          DEFAULT: "#E8EAF0",
          strong: "#D8DCE6",
        },
        // primary brand — indigo/blue (the "visible" / calm channel)
        brand: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          soft: "#EEF0FF",
          ring: "#C7CCFF",
          ink: "#312BA6",
        },
        // warm accent — coral (the "hidden mind" / what it was thinking)
        accent: {
          DEFAULT: "#FF6A3D",
          hover: "#EC5326",
          soft: "#FFF1EB",
          ink: "#B83A18",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 10px 28px -14px rgba(16,24,40,0.14)",
        cardHover:
          "0 2px 6px rgba(16,24,40,0.06), 0 22px 48px -20px rgba(16,24,40,0.22)",
        btn: "0 1px 2px rgba(16,24,40,0.10)",
        glowBrand: "0 14px 34px -12px rgba(79,70,229,0.45)",
        glowAccent: "0 14px 34px -12px rgba(255,106,61,0.40)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        blink: {
          "0%, 64%": { opacity: "1" },
          "65%, 100%": { opacity: "0.2" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        aurora1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(40px, -30px) scale(1.15)" },
        },
        aurora2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1.05)" },
          "50%": { transform: "translate(-50px, 20px) scale(0.92)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        caretBlink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        think: {
          "0%, 100%": { opacity: "0.3", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-3px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        blink: "blink 1.3s steps(1) infinite",
        floaty: "floaty 7s ease-in-out infinite",
        aurora1: "aurora1 18s ease-in-out infinite",
        aurora2: "aurora2 22s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
