/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true, // ✅ Disables Next.js image optimization (fixes upstream fetch issues)
    domains: ["yourdomain.com"], // ✅ Add your production domain if hosting externally
  },

  experimental: {
    scrollRestoration: true, // ✅ Keeps scroll position on navigation
  },

  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevents ESLint errors from breaking the build
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // ✅ Allows direct SVG imports
    });
    return config;
  },
};

module.exports = nextConfig;
