import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d1017",
        surface: "#12151f",
        raised: "#171b27",
        line: "#232838",
        line2: "#2e3547",
        body: "#c6cee0",
        head: "#eef1f8",
        muted: "#79839c",
        azure: "#7aa2f7",
        amber: "#e5b567",
        teal: "#73daca",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      maxWidth: { content: "1140px" },
    },
  },
  plugins: [],
};
export default config;
