/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff9eb",
          100: "#fff0c2",
          200: "#ffe08a",
          300: "#ffd04d",
          400: "#f2b824",
          500: "#d99a0b",
          600: "#b87b08",
          700: "#8a5a00",
          800: "#694400",
          900: "#493000",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(138, 90, 0, 0.14)",
        card: "0 8px 24px rgba(16, 24, 40, 0.08)",
      },
    },
  },
  plugins: [],
};
