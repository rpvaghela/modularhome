import type { MetadataRoute } from "next";
import { PRODUCTION_CANONICAL_HOST } from "@/lib/seo";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

/** Number of video URLs to include per sub-sitemap. Google allows up to 50,000. */
const CHUNK_SIZE = 1000;

/**
 * Tells Next.js how many sub-sitemaps to generate.
 * We query the live video count from Supabase; fallback to 21 chunks (covers 20,001 videos).
 * Each sitemap is served at /videos/sitemap/[id].xml and auto-indexed at /videos/sitemap.xml.
 */
export async function generateSitemaps() {
  let totalVideos = 20001; // safe fallback

  if (isSupabaseConfigured()) {
    try {
      const { count, error } = await supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .or("is_published.eq.true,is_published.is.null");

      if (!error && typeof count === "number" && count > 0) {
        totalVideos = count;
      }
    } catch {
      // use fallback
    }
  }

  const numChunks = Math.ceil(totalVideos / CHUNK_SIZE);
  return Array.from({ length: numChunks }, (_, i) => ({ id: i }));
}

/**
 * Generates a single paginated video sitemap for the given chunk id.
 * The `id` prop is a Promise<string> in Next.js v16+.
 */
export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const baseUrl = PRODUCTION_CANONICAL_HOST || "https://modularhome.com";

  const from = id * CHUNK_SIZE;
  const to = from + CHUNK_SIZE - 1;

  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from("videos")
      .select("slug, published_at")
      .or("is_published.eq.true,is_published.is.null")
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error || !Array.isArray(data)) return [];

    return data
      .filter((v) => v.slug && !v.slug.includes("<"))
      .map((v) => ({
        url: `${baseUrl}/videos/${v.slug}`,
        lastModified: v.published_at ? new Date(v.published_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}
