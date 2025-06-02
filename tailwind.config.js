/** @type {import('tailwindcss').Config} */

const {
  themeSettings,
} = require("./src/app/config/default-settings/theme.settings");

function getThemeByEnvironment() {
  const env = process.env.APP_ENV || "production";
  console.log(`Getting theme by environment: ${env}`);

  switch (env) {
    case "development":
      return themeSettings.development;
    case "accept":
      return themeSettings.accept;
    case "test":
      return themeSettings.test;
    default:
      return themeSettings.production;
  }
}

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
        main: getThemeByEnvironment(),
      },
    ],
  },
  themes: ["main"],
};
