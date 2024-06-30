// next.config.js
require('dotenv').config();

console.log('NEXT_PUBLIC_SHOPIFY_API_URL:', process.env.NEXT_PUBLIC_SHOPIFY_API_URL);
console.log('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:', process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.shopify.com'], // Add your image domain here
  },
  env: {
    NEXT_PUBLIC_SHOPIFY_API_URL: process.env.NEXT_PUBLIC_SHOPIFY_API_URL,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;
