"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Clock, Calendar, BookOpen, ArrowRight, Filter } from "lucide-react";
import { ResourceArticle } from "@/data/resources";
import { formatEditorialTitle } from "@/utils/text";

interface BlogsCatalogProps {
  initialArticles: ResourceArticle[];
}

export default function BlogsCatalog({ initialArticles }: BlogsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "title-asc" | "title-desc">("newest");
  const [visibleCount, setVisibleCount] = useState(24);

  // Extract unique topic list from real articles
  const topics = useMemo(() => {
    const set = new Set<string>();
    initialArticles.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [initialArticles]);

  // Filter & sort articles
  const filteredArticles = useMemo(() => {
    let list = [...initialArticles];

    // Filter by topic
    if (selectedTopic !== "All") {
      const target = selectedTopic.toLowerCase();
      list = list.filter((a) => {
        const cat = (a.category || "").toLowerCase();
        const catSlug = (a.category_slug || "").toLowerCase();
        return cat === target || catSlug.includes(target) || target.includes(cat);
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((a) => {
        const title = (a.title || "").toLowerCase();
        const excerpt = (a.excerpt || "").toLowerCase();
        const cat = (a.category || "").toLowerCase();
        const tags = (a.tags || []).join(" ").toLowerCase();
        const author = (a.author || "").toLowerCase();
        return (
          title.includes(q) ||
          excerpt.includes(q) ||
          cat.includes(q) ||
          tags.includes(q) ||
          author.includes(q)
        );
      });
    }

    // Sort
    if (sortBy === "title-asc") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "title-desc") {
      list.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    }
    // "newest" preserves original order from database / custom store

    return list;
  }, [initialArticles, selectedTopic, searchQuery, sortBy]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div className="space-y-8 font-sans">
      {/* Search & Filter Toolbar */}
      <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="Search across all 189+ guides, pricing, floor plans, states..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e7e9ee] rounded-xl text-xs sm:text-sm text-[#101114] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#fcb907] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#101114] p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="text-xs font-bold text-[#6b7280]">
              Showing <span className="text-[#101114] font-black">{filteredArticles.length}</span> of {initialArticles.length}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 bg-white border border-[#e7e9ee] rounded-xl text-xs font-bold text-[#101114] focus:outline-none focus:ring-2 focus:ring-[#fcb907] transition-all cursor-pointer"
            >
              <option value="newest">Featured &amp; Newest</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>
        </div>

        {/* Quick In-Page Topic Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-[#6b7280] shrink-0 mr-1 hidden sm:inline-flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#fcb907]" /> Filter:
          </span>
          {topics.map((topic) => {
            const isSelected = selectedTopic === topic;
            const count = topic === "All"
              ? initialArticles.length
              : initialArticles.filter((a) => (a.category || "").toLowerCase() === topic.toLowerCase()).length;

            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setSelectedTopic(topic);
                  setVisibleCount(24);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-[#101114] text-[#fcb907] shadow-xs"
                    : "bg-white hover:bg-gray-100 text-[#4b5563] border border-[#e7e9ee]"
                }`}
              >
                <span>{topic}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-[#fcb907]" : "bg-gray-100 text-[#6b7280]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {displayedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => {
            const catSlug = (
              article.category_slug ||
              (article.category || "modular-construction").toLowerCase().replace(/[^a-z0-9]+/g, "-")
            ).replace(/^blogs-/, "");

            return (
              <Link
                key={article.id || article.slug}
                href={`/blogs/${catSlug}/${article.slug}`}
                className="group card overflow-hidden flex flex-col justify-between bg-white rounded-[18px] border border-[#e7e9ee] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={article.image || "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#fcb907] text-[#101114] text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
                      {article.category || "Building Guide"}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#d97706]" />
                        <span>{article.readTime || "5 min read"}</span>
                      </div>
                      {article.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#9ca3af]" />
                          <span>{article.date}</span>
                        </div>
                      )}
                    </div>

                    <h2 className="text-base font-black text-[#101114] group-hover:text-[#d97706] transition-colors leading-snug line-clamp-2 font-display">
                      {formatEditorialTitle(article.title)}
                    </h2>

                    <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
                      {article.excerpt || "Comprehensive architectural guide and modular construction advice."}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <span className="text-[11px] font-bold text-[#6b7280] truncate max-w-[150px]">
                    By {article.author || "ModularHome Team"}
                  </span>
                  <span className="text-xs font-bold text-[#d97706] inline-flex items-center gap-1 group-hover:underline">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-[#9ca3af] mx-auto" />
          <h3 className="text-lg font-black text-[#101114]">
            No matching articles found
          </h3>
          <p className="text-xs text-[#6b7280] max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any articles matching "${searchQuery}". Try searching for terms like "pricing", "cabins", "permits", or "delivery".`
              : "No articles are available in this category."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTopic("All");
              setVisibleCount(24);
            }}
            className="px-5 py-2 bg-[#101114] text-[#fcb907] text-xs font-bold rounded-xl hover:bg-black transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination / Load More */}
      {hasMore && (
        <div className="pt-8 text-center border-t border-[#e7e9ee] space-y-3">
          <div className="text-xs text-[#6b7280]">
            Showing {displayedArticles.length} of {filteredArticles.length} articles
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredArticles.length))}
              className="px-6 py-2.5 bg-[#101114] text-white hover:bg-black text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>Load Next 24 Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filteredArticles.length)}
              className="px-6 py-2.5 bg-white border border-[#e7e9ee] hover:bg-gray-50 text-[#101114] text-xs font-bold rounded-xl transition-colors"
            >
              <span>Show All {filteredArticles.length}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
