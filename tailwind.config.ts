import type { Config } from "tailwindcss";

// NOTE: Tailwind v4では未読込（実際のトークンは src/app/globals.css の @theme）。
// 参照用にglobals.cssと同じ値を維持する。
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FFFFFF",
        ink: "#1D1D1F",
        subtle: "#86868B",
        surface: "#F5F5F7",
        accent: "#00B4D8",
        night: "#1A1A2E",
      },
    },
  },
  plugins: [],
};

export default config;
