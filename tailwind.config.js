/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Familjen Grotesk", "sans-serif"],
        mono: ["Familjen Grotesk", "sans-serif"],
      },
      screens: {
        wide: "1600px",
      },
      colors: {
        background: "#E5E4E2",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        main: require("./tailwind-theme-export.js"),
      },
    ],
  },
};
