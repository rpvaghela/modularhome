import { MetadataRoute } from "next";
import { PRODUCTION_CANONICAL_HOST } from "@/lib/seo";
import { CATEGORIES } from "@/data/models";
import ALL_PRODUCTS_CATALOG from "@/data/all_products_catalog.json";
import ALL_COLLECTIONS_DATA from "@/data/all_collections.json";
import { getProductUrl } from "@/utils/productUrls";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { US_STATES_LOCATIONS } from "@/lib/locationData";
import { getPublicBlogs } from "@/lib/publicData";

export const dynamic = "force-dynamic";

/** Stable site release date for static pages to avoid fluctuating lastmod on every request */
const STABLE_SITE_DATE = new Date("2026-10-15T00:00:00.000Z");

function parseValidDate(dateVal?: any): Date | undefined {
  if (!dateVal) return undefined;
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) return d;
  } catch {}
  return undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = PRODUCTION_CANONICAL_HOST || "https://modularhome.com";

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buildings`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/all`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/modular-homes`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/floor-plans`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/upload-floor-plan`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blogs/modular-cabins`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/modular-construction`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/modular-homes-prefab-homes`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/financing`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/warranty`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reports/website-implementation-qa-2026`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-cancellation-policy`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-delivery-policy`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Price-point & utility landing pages (QA requirement #14)
    {
      url: `${baseUrl}/modular-homes-under-100k`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/modular-storage`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>(staticRoutes.map((r) => r.url));

  // 2. Canonical Category Landing Pages (e.g. /barndominiums, /cabins, /modular-homes)
  CATEGORIES.forEach((cat) => {
    const slug = cat.href ? cat.href.replace(/^\//, "") : cat.id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const catUrl = `${baseUrl}/${slug}`;
    if (!seenUrls.has(catUrl)) {
      seenUrls.add(catUrl);
      dynamicRoutes.push({
        url: catUrl,
        lastModified: STABLE_SITE_DATE,
        changeFrequency: "daily",
        priority: 0.9,
      });
    }
  });

  // 3. Video pages are covered by the dedicated paginated sitemap index at
  //    /videos/sitemap.xml (and sub-sitemaps /videos/sitemap/[id].xml via src/app/videos/sitemap.ts),
  //    which exposes all 20,504 video watch pages without duplicates.

  // 4. Products with Canonical SEO Category Paths (e.g. /cabins/el-chapo-muchacho)
  if (Array.isArray(ALL_PRODUCTS_CATALOG)) {
    ALL_PRODUCTS_CATALOG.forEach((p: any) => {
      const slug = p.slug || p.handle;
      if (!slug || slug.includes("<")) return;
      const path = getProductUrl(p);
      const fullUrl = `${baseUrl}${path}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        const lastMod = parseValidDate(p.updated_at || p.published_at || p.created_at);
        dynamicRoutes.push({
          url: fullUrl,
          ...(lastMod ? { lastModified: lastMod } : {}),
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    });
  }

  // 5. Blog Posts & Articles (/blogs/[category]/[slug]) - Includes all published articles (migrated + database)
  const allArticles = await getPublicBlogs();
  if (Array.isArray(allArticles)) {
    allArticles.forEach((art: any) => {
      const slug = art.slug || art.handle;
      if (slug && !slug.includes("<")) {
        const cat = (art.category_slug || art.category || art.blog_title || "modular-construction")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^blogs-/, "");
        const fullUrl = `${baseUrl}/blogs/${cat}/${slug}`;
        if (!seenUrls.has(fullUrl)) {
          seenUrls.add(fullUrl);
          const lastMod = parseValidDate(art.published_at || art.publishedAt || art.updated_at || art.updatedAt || art.date);
          dynamicRoutes.push({
            url: fullUrl,
            ...(lastMod ? { lastModified: lastMod } : {}),
            changeFrequency: "weekly",
            priority: 0.75,
          });
        }
      }
    });
  }

  // 6. Location-Based SEO Landing Pages (e.g. /modular-homes-in-texas, /barndominiums-in-florida)
  Object.keys(US_STATES_LOCATIONS).forEach((stateKey) => {
    const locRoutes = [
      `modular-homes-in-${stateKey}`,
      `prefab-homes-in-${stateKey}`,
      `barndominiums-in-${stateKey}`,
      `cabins-in-${stateKey}`,
    ];

    locRoutes.forEach((routeSlug) => {
      const fullUrl = `${baseUrl}/${routeSlug}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        dynamicRoutes.push({
          url: fullUrl,
          lastModified: STABLE_SITE_DATE,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    });
  });

  // 7. Floor Plans from Supabase (excluding archived test floor plans)
  if (isSupabaseConfigured()) {
    try {
      const { data: dbPlans } = await supabase
        .from("floor_plans")
        .select("slug, updated_at")
        .eq("status", "PUBLISHED");

      if (dbPlans && dbPlans.length > 0) {
        dbPlans.forEach((fp: { slug: string; updated_at?: string }) => {
          if (!fp.slug || fp.slug === "floor") return;
          const fpUrl = `${baseUrl}/floor-plans/${fp.slug}`;
          if (!seenUrls.has(fpUrl)) {
            seenUrls.add(fpUrl);
            const lastMod = parseValidDate(fp.updated_at);
            dynamicRoutes.push({
              url: fpUrl,
              ...(lastMod ? { lastModified: lastMod } : {}),
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        });
      }
    } catch {
      // offline fallback handled by local catalog
    }
  }

  // 8. Curated Architectural Collections (/collections/[slug])
  if (Array.isArray(ALL_COLLECTIONS_DATA)) {
    ALL_COLLECTIONS_DATA.forEach((col: any) => {
      const slug = col.handle || col.slug;
      if (!slug || slug === "all" || slug.includes("<")) return;
      const fullUrl = `${baseUrl}/collections/${slug}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        const lastMod = parseValidDate(col.updated_at || col.published_at);
        dynamicRoutes.push({
          url: fullUrl,
          ...(lastMod ? { lastModified: lastMod } : {}),
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    });
  }

  return [...staticRoutes, ...dynamicRoutes];
}
