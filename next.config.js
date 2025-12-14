import withPWA from "next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ["!noprecache/**/*"],
  cacheStartUrl: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
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
          maxEntries: 200,
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
          maxEntries: 5,
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
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /^\/.*\.(jpg|jpeg|png|gif|webp|svg|ico)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^\/(?!api|_next\/static|public).*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "dynamic-pages",
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
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
  headers: async () => {
    return [
      {
        source: "/public/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=*, microphone=*, geolocation=*",
          },
          {
            key: "Feature-Policy",
            value: "camera 'self'; microphone 'self'; geolocation 'self'",
          },
        ],
      },
    ];
  },
};

export default withPWAConfig(nextConfig);
