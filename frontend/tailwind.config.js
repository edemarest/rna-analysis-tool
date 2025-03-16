/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Urbanist", "Inter", "sans-serif"],
      },
      colors: {
        primary: "#3b82f6",
        secondary: "#a855f7",
        accent: "#facc15",
        background: "#0f172a",
        card: "#1e293b",
        border: "#334155",
        textLight: "#f1f5f9",
        textDark: "#cbd5e1",
      },
    },
  },
  plugins: [],
};
