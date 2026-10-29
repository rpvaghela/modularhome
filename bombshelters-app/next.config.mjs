/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
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
