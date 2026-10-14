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
      // ── Security headers on all routes ───────────────────────────────────
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

      // ── Public images / fonts ─────────────────────────────────────────────
      {
        source: "/(.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)$)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },

      // ── robots.txt & sitemaps: public, short TTL ─────────────────────────
      {
        source: "/(robots\\.txt|sitemap.*\\.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },

      // ── Admin panel & API: never cache ───────────────────────────────────
      {
        source: "/(admin|api)(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },

      // ── Public catalog & landing pages: ISR-friendly short cache ─────────
      // s-maxage lets a CDN cache the HTML for 60 s; stale-while-revalidate
      // serves stale content while Next.js regenerates in the background.
      {
        source:
          "/(modular-homes|prefab-homes|barndominiums|cabins|modular-cabins|tiny-homes|house-kits|a-frames|commercial-modular-buildings|floor-plans|videos|blogs)(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
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
        statusCode: 301,
      },
      {
        source: "/commercial-buildings/",
        destination: "/commercial-modular-buildings",
        statusCode: 301,
      },
      {
        source: "/commercial-buildings/:path*",
        destination: "/commercial-modular-buildings/:path*",
        statusCode: 301,
      },
      {
        source: "/catalog",
        destination: "/buildings",
        statusCode: 301,
      },
      {
        source: "/models",
        destination: "/buildings",
        statusCode: 301,
      },
      {
        source: "/floorplans",
        destination: "/floor-plans",
        statusCode: 301,
      },
      {
        source: "/plans",
        destination: "/floor-plans",
        statusCode: 301,
      },
      {
        source: "/buildings/the-grey-haven-barndo-house-kit",
        destination: "/barndominiums/the-grey-haven-barndo-house-kit",
        statusCode: 301,
      },
      {
        source: "/buildings/the-farmhouse-charm-new-model",
        destination: "/modular-homes/the-farmhouse-charm-new-model",
        statusCode: 301,
      },
      {
        source: "/buildings/el-chapo-muchacho",
        destination: "/cabins/el-chapo-muchacho",
        statusCode: 301,
      },
      {
        source: "/buildings/the-grandview-two-story-modular-estate",
        destination: "/barndominiums/the-grandview-two-story-modular-estate",
        statusCode: 301,
      },
      // Discontinued Willow Brook Cabin Designs -> Category SEO Redirect (Permanent 301)
      {
        source: "/cabins/:slug(the-willow-brook.*)",
        destination: "/cabins",
        statusCode: 301,
      },
      {
        source: "/products/:slug(the-willow-brook.*)",
        destination: "/cabins",
        statusCode: 301,
      },
      // Discontinued Meadow Ridge ADU Designs -> Category SEO Redirect (Permanent 301)
      {
        source: "/adus/:slug(the-meadow-ridge.*)",
        destination: "/adus",
        statusCode: 301,
      },
      {
        source: "/adus/:slug(the-meadow-brook-adu.*)",
        destination: "/adus",
        statusCode: 301,
      },
      {
        source: "/cabins/:slug(the-meadow-ridge.*)",
        destination: "/adus",
        statusCode: 301,
      },
      {
        source: "/cabins/:slug(the-meadow-brook-adu.*)",
        destination: "/adus",
        statusCode: 301,
      },
      {
        source: "/products/:slug(the-meadow-ridge.*)",
        destination: "/adus",
        statusCode: 301,
      },
      {
        source: "/products/:slug(the-meadow-brook-adu.*)",
        destination: "/adus",
        statusCode: 301,
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