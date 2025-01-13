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
      colors: {
        'background': '#E5E4E2',
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
          // primary: "#6c5a82",
          // neutral: "#a999bd",
          // accent: "#9ad199", // Used for highlighting search results
          // secondary: "#c2b280",
          // "primary-content": "white",
          // background: "#E5E4E2",
          // search_background: "#E5E4E2",
          // "--rounded-box": "1rem",
          // "--rounded-btn": "1rem",
          // "--rounded-badge": "1rem",
          // black: "#000000",

          // DEVELOPMENT:
          primary: "#4a4a4a", // Dark gray for primary elements
          neutral: "#808080", // Medium gray for neutral elements
          accent: "#b3b3b3", // Light gray for highlighting search results
          secondary: "#6d6d6d", // A slightly darker gray for secondary elements
          "primary-content": "white", // White text to maintain contrast
          background: "#f2f2f2",
          search_background: "#f2f2f2", // Very light gray for the background
          "--rounded-box": "0.375rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "0.375rem",
        },
      },
    ],
  },
  themes: ["main"],
};
