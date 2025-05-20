const { getDefaultConfig } = require('expo/metro-config');

// Create the default Metro config
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

// Add all the Node.js polyfills
const nodeModules = {
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('react-native-crypto'),
  'http': require.resolve('@tradle/react-native-http'),
  'https': require.resolve('https-browserify'),
  'net': require.resolve('react-native-tcp'),
  'tls': require.resolve('react-native-tcp'),
  'zlib': require.resolve('browserify-zlib'),
  'url': require.resolve('url'),
  'buffer': require.resolve('buffer'),
  'process': require.resolve('process/browser'),
  'util': require.resolve('util'),
  'events': require.resolve('events'),
  'assert': require.resolve('assert')
};

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    assetExts: [...assetExts, 'pem'],
    sourceExts: [...sourceExts, 'cjs'],
    extraNodeModules: nodeModules,
  },
};
