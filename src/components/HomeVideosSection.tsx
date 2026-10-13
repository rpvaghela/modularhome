"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import VideoModal from "@/components/VideoModal";
import { VideoItem, VIDEOS_DATA } from "@/data/videos";
import { Play, ArrowRight } from "lucide-react";

interface HomeVideosSectionProps {
  videos?: VideoItem[];
  totalCount?: number;
}

function cleanVideoTitle(rawTitle: string): string {
  let clean = rawTitle
    .replace(/#\w+/g, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]|\(.*?\)/g, "")
    .replace(/\|\s*Amish Built.*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean || clean.length < 5) {
    return "Amish Built Modular Home & Cabin Tour";
  }

  // If the title is just lowercase tags or all uppercase, clean and title-case it
  if (clean === clean.toUpperCase() || clean === clean.toLowerCase()) {
    clean = clean
      .toLowerCase()
      .split(" ")
      .map((w) => {
        if (w === "logcabins") return "Log Cabins";
        if (w === "modularcabins") return "Modular Cabins";
        if (w === "loghomes") return "Log Homes";
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(" ");
  }

  return clean;
}

export default function HomeVideosSection({ videos, totalCount }: HomeVideosSectionProps) {
  const [videoList, setVideoList] = useState<VideoItem[]>(videos && videos.length > 0 ? videos : VIDEOS_DATA);
  const [totalVideosCount, setTotalVideosCount] = useState<number>(totalCount ?? (videos?.length || VIDEOS_DATA.length));
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Sync state if server props change
  useEffect(() => {
    if (videos && videos.length > 0) {
      setVideoList(videos);
    }
    if (typeof totalCount === "number") {
      setTotalVideosCount(totalCount);
    }
  }, [videos, totalCount]);

  // Client-side fallback fetch only if no server videos were supplied
  useEffect(() => {
    if (videos && videos.length > 0) {
      return;
    }
    let isMounted = true;
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos?limit=8");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.videos) && data.videos.length > 0) {
            setVideoList(data.videos);
            if (typeof data.totalCount === "number") {
              setTotalVideosCount(data.totalCount);
            }
          }
        }
      } catch (e) {
        // Fallback to initial VIDEOS_DATA
      }
    }
    loadVideos();
    return () => {
      isMounted = false;
    };
  }, [videos]);

  // Filter 8 distinct videos for a clean 2x4 grid
  const distinctVideos: VideoItem[] = [];
  const seenTitles = new Set<string>();

  for (const v of videoList) {
    const cleaned = cleanVideoTitle(v.title);
    if (!seenTitles.has(cleaned) && distinctVideos.length < 8) {
      seenTitles.add(cleaned);
      distinctVideos.push({
        ...v,
        title: cleaned,
      });
    }
  }

  const displayVideos = distinctVideos.length > 0 ? distinctVideos : videoList.slice(0, 8);

  if (displayVideos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-10 sm:py-16 bg-[#f6f7f9] font-sans">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8 font-sans">
            <div>
              <div className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#d97706] mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fcb907] animate-pulse"></span>
                <span>Factory &amp; Architectural Tours</span>
              </div>
              <h2 className="font-sans text-2xl sm:text-4xl font-black tracking-[-1.2px] text-[#101114] m-0">
                Watch Our Home Tours
              </h2>
              <p className="font-sans text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0 font-medium">
                Take a virtual tour of modular homes, steel framing, crane deliveries, and luxury interiors.
              </p>
            </div>
            <Link
              href="/videos"
              className="font-sans text-[#d97706] hover:text-[#b45309] font-black text-xs sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1 group"
            >
              <span>View All Videos ({totalVideosCount.toLocaleString()})</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* 2x4 Video Grid (8 Cards Total) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5 font-sans">
            {displayVideos.map((vid) => (
              <div
                key={vid.id || vid.youtubeVideoId}
                onClick={() => setSelectedVideo(vid)}
                className="group rounded-2xl bg-white border border-gray-200/90 hover:border-[#fcb907] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 flex flex-col justify-between cursor-pointer block relative"
              >
                {/* Thumbnail Container */}
                <div className="relative h-[155px] xs:h-[170px] sm:h-[185px] w-full overflow-hidden bg-black">
                  <Image
                    src={vid.thumbnail}
                    alt={vid.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Centered Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-115 group-hover:bg-[#e5a706]">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  {vid.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-xs text-[#fcb907] rounded-full shadow-xs">
                        {vid.category}
                      </span>
                    </div>
                  )}

                  {/* Duration Badge */}
                  {vid.duration && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-black/75 backdrop-blur-xs text-white rounded-full shadow-xs">
                        {vid.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 font-sans flex-1 flex flex-col justify-between">
                  <h3 className="font-sans text-xs sm:text-[13.5px] font-black text-[#101114] group-hover:text-[#b45309] transition-colors leading-snug line-clamp-2 min-h-[38px] sm:min-h-[42px] m-0">
                    {vid.title}
                  </h3>
                  <div className="pt-2">
                    <span className="font-sans text-[11.5px] font-black text-[#d97706] group-hover:text-[#b45309] inline-flex items-center gap-1.5 transition-colors">
                      <span>Watch Video Tour</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  );
}

