const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude react-native-maps from web builds
config.resolver.platforms = ["ios", "android", "native", "web"];

// Add web-specific resolver
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

// Exclude react-native-maps from web platform
config.resolver.blockList = [/node_modules\/react-native-maps\/.*\.web\.js$/];

module.exports = config;
