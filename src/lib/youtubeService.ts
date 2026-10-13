import { VideoItem, YouTubeSyncResult, SyncStats } from "@/types/video";
import { batchUpsertVideos, readVideosFromStore, writeVideosToStore, saveSyncStats, upsertVideo } from "./videoStore";
import { slugifyVideoTitle } from "./videoSlug";

// Helper to convert ISO 8601 duration (e.g. PT5M12S) to seconds
export function parseISO8601DurationInSeconds(isoDuration: string): number {
  if (!isoDuration) return 0;
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

// Helper to convert ISO 8601 duration (e.g. PT5M12S) to human readable (5:12)
export function parseISO8601Duration(isoDuration: string): string {
  if (!isoDuration) return "0:00";
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return "0:00";

  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${minutes}:${formattedSeconds}`;
}

// Helper to detect if a video is a YouTube Short
export function isYouTubeShort(
  durationInSeconds: number,
  title?: string,
  description?: string,
  urlOrId?: string
): boolean {
  // If URL explicitly has /shorts/
  if (urlOrId && /youtube\.com\/shorts\//i.test(urlOrId)) {
    return true;
  }

  // Official YouTube Shorts are <= 60 seconds (or zero/missing duration flagged as non-main)
  if (durationInSeconds > 0 && durationInSeconds <= 60) {
    return true;
  }

  // Short duration tagged with #shorts
  const titleLower = (title || "").toLowerCase();
  const descLower = (description || "").toLowerCase();
  if (
    durationInSeconds <= 90 &&
    (titleLower.includes("#shorts") ||
      titleLower.includes("#short") ||
      descLower.includes("#shorts") ||
      descLower.includes("#short"))
  ) {
    return true;
  }

  return false;
}

// Known demo IDs to purge
export const KNOWN_DEMO_VIDEO_IDS = new Set([
  "dQw4w9WgXcQ",
  "L_LUpnjgPso",
  "4ie-LR2JDPE",
  "vid-1",
  "vid-2",
  "vid-3",
  "vid-4",
]);

// Helper to extract YouTube Video ID from any URL format
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already a clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex patterns for youtube URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function fetchYouTubeVideoByUrl(urlOrId: string): Promise<Partial<VideoItem> | null> {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) {
    throw new Error("Invalid YouTube URL or Video ID format.");
  }

  // Reject known demo IDs
  if (KNOWN_DEMO_VIDEO_IDS.has(videoId)) {
    throw new Error("Demo placeholder videos cannot be imported.");
  }

  // Reject explicit shorts URL
  if (/youtube\.com\/shorts\//i.test(urlOrId)) {
    throw new Error("YouTube Shorts are excluded. Please provide a full-length YouTube video URL.");
  }

  const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyDtb7876TeTWSXHH14xqH0QVir-rEYm6R0";

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not configured in environment.");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`YouTube API returned status ${res.status}`);
    }
    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      throw new Error(`No YouTube video found with ID ${videoId}`);
    }

    const item = data.items[0];
    const snippet = item.snippet;
    const contentDetails = item.contentDetails;
    const statistics = item.statistics;

    const durationSec = parseISO8601DurationInSeconds(contentDetails?.duration || "");
    if (isYouTubeShort(durationSec, snippet.title, snippet.description, urlOrId)) {
      throw new Error("This video is a YouTube Short (<= 60s). Only full-length main videos are supported.");
    }

    const thumbnail =
      snippet.thumbnails?.maxres?.url ||
      snippet.thumbnails?.standard?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const viewCount = statistics?.viewCount
      ? `${parseInt(statistics.viewCount, 10).toLocaleString()} views`
      : "10K views";

    return {
      youtubeVideoId: videoId,
      slug: slugifyVideoTitle(snippet.title || "YouTube Video", videoId),
      title: snippet.title || "YouTube Video",
      description: snippet.description || "",
      thumbnail,
      duration: parseISO8601Duration(contentDetails?.duration),
      publishedAt: snippet.publishedAt || new Date().toISOString(),
      views: viewCount,
      date: snippet.publishedAt
        ? new Date(snippet.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recent",
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      channelId: snippet.channelId,
      channelTitle: snippet.channelTitle,
      category: "Building Tours",
      isPublished: true,
    };
  } catch (err: any) {
    console.error("fetchYouTubeVideoByUrl error:", err);
    throw new Error(err.message || "Failed to fetch YouTube video metadata.");
  }
}

export function inferVideoCategory(title: string = "", description: string = ""): string {
  const content = `${title} ${description}`.toLowerCase();
  if (content.includes("barndo") || content.includes("barndominium") || content.includes("pole barn")) {
    return "Barndominiums";
  }
  if (content.includes("a-frame") || content.includes("aframe")) {
    return "A-Frames";
  }
  if (content.includes("tiny") || content.includes("park model") || content.includes("granny pod")) {
    return "Tiny Homes";
  }
  if (content.includes("cabin") || content.includes("lodge") || content.includes("rustic") || content.includes("log")) {
    return "Prefab Cabins";
  }
  if (content.includes("modular") || content.includes("residence") || content.includes("prefab home")) {
    return "Modular Homes";
  }
  return "Building Tours";
}

export async function syncYouTubeChannel(options?: {
  customChannelId?: string;
  maxPages?: number;
  pageToken?: string;
  includeAllHistorical?: boolean;
  skipFileWrite?: boolean;
}): Promise<YouTubeSyncResult> {
  const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyDtb7876TeTWSXHH14xqH0QVir-rEYm6R0";
  const channelId = options?.customChannelId || process.env.YOUTUBE_CHANNEL_ID || "UCe8Cs76lnVixGuymeoyExKg";
  const maxPagesToFetch = options?.maxPages && options.maxPages > 0 ? options.maxPages : 10;
  const includeAllHistorical = options?.includeAllHistorical ?? true;

  if (!apiKey || !channelId) {
    throw new Error("YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID must be configured in environment variables.");
  }

  try {
    // 1. Get channel uploads playlist ID
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    if (!channelRes.ok) {
      throw new Error(`YouTube Channel API returned ${channelRes.status}`);
    }
    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error(`YouTube channel with ID ${channelId} not found.`);
    }

    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error(`Uploads playlist not found for channel ${channelId}`);
    }

    // 2. Fetch playlist items across pages with configurable depth and pagination token
    let allPlaylistItems: any[] = [];
    let pageToken = options?.pageToken || "";
    let lastNextPageToken: string | null = null;

    for (let page = 0; page < maxPagesToFetch; page++) {
      const pageParam = pageToken ? `&pageToken=${pageToken}` : "";
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50${pageParam}&key=${apiKey}`;
      const playlistRes = await fetch(playlistUrl);
      if (!playlistRes.ok) {
        break;
      }
      const playlistData = await playlistRes.json();
      if (!playlistData.items || playlistData.items.length === 0) {
        break;
      }
      allPlaylistItems.push(...playlistData.items);
      lastNextPageToken = playlistData.nextPageToken || null;
      pageToken = playlistData.nextPageToken || "";
      if (!pageToken) break;
    }

    if (allPlaylistItems.length === 0) {
      const currentVideos = readVideosFromStore();
      const stats: SyncStats = {
        lastSyncAt: new Date().toISOString(),
        totalFound: currentVideos.length,
        newVideosAdded: 0,
        updatedVideos: 0,
        status: "success",
      };
      saveSyncStats(stats);
      return {
        success: true,
        message: "No videos found in channel uploads playlist.",
        checkedCount: 0,
        newVideosCount: 0,
        updatedVideosCount: 0,
        stats,
        nextPageToken: lastNextPageToken,
        hasMore: false,
      };
    }

    const videoIds = allPlaylistItems
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean);

    // 3. Batch fetch detailed metadata (durations, statistics, maxres thumbnails) in chunks of 50
    let detailedItems: any[] = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      const batchIds = videoIds.slice(i, i + 50).join(",");
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${batchIds}&key=${apiKey}`;
      const videosRes = await fetch(videosUrl);
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        if (videosData.items) {
          detailedItems.push(...videosData.items);
        }
      }
    }

    // 4. Map videos with category inference and metadata
    const mainVideos: Partial<VideoItem>[] = [];

    for (const item of detailedItems) {
      const vId = item.id;
      const snippet = item.snippet;
      const contentDetails = item.contentDetails;
      const statistics = item.statistics;

      // Exclude known demo IDs
      if (KNOWN_DEMO_VIDEO_IDS.has(vId)) {
        continue;
      }

      // Check duration and shorts indicators only if NOT importing full historical archive
      const durationSec = parseISO8601DurationInSeconds(contentDetails?.duration || "");
      if (!includeAllHistorical && isYouTubeShort(durationSec, snippet?.title, snippet?.description)) {
        // Skip shorts only if strict non-historical mode requested
        continue;
      }

      const thumbnail =
        snippet?.thumbnails?.maxres?.url ||
        snippet?.thumbnails?.standard?.url ||
        snippet?.thumbnails?.high?.url ||
        snippet?.thumbnails?.medium?.url ||
        `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;

      const viewCount = statistics?.viewCount
        ? `${parseInt(statistics.viewCount, 10).toLocaleString()} views`
        : "Recent Tour";

      const title = snippet?.title || "Modular Home & Cabin Tour";
      const description = snippet?.description || "";
      const category = inferVideoCategory(title, description);

      mainVideos.push({
        youtubeVideoId: vId,
        title,
        description,
        thumbnail,
        duration: parseISO8601Duration(contentDetails?.duration) || (durationSec > 0 ? `${Math.floor(durationSec / 60)}:${(durationSec % 60).toString().padStart(2, "0")}` : "4:00"),
        publishedAt: snippet?.publishedAt || new Date().toISOString(),
        views: viewCount,
        date: snippet?.publishedAt
          ? new Date(snippet.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recent",
        youtubeUrl: `https://www.youtube.com/watch?v=${vId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${vId}`,
        videoUrl: `https://www.youtube-nocookie.com/embed/${vId}`,
        channelId: snippet?.channelId || channelId,
        channelTitle: snippet?.channelTitle || "Amish Built Cabins, Modular Cabins, Modular Homes",
        category,
        isPublished: true,
      });
    }

    // 5. Clean existing store: Remove demo IDs
    const existingStore = readVideosFromStore();
    const cleanedStore = existingStore.filter((v) => {
      if (KNOWN_DEMO_VIDEO_IDS.has(v.youtubeVideoId) || KNOWN_DEMO_VIDEO_IDS.has(v.id)) {
        return false;
      }
      return true;
    });

    if (!options?.skipFileWrite) {
      writeVideosToStore(cleanedStore);
    }

    // 6. Upsert the genuine videos
    const { newCount, updatedCount } = await batchUpsertVideos(mainVideos, { skipFileWrite: options?.skipFileWrite });
    const finalStored = readVideosFromStore();

    const stats: SyncStats = {
      lastSyncAt: new Date().toISOString(),
      totalFound: finalStored.length,
      newVideosAdded: newCount,
      updatedVideos: updatedCount,
      status: "success",
    };
    saveSyncStats(stats);

    return {
      success: true,
      message: `Successfully synchronized ${mainVideos.length} videos from YouTube channel.`,
      checkedCount: detailedItems.length,
      newVideosCount: newCount,
      updatedVideosCount: updatedCount,
      stats,
      nextPageToken: lastNextPageToken,
      hasMore: Boolean(lastNextPageToken),
    };
  } catch (err: any) {
    console.error("YouTube Channel Sync Failed:", err);
    const stats: SyncStats = {
      lastSyncAt: new Date().toISOString(),
      totalFound: readVideosFromStore().length,
      newVideosAdded: 0,
      updatedVideos: 0,
      status: "error",
      errorMessage: err.message || "Network error while connecting to YouTube API",
    };
    saveSyncStats(stats);

    return {
      success: false,
      message: err.message || "Failed to synchronize YouTube channel.",
      checkedCount: 0,
      newVideosCount: 0,
      updatedVideosCount: 0,
      stats,
      errors: [err.message || "YouTube API Error"],
    };
  }
}
