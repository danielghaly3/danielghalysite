import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        bone: "var(--bone)",
        graphite: "var(--graphite)",
        ash: "var(--ash)",
        line: "var(--line)",
        accent: {
          DEFAULT: "var(--accent)",
          ink: "var(--accent-ink)",
          soft: "var(--accent-soft)"
        },
        ok: "var(--ok)"
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Geist", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Boska", "Arial Narrow", "sans-serif"]
      },
      borderRadius: {
        "3xl": "28px",
        card: "20px",
        image: "16px"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        pop: "var(--shadow-pop)"
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      maxWidth: {
        editorial: "1400px"
      }
    }
  },
  plugins: []
};

export default config;
