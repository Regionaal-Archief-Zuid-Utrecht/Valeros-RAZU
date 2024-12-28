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
          // primary: "#0084CA",
          primary: "#6c5a82",
          neutral: "#a999bd",
          accent: "#9ad199", // Used for highlighting search results
          secondary: "#c2b280",
          "primary-content": "white",
          // background: "white",
          background: "#E5E4E2",
          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          black: "#000000",
        },
      },
    ],
  },
  themes: ["main"],
};
