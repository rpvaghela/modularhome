import fs from "fs";
import path from "path";
import { VIDEOS, VideoItem } from "../data/videos";

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

export async function getBombShelterVideos(): Promise<VideoItem[]> {
  return readLocalVideos();
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
