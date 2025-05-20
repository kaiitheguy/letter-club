// iOS-specific polyfills
global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.URL = require('react-native-url-polyfill').URL;
global.assert = require('assert');

// Any additional iOS-specific polyfills
