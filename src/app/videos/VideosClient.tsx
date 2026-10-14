"use client";

import { useState, useEffect, useMemo, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Film } from "lucide-react";
import Link from "next/link";
import { VIDEO_CATEGORIES } from "@/data/videos";
import { VideoItem } from "@/types/video";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { CmsPage } from "@/lib/publicData";

interface VideosClientProps {
  pageData?: CmsPage | null;
  initialVideos?: VideoItem[];
  initialTotalCount?: number;
  initialPage?: number;
  initialTotalPages?: number;
  initialCategory?: string;
  initialSearchQuery?: string;
  initialCategoryCounts?: Record<string, number>;
}

const ITEMS_PER_PAGE = 12;

export default function VideosClient({
  pageData,
  initialVideos = [],
  initialTotalCount = 0,
  initialPage = 1,
  initialTotalPages = 1,
  initialCategory = "All",
  initialSearchQuery = "",
  initialCategoryCounts = {},
}: VideosClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Active video for the popup video player modal
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Local state for debounced search input typing
  const [searchInput, setSearchInput] = useState<string>(initialSearchQuery);
  const [jumpPageInput, setJumpPageInput] = useState<string>("");

  const gridRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize local search input when server props change
  useEffect(() => {
    setSearchInput(initialSearchQuery);
  }, [initialSearchQuery]);

  // Clean navigation helper using React 19 transition to prevent unmounted updates
  const navigateTo = (newCategory: string, newPage: number, newQuery: string) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== "All") params.set("category", newCategory);
    if (newPage > 1) params.set("page", newPage.toString());
    if (newQuery.trim()) params.set("q", newQuery.trim());
    const qs = params.toString();
    const targetUrl = qs ? `${pathname}?${qs}` : pathname;

    startTransition(() => {
      router.push(targetUrl, { scroll: false });
    });

    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategoryChange = (cat: string) => {
    navigateTo(cat, 1, searchInput);
  };

  const handleSearchChange = (query: string) => {
    setSearchInput(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      navigateTo(initialCategory, 1, query);
    }, 400);
  };

  const handleJumpToPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput.trim(), 10);
    if (!isNaN(p) && p >= 1 && p <= initialTotalPages) {
      navigateTo(initialCategory, p, searchInput);
      setJumpPageInput("");
    }
  };

  const safePage = Math.min(Math.max(1, initialPage), initialTotalPages);

  // Generate numbered pages array with responsive windowing
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (initialTotalPages <= 7) {
      for (let i = 1; i <= initialTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 4) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(initialTotalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < initialTotalPages - 3) pages.push("...");
      pages.push(initialTotalPages);
    }
    return pages;
  }, [initialTotalPages, safePage]);

  // Video Gallery Title
  const heroTitle =
    pageData?.title && pageData.title !== "Video Gallery & Home Tours"
      ? pageData.title
      : "Modular Home & Prefab Home Video Tours";
  const heroSubtitle =
    pageData?.subtitle ||
    "Watch factory walkthroughs, crane assembly days, and customer build walkthroughs";
  const heroDesc =
    pageData?.content ||
    "Watch in-depth walkthroughs of our modular homes, prefabs, barndominiums, cabins, and customer project stories.";

  return (
    <div className="min-h-screen bg-white pt-6 pb-24 text-[var(--ink)]">
      <div className="wrap">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#b45309] text-[11px] font-black uppercase tracking-wider mb-4">
            <Film className="w-3.5 h-3.5 text-[#d97706]" />
            <span>HD Architecture & Factory Tours</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--ink)] font-display leading-[1.05]">
            {heroTitle}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[var(--muted)] leading-relaxed font-body">
            {heroSubtitle}
          </p>
          <p className="mt-2 text-sm sm:text-base text-[var(--muted)] leading-relaxed font-body">
            {heroDesc}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--muted)] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search video tours by keyword or model..."
                className="w-full bg-[var(--soft)] border border-[var(--line)] pl-11 pr-4 py-3 text-xs text-[var(--ink)] rounded-full focus:outline-none focus:border-[#d97706] shadow-xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Video Categories Bar */}
        <div className="mb-8" ref={gridRef}>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center flex-nowrap">
            {VIDEO_CATEGORIES.map((category) => {
              const isActive = initialCategory === category;
              const count = initialCategoryCounts[category] ?? (category === "All" ? initialTotalCount : 0);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#101114] text-white shadow-sm ring-2 ring-[#fcb907]/60"
                      : "bg-gray-100/90 text-gray-700 hover:bg-gray-200/90 hover:text-black"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? "bg-[#fcb907] text-[#101114]" : "bg-gray-200/80 text-gray-600"
                    }`}
                  >
                    {count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Summary Info */}
          <div className="flex items-center justify-between text-xs text-[var(--muted)] mt-4 px-1 border-b border-gray-100 pb-3">
            <div>
              Showing{" "}
              <span className="font-bold text-[#101114]">
                {initialTotalCount === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(safePage * ITEMS_PER_PAGE, initialTotalCount)}
              </span>{" "}
              of <span className="font-bold text-[#101114]">{initialTotalCount.toLocaleString()}</span> video tours
              {initialCategory !== "All" && (
                <span>
                  {" "}
                  in <span className="font-bold text-[#d97706]">{initialCategory}</span>
                </span>
              )}
            </div>
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  navigateTo(initialCategory, 1, "");
                }}
                className="text-xs text-[#d97706] font-bold hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        </div>

        {/* Transition Loading State Indicator */}
        <div className={`transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          {initialVideos.length === 0 ? (
            <div className="p-16 text-center text-xs text-[var(--muted)] space-y-3 bg-[var(--soft)] rounded-[18px] border border-[var(--line)]">
              <div className="text-sm font-bold text-gray-700">No videos found matching your filters.</div>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try selecting a different category tab or removing search keywords.
              </p>
              <button
                onClick={() => {
                  setSearchInput("");
                  navigateTo("All", 1, "");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#fcb907] text-[#101114] text-xs font-black rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {initialVideos.map((video) => (
                <VideoCard
                  key={video.id || video.youtubeVideoId}
                  video={video}
                  onPlay={(v: VideoItem) => setActiveVideo(v)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Numbered Pagination (Crawlable SEO <Link> tags) */}
        {initialTotalPages > 1 && (
          <nav
            aria-label="Video Gallery Pagination"
            className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100"
          >
            <div className="text-xs text-[var(--muted)]">
              Page <span className="font-bold text-[#101114]">{safePage}</span> of{" "}
              <span className="font-bold text-[#101114]">{initialTotalPages.toLocaleString()}</span> (
              {initialTotalCount.toLocaleString()} total videos)
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {/* Previous Button */}
              {safePage <= 1 ? (
                <span
                  aria-disabled="true"
                  aria-label="Previous Page"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 select-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </span>
              ) : (
                <Link
                  href={`/videos?${new URLSearchParams({
                    ...(initialCategory !== "All" && { category: initialCategory }),
                    ...(safePage > 2 ? { page: (safePage - 1).toString() } : {}),
                    ...(searchInput ? { q: searchInput } : {}),
                  }).toString()}`}
                  prefetch={false}
                  onClick={() => {
                    if (gridRef.current) gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  aria-label="Previous Page"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </Link>
              )}

              {/* Numbered Buttons */}
              {pageNumbers.map((p, idx) => {
                if (typeof p === "string") {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400 font-bold select-none">
                      ...
                    </span>
                  );
                }

                const isCurrent = p === safePage;
                const linkHref = `/videos?${new URLSearchParams({
                  ...(initialCategory !== "All" && { category: initialCategory }),
                  ...(p > 1 && { page: p.toString() }),
                  ...(searchInput && { q: searchInput }),
                }).toString()}`;

                return (
                  <Link
                    key={p}
                    href={linkHref}
                    prefetch={false}
                    onClick={() => {
                      if (gridRef.current) gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#101114] text-[#fcb907] shadow-sm ring-2 ring-[#fcb907]/60"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black bg-white"
                    }`}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {p}
                  </Link>
                );
              })}

              {/* Next Button */}
              {safePage >= initialTotalPages ? (
                <span
                  aria-disabled="true"
                  aria-label="Next Page"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 select-none"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              ) : (
                <Link
                  href={`/videos?${new URLSearchParams({
                    ...(initialCategory !== "All" && { category: initialCategory }),
                    page: (safePage + 1).toString(),
                    ...(searchInput ? { q: searchInput } : {}),
                  }).toString()}`}
                  prefetch={false}
                  onClick={() => {
                    if (gridRef.current) gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  aria-label="Next Page"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer bg-white transition-colors"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Jump to Page input for large catalogs */}
            {initialTotalPages > 5 && (
              <form onSubmit={handleJumpToPageSubmit} className="flex items-center gap-1 text-xs">
                <span className="text-[var(--muted)]">Go to:</span>
                <input
                  type="number"
                  min="1"
                  max={initialTotalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  placeholder="#"
                  className="w-14 px-2 py-1.5 text-xs text-center border border-gray-200 rounded-lg focus:outline-none focus:border-[#fcb907]"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-[#101114] text-white text-[11px] font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Go
                </button>
              </form>
            )}
          </nav>
        )}
      </div>

      {/* Video Lightbox Modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}
