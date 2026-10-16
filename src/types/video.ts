export type VideoCategory = 
  | "Building Tours" 
  | "Construction" 
  | "Delivery" 
  | "Interior" 
  | "Customer Stories" 
  | "Barndominiums" 
  | "Modular Homes"
  | "Prefab Cabins"
  | "Tiny Homes"
  | "A-Frames"
  | "Shorts"
  | "General";

export interface VideoItem {
  id: string; // Internal unique ID or youtubeVideoId
  youtubeVideoId: string;
  slug?: string; // Unique SEO-friendly URL slug derived from title
  title: string;
  category: VideoCategory | string;
  duration: string;
  description: string;
  thumbnail: string;
  modelSlug?: string;
  views: string;
  date: string;
  publishedAt?: string;
  youtubeUrl?: string;
  embedUrl?: string;
  videoUrl?: string;
  channelId?: string;
  channelTitle?: string;
  isPublished?: boolean;
  isShort?: boolean; // Indicates if this is a YouTube Short (<= 60s / shorts format)
  createdAt?: string;
  updatedAt?: string;
}

export interface SyncStats {
  lastSyncAt: string | null;
  totalFound: number;
  newVideosAdded: number;
  updatedVideos: number;
  status: "success" | "error" | "never";
  errorMessage?: string;
}

export interface AutoSyncConfig {
  enabled: boolean;
  intervalMinutes: number; // e.g., 15, 30, 60, 120, 360, 1440
  syncShorts: boolean;
  syncScope: "latest" | "full";
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastRunStatus: "success" | "error" | "never" | "running";
  lastRunMessage?: string;
  history?: Array<{
    executedAt: string;
    newVideos: number;
    updatedVideos: number;
    status: "success" | "error";
  }>;
}

export interface YouTubeSyncResult {
  success: boolean;
  message: string;
  checkedCount: number;
  newVideosCount: number;
  updatedVideosCount: number;
  stats: SyncStats;
  autoSync?: AutoSyncConfig;
  nextPageToken?: string | null;
  hasMore?: boolean;
  errors?: string[];
}
