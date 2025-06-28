/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts,scss,css,js}"],
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
        // main: require("./tailwind-theme-export.js"),
        main: {
          primary: '#6c5a82',
          'primary-content': '#ffffff',
          secondary: '#c2b280',
          'secondary-content': '#222222',
          accent: '#9ad199',
          'accent-content': '#222222',
          neutral: '#a999bd',
          'neutral-content': '#ffffff',
          'base-100': '#E5E4E2',
          'base-200': '#d6d1e0',
          'base-300': '#a999bd',
          'base-content': '#222222',
          background: '#E5E4E2',
          search_background: '#E5E4E2',
          '--rounded-box': '0.375rem',
          '--rounded-btn': '0.375rem',
          '--rounded-badge': '0.375rem',
          info: '#2094f3',
          'info-content': '#ffffff',
          success: '#009485',
          'success-content': '#ffffff',
          warning: '#ff9900',
          'warning-content': '#ffffff',
          error: '#ff5724',
          'error-content': '#ffffff',
        },
      },
    ],
  },
};