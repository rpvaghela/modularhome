import { MetadataRoute } from "next";
import { PRODUCTION_CANONICAL_HOST } from "@/lib/seo";
import { CATEGORIES } from "@/data/models";
import ALL_PRODUCTS_CATALOG from "@/data/all_products_catalog.json";
import ALL_COLLECTIONS_DATA from "@/data/all_collections.json";
import MIGRATED_ARTICLES from "@/data/migrated_articles.json";
import { getProductUrl } from "@/utils/productUrls";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { US_STATES_LOCATIONS } from "@/lib/locationData";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = PRODUCTION_CANONICAL_HOST || "https://modularhome.com";
  const now = new Date();

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buildings`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/all`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/modular-homes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/floor-plans`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/upload-floor-plan`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blogs/modular-cabins`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/modular-construction`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs/modular-homes-prefab-homes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/financing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/warranty`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-cancellation-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-delivery-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Price-point & utility landing pages (QA requirement #14)
    {
      url: `${baseUrl}/modular-homes-under-100k`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/modular-storage`,
      lastModified: now,
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
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      });
    }
  });

  // 3. Video pages are covered by the dedicated paginated sitemap at
  //    /videos/sitemap/[id].xml (src/app/videos/sitemap.ts) via generateSitemaps(),
  //    which exposes all 20,001 video pages across ~21 sub-sitemaps without Supabase's
  //    1,000-row cap. Do NOT add video URLs here to avoid duplicates.

  // 4. Products with Canonical SEO Category Paths (e.g. /cabins/el-chapo-muchacho)
  if (Array.isArray(ALL_PRODUCTS_CATALOG)) {
    ALL_PRODUCTS_CATALOG.forEach((p: any) => {
      const slug = p.slug || p.handle;
      if (!slug || slug.includes("<")) return;
      const path = getProductUrl(p);
      const fullUrl = `${baseUrl}${path}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        dynamicRoutes.push({
          url: fullUrl,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    });
  }

  // 4. Blog Posts & Articles (/blogs/[category]/[slug])
  if (Array.isArray(MIGRATED_ARTICLES)) {
    MIGRATED_ARTICLES.forEach((art: any) => {
      const slug = art.handle || art.slug;
      if (slug) {
        const cat = (art.category_slug || art.blog_title || art.category || "modular-construction")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^blogs-/, "");
        const fullUrl = `${baseUrl}/blogs/${cat}/${slug}`;
        if (!seenUrls.has(fullUrl)) {
          seenUrls.add(fullUrl);
          dynamicRoutes.push({
            url: fullUrl,
            lastModified: art.published_at ? new Date(art.published_at) : now,
            changeFrequency: "weekly",
            priority: 0.75,
          });
        }
      }
    });
  }

  // 5. Location-Based SEO Landing Pages (e.g. /modular-homes-in-texas, /barndominiums-in-florida)
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
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    });
  });

  // 6. Try live database updates from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: dbPlans } = await supabase
        .from("floor_plans")
        .select("slug, updated_at")
        .eq("status", "PUBLISHED");

      if (dbPlans && dbPlans.length > 0) {
        dbPlans.forEach((fp: { slug: string; updated_at?: string }) => {
          const fpUrl = `${baseUrl}/floor-plans/${fp.slug}`;
          if (!seenUrls.has(fpUrl)) {
            seenUrls.add(fpUrl);
            dynamicRoutes.push({
              url: fpUrl,
              lastModified: fp.updated_at ? new Date(fp.updated_at) : now,
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        });
      }
    } catch (e) {
      // offline fallback handled by local catalog
    }
  }

  // 7. Curated Architectural Collections from Book1.xlsx (/collections/[slug])
  if (Array.isArray(ALL_COLLECTIONS_DATA)) {
    ALL_COLLECTIONS_DATA.forEach((col: any) => {
      const slug = col.handle || col.slug;
      if (!slug || slug === "all") return;
      const fullUrl = `${baseUrl}/collections/${slug}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        dynamicRoutes.push({
          url: fullUrl,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    });
  }

  return [...staticRoutes, ...dynamicRoutes];
}
