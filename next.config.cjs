// next.config.cjs
const path = require('path');

function throwError(envVar) {
  if (!process.env[envVar]) {
    throw new Error(`Abort: You need to define the ${envVar} environment variable.`);
  }
}

// Check for the RESEND_API_KEY environment variable
throwError('RESEND_API_KEY');

// Next.js configuration as a CommonJS module
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'media.istockphoto.com',
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  // Include other specific configurations if necessary
};