"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Clock, Eye } from "lucide-react";
import { VideoItem } from "@/data/videos";
import { slugifyVideoTitle } from "@/lib/videoSlug";
import ShareButton from "@/components/ShareButton";

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
  dark?: boolean;
}

export default function VideoCard({ video, onPlay, dark = false }: VideoCardProps) {
  const videoSlug = (video as any).slug || slugifyVideoTitle(video.title, video.youtubeVideoId);
  const videoUrl = `/videos/${videoSlug}`;
  const canonicalVideoUrl = `https://modularhome.com/videos/${videoSlug}`;

  const shareItem = {
    title: `${video.title} | ModularHome.com Video Tour`,
    url: canonicalVideoUrl,
    description: video.description || `Watch the official video tour of ${video.title} on ModularHome.com`,
    image: video.thumbnail,
    category: video.category,
  };

  return (
    <div
      className={`group flex flex-col rounded-[18px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        dark
          ? "bg-[#181a1f] border border-white/10 hover:border-[var(--r)]"
          : "bg-white border border-[var(--line)] hover:border-[var(--r)]"
      }`}
    >
      {/* Thumbnail Viewport (Crawlable Link with inline play button) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
        <Link href={videoUrl} className="block absolute inset-0 z-0" aria-label={`View ${video.title} video tour`}>
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />
        </Link>

        {/* Play Button Overlay (triggers inline modal player) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPlay(video);
            }}
            aria-label={`Play ${video.title} in popup`}
            className="pointer-events-auto cursor-pointer w-13 h-13 rounded-full bg-[var(--r)] hover:bg-[var(--r-dark)] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
          >
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-black/70 backdrop-blur-md text-white rounded-full">
            {video.category}
          </span>
        </div>

        {/* Share Button (Top-Right Overlay) */}
        <div className="absolute top-3 right-3 z-20">
          <ShareButton
            item={shareItem}
            variant="icon"
            buttonTitle="Share video tour"
            modalTitle="Share Video Tour"
            modalSubtitle="Share this video tour with canonical ModularHome.com SEO link"
            className="!w-7.5 !h-7.5 !rounded-full !bg-black/70 hover:!bg-[var(--r)] !text-white !border-0 backdrop-blur-md transition-all shadow-md"
            iconClassName="w-3.5 h-3.5"
          />
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-black/70 text-white rounded-full backdrop-blur-xs pointer-events-none z-10">
          <Clock className="w-3 h-3 text-[var(--r)]" />
          <span>{video.duration}</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-tight line-clamp-2 font-display">
            <Link
              href={videoUrl}
              className={`transition-colors hover:text-[var(--r)] ${
                dark ? "text-white" : "text-[var(--ink)]"
              }`}
            >
              {video.title}
            </Link>
          </h3>
          <p
            className={`text-xs line-clamp-2 mt-1.5 leading-relaxed font-body ${
              dark ? "text-white/70" : "text-[var(--muted)]"
            }`}
          >
            {video.description}
          </p>
        </div>

        <div
          className={`pt-3 border-t flex items-center justify-between text-[11px] ${
            dark ? "border-white/10 text-white/60" : "border-[var(--line)] text-[var(--muted)]"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[var(--r)]" />
            {video.views}
          </span>
          <div className="flex items-center gap-2.5">
            <span>{video.date}</span>
            <ShareButton
              item={shareItem}
              variant="badge"
              label="Share"
              buttonTitle="Share video"
              modalTitle="Share Video Tour"
              modalSubtitle="Share this video tour with canonical ModularHome.com SEO link"
              className={`!px-2 !py-0.5 !text-[10px] !font-bold ${
                dark
                  ? "!bg-white/10 hover:!bg-[var(--r)] !text-white"
                  : "!bg-stone-100 hover:!bg-[var(--r)] hover:!text-white !text-stone-700"
              }`}
              iconClassName="w-3 h-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
