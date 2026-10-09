import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  // Em telas de toque o :hover "gruda" após o toque; só aplica hover onde há mouse.
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        canvas: {
          DEFAULT: "hsl(var(--canvas))",
          muted: "hsl(var(--canvas-muted))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        link: "hsl(var(--link))",
        backdrop: "hsl(var(--backdrop))",
        overlay: "hsl(var(--overlay))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sidebar: {
          background: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          active: "hsl(var(--sidebar-active))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: "hsl(var(--success))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        md: "calc(var(--radius) - 4px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--foreground))",
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-links": "hsl(var(--link))",
            "--tw-prose-hr": "hsl(var(--border))",
            "--tw-prose-counters": "hsl(var(--muted-foreground))",
            "--tw-prose-bullets": "hsl(var(--muted-foreground))",
            "--tw-prose-bold": "hsl(var(--foreground))",
            "--tw-prose-code": "hsl(var(--foreground))",
            "--tw-prose-pre-bg": "hsl(var(--muted))",
            "--tw-prose-th-borders": "hsl(var(--border))",
            "--tw-prose-td-borders": "hsl(var(--border))",
            "--tw-prose-invert-body": "hsl(var(--foreground))",
            "--tw-prose-invert-headings": "hsl(var(--foreground))",
            "--tw-prose-invert-links": "hsl(var(--link))",
            maxWidth: "none",
            // Escala de leitura: corpo 14px em Inter, títulos em Montserrat com peso médio.
            fontSize: "0.875rem",
            lineHeight: "1.7",
            p: { marginTop: "0", marginBottom: "1rem" },
            "h1, h2, h3": { fontFamily: "var(--font-heading), system-ui, sans-serif", letterSpacing: "-0.01em" },
            h1: { fontWeight: "600", fontSize: "1.625rem", lineHeight: "1.2", marginTop: "2.5rem", marginBottom: "0.75rem" },
            h2: { fontWeight: "600", fontSize: "1.25rem", lineHeight: "1.3", marginTop: "2.5rem", marginBottom: "0.75rem" },
            h3: { fontWeight: "600", fontSize: "1rem", lineHeight: "1.4", marginTop: "1.75rem", marginBottom: "0.5rem" },
            "ul, ol": { marginTop: "0", marginBottom: "1rem" },
            li: { marginTop: "0", marginBottom: "0.375rem" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
