import { NextResponse } from "next/server";
import { PRODUCTION_CANONICAL_HOST } from "@/lib/seo";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24 hours

const CHUNK_SIZE = 1000;

export async function GET() {
  const baseUrl = PRODUCTION_CANONICAL_HOST || "https://modularhome.com";
  let totalVideos = 20000;

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
      // fallback to safe count
    }
  }

  const numChunks = Math.max(1, Math.ceil(totalVideos / CHUNK_SIZE));
  const nowIso = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (let i = 0; i < numChunks; i++) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${baseUrl}/videos/sitemap/${i}.xml</loc>\n`;
    xml += `    <lastmod>${nowIso}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
