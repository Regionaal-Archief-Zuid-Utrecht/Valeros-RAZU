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
        'wide': '1600px',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        main: {
          ...require("daisyui/src/theming/themes")["light"],
          // PRODUCTION:
          primary: "#6c5a82",
          neutral: "#a999bd",
          accent: "#9ad199", // Used for highlighting search results
          secondary: "#c2b280",
          "primary-content": "white",
          background: "#E5E4E2",
          "--rounded-box": "1rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1rem",
          black: "#000000",

          // DEVELOPMENT:
          // primary: "#000000",
          // neutral: "#000000",
          // accent: "#A0A5A2", // Used for highlighting search results
          // secondary: "#A0A5A2",
          // "primary-content": "white",
          // background: "#A493BC",
          // "--rounded-box": "1rem",
          // "--rounded-btn": "1rem",
          // "--rounded-badge": "1rem",
          // black: "#000000",
        },
      },
    ],
  },
  themes: ["main"],
};
