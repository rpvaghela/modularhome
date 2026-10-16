import { MetadataRoute } from "next";
import { PRODUCTION_CANONICAL_HOST } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = PRODUCTION_CANONICAL_HOST;

  // Staging & Preview Environments: Disallow all crawlers
  if (process.env.DISALLOW_ROBOTS === "true" || process.env.VERCEL_ENV === "preview") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"],
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/signup",
          "/login",
          "/verify-email",
          "/auth/callback",
          "/account",
          "/account/*",
          "/api/customer/*",
          "/admin",
          "/admin/*",
          "/api/admin",
          "/api/admin/*",
          "/checkout/*",
          "/api/payments/*",
          "/api/downloads/*",
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/videos/sitemap.xml`,
    ],
  };
}
