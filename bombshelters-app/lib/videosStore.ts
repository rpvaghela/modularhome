import fs from "fs";
import path from "path";
import { VIDEOS, VideoItem } from "../data/videos";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";

export type { VideoItem };

const DATA_DIR = path.join(process.cwd(), "data");
const VIDEOS_FILE = path.join(DATA_DIR, "custom_videos.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

export function readLocalVideos(): VideoItem[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(VIDEOS_FILE)) {
      fs.writeFileSync(VIDEOS_FILE, JSON.stringify(VIDEOS, null, 2), "utf-8");
      return VIDEOS;
    }
    const data = fs.readFileSync(VIDEOS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : VIDEOS;
  } catch (error) {
    console.error("Error reading custom_videos.json:", error);
    return VIDEOS;
  }
}

export function writeLocalVideos(videos: VideoItem[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_videos.json:", error);
  }
}

/**
 * Fetch all published videos from Supabase database
 */
export async function getBombShelterVideos(limit = 60): Promise<VideoItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabaseAdmin || supabase)
        .from("videos")
        .select("id, youtube_video_id, slug, title, category, duration, description, thumbnail, video_url")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((v) => ({
          slug: v.slug || v.id,
          title: v.title,
          category: v.category || "Building Tours",
          duration: v.duration || "10:00",
          imageUrl: v.thumbnail || "/images/hillside-bunker.png",
          description: v.description || "",
          youtubeId: v.youtube_video_id || "dQw4w9WgXcQ",
        }));
      }
    } catch (e) {
      console.warn("Supabase videos fetch error, fallback to local:", e);
    }
  }

  return readLocalVideos();
}

/**
 * Get a single video by slug or youtube ID
 */
export async function getBombShelterVideoBySlug(slug: string): Promise<VideoItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabaseAdmin || supabase)
        .from("videos")
        .select("id, youtube_video_id, slug, title, category, duration, description, thumbnail, video_url")
        .or(`slug.eq.${slug},id.eq.${slug},youtube_video_id.eq.${slug}`)
        .maybeSingle();

      if (!error && data) {
        return {
          slug: data.slug || data.id,
          title: data.title,
          category: data.category || "Building Tours",
          duration: data.duration || "10:00",
          imageUrl: data.thumbnail || "/images/hillside-bunker.png",
          description: data.description || "",
          youtubeId: data.youtube_video_id || "dQw4w9WgXcQ",
        };
      }
    } catch (e) {
      console.warn("Supabase single video fetch error:", e);
    }
  }

  const all = await getBombShelterVideos();
  return all.find((v) => v.slug.toLowerCase() === slug.toLowerCase() || v.youtubeId === slug) || null;
}

export async function saveBombShelterVideo(video: VideoItem): Promise<VideoItem> {
  const list = readLocalVideos();
  const idx = list.findIndex((v) => v.slug === video.slug);
  if (idx !== -1) {
    list[idx] = video;
  } else {
    list.unshift(video);
  }
  writeLocalVideos(list);
  return video;
}

export async function deleteBombShelterVideo(slug: string): Promise<boolean> {
  const list = readLocalVideos();
  const filtered = list.filter((v) => v.slug !== slug);
  writeLocalVideos(filtered);
  return true;
}
