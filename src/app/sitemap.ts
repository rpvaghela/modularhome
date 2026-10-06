import { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PRODUCTION_CANONICAL_HOST } from "@/lib/seo";
import { CATEGORIES } from "@/data/models";
import { RESOURCE_ARTICLES } from "@/data/resources";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = PRODUCTION_CANONICAL_HOST;
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
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
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
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>(staticRoutes.map((r) => r.url));

  if (isSupabaseConfigured()) {
    try {
      // 1. Products (/products/[handle])
      const { data: products } = await supabase
        .from("products")
        .select("handle, updated_at, status")
        .or("status.eq.active,status.is.null")
        .limit(2000);

      if (products && products.length > 0) {
        products.forEach((p: { handle?: string; updated_at?: string }) => {
          if (p.handle) {
            const productUrl = `${baseUrl}/products/${p.handle}`;
            if (!seenUrls.has(productUrl)) {
              seenUrls.add(productUrl);
              dynamicRoutes.push({
                url: productUrl,
                lastModified: p.updated_at ? new Date(p.updated_at) : now,
                changeFrequency: "weekly",
                priority: 0.85,
              });
            }
          }
        });
      }

      // 2. Collections (/collections/[handle])
      const { data: collections } = await supabase
        .from("collections")
        .select("handle, updated_at, published")
        .eq("published", true);

      if (collections && collections.length > 0) {
        collections.forEach((c: { handle?: string; updated_at?: string }) => {
          if (c.handle) {
            const colUrl = `${baseUrl}/collections/${c.handle}`;
            if (!seenUrls.has(colUrl)) {
              seenUrls.add(colUrl);
              dynamicRoutes.push({
                url: colUrl,
                lastModified: c.updated_at ? new Date(c.updated_at) : now,
                changeFrequency: "weekly",
                priority: 0.85,
              });
            }
          }
        });
      }

      // 3. Floor Plans (/floor-plans/[slug])
      const { data: floorPlans } = await supabase
        .from("floor_plans")
        .select("slug, updated_at")
        .eq("status", "PUBLISHED");

      if (floorPlans && floorPlans.length > 0) {
        floorPlans.forEach((fp: { slug: string; updated_at?: string }) => {
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

      // 4. Blog Posts & Articles (/blogs/[blog]/[article])
      const { data: blogPosts } = await supabase
        .from("blog_posts")
        .select("handle, blog_title, updated_at, status")
        .or("status.eq.active,status.is.null")
        .limit(1000);

      if (blogPosts && blogPosts.length > 0) {
        blogPosts.forEach((b: { handle?: string; blog_title?: string; updated_at?: string }) => {
          if (b.handle) {
            const blogCategory = (b.blog_title || "news").toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const blogUrl = `${baseUrl}/blogs/${blogCategory}/${b.handle}`;
            if (!seenUrls.has(blogUrl)) {
              seenUrls.add(blogUrl);
              dynamicRoutes.push({
                url: blogUrl,
                lastModified: b.updated_at ? new Date(b.updated_at) : now,
                changeFrequency: "weekly",
                priority: 0.75,
              });
            }
          }
        });
      }

      // 5. CMS Pages (/pages/[handle])
      const { data: pages } = await supabase
        .from("pages")
        .select("handle, slug, updated_at, status")
        .or("status.eq.active,status.is.null");

      if (pages && pages.length > 0) {
        pages.forEach((page: { handle?: string; slug?: string; updated_at?: string }) => {
          const handle = page.handle || page.slug;
          if (handle && handle !== "home" && handle !== "buildings" && handle !== "about" && handle !== "contact") {
            const pageUrl = `${baseUrl}/pages/${handle}`;
            if (!seenUrls.has(pageUrl)) {
              seenUrls.add(pageUrl);
              dynamicRoutes.push({
                url: pageUrl,
                lastModified: page.updated_at ? new Date(page.updated_at) : now,
                changeFrequency: "monthly",
                priority: 0.6,
              });
            }
          }
        });
      }
    } catch (e) {
      console.error("Error fetching live dynamic sitemap rows from Supabase:", e);
    }
  }

  // Fallback routes from local data if database had offline records
  if (dynamicRoutes.length === 0) {
    CATEGORIES.forEach((cat) => {
      const slug = cat.id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const url = `${baseUrl}/collections/${slug}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        dynamicRoutes.push({
          url,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });

    RESOURCE_ARTICLES.forEach((art) => {
      const blogCat = (art.category || "news").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const url = `${baseUrl}/blogs/${blogCat}/${art.slug}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        dynamicRoutes.push({
          url,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.75,
        });
      }
    });
  }

  return [...staticRoutes, ...dynamicRoutes];
}
