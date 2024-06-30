// next.config.js
require('dotenv').config();

console.log('SHOPIFY_API_ENDPOINT:', process.env.SHOPIFY_API_ENDPOINT);
console.log('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:', process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.shopify.com', 'via.placeholder.com'], // Add your image domain here
  },
  env: {
    SHOPIFY_API_ENDPOINT: process.env.SHOPIFY_API_ENDPOINT,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;
