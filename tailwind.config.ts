import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F4EAD8",
        "cream-soft": "#FBF6EC",
        espresso: "#2C1B12",
        gold: "#B8874A",
        "gold-light": "#E7B45C",
        rust: "#9C5233",
        line: "rgba(44,27,18,0.12)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(44, 27, 18, 0.08)",
        card: "0 2px 16px rgba(44, 27, 18, 0.06)",
        "card-hover": "0 8px 32px rgba(44, 27, 18, 0.12)",
        glow: "0 0 40px rgba(231, 180, 92, 0.25)",
      },
      height: {
        "13": "3.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
