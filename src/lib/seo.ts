import { Metadata } from "next";

export const PRODUCTION_CANONICAL_HOST = "https://modularhome.com";

/**
 * Normalizes any relative or absolute path into a production canonical URL.
 * Guarantees https://modularhome.com origin without duplicate slashes.
 */
export function getCanonicalUrl(path: string = "/"): string {
  if (!path || path === "/" || path === "") {
    return PRODUCTION_CANONICAL_HOST;
  }
  let cleanPath = path.trim();
  // Strip any existing protocol/hostname if mistakenly passed
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    try {
      const u = new URL(cleanPath);
      cleanPath = u.pathname + u.search;
    } catch {}
  }
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }
  return `${PRODUCTION_CANONICAL_HOST}${cleanPath}`;
}

/**
 * Inspects a host string (from headers or env) and returns appropriate Robots metadata.
 * - If DISALLOW_ROBOTS="true" is set, enforces noindex, nofollow.
 * - If host or environment is a preview/staging environment (e.g. *.vercel.app, staging.*, or non-production hostname other than localhost),
 *   automatically enforces noindex, nofollow to protect staging environments from indexing.
 * - On production (modularhome.com), allows indexing: { index: true, follow: true }.
 */
export function getRobotsMetadata(host?: string | null): Metadata["robots"] {
  const isExplicitlyDisallowed = process.env.DISALLOW_ROBOTS === "true";
  const isVercelPreview = process.env.VERCEL_ENV === "preview";

  const rawHost = (host || "").trim().toLowerCase();
  const hostWithoutPort = rawHost.split(":")[0];

  const isProductionHost =
    hostWithoutPort === "modularhome.com" ||
    hostWithoutPort === "www.modularhome.com";

  const isLocalDev =
    hostWithoutPort === "localhost" ||
    hostWithoutPort === "127.0.0.1" ||
    hostWithoutPort === "";

  // Auto-detect staging / preview domains
  const isStaging =
    !isProductionHost &&
    !isLocalDev &&
    (hostWithoutPort.endsWith(".vercel.app") ||
      hostWithoutPort.includes("staging") ||
      hostWithoutPort.includes("preview") ||
      hostWithoutPort.includes("dev."));

  if (isExplicitlyDisallowed || isVercelPreview || isStaging) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}
