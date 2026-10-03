import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage - public images
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },

      // Supabase Storage / other Supabase image URLs
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },

      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // Shopify CDN
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
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

      // Placeholder images
      {
        protocol: "https",
        hostname: "via.placeholder.com",
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

  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "/resources",
      },
      {
        source: "/blogs",
        destination: "/resources",
      },
      {
        source: "/blog/:slug",
        destination: "/resources/:slug",
      },
      {
        source: "/blogs/:slug",
        destination: "/resources/:slug",
      },
    ];
  },
};

export default nextConfig;