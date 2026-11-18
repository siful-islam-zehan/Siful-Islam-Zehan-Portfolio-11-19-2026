import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "430px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1600px",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "dark-background": "var(--dark-background)",
        "dark-foreground": "var(--dark-foreground)",
        "secondary-text": "var(--secondary-text)",
        border: "var(--border)",
        
        /* Semantic aliases */
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "surface-dark": "var(--surface-dark)",
        "surface-main": "var(--surface-main)",
        "text-on-dark": "var(--text-on-dark)",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-archivo)", "var(--font-manrope)", "sans-serif"],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
        24: "96px",
        32: "128px",
        48: "192px",
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        pill: "var(--radius-pill)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.16, 1, 0.3, 1)", // power4.out
      },
      transitionDuration: {
        base: "0.9s",
      },
      keyframes: {
        pageProgress: {
          "0%": { width: "0%", opacity: "1" },
          "80%": { width: "100%", opacity: "1" },
          "100%": { width: "100%", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
