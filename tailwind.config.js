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
        xxs: "400px",
        xs: "480px",
        "3xl": "1792px",
        "4xl": "2048px",
        "5xl": "2304px",
        "6xl": "2560px",
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
