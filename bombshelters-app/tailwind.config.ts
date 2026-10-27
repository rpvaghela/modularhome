import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: {
          DEFAULT: "#111214",
          alt: "#16181b",
          card: "#121417",
        },
        border: {
          DEFAULT: "#2a2d31",
          subtle: "#1f2226",
        },
        military: {
          red: "#e11d1d",
          redHover: "#ff2b2b",
          redDark: "#991b1b",
          charcoal: "#181a1d",
          steel: "#2b3036",
          badge: "#1c2024",
        },
        muted: "#a1a1aa",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        redGlow: "0 0 25px -5px rgba(225, 29, 29, 0.4)",
        cardHover: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
