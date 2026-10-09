"use client";

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { 
  Search, 
  X, 
  RotateCcw, 
  Building2, 
  ChevronDown 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import BuildingCard from "@/components/BuildingCard";
import { BuildingModel } from "@/data/models";
import { matchProductCategory, getBaseModelName } from "@/utils/categoryMatching";

interface CategoryFilteredCatalogProps {
  initialProducts: BuildingModel[];
  allProducts: BuildingModel[];
  categoryName: string;
  categoryKey?: string;
}

export const CATEGORY_ROUTE_MAP: Record<string, string> = {
  "All": "/collections/all",
  "Modular Homes": "/modular-homes",
  "Prefab Homes": "/prefab-homes",
  "Barndominiums": "/barndominiums",
  "House Kits": "/house-kits",
  "Tiny Homes": "/tiny-homes",
  "Park Models": "/park-models",
  "Cabins": "/cabins",
  "ADUs & Granny Pods": "/adus",
  "ADUs": "/adus",
  "A-Frame Homes": "/a-frame-homes",
  "A-Frames": "/a-frame-homes",
  "Commercial Buildings": "/commercial-modular-buildings",
  "Commercial": "/commercial-modular-buildings",
  "Commercial Modular Buildings": "/commercial-modular-buildings",
  "Custom Homes": "/custom-homes",
};

const CATEGORY_SELECT_OPTIONS = [
  { label: "All Categories", value: "All" },
  { label: "Modular Homes", value: "Modular Homes" },
  { label: "Prefab Homes", value: "Prefab Homes" },
  { label: "Barndominiums", value: "Barndominiums" },
  { label: "House Kits", value: "House Kits" },
  { label: "Tiny Homes", value: "Tiny Homes" },
  { label: "Park Models", value: "Park Models" },
  { label: "Cabins", value: "Cabins" },
  { label: "ADUs & Granny Pods", value: "ADUs & Granny Pods" },
  { label: "A-Frames", value: "A-Frames" },
  { label: "Commercial", value: "Commercial" },
  { label: "Custom Homes", value: "Custom Homes" },
];

const ARCHITECTURAL_STYLES = [
  { label: "All Styles", value: "All" },
  { label: "Modern", value: "Modern" },
  { label: "Farmhouse", value: "Farmhouse" },
  { label: "Ranch", value: "Ranch" },
  { label: "Cabin", value: "Cabin" },
  { label: "Contemporary", value: "Contemporary" },
  { label: "Barndominium", value: "Barndominium" },
  { label: "ADU", value: "ADU" },
  { label: "Rustic", value: "Rustic" },
  { label: "Industrial", value: "Industrial" },
  { label: "Craftsman", value: "Craftsman" },
  { label: "Cottage", value: "Cottage" },
];

export default function CategoryFilteredCatalog({
  initialProducts,
  allProducts,
  categoryName,
  categoryKey,
}: CategoryFilteredCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAllPage = categoryName === "All" || categoryName === "All Models" || categoryKey === "all";
  
  // Normalize initial category value to match one of our select option values
  const getInitialCategory = () => {
    if (isAllPage) return "All";
    const match = CATEGORY_SELECT_OPTIONS.find(
      opt => opt.value.toLowerCase() === categoryName.toLowerCase() ||
             opt.label.toLowerCase() === categoryName.toLowerCase() ||
             (categoryKey && opt.value.toLowerCase().includes(categoryKey.toLowerCase()))
    );
    return match ? match.value : categoryName;
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(getInitialCategory());
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");
  const [bathroomFilter, setBathroomFilter] = useState<string>("all");
  const [storiesFilter, setStoriesFilter] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [minSqft, setMinSqft] = useState<number>(0);

  // Sync category state when route or category props change
  useEffect(() => {
    setSelectedCategory(getInitialCategory());
  }, [categoryName, isAllPage, categoryKey]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    const targetRoute = CATEGORY_ROUTE_MAP[newCat] || CATEGORY_ROUTE_MAP[newCat.replace(/ Homes?$/, "")];
    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
    }
  };

  // Pool of products to filter from
  const catalogPool = allProducts && allProducts.length > 0 ? allProducts : initialProducts;

  // Filter products in real-time
  const filteredProducts = useMemo(() => {
    const matched = catalogPool.filter((p) => {
      // 1. Category Filter
      if (selectedCategory !== "All") {
        if (!matchProductCategory(p, selectedCategory)) {
          return false;
        }
      }

      // 2. Keyword Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (p.name || (p as any).title || "").toLowerCase().includes(q);
        const seriesMatch = (p.series || "").toLowerCase().includes(q);
        const catMatch = (p.category || (p as any).product_type || "").toLowerCase().includes(q);
        const descMatch = (p.description || "").toLowerCase().includes(q);
        const styleMatch = (p.architecturalStyle || "").toLowerCase().includes(q);
        const tagMatch = Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q));

        if (!titleMatch && !seriesMatch && !catMatch && !descMatch && !styleMatch && !tagMatch) {
          return false;
        }
      }

      // 3. Architectural Style Filter
      if (selectedStyle !== "All") {
        const pStyle = (p.architecturalStyle || "").toLowerCase();
        const pName = (p.name || "").toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        const targetStyle = selectedStyle.toLowerCase();

        if (!pStyle.includes(targetStyle) && !pName.includes(targetStyle) && !pDesc.includes(targetStyle)) {
          return false;
        }
      }

      // 4. Bedrooms Filter
      if (bedroomFilter !== "all" && bedroomFilter !== "Any") {
        const reqBeds = parseInt(bedroomFilter, 10);
        if (!isNaN(reqBeds)) {
          if (bedroomFilter === "4") {
            if ((p.bedrooms || 0) < 4) return false;
          } else {
            if ((p.bedrooms || 0) !== reqBeds) return false;
          }
        }
      }

      // 5. Bathrooms Filter
      if (bathroomFilter !== "all" && bathroomFilter !== "Any") {
        const reqBaths = parseInt(bathroomFilter, 10);
        if (!isNaN(reqBaths)) {
          if (bathroomFilter === "3") {
            if ((p.bathrooms || 0) < 3) return false;
          } else {
            if (Math.floor(p.bathrooms || 0) !== reqBaths) return false;
          }
        }
      }

      // 6. Stories Filter
      if (storiesFilter !== "all") {
        const reqStories = parseInt(storiesFilter, 10);
        if (!isNaN(reqStories)) {
          if ((p.stories || 1) !== reqStories) return false;
        }
      }

      // 7. Minimum SQ FT Filter
      if (minSqft > 0) {
        if ((p.sqft || 0) < minSqft) return false;
      }

      // 8. Budget Tier Filter
      if (budgetFilter !== "all") {
        const price = p.startingPrice || 0;
        if (price > 0) {
          if (budgetFilter === "under-75k" && price > 75000) return false;
          if (budgetFilter === "75k-150k" && (price < 75000 || price > 150000)) return false;
          if (budgetFilter === "150k-250k" && (price < 150000 || price > 250000)) return false;
          if (budgetFilter === "250k-plus" && price < 250000) return false;
          if (budgetFilter === "100000" && price > 100000) return false;
          if (budgetFilter === "200000" && price > 200000) return false;
          if (budgetFilter === "300000" && price > 300000) return false;
        }
      }

      return true;
    });

    // Deduplicate by base model name so duplicate state pricing records do not repeat
    const seen = new Set<string>();
    const deduplicated: BuildingModel[] = [];
    for (const p of matched) {
      const base = getBaseModelName(p.name);
      const key = base.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(p);
      }
    }

    return deduplicated;
  }, [
    catalogPool,
    selectedCategory,
    selectedStyle,
    searchQuery,
    bedroomFilter,
    bathroomFilter,
    storiesFilter,
    minSqft,
    budgetFilter,
  ]);

  const isFiltered =
    selectedCategory !== getInitialCategory() ||
    selectedStyle !== "All" ||
    searchQuery !== "" ||
    bedroomFilter !== "all" ||
    bathroomFilter !== "all" ||
    storiesFilter !== "all" ||
    budgetFilter !== "all" ||
    minSqft > 0;

  const handleResetFilters = () => {
    setSelectedCategory(getInitialCategory());
    setSelectedStyle("All");
    setSearchQuery("");
    setBedroomFilter("all");
    setBathroomFilter("all");
    setStoriesFilter("all");
    setBudgetFilter("all");
    setMinSqft(0);
  };

  return (
    <div className="space-y-4">
      {/* Search & Advanced Filters Container */}
      <div className="p-4 sm:p-5 border border-gray-200 bg-[#f8f9fa] rounded-2xl shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search floor plans by name, style, or type..."
              className="w-full bg-white border border-gray-200 pl-10 pr-8 py-2.5 text-xs sm:text-[13px] text-[#101114] placeholder-gray-400 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 rounded-xl transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#101114] hover:text-[#b45309] hover:border-amber-300 transition-all cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#fcb907]" />
            <span>Reset All Filters</span>
          </button>
        </div>

        {/* 7 Filter Select Boxes in a responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-2.5">
          {/* 1. Category */}
          <div className="relative flex flex-col bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider pointer-events-none">Category</span>
            <div className="flex items-center justify-between">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-transparent text-xs font-bold text-[#101114] focus:outline-none cursor-pointer appearance-none pr-4 py-0.5 truncate"
              >
                {CATEGORY_SELECT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 2. Style */}
          <div className="relative flex flex-col bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider pointer-events-none">Style</span>
            <div className="flex items-center justify-between">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#101114] focus:outline-none cursor-pointer appearance-none pr-4 py-0.5 truncate"
              >
                {ARCHITECTURAL_STYLES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 3. Bedrooms */}
          <div className="relative flex flex-col bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider pointer-events-none">Bedrooms</span>
            <div className="flex items-center justify-between">
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#101114] focus:outline-none cursor-pointer appearance-none pr-4 py-0.5 truncate"
              >
                <option value="all">Any Beds</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4+ Beds</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 4. Bathrooms */}
          <div className="relative flex flex-col bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider pointer-events-none">Bathrooms</span>
            <div className="flex items-center justify-between">
              <select
                value={bathroomFilter}
                onChange={(e) => setBathroomFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#101114] focus:outline-none cursor-pointer appearance-none pr-4 py-0.5 truncate"
              >
                <option value="all">Any Baths</option>
                <option value="1">1 Bath</option>
                <option value="2">2 Baths</option>
                <option value="3">3+ Baths</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 5. Stories */}
          <div className="relative flex flex-col bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider pointer-events-none">Stories</span>
            <div className="flex items-center justify-between">
              <select
                value={storiesFilter}
                onChange={(e) => setStoriesFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#101114] focus:outline-none cursor-pointer appearance-none pr-4 py-0.5 truncate"
              >
                <option value="all">Any Levels</option>
                <option value="1">1 Story</option>
                <option value="2">2 Stories</option>
                <option value="3">3 Stories</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 6. Min Sq Ft */}
          <div className="relative flex flex-col bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider pointer-events-none">Min Sq Ft</span>
            <div className="flex items-center justify-between">
              <select
                value={minSqft}
                onChange={(e) => setMinSqft(Number(e.target.value))}
                className="w-full bg-transparent text-xs font-bold text-[#101114] focus:outline-none cursor-pointer appearance-none pr-4 py-0.5 truncate"
              >
                <option value={0}>Any Size</option>
                <option value={500}>500+ sq ft</option>
                <option value={1000}>1,000+ sq ft</option>
                <option value={1500}>1,500+ sq ft</option>
                <option value={2000}>2,000+ sq ft</option>
                <option value={2500}>2,500+ sq ft</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 7. Budget */}
          <div className="relative flex flex-col bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider pointer-events-none">Budget</span>
            <div className="flex items-center justify-between">
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#101114] focus:outline-none cursor-pointer appearance-none pr-4 py-0.5 truncate"
              >
                <option value="all">All Budgets</option>
                <option value="under-75k">Under $75K</option>
                <option value="75k-150k">$75K – $150K</option>
                <option value="150k-250k">$150K – $250K</option>
                <option value="250k-plus">$250K+</option>
                <option value="100000">Under $100k</option>
                <option value="200000">Under $200k</option>
                <option value="300000">Under $300k</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Counter & Active Status Bar */}
      <div className="py-1 flex items-center justify-between text-xs text-gray-500 border-b border-gray-200/80 pb-3.5">
        <div>
          Showing <span className="text-[#101114] font-extrabold">{filteredProducts.length}</span> of {catalogPool.length} models
          {selectedCategory !== "All" && (
            <span className="ml-1 text-[#d97706] font-bold">
              in {selectedCategory}
            </span>
          )}
        </div>
        {isFiltered && (
          <span className="text-[#d97706] font-bold text-[11px] sm:text-xs">
            Filtered results active
          </span>
        )}
      </div>

      {/* Product Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1">
          {filteredProducts.map((model) => {
            const activeCatSlug = selectedCategory !== "All" 
              ? (CATEGORY_ROUTE_MAP[selectedCategory] || `/${selectedCategory.toLowerCase()}`).replace(/^\//, "")
              : categoryKey;
            return (
              <BuildingCard
                key={model.id}
                model={model}
                categorySlug={activeCatSlug}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#f8f9fa] border border-gray-200 rounded-2xl p-8 space-y-3">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-black uppercase text-[#101114]">
            No Models Match Your Filter Criteria
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Try adjusting your search query, budget tier, or bedrooms filter to discover matching precision models.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] py-2.5 px-6 text-xs font-extrabold rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
