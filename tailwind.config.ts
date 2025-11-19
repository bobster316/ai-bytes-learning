import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background-default)",
        "background-subtle": "var(--background-subtle)",
        "background-card": "var(--background-card)",
        "background-inverse": "var(--background-inverse)",

        foreground: "var(--foreground-default)",
        "foreground-subtle": "var(--foreground-subtle)",
        "foreground-inverse": "var(--foreground-inverse)",

        border: "var(--border-default)",

        // Shorthand aliases for common usage
        card: "var(--background-card)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
