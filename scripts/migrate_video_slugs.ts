import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";
import { generateUniqueSlug } from "../src/lib/videoSlug";

async function main() {
  console.log("Starting video slug migration...");

  const syncedPath = path.join(__dirname, "..", "src", "data", "synced_videos.json");
  const redirectsPath = path.join(__dirname, "..", "src", "data", "shopify_redirects.json");

  const rawVideos = JSON.parse(fs.readFileSync(syncedPath, "utf-8"));
  console.log(`Loaded ${rawVideos.length} videos from synced_videos.json`);

  const existingSlugs = new Set<string>();
  const updatedVideos = [];
  const videoRedirects: Record<string, string> = {};

  for (const v of rawVideos) {
    const slug = generateUniqueSlug(v.title, v.youtubeVideoId, existingSlugs);
    existingSlugs.add(slug);

    const updated = {
      ...v,
      slug,
      updatedAt: v.updatedAt || new Date().toISOString(),
    };
    updatedVideos.push(updated);

    // Map 301 redirects for legacy URLs
    const ytId = v.youtubeVideoId;
    const targetUrl = `/videos/${slug}`;

    videoRedirects[`/videos/${ytId}`] = targetUrl;
    videoRedirects[`/videos/${ytId.toLowerCase()}`] = targetUrl;
    if (v.id && v.id !== ytId) {
      videoRedirects[`/videos/${v.id}`] = targetUrl;
      videoRedirects[`/videos/${v.id.toLowerCase()}`] = targetUrl;
    }
  }

  // 1. Write updated synced_videos.json
  fs.writeFileSync(syncedPath, JSON.stringify(updatedVideos, null, 2), "utf-8");
  console.log(`Saved ${updatedVideos.length} videos with slugs to synced_videos.json`);

  // 2. Merge into shopify_redirects.json
  const existingRedirects = JSON.parse(fs.readFileSync(redirectsPath, "utf-8"));
  const mergedRedirects = {
    ...existingRedirects,
    ...videoRedirects,
  };
  fs.writeFileSync(redirectsPath, JSON.stringify(mergedRedirects, null, 2), "utf-8");
  console.log(`Added ${Object.keys(videoRedirects).length} video 301 redirects to shopify_redirects.json`);

  // 3. Upsert into Supabase `videos` table
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Upserting into Supabase `videos` table...");

  const supabaseRows = updatedVideos.map((v) => ({
    id: v.id || `vid-${v.youtubeVideoId}`,
    youtube_video_id: v.youtubeVideoId,
    slug: v.slug,
    title: v.title,
    category: v.category || "Building Tours",
    duration: v.duration || "4:00",
    description: v.description || "",
    thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.youtubeVideoId}/hqdefault.jpg`,
    model_slug: v.modelSlug || null,
    views: v.views || "10K views",
    date: v.date || "Recent",
    published_at: v.publishedAt || new Date().toISOString(),
    youtube_url: v.youtubeUrl || `https://www.youtube.com/watch?v=${v.youtubeVideoId}`,
    embed_url: v.embedUrl || `https://www.youtube-nocookie.com/embed/${v.youtubeVideoId}`,
    video_url: v.videoUrl || `https://www.youtube-nocookie.com/embed/${v.youtubeVideoId}`,
    channel_id: v.channelId || "UCe8Cs76lnVixGuymeoyExKg",
    channel_title: v.channelTitle || "Amish Built Cabins, Modular Cabins, Modular Homes",
    is_published: v.isPublished !== false,
    created_at: v.createdAt || new Date().toISOString(),
    updated_at: v.updatedAt || new Date().toISOString(),
  }));

  // Batch in chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < supabaseRows.length; i += chunkSize) {
    const chunk = supabaseRows.slice(i, i + chunkSize);
    const { error } = await supabase.from("videos").upsert(chunk, {
      onConflict: "youtube_video_id",
    });
    if (error) {
      console.error(`Error upserting chunk ${i / chunkSize}:`, error);
    } else {
      console.log(`Upserted chunk ${i / chunkSize + 1} (${chunk.length} items)`);
    }
  }

  // 4. Verify count in Supabase
  const { count, error: countErr } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true });

  console.log(`Verification: Supabase videos count = ${count}, error =`, countErr);
  console.log("Video slug migration completed successfully!");
}

main().catch(console.error);
