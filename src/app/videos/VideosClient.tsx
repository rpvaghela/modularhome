"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Play, Film, Sparkles } from "lucide-react";
import Link from "next/link";
import { VIDEOS_DATA, VIDEO_CATEGORIES } from "@/data/videos";
import { VideoItem } from "@/types/video";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { CmsPage } from "@/lib/publicData";

interface VideosClientProps {
  pageData?: CmsPage | null;
}

const ITEMS_PER_PAGE = 12;

function matchVideoCategory(video: VideoItem, cat: string): boolean {
  if (!cat || cat === "All") return true;
  const content = `${video.title} ${video.description} ${video.category || ""}`.toLowerCase();
  
  if (cat === "Barndominiums") {
    return content.includes("barndo") || content.includes("barndominium") || content.includes("pole barn");
  }
  if (cat === "Modular Homes") {
    return (content.includes("modular") && !content.includes("cabin")) || content.includes("modular home") || content.includes("residence");
  }
  if (cat === "Prefab Cabins") {
    return content.includes("cabin") || content.includes("lodge") || content.includes("rustic") || content.includes("log");
  }
  if (cat === "Tiny Homes") {
    return content.includes("tiny") || content.includes("park model");
  }
  if (cat === "A-Frames") {
    return content.includes("a-frame") || content.includes("aframe");
  }
  if (cat === "Building Tours") {
    return content.includes("tour") || content.includes("walkthrough") || content.includes("factory") || content.includes("building");
  }
  return (video.category || "").toLowerCase() === cat.toLowerCase();
}

export default function VideosClient({ pageData }: VideosClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Read state from URL search params
  const initialCategory = searchParams.get("category") || "All";
  const initialPage = parseInt(searchParams.get("page") || "1", 10) || 1;
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const gridRef = useRef<HTMLDivElement>(null);

  // Sync state if URL changes externally
  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    const pg = parseInt(searchParams.get("page") || "1", 10) || 1;
    const q = searchParams.get("q") || "";
    setSelectedCategory(cat);
    setCurrentPage(pg);
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function loadSyncedVideos() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        if (!isMounted) return;
        if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          setVideos(VIDEOS_DATA as unknown as VideoItem[]);
        }
      } catch (err) {
        console.error("Failed to fetch synced videos, using fallback:", err);
        if (isMounted) {
          setVideos(VIDEOS_DATA as unknown as VideoItem[]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadSyncedVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update URL helper
  const updateUrl = (cat: string, page: number, query: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== "All") params.set("category", cat);
    if (page > 1) params.set("page", page.toString());
    if (query.trim()) params.set("q", query.trim());
    const newQueryString = params.toString();
    const targetUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname;
    router.push(targetUrl, { scroll: false });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    updateUrl(cat, 1, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateUrl(selectedCategory, 1, query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(selectedCategory, page, searchQuery);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Filtered dataset
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      if (!matchVideoCategory(v, selectedCategory)) return false;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        (v.category && v.category.toLowerCase().includes(q))
      );
    });
  }, [videos, selectedCategory, searchQuery]);

  // Compute pagination
  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedVideos = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredVideos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVideos, safePage]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: videos.length };
    VIDEO_CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = videos.filter((v) => matchVideoCategory(v, cat)).length;
      }
    });
    return counts;
  }, [videos]);

  // Client Requirement #12: Video Gallery Title must be "Modular Home & Prefab Home Video Tours"
  const heroTitle = pageData?.title || "Modular Home & Prefab Home Video Tours";
  const heroSubtitle =
    pageData?.subtitle ||
    "Watch high-definition architectural walkthroughs of our precision-built modular homes, prefab cabins, barndominiums, and tiny home estates.";
  const heroDesc =
    pageData?.content ||
    "See genuine model floor plans, interiors, crane installations, and building craftsmanship to inspire your next custom project.";

  // Generate numbered pages array
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className="min-h-screen bg-white pt-6 pb-24 text-[var(--ink)]">
      <div className="wrap">
        {/* Header (Requirement #12) */}
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
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search video tours by keyword or model..."
                className="w-full bg-[var(--soft)] border border-[var(--line)] pl-11 pr-4 py-3 text-xs text-[var(--ink)] rounded-full focus:outline-none focus:border-[#d97706] shadow-xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Video Categories Bar (Client Requirement #13) */}
        <div className="mb-8" ref={gridRef}>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center flex-nowrap">
            {VIDEO_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              const count = categoryCounts[category] || 0;
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
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Summary Info */}
          <div className="flex items-center justify-between text-xs text-[var(--muted)] mt-4 px-1 border-b border-gray-100 pb-3">
            <div>
              Showing <span className="font-bold text-[#101114]">{filteredVideos.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredVideos.length)}</span> of{" "}
              <span className="font-bold text-[#101114]">{filteredVideos.length}</span> video tours
              {selectedCategory !== "All" && <span> in <span className="font-bold text-[#d97706]">{selectedCategory}</span></span>}
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="text-xs text-[#d97706] font-bold hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-xs text-[var(--muted)]">
            Loading video tours...
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-16 text-center text-xs text-[var(--muted)] space-y-3 bg-[var(--soft)] rounded-[18px] border border-[var(--line)]">
            <div className="text-sm font-bold text-gray-700">No videos found matching your filters.</div>
            <p className="text-gray-500 max-w-sm mx-auto">
              Try selecting a different category tab or removing search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setCurrentPage(1);
                updateUrl("All", 1, "");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#fcb907] text-[#101114] text-xs font-black rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {paginatedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={(v: VideoItem) => setActiveVideo(v)}
              />
            ))}
          </div>
        )}

        {/* Numbered Pagination (Client Requirement #10) */}
        {!isLoading && totalPages > 1 && (
          <nav
            aria-label="Video Gallery Pagination"
            className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100"
          >
            <div className="text-xs text-[var(--muted)]">
              Page <span className="font-bold text-[#101114]">{safePage}</span> of{" "}
              <span className="font-bold text-[#101114]">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                aria-label="Previous Page"
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  safePage === 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                    : "border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer bg-white"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

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
                  ...(selectedCategory !== "All" && { category: selectedCategory }),
                  ...(p > 1 && { page: p.toString() }),
                  ...(searchQuery && { q: searchQuery }),
                }).toString()}`;

                return (
                  <Link
                    key={p}
                    href={linkHref}
                    prefetch={false}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(p);
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
              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="Next Page"
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  safePage === totalPages
                    ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                    : "border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer bg-white"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
