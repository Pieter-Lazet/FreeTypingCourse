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
        bg: "#0B0B0B",
        surface: "#141414",
        border: "#222222",
        accent: "#6C63FF",
        success: "#1DB97A",
        error: "#E24B4A",
        "text-primary": "#F5F5F5",
        "text-muted": "#888888",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": "12px",
        xs: "13px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "22px",
        "2xl": "28px",
      },
      borderWidth: {
        DEFAULT: "0.5px",
        "0": "0",
        "1": "1px",
        "2": "2px",
      },
      minWidth: {
        "1024": "1024px",
      },
    },
  },
  plugins: [],
};

export default config;
