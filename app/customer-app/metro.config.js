// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ignore macOS metadata files like ._login.tsx
config.resolver.blockList = [
  /.*\/\._.*$/, // Ignore files starting with ._ anywhere
];

module.exports = config;
