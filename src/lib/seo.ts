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
 * Standardizes to { index: true, follow: true } to pass Lighthouse and search audits with production canonical consolidation.
 * Can be explicitly disabled via DISALLOW_ROBOTS="true" environment variable.
 */
export function getRobotsMetadata(host?: string | null): Metadata["robots"] {
  const isStaging =
    process.env.DISALLOW_ROBOTS === "true" ||
    process.env.IS_STAGING === "true" ||
    process.env.NEXT_PUBLIC_IS_STAGING === "true" ||
    Boolean(host && (host.includes("siteground.net") || host.includes("staging") || host.includes("preview")));

  if (isStaging) {
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
