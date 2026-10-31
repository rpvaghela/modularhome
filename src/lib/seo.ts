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

export interface ProductFaqItem {
  q: string;
  a: string;
}

/**
 * Returns canonical, authoritative FAQs for any product model.
 * Used identically in Product Detail Client UI and JSON-LD FAQPage schemas.
 */
export function getProductFaqs(model: {
  name: string;
  category?: string;
  sqft?: number;
}): ProductFaqItem[] {
  const modelName = model?.name || "this model";
  const sizeDesc = model?.sqft && model.sqft > 0 ? ` (${model.sqft.toLocaleString()} sq ft)` : "";

  return [
    {
      q: `What is included in the base package for the ${modelName}?`,
      a: `The base package for the ${modelName}${sizeDesc} includes precision-welded structural framing, exterior sheathing, high-efficiency thermal insulation, factory-hung exterior doors, Low-E double pane insulated windows, and comprehensive pre-engineered architectural assembly blueprints certified for local building permitting.`,
    },
    {
      q: `What type of foundation does the ${modelName} require?`,
      a: `The ${modelName} can be permanently installed on multiple engineered foundation types depending on your site topography and soil test results, including reinforced concrete crawlspace stem walls, a full poured concrete basement, monolithic slab-on-grade, or engineered helical screw piers for sloped parcels.`,
    },
    {
      q: `Can the floor plan and interior layout of the ${modelName} be customized?`,
      a: `Yes. All ModularHome.com models can be customized. You can alter interior non-load-bearing partitions, adjust room dimensions, add covered porches, select kitchen cabinetry packages, upgrade fixtures, or add high-efficiency ductless mini-split heat pumps.`,
    },
    {
      q: `How long is the delivery timeline and factory build process for the ${modelName}?`,
      a: `Precision factory manufacturing typically takes 4 to 8 weeks once architectural engineering and local site permits are finalized. On-site delivery and crane installation onto your prepared foundation are typically completed in just 1 to 3 days.`,
    },
    {
      q: `Does the ${modelName} meet local building codes and qualify for a mortgage?`,
      a: `Yes. Every ${modelName} is built to meet or exceed the International Residential Code (IRC) and state modular building regulations. Because it is permanently affixed to an engineered foundation, it appraises as real property and qualifies for standard conventional mortgages, FHA, and VA construction-to-permanent financing.`,
    },
  ];
}
