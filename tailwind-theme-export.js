const {
  developmentTheme,
  acceptanceTheme,
  productionTheme,
} = require("./src/app/config/themes");

const hasConfiguration = (args, configName) => {
  return (
    args.includes(`--configuration ${configName}`) ||
    args.includes(`--configuration=${configName}`) ||
    args.includes(`-c ${configName}`) ||
    args.includes(`-c=${configName}`)
  );
};

const getThemeForEnvironment = () => {
  if (typeof process !== "undefined" && process.argv) {
    const args = process.argv.join(" ");

    if (hasConfiguration(args, "production")) {
      console.log("Using production theme");
      return productionTheme;
    } else if (hasConfiguration(args, "acceptance")) {
      console.log("Using acceptance theme");
      return acceptanceTheme;
    }
  }

  console.log("Using development theme");
  return developmentTheme;
};

module.exports = getThemeForEnvironment();
