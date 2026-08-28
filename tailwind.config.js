/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1B33",
        brass: "#C9975B",
        porcelain: "#F6F4EE",
        slate: "#5B6472",
        carbon: "#14161C",
        carbon2: "#1E212B",
        foilStart: "#E8C9A0",
        foilEnd: "#B8794A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        foilGlow: "0 20px 60px -20px rgba(184,121,74,0.35)",
      },
    },
  },
  plugins: [],
};
