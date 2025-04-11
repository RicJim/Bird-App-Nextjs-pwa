const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.pixabay\.com\/.*\.(png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "pixabay-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern:
        /^https:\/\/static\.inaturalist\.org\/.*\.(png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "inaturalist-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern:
        /\/_next\/.*\.(js|css|html|json|woff2?|ttf|eot|ico|svg|png|jpg|jpeg|webp)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^\/models\/image\/.*\.(json|bin)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-model-cache",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^\/models\/sound\/.*\.(json|bin)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "sound-model-cache",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^\/.*/, // Coincide con todas las rutas dinámicas
      handler: "NetworkFirst", // Intenta la red primero; si falla, usa la caché
      options: {
        cacheName: "dynamic-pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
        },
        networkTimeoutSeconds: 10, // Espera 10 segundos antes de usar la caché
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@tensorflow/tfjs-node"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "static.inaturalist.org",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
