// First import the text encoding polyfill
import { TextDecoder, TextEncoder } from 'text-encoding';

// Make sure TextEncoder and TextDecoder are available globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Import the complete URL implementation from whatwg-url
import { URL, URLSearchParams } from 'whatwg-url';

// Override the global URL and URLSearchParams with the whatwg-url implementation
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// Add other necessary polyfills
global.Buffer = require('buffer').Buffer;
global.process = require('process');
