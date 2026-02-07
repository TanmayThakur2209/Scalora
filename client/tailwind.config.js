/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat","B", "sans-serif"],
        bitcount: ["Bitcount Single", "sans-serif"],
      },
    },
  },
  plugins: [],
};
