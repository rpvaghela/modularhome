"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Search, BookOpen, Sparkles } from "lucide-react";
import { CmsPage } from "@/lib/publicData";

interface ResourcesClientProps {
  initialArticles: any[];
  pageData?: CmsPage | null;
}

export default function ResourcesClient({ initialArticles, pageData }: ResourcesClientProps) {
  const [articles] = useState<any[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredArticles = articles.filter((art) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (art.title || "").toLowerCase().includes(q) ||
      (art.excerpt || "").toLowerCase().includes(q) ||
      (art.category || "").toLowerCase().includes(q)
    );
  });

  const headerBadge = pageData?.subtitle ? "Modular Housing Knowledge Hub" : "Modular Housing Knowledge Hub";
  const headerTitle = pageData?.title || "Modular Home Resources & Guides";
  const headerDesc = pageData?.content || "Everything you need to know about factory modular housing, costs, timelines, financing, land preparation, and floor plan customization.";

  return (
    <div className="min-h-screen bg-white pt-24 pb-28 text-[#101114]">
      <div className="wrap">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-[#d97706] text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-[#fcb907]" />
            <span>{headerBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#101114] font-display leading-[0.98]">
            {headerTitle}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#555d69] leading-relaxed font-body">
            {headerDesc}
          </p>

          {/* Search Bar */}
          <div className="mt-8">
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-[#6b7280] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, pricing, permits, foundation..."
                className="w-full bg-[#f8f9fa] border border-[#d5d9e0] pl-11 pr-4 py-3 text-xs text-[#101114] rounded-full focus:outline-none focus:border-[#fcb907] focus:bg-white shadow-xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#6b7280] space-y-3 bg-[#f8f9fa] rounded-[20px] border border-[#e7e9ee]">
            <BookOpen className="w-8 h-8 mx-auto text-[#6b7280]/40" />
            <div className="font-bold text-[#101114]">No articles matched your search.</div>
            <p className="text-xs text-[#6b7280]">
              Try searching with different terms.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredArticles.map((article: any) => (
              <Link
                key={article.id || article.slug}
                href={`/resources/${article.slug}`}
                className="card overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all group bg-white rounded-[20px] border border-[#e7e9ee] shadow-xs hover:border-[#d97706] hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-[#fcb907] text-[#101114] text-[10px] font-black uppercase px-2.5 py-1 rounded-[6px] shadow-xs">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                      <Clock className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>

                    <h2 className="text-lg font-black text-[#101114] line-clamp-2 group-hover:text-[#d97706] transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-xs text-[#555d69] line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-[#e7e9ee]/60 flex items-center justify-between text-xs font-bold text-[#d97706]">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
