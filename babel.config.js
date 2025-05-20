module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This helps with module resolution issues
      ['module-resolver', {
        alias: {
          // Add any aliases you might need
          'stream': 'stream-browserify',
          'crypto': 'react-native-crypto',
        }
      }]
    ]
  };
};
