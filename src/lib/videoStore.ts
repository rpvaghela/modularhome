import { VideoItem, SyncStats } from "@/types/video";
import { VIDEOS_DATA } from "@/data/videos";
import syncedVideosFallback from "@/data/synced_videos.json";
import syncStatsFallback from "@/data/sync_stats.json";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { slugifyVideoTitle, generateUniqueSlug } from "./videoSlug";

let fs: any = null;
let path: any = null;

if (typeof window === "undefined") {
  try {
    fs = require("fs");
    path = require("path");
  } catch {}
}

const DATA_DIR = path ? path.join(process.cwd(), "src", "data") : "";
const FILE_PATH = path ? path.join(DATA_DIR, "synced_videos.json") : "";
const STATS_FILE_PATH = path ? path.join(DATA_DIR, "sync_stats.json") : "";
const REDIRECTS_FILE_PATH = path ? path.join(DATA_DIR, "shopify_redirects.json") : "";

// In-memory cache
let memoryVideosCache: VideoItem[] | null = null;
let memoryStatsCache: SyncStats | null = null;

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Expected on read-only serverless filesystems (e.g., Vercel AWS Lambda)
  }
}

export function normalizeVideo(v: any): VideoItem {
  const ytId =
    v.youtubeVideoId ||
    v.youtube_video_id ||
    (v.id && !v.id.startsWith("vid-") ? v.id : v.id ? v.id.replace("vid-", "") : "MHWHDE87Pp4");
  const embed = v.embedUrl || v.embed_url || `https://www.youtube-nocookie.com/embed/${ytId}`;
  const title = v.title || "Modular Home & Cabin Tour";
  const slug = v.slug || slugifyVideoTitle(title, ytId);

  return {
    id: v.id || `vid-${ytId}`,
    youtubeVideoId: ytId,
    slug,
    title,
    category: v.category || "Building Tours",
    duration: v.duration || "4:00",
    description: v.description || "",
    thumbnail: v.thumbnail || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    modelSlug: v.modelSlug || v.model_slug,
    views: v.views || "10K views",
    date: v.date || "Recent",
    publishedAt: v.publishedAt || v.published_at || new Date().toISOString(),
    youtubeUrl: v.youtubeUrl || v.youtube_url || `https://www.youtube.com/watch?v=${ytId}`,
    embedUrl: embed,
    videoUrl: v.videoUrl || v.video_url || embed,
    channelId: v.channelId || v.channel_id || "UCe8Cs76lnVixGuymeoyExKg",
    channelTitle: v.channelTitle || v.channel_title || "Amish Built Cabins, Modular Cabins, Modular Homes",
    isPublished: v.isPublished !== undefined ? v.isPublished : v.is_published !== false,
    createdAt: v.createdAt || v.created_at || new Date().toISOString(),
    updatedAt: v.updatedAt || v.updated_at || new Date().toISOString(),
  };
}

export function readVideosFromStore(): VideoItem[] {
  if (memoryVideosCache) {
    return memoryVideosCache;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryVideosCache = parsed.map(normalizeVideo);
        return memoryVideosCache;
      }
    }
  } catch (error) {
    // Silently fallback to bundled static data on read errors
  }

  if (Array.isArray(syncedVideosFallback) && syncedVideosFallback.length > 0) {
    const normalized = (syncedVideosFallback as any[]).map(normalizeVideo);
    memoryVideosCache = normalized;
    return normalized;
  }

  const normalizedSeeds = VIDEOS_DATA.map(normalizeVideo);
  memoryVideosCache = normalizedSeeds;
  return normalizedSeeds;
}

export function writeVideosToStore(videos: VideoItem[]): void {
  memoryVideosCache = videos;
  try {
    ensureDataDirectory();
    fs.writeFileSync(FILE_PATH, JSON.stringify(videos, null, 2), "utf-8");
  } catch (error) {
    // In Vercel serverless environment, local writes fail gracefully without crashing
  }
}

export function readSyncStats(): SyncStats {
  if (memoryStatsCache) return memoryStatsCache;

  try {
    ensureDataDirectory();
    if (fs.existsSync(STATS_FILE_PATH)) {
      const data = fs.readFileSync(STATS_FILE_PATH, "utf-8");
      memoryStatsCache = JSON.parse(data);
      return memoryStatsCache!;
    }
  } catch (error) {}

  if (syncStatsFallback) {
    memoryStatsCache = (syncStatsFallback as unknown) as SyncStats;
    return memoryStatsCache;
  }

  const defaultStats: SyncStats = {
    lastSyncAt: new Date().toISOString(),
    totalFound: VIDEOS_DATA.length,
    newVideosAdded: 0,
    updatedVideos: 0,
    status: "success",
  };
  memoryStatsCache = defaultStats;
  return defaultStats;
}

export function saveSyncStats(stats: SyncStats): void {
  memoryStatsCache = stats;
  try {
    ensureDataDirectory();
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(stats, null, 2), "utf-8");
  } catch (error) {}

  if (isSupabaseConfigured()) {
    (async () => {
      try {
        const { data: curr } = await supabaseAdmin
          .from("global_settings")
          .select("custom_scripts")
          .eq("id", "primary")
          .maybeSingle();

        const existingScripts = curr?.custom_scripts || {};
        await supabaseAdmin
          .from("global_settings")
          .update({
            custom_scripts: {
              ...existingScripts,
              video_sync_stats: stats,
            },
          })
          .eq("id", "primary");
      } catch (e) {
        console.error("Failed to persist sync stats to global_settings:", e);
      }
    })();
  }
}

export function getPublishedVideos(params?: { category?: string; search?: string }): VideoItem[] {
  const videos = readVideosFromStore();
  let result = videos.filter((v) => v.isPublished !== false);

  if (params?.category && params.category !== "All" && params.category !== "ALL") {
    result = result.filter(
      (v) => (v.category || "").toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.description || "").toLowerCase().includes(q) ||
        (v.category || "").toLowerCase().includes(q)
    );
  }

  // Sort newest first
  return result.sort(
    (a, b) => new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime()
  );
}

export function getAllVideos(params?: { category?: string; search?: string }): VideoItem[] {
  const videos = readVideosFromStore();
  let result = [...videos];

  if (params?.category && params.category !== "All" && params.category !== "ALL") {
    result = result.filter(
      (v) => (v.category || "").toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.description || "").toLowerCase().includes(q)
    );
  }

  return result.sort(
    (a, b) => new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime()
  );
}

export function getVideoSlug(video: VideoItem, allVideos?: VideoItem[]): string {
  if (!video) return "";
  if (video.slug && video.slug.trim()) return video.slug.trim();
  return slugifyVideoTitle(video.title, video.youtubeVideoId);
}

export async function getVideoByIdOrSlug(idOrSlug: string): Promise<VideoItem | null> {
  if (!idOrSlug) return null;
  const videos = readVideosFromStore();
  const raw = decodeURIComponent(idOrSlug).trim();
  const lower = raw.toLowerCase().replace(/^vid-/, "");

  // 1. Exact slug match in memory (primary for SEO URLs)
  const slugMatch = videos.find(
    (v) => (v.slug || "").toLowerCase() === raw.toLowerCase() || (v.slug || "").toLowerCase() === lower
  );
  if (slugMatch) return slugMatch;

  // 2. Direct ID / YouTube ID match in memory
  const directMatch = videos.find(
    (v) =>
      v.id.toLowerCase() === `vid-${lower}` ||
      v.id.toLowerCase() === lower ||
      v.youtubeVideoId.toLowerCase() === lower ||
      (v.modelSlug && v.modelSlug.toLowerCase() === lower)
  );
  if (directMatch) return directMatch;

  // 3. Query Supabase directly (ensures admin edits on Vercel reflect immediately on public site)
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("videos")
        .select("*")
        .or(`slug.ilike.${raw},slug.ilike.${lower},youtube_video_id.eq.${raw},youtube_video_id.ilike.${lower},id.eq.${raw},id.ilike.vid-${lower}`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const normalized = normalizeVideo(data[0]);
        if (memoryVideosCache) {
          const idx = memoryVideosCache.findIndex((v) => v.youtubeVideoId === normalized.youtubeVideoId);
          if (idx >= 0) memoryVideosCache[idx] = normalized;
          else memoryVideosCache.unshift(normalized);
        }
        return normalized;
      }

      // Check redirects table in Supabase for previous slugs
      const { data: redirData } = await supabaseAdmin
        .from("redirects")
        .select("to_path")
        .or(`from_path.eq./videos/${raw},from_path.ilike./videos/${lower}`)
        .limit(1);

      if (redirData && redirData.length > 0 && redirData[0].to_path) {
        const targetSlug = redirData[0].to_path.replace(/^\/videos\//i, "");
        if (targetSlug && targetSlug.toLowerCase() !== lower && targetSlug.toLowerCase() !== raw.toLowerCase()) {
          return getVideoByIdOrSlug(targetSlug);
        }
      }
    } catch (e) {
      console.error("getVideoByIdOrSlug Supabase query error:", e);
    }
  }

  // 4. Match by computed video slug in memory
  for (const v of videos) {
    if (getVideoSlug(v, videos).toLowerCase() === lower) {
      return v;
    }
  }

  // 5. Fallback normalized title match
  return (
    videos.find((v) => {
      const titleSlug = slugifyVideoTitle(v.title, v.youtubeVideoId);
      return titleSlug === lower || lower.startsWith(titleSlug);
    }) || null
  );
}

export function upsertVideo(videoData: Partial<VideoItem> & { youtubeVideoId: string }): {
  video: VideoItem;
  isNew: boolean;
} {
  const videos = readVideosFromStore();
  const existingIdx = videos.findIndex((v) => v.youtubeVideoId === videoData.youtubeVideoId);
  const now = new Date().toISOString();

  let finalVideo: VideoItem;
  let isNew = false;

  if (existingIdx >= 0) {
    const existing = videos[existingIdx];
    const slug =
      videoData.slug ||
      existing.slug ||
      slugifyVideoTitle(videoData.title || existing.title, videoData.youtubeVideoId);

    finalVideo = normalizeVideo({
      ...existing,
      ...videoData,
      slug,
      updatedAt: now,
    });
    videos[existingIdx] = finalVideo;
    isNew = false;
  } else {
    const existingSlugs = new Set<string>(
      videos.map((v) => v.slug).filter((s): s is string => typeof s === "string" && s.length > 0)
    );
    const slug =
      videoData.slug ||
      generateUniqueSlug(
        videoData.title || "Untitled Cabin Video",
        videoData.youtubeVideoId,
        existingSlugs
      );

    finalVideo = normalizeVideo({
      id: `vid-${videoData.youtubeVideoId}`,
      youtubeVideoId: videoData.youtubeVideoId,
      slug,
      title: videoData.title || "Untitled Cabin Video",
      category: videoData.category || "Building Tours",
      duration: videoData.duration || "4:00",
      description: videoData.description || "",
      thumbnail: videoData.thumbnail || `https://img.youtube.com/vi/${videoData.youtubeVideoId}/hqdefault.jpg`,
      views: videoData.views || "New Upload",
      date: videoData.date || "Just now",
      publishedAt: videoData.publishedAt || now,
      youtubeUrl: videoData.youtubeUrl || `https://www.youtube.com/watch?v=${videoData.youtubeVideoId}`,
      embedUrl: videoData.embedUrl || `https://www.youtube-nocookie.com/embed/${videoData.youtubeVideoId}`,
      videoUrl: videoData.videoUrl || `https://www.youtube-nocookie.com/embed/${videoData.youtubeVideoId}`,
      channelId: videoData.channelId || "UCe8Cs76lnVixGuymeoyExKg",
      channelTitle: videoData.channelTitle || "Amish Built Cabins, Modular Cabins, Modular Homes",
      isPublished: videoData.isPublished !== undefined ? videoData.isPublished : true,
      createdAt: now,
      updatedAt: now,
    });
    videos.unshift(finalVideo);
    isNew = true;
  }

  writeVideosToStore(videos);

  // Maintain permanent 301 legacy redirects in local file
  try {
    if (fs && fs.existsSync(REDIRECTS_FILE_PATH)) {
      const redirects = JSON.parse(fs.readFileSync(REDIRECTS_FILE_PATH, "utf-8"));
      const targetUrl = `/videos/${finalVideo.slug}`;
      redirects[`/videos/${finalVideo.youtubeVideoId}`] = targetUrl;
      redirects[`/videos/${finalVideo.youtubeVideoId.toLowerCase()}`] = targetUrl;
      fs.writeFileSync(REDIRECTS_FILE_PATH, JSON.stringify(redirects, null, 2), "utf-8");
    }
  } catch (e) {}

  // Sync to Supabase `videos` and `redirects` table
  if (isSupabaseConfigured()) {
    (async () => {
      try {
        await supabaseAdmin.from("videos").upsert(
          {
            id: finalVideo.id,
            youtube_video_id: finalVideo.youtubeVideoId,
            slug: finalVideo.slug,
            title: finalVideo.title,
            category: finalVideo.category,
            duration: finalVideo.duration,
            description: finalVideo.description,
            thumbnail: finalVideo.thumbnail,
            model_slug: finalVideo.modelSlug || null,
            views: finalVideo.views,
            date: finalVideo.date,
            published_at: finalVideo.publishedAt,
            youtube_url: finalVideo.youtubeUrl,
            embed_url: finalVideo.embedUrl,
            video_url: finalVideo.videoUrl,
            channel_id: finalVideo.channelId,
            channel_title: finalVideo.channelTitle,
            is_published: finalVideo.isPublished,
            created_at: finalVideo.createdAt,
            updated_at: finalVideo.updatedAt,
          },
          { onConflict: "youtube_video_id" }
        );

        // Ensure 301 redirects are in Supabase redirects table
        const targetUrl = `/videos/${finalVideo.slug}`;
        await supabaseAdmin.from("redirects").upsert(
          [
            {
              from_path: `/videos/${finalVideo.youtubeVideoId}`,
              to_path: targetUrl,
              http_status: 301,
              source: "video_sync",
            },
            {
              from_path: `/videos/${finalVideo.youtubeVideoId.toLowerCase()}`,
              to_path: targetUrl,
              http_status: 301,
              source: "video_sync",
            },
          ],
          { onConflict: "from_path" }
        );
      } catch (e) {
        console.error("upsertVideo Supabase sync error:", e);
      }
    })();
  }

  return { video: finalVideo, isNew };
}

export async function updateVideoSlug(
  id: string,
  newSlug: string
): Promise<{ success: boolean; message: string; video?: VideoItem }> {
  const videos = readVideosFromStore();
  let idx = videos.findIndex((v) => v.id === id || v.youtubeVideoId === id || v.slug === id);
  let targetVideo = idx >= 0 ? videos[idx] : null;

  // If not found in memory, check Supabase
  if (!targetVideo && isSupabaseConfigured()) {
    try {
      const { data } = await supabaseAdmin
        .from("videos")
        .select("*")
        .or(`id.eq.${id},youtube_video_id.eq.${id},slug.eq.${id}`)
        .maybeSingle();
      if (data) {
        targetVideo = normalizeVideo(data);
      }
    } catch (e) {}
  }

  if (!targetVideo) {
    return { success: false, message: "Video not found" };
  }

  const cleanSlug = newSlug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleanSlug || cleanSlug.length < 2) {
    return { success: false, message: "Slug must contain at least 2 characters (letters, numbers, hyphens)." };
  }

  // Check uniqueness across other videos in memory
  const existing = videos.find((v) => v.youtubeVideoId !== targetVideo!.youtubeVideoId && v.slug && v.slug.toLowerCase() === cleanSlug);
  if (existing) {
    return { success: false, message: `Slug '${cleanSlug}' is already taken by another video.` };
  }

  // Check uniqueness across Supabase
  if (isSupabaseConfigured()) {
    try {
      const { data: dbConflict } = await supabaseAdmin
        .from("videos")
        .select("id")
        .ilike("slug", cleanSlug)
        .neq("youtube_video_id", targetVideo.youtubeVideoId)
        .limit(1);
      if (dbConflict && dbConflict.length > 0) {
        return { success: false, message: `Slug '${cleanSlug}' is already taken by another video in database.` };
      }
    } catch (e) {}
  }

  const oldSlug = targetVideo.slug;
  const now = new Date().toISOString();
  targetVideo.slug = cleanSlug;
  targetVideo.updatedAt = now;

  if (idx >= 0) {
    videos[idx] = targetVideo;
  } else {
    videos.unshift(targetVideo);
  }
  writeVideosToStore(videos);

  // Synchronously update Supabase `videos` table and `redirects` table
  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin
        .from("videos")
        .update({ slug: cleanSlug, updated_at: now })
        .or(`id.eq.${targetVideo.id},youtube_video_id.eq.${targetVideo.youtubeVideoId}`);

      const newTarget = `/videos/${cleanSlug}`;

      // 1. Delete/remove any existing redirect rule whose source (from_path) is the new slug
      // This prevents infinite redirect loops when changing a slug back to a previous value
      await supabaseAdmin
        .from("redirects")
        .delete()
        .or(`from_path.ilike./videos/${cleanSlug},from_path.eq./videos/${cleanSlug}`);

      // 2. Flatten older redirects pointing to the previous slug -> point them directly to newTarget (eliminates 2-hop chains)
      if (oldSlug && oldSlug.toLowerCase() !== cleanSlug.toLowerCase()) {
        await supabaseAdmin
          .from("redirects")
          .update({ to_path: newTarget })
          .or(`to_path.ilike./videos/${oldSlug},to_path.eq./videos/${oldSlug}`);
      }

      // 3. Upsert new direct 301 redirects for previous slug and YouTube ID
      const redirectsToUpsert: any[] = [];

      if (oldSlug && oldSlug.toLowerCase() !== cleanSlug.toLowerCase()) {
        redirectsToUpsert.push({
          from_path: `/videos/${oldSlug}`,
          to_path: newTarget,
          http_status: 301,
          source: "video_slug_update",
        });
        if (oldSlug !== oldSlug.toLowerCase()) {
          redirectsToUpsert.push({
            from_path: `/videos/${oldSlug.toLowerCase()}`,
            to_path: newTarget,
            http_status: 301,
            source: "video_slug_update",
          });
        }
      }

      redirectsToUpsert.push({
        from_path: `/videos/${targetVideo.youtubeVideoId}`,
        to_path: newTarget,
        http_status: 301,
        source: "video_slug_update",
      });
      if (targetVideo.youtubeVideoId !== targetVideo.youtubeVideoId.toLowerCase()) {
        redirectsToUpsert.push({
          from_path: `/videos/${targetVideo.youtubeVideoId.toLowerCase()}`,
          to_path: newTarget,
          http_status: 301,
          source: "video_slug_update",
        });
      }

      for (const r of redirectsToUpsert) {
        await supabaseAdmin.from("redirects").upsert(r, { onConflict: "from_path" });
      }
    } catch (e) {
      console.error("updateVideoSlug Supabase update error:", e);
    }
  }

  // Update local file redirects if writable
  try {
    if (fs && fs.existsSync(REDIRECTS_FILE_PATH)) {
      const redirects = JSON.parse(fs.readFileSync(REDIRECTS_FILE_PATH, "utf-8"));
      const newTarget = `/videos/${cleanSlug}`;

      // Remove any redirect rule whose from_path matches the new slug
      delete redirects[`/videos/${cleanSlug}`];
      delete redirects[`/videos/${cleanSlug.toLowerCase()}`];

      // Flatten existing entries pointing to oldSlug
      if (oldSlug && oldSlug.toLowerCase() !== cleanSlug.toLowerCase()) {
        for (const k of Object.keys(redirects)) {
          if (redirects[k]?.toLowerCase() === `/videos/${oldSlug.toLowerCase()}`) {
            redirects[k] = newTarget;
          }
        }
        redirects[`/videos/${oldSlug}`] = newTarget;
        redirects[`/videos/${oldSlug.toLowerCase()}`] = newTarget;
      }

      redirects[`/videos/${targetVideo.youtubeVideoId}`] = newTarget;
      redirects[`/videos/${targetVideo.youtubeVideoId.toLowerCase()}`] = newTarget;
      fs.writeFileSync(REDIRECTS_FILE_PATH, JSON.stringify(redirects, null, 2), "utf-8");
    }
  } catch (e) {}

  // Revalidate Next.js cache so the public page is updated immediately
  try {
    const { revalidatePath } = require("next/cache");
    revalidatePath("/videos");
    revalidatePath(`/videos/${cleanSlug}`);
    if (oldSlug) revalidatePath(`/videos/${oldSlug}`);
    revalidatePath("/sitemap.xml");
  } catch (e) {}

  return { success: true, message: "Slug updated successfully", video: targetVideo };
}

export async function batchUpsertVideos(videosData: Partial<VideoItem>[]): Promise<{
  newCount: number;
  updatedCount: number;
}> {
  const videos = readVideosFromStore();
  const now = new Date().toISOString();
  let newCount = 0;
  let updatedCount = 0;
  const toUpsertDb: any[] = [];
  const redirectsToUpsert: any[] = [];

  const existingSlugs = new Set<string>(
    videos.map((v) => v.slug).filter((s): s is string => typeof s === "string" && s.length > 0)
  );

  for (const item of videosData) {
    if (!item.youtubeVideoId) continue;
    const existingIdx = videos.findIndex((v) => v.youtubeVideoId === item.youtubeVideoId);
    let finalVideo: VideoItem;

    if (existingIdx >= 0) {
      const existing = videos[existingIdx];
      const slug =
        item.slug ||
        existing.slug ||
        slugifyVideoTitle(item.title || existing.title, item.youtubeVideoId);

      finalVideo = normalizeVideo({
        ...existing,
        ...item,
        slug,
        updatedAt: now,
      });
      videos[existingIdx] = finalVideo;
      updatedCount++;
    } else {
      const slug =
        item.slug ||
        generateUniqueSlug(
          item.title || "Untitled Cabin Video",
          item.youtubeVideoId,
          existingSlugs
        );
      existingSlugs.add(slug);

      finalVideo = normalizeVideo({
        id: `vid-${item.youtubeVideoId}`,
        youtubeVideoId: item.youtubeVideoId,
        slug,
        title: item.title || "Untitled Cabin Video",
        category: item.category || "Building Tours",
        duration: item.duration || "4:00",
        description: item.description || "",
        thumbnail: item.thumbnail || `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`,
        views: item.views || "New Upload",
        date: item.date || "Just now",
        publishedAt: item.publishedAt || now,
        youtubeUrl: item.youtubeUrl || `https://www.youtube.com/watch?v=${item.youtubeVideoId}`,
        embedUrl: item.embedUrl || `https://www.youtube-nocookie.com/embed/${item.youtubeVideoId}`,
        videoUrl: item.videoUrl || `https://www.youtube-nocookie.com/embed/${item.youtubeVideoId}`,
        channelId: item.channelId || "UCe8Cs76lnVixGuymeoyExKg",
        channelTitle: item.channelTitle || "Amish Built Cabins, Modular Cabins, Modular Homes",
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
        createdAt: now,
        updatedAt: now,
      });
      videos.unshift(finalVideo);
      newCount++;
    }

    toUpsertDb.push({
      id: finalVideo.id,
      youtube_video_id: finalVideo.youtubeVideoId,
      slug: finalVideo.slug,
      title: finalVideo.title,
      category: finalVideo.category,
      duration: finalVideo.duration,
      description: finalVideo.description,
      thumbnail: finalVideo.thumbnail,
      model_slug: finalVideo.modelSlug || null,
      views: finalVideo.views,
      date: finalVideo.date,
      published_at: finalVideo.publishedAt,
      youtube_url: finalVideo.youtubeUrl,
      embed_url: finalVideo.embedUrl,
      video_url: finalVideo.videoUrl,
      channel_id: finalVideo.channelId,
      channel_title: finalVideo.channelTitle,
      is_published: finalVideo.isPublished,
      created_at: finalVideo.createdAt,
      updated_at: finalVideo.updatedAt,
    });

    const targetUrl = `/videos/${finalVideo.slug}`;
    redirectsToUpsert.push({
      from_path: `/videos/${finalVideo.youtubeVideoId}`,
      to_path: targetUrl,
      http_status: 301,
      source: "video_sync",
    });
    redirectsToUpsert.push({
      from_path: `/videos/${finalVideo.youtubeVideoId.toLowerCase()}`,
      to_path: targetUrl,
      http_status: 301,
      source: "video_sync",
    });
  }

  writeVideosToStore(videos);

  // Batch upsert to Supabase
  if (isSupabaseConfigured() && toUpsertDb.length > 0) {
    try {
      for (let i = 0; i < toUpsertDb.length; i += 50) {
        const chunk = toUpsertDb.slice(i, i + 50);
        await supabaseAdmin.from("videos").upsert(chunk, { onConflict: "youtube_video_id" });
      }
      for (let i = 0; i < redirectsToUpsert.length; i += 50) {
        const chunk = redirectsToUpsert.slice(i, i + 50);
        await supabaseAdmin.from("redirects").upsert(chunk, { onConflict: "from_path" });
      }
    } catch (e) {
      console.error("Batch upsert Supabase error:", e);
    }
  }

  // Update local file redirects if writable
  try {
    if (fs && fs.existsSync(REDIRECTS_FILE_PATH)) {
      const redirects = JSON.parse(fs.readFileSync(REDIRECTS_FILE_PATH, "utf-8"));
      for (const r of redirectsToUpsert) {
        redirects[r.from_path] = r.to_path;
      }
      fs.writeFileSync(REDIRECTS_FILE_PATH, JSON.stringify(redirects, null, 2), "utf-8");
    }
  } catch (e) {}

  return { newCount, updatedCount };
}

export function updateVideoCategory(id: string, category: VideoItem["category"]): boolean {
  const videos = readVideosFromStore();
  const idx = videos.findIndex((v) => v.id === id || v.youtubeVideoId === id);
  if (idx < 0) return false;
  videos[idx].category = category;
  videos[idx].updatedAt = new Date().toISOString();
  writeVideosToStore(videos);

  if (isSupabaseConfigured()) {
    (async () => {
      try {
        await supabaseAdmin
          .from("videos")
          .update({ category, updated_at: videos[idx].updatedAt })
          .eq("id", videos[idx].id);
      } catch (e) {}
    })();
  }

  return true;
}

export function toggleVideoPublish(id: string, isPublished?: boolean): boolean {
  const videos = readVideosFromStore();
  const idx = videos.findIndex((v) => v.id === id || v.youtubeVideoId === id);
  if (idx < 0) return false;
  videos[idx].isPublished = isPublished !== undefined ? isPublished : !videos[idx].isPublished;
  videos[idx].updatedAt = new Date().toISOString();
  writeVideosToStore(videos);

  if (isSupabaseConfigured()) {
    (async () => {
      try {
        await supabaseAdmin
          .from("videos")
          .update({ is_published: videos[idx].isPublished, updated_at: videos[idx].updatedAt })
          .eq("id", videos[idx].id);
      } catch (e) {}
    })();
  }

  return true;
}

export function deleteLocalVideo(id: string): boolean {
  const videos = readVideosFromStore();
  const filtered = videos.filter((v) => v.id !== id && v.youtubeVideoId !== id);
  if (filtered.length === videos.length) return false;
  writeVideosToStore(filtered);

  if (isSupabaseConfigured()) {
    (async () => {
      try {
        await supabaseAdmin
          .from("videos")
          .delete()
          .or(`id.eq.${id},youtube_video_id.eq.${id}`);
      } catch (e) {}
    })();
  }

  return true;
}
