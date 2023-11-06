// Using ES6 export syntax in next.config.js

// Define a function to throw an error if an environment variable is not defined
function throwError(envVar) {
  throw new Error(`Abort: You need to define ${envVar} in the .env file.`);
}

// Check for the required environment variable
if (!process.env.RESEND_API_KEY) throwError('RESEND_API_KEY');

// Next.js configuration
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'media.istockphoto.com',
    ],
  },
  // Any other Next.js specific configurations
};

// ES6 default export of the configuration object
export default nextConfig;