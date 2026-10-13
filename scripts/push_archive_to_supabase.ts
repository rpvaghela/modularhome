/**
 * High-Speed Archive Uploader to Supabase
 * Reads all synced videos from src/data/synced_videos.json
 * and batch upserts them directly into Supabase PostgreSQL `videos` table.
 */

import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "../src/lib/supabase";
import { VideoItem } from "../src/types/video";

async function pushArchiveToSupabase() {
  console.log("==================================================================");
  console.log("🚀 PUSHING HISTORICAL YOUTUBE ARCHIVE TO SUPABASE");
  console.log("==================================================================");

  if (!isSupabaseConfigured()) {
    console.error("❌ Supabase is not configured or live credentials missing.");
    process.exit(1);
  }

  const jsonPath = path.join(process.cwd(), "src", "data", "synced_videos.json");
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ ${jsonPath} does not exist!`);
    process.exit(1);
  }

  console.log("📖 Reading JSON archive from disk...");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const videos: VideoItem[] = JSON.parse(raw);
  console.log(`📊 Found ${videos.length.toLocaleString()} videos in archive file.`);

  const records = videos.map((v) => ({
    id: v.id,
    youtube_video_id: v.youtubeVideoId,
    slug: v.slug,
    title: v.title,
    category: v.category,
    duration: v.duration,
    description: v.description,
    thumbnail: v.thumbnail,
    model_slug: v.modelSlug || null,
    views: v.views,
    date: v.date,
    published_at: v.publishedAt,
    youtube_url: v.youtubeUrl,
    embed_url: v.embedUrl,
    video_url: v.videoUrl,
    channel_id: v.channelId,
    channel_title: v.channelTitle,
    is_published: v.isPublished !== false,
    created_at: v.createdAt || new Date().toISOString(),
    updated_at: v.updatedAt || new Date().toISOString(),
  }));

  const CHUNK_SIZE = 250;
  const totalChunks = Math.ceil(records.length / CHUNK_SIZE);
  console.log(`📦 Upserting in ${totalChunks} chunks of ${CHUNK_SIZE} records...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunkIndex = Math.floor(i / CHUNK_SIZE) + 1;
    const chunk = records.slice(i, i + CHUNK_SIZE);

    try {
      const { error } = await supabaseAdmin
        .from("videos")
        .upsert(chunk, { onConflict: "youtube_video_id" });

      if (error) {
        console.error(`❌ Chunk ${chunkIndex}/${totalChunks} error:`, error.message);
        failCount += chunk.length;
      } else {
        successCount += chunk.length;
        if (chunkIndex % 10 === 0 || chunkIndex === totalChunks) {
          console.log(`✅ Progress: Chunk ${chunkIndex}/${totalChunks} upserted (${successCount.toLocaleString()}/${records.length.toLocaleString()} records)`);
        }
      }
    } catch (e: any) {
      console.error(`❌ Chunk ${chunkIndex} unexpected error:`, e.message);
      failCount += chunk.length;
    }
  }

  // Check final count in database
  const countRes = await supabaseAdmin.from("videos").select("id", { count: "exact" }).limit(1);
  console.log("==================================================================");
  console.log(`🎉 COMPLETED ARCHIVE UPLOAD!`);
  console.log(`   Successfully processed: ${successCount.toLocaleString()} records`);
  console.log(`   Failed records: ${failCount}`);
  console.log(`   Verified Supabase 'videos' row count: ${(countRes.count ?? 0).toLocaleString()}`);
  console.log("==================================================================");
}

pushArchiveToSupabase().catch(console.error);
