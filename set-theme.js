#!/usr/bin/env node
/**
 * Script to set the data-theme attribute in src/index.html based on --theme argument.
 * Usage: node set-theme.js --theme=razu-development
 * If --theme is not provided, defaults to 'light'.
 */
const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, 'src', 'index.html');
const STYLES_PATH = path.join(__dirname, 'src', 'styles.css');
const THEMES_DIR = path.join(__dirname, 'src', 'app', 'config', 'theme');

// Parse --theme argument
let theme = 'light'; // default
const arg = process.argv.find(arg => arg.startsWith('--theme='));
if (arg) {
  theme = arg.split('=')[1] || 'light';
}

// 1. Copy theme file to styles.css if it exists
if (theme && theme !== 'light') {
  const themeFile = path.join(THEMES_DIR, `${theme}.css`);
  if (fs.existsSync(themeFile)) {
    fs.copyFileSync(themeFile, STYLES_PATH);
    console.log(`Theme file found: ${themeFile}. Overwrote styles.css for this build.`);
  } else {
    console.log(`Theme file not found for '${theme}'. Using default styles.css.`);
  }
} else {
  console.log('No theme argument provided or theme is "light". Using default styles.css.');
}

// 2. Set data-theme in index.html as before
let html = fs.readFileSync(INDEX_PATH, 'utf8');
const htmlTagRegex = /<html([^>]*)>/i;
if (htmlTagRegex.test(html)) {
  html = html.replace(htmlTagRegex, (match, attrs) => {
    // Remove any existing data-theme attribute
    let newAttrs = attrs.replace(/\s*data-theme="[^"]*"/, '');
    // Add data-theme as the first attribute
    return `<html data-theme="${theme}"${newAttrs}>`;
  });
} else {
  // Fallback: insert data-theme if <html> tag is found
  html = html.replace('<html>', `<html data-theme="${theme}">`);
}
fs.writeFileSync(INDEX_PATH, html, 'utf8');
console.log(`Set data-theme=\"${theme}\" in src/index.html`);
