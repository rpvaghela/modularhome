import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Large desktop monitors; 2xl (1536) is also hit by 1920 laptops at 125% Windows scaling
        "3xl": "1800px",
      },
      colors: {
        // Off-white page background for light sections (cards stay pure white on top)
        paper: "#ffffff",
        background: "#ffffff",
        surface: {
          DEFAULT: "#ffffff",
          alt: "#ffffff",
          card: "#ffffff",
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
        brush: ["var(--font-brush)", "Permanent Marker", "cursive"],
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
