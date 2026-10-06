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
 * Preview hosts (vercel.app, sg-host.com, localhost) get { index: false, follow: false, nocache: true }.
 * Production (modularhome.com) gets { index: true, follow: true }.
 */
export function getRobotsMetadata(host?: string | null): Metadata["robots"] {
  if (!host) {
    return {
      index: true,
      follow: true,
    };
  }

  const cleanHost = host.toLowerCase().split(":")[0];
  const isPreview =
    cleanHost.includes("vercel.app") ||
    cleanHost.includes("sg-host.com") ||
    cleanHost.includes("localhost") ||
    cleanHost.includes("127.0.0.1");

  if (isPreview) {
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
    },
  };
}
