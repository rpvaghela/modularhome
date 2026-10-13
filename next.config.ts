import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // When hosted on Node.js / shared hosting / VPS / custom server, unoptimized avoids internal proxy failures and serves direct fast CDN URLs.
    unoptimized: process.env.NEXT_IMAGE_OPTIMIZATION === "true" ? false : true,
    remotePatterns: [
      // Supabase Storage & CDNs
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      {
        protocol: "https",
        hostname: "*.supabase.net",
      },

      // Shopify CDN and subdomains
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "*.shopify.com",
      },
      {
        protocol: "https",
        hostname: "*.myshopify.com",
      },
      {
        protocol: "https",
        hostname: "*.shopifycdn.com",
      },

      // Unsplash (Standard and Plus)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },

      // YouTube thumbnails
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "*.youtube.com",
      },

      // Google User Content (OAuth profile pictures)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },

      // Cloudinary & Pexels
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },

      // Placeholder images
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },

      // Local / Custom domains
      {
        protocol: "https",
        hostname: "*.modularhome.com",
      },
      {
        protocol: "https",
        hostname: "modularhome.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/commercial-buildings",
        destination: "/commercial-modular-buildings",
        permanent: true,
      },
      {
        source: "/commercial-buildings/:path*",
        destination: "/commercial-modular-buildings/:path*",
        permanent: true,
      },
      {
        source: "/catalog",
        destination: "/buildings",
        permanent: true,
      },
      {
        source: "/models",
        destination: "/buildings",
        permanent: true,
      },
      {
        source: "/floorplans",
        destination: "/floor-plans",
        permanent: true,
      },
      {
        source: "/plans",
        destination: "/floor-plans",
        permanent: true,
      },
      {
        source: "/buildings/the-grey-haven-barndo-house-kit",
        destination: "/barndominiums/the-grey-haven-barndo-house-kit",
        permanent: true,
      },
      {
        source: "/buildings/the-farmhouse-charm-new-model",
        destination: "/modular-homes/the-farmhouse-charm-new-model",
        permanent: true,
      },
      {
        source: "/buildings/el-chapo-muchacho",
        destination: "/cabins/el-chapo-muchacho",
        permanent: true,
      },
      {
        source: "/buildings/the-grandview-two-story-modular-estate",
        destination: "/barndominiums/the-grandview-two-story-modular-estate",
        permanent: true,
      },
      {
        source: "/collections/prefab-homes",
        destination: "/prefab-homes",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "/blogs",
      },
      {
        source: "/blog/:slug",
        destination: "/resources/:slug",
      },
    ];
  },
};

export default nextConfig;