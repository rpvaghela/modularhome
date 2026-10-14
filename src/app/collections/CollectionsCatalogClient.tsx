"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  ArrowRight, 
  Layers, 
  MapPin, 
  Home, 
  Building2, 
  Sparkles,
  Filter,
  CheckCircle2,
  X
} from "lucide-react";
import { PublicCollection } from "@/lib/publicData";

interface CollectionsCatalogClientProps {
  initialCollections: PublicCollection[];
}

const CATEGORY_TABS = [
  "All Collections",
  "Turnkey & Bedroom Series",
  "Cabins & Lodges",
  "Barndominiums & Barns",
  "State & Regional Builders",
  "ADUs & Tiny Homes",
  "House Kits & Framing",
  "Commercial & Specialty",
] as const;

export default function CollectionsCatalogClient({
  initialCollections,
}: CollectionsCatalogClientProps) {
  const [activeTab, setActiveTab] = useState<string>("All Collections");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Extract all unique US states mentioned in state collections
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    initialCollections.forEach((c) => {
      const match = c.slug.match(/-in-([a-z-]+)$/);
      if (match) {
        const stateFormatted = match[1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
        states.add(stateFormatted);
      }
    });
    return Array.from(states).sort();
  }, [initialCollections]);

  // Filter collections
  const filteredCollections = useMemo(() => {
    return initialCollections.filter((col) => {
      const q = searchQuery.toLowerCase().trim();
      const name = col.name.toLowerCase();
      const slug = col.slug.toLowerCase();
      const tagline = (col.tagline || "").toLowerCase();
      const desc = (col.description || "").toLowerCase();

      // Search matching
      if (q && !name.includes(q) && !slug.includes(q) && !tagline.includes(q) && !desc.includes(q)) {
        return false;
      }

      // State dropdown matching
      if (selectedState && activeTab === "State & Regional Builders") {
        const stateSlug = selectedState.toLowerCase().replace(/\s+/g, "-");
        if (!slug.includes(`-in-${stateSlug}`)) {
          return false;
        }
      }

      // Tab matching
      if (activeTab === "All Collections") return true;

      if (activeTab === "Turnkey & Bedroom Series") {
        return slug.includes("bedroom") || slug.includes("turnkey") || name.includes("turnkey") || name.includes("bedroom");
      }

      if (activeTab === "Cabins & Lodges") {
        return (slug.includes("cabin") || slug.includes("lodge") || slug.includes("log") || name.includes("cabin") || name.includes("lodge")) && !slug.includes("barndo");
      }

      if (activeTab === "Barndominiums & Barns") {
        return slug.includes("barndo") || slug.includes("pole-barn") || name.includes("barndominium") || name.includes("barndo") || name.includes("pole barn");
      }

      if (activeTab === "State & Regional Builders") {
        return slug.includes("-in-") || slug.includes("builders");
      }

      if (activeTab === "ADUs & Tiny Homes") {
        return slug.includes("adu") || slug.includes("tiny") || name.includes("adu") || name.includes("tiny home");
      }

      if (activeTab === "House Kits & Framing") {
        return slug.includes("kit") || slug.includes("sip") || name.includes("kit") || name.includes("panelized");
      }

      if (activeTab === "Commercial & Specialty") {
        return slug.includes("commercial") || slug.includes("a-frame") || slug.includes("custom") || name.includes("commercial");
      }

      return true;
    });
  }, [initialCollections, activeTab, searchQuery, selectedState]);

  // Slice for pagination / infinite load
  const visibleCollections = useMemo(() => {
    return filteredCollections.slice(0, visibleCount);
  }, [filteredCollections, visibleCount]);

  const handleReset = () => {
    setSearchQuery("");
    setActiveTab("All Collections");
    setSelectedState("");
    setVisibleCount(36);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar & Quick Filters */}
      <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-[20px] p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(36);
              }}
              placeholder="Search by collection name, style (e.g. Amish Cabins, 2 Bedroom, Texas, Barndo Kits)..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-[#e7e9ee] rounded-xl text-sm text-[#101114] placeholder-[#9ca3af] focus:outline-hidden focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* State Filter dropdown if on State Builders tab */}
          {activeTab === "State & Regional Builders" && (
            <div className="w-full md:w-64">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setVisibleCount(36);
                }}
                className="w-full py-3 px-4 bg-white border border-[#e7e9ee] rounded-xl text-sm font-semibold text-[#101114] focus:outline-hidden focus:border-[#fcb907]"
              >
                <option value="">All States ({availableStates.length})</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setVisibleCount(36);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#101114] text-[#fcb907] shadow-sm scale-[1.02]"
                    : "bg-white text-[#6b7280] border border-[#e7e9ee] hover:border-gray-400 hover:text-[#101114]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#6b7280] px-1">
        <div>
          Showing <span className="font-bold text-[#101114]">{visibleCollections.length}</span> of{" "}
          <span className="font-bold text-[#101114]">{filteredCollections.length}</span> collections
          {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          {selectedState && <span> in {selectedState}</span>}
        </div>
        {(searchQuery || selectedState || activeTab !== "All Collections") && (
          <button
            onClick={handleReset}
            className="text-[#d97706] font-bold hover:underline flex items-center gap-1"
          >
            <span>Reset Filters</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Collections Grid */}
      {visibleCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card for All Models if on All tab */}
          {activeTab === "All Collections" && !searchQuery && (
            <Link
              href="/collections/all"
              className="group card overflow-hidden flex flex-col justify-between bg-white rounded-[18px] border-2 border-[#fcb907] hover:-translate-y-1 transition-all shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
                  alt="All Modular Home Models"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#fcb907] text-[#101114] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                  Full Portfolio
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-black text-[#101114] group-hover:text-[#d97706] transition-colors">
                  All Modular Home Models
                </h2>
                <p className="text-xs text-[#6b7280] leading-relaxed line-clamp-2">
                  Browse our entire portfolio of precision steel modular homes, turnkey prefab models, and custom house kits.
                </p>
                <div className="pt-2 text-xs font-bold text-[#d97706] inline-flex items-center gap-1 group-hover:underline">
                  <span>Explore All 38+ Models</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          )}

          {visibleCollections.map((col) => {
            const colImg = col.image || col.bannerImage || "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";
            const isState = col.slug.includes("-in-") || col.slug.includes("builder");
            
            return (
              <Link
                key={col.id || col.slug}
                href={`/collections/${col.slug}`}
                className="group card overflow-hidden flex flex-col justify-between bg-white rounded-[18px] border border-[#e7e9ee] hover:border-gray-400 hover:-translate-y-1 transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={colImg}
                    alt={col.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#101114]/90 backdrop-blur-xs text-[#fcb907] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                      {col.productCount || 0} Models
                    </span>
                    {isState && (
                      <span className="bg-[#fcb907] text-[#101114] text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>State Series</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#101114] group-hover:text-[#d97706] transition-colors leading-snug line-clamp-2">
                      {col.name}
                    </h2>
                    <p className="text-xs text-[#6b7280] leading-relaxed line-clamp-2 mt-1.5">
                      {col.tagline || col.description?.replace(/<[^>]*>?/gm, "").slice(0, 110) || `Precision modular & prefab architecture series.`}
                    </p>
                  </div>

                  <div className="pt-3 text-xs font-bold text-[#d97706] inline-flex items-center gap-1 group-hover:underline border-t border-gray-100 mt-3">
                    <span>View Architectural Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-gray-50 border border-[#e7e9ee] rounded-2xl p-8">
          <Layers className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-[#101114]">No collections matched your filters</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Try adjusting your search terms or reset the filters to see all available architectural series.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-[#101114] text-[#fcb907] font-bold text-xs rounded-xl shadow-xs"
          >
            Clear Search & Reset Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {visibleCollections.length < filteredCollections.length && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 36)}
            className="px-8 py-3.5 bg-white hover:bg-gray-50 text-[#101114] font-black text-sm rounded-xl border border-[#e7e9ee] shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Load More Collections ({filteredCollections.length - visibleCollections.length} remaining)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
