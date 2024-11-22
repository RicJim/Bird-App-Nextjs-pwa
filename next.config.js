const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'observation.org',
      },
      {
        protocol: 'https',
        hostname: 'avesexoticas.org',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'inaturalist-open-data.s3.amazonaws.com',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
