/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
        hostname: "*.bombshelters.com",
      },
      {
        protocol: "https",
        hostname: "bombshelters.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: "/api/bombshelter/admin/:path*",
      },
      {
        source: "/products/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/buildings/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/cabins/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/modular-homes/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/barndominiums/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/house-kits/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/tiny-homes/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/adus/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/a-frame-homes/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/prefab-homes/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/park-models/:slug",
        destination: "/models/:slug",
      },
      {
        source: "/commercial-modular-buildings/:slug",
        destination: "/models/:slug",
      },
    ];
  },
};

export default nextConfig;
