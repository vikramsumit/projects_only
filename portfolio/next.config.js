// Next.js configuration file.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static HTML export
  images: {
    unoptimized: true, // For static export, next/image optimization needs to be unoptimized or configured with a loader
    // If you plan to use a CDN or external image host, configure domains here:
    // domains: ['example.com'],
  },
};

module.exports = nextConfig;
