"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  X, 
  RotateCcw, 
  Building2, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import BuildingCard from "@/components/BuildingCard";
import { BuildingModel } from "@/data/models";
import { matchProductCategory } from "@/utils/categoryMatching";

interface CategoryFilteredCatalogProps {
  initialProducts: BuildingModel[];
  allProducts: BuildingModel[];
  categoryName: string;
  categoryKey?: string;
}

const DEFAULT_CATEGORY_TABS = [
  "All",
  "Modular Homes",
  "Prefab Homes",
  "Barndominiums",
  "House Kits",
  "Tiny Homes",
  "Park Models",
  "Cabins",
  "ADUs & Granny Pods",
  "A-Frame Homes",
  "Commercial Buildings",
  "Custom Homes",
];

const ARCHITECTURAL_STYLES = [
  "All",
  "Modern",
  "Farmhouse",
  "Ranch",
  "Cabin",
  "Contemporary",
  "Barndominium",
  "ADU",
  "Rustic",
  "Industrial",
];

export default function CategoryFilteredCatalog({
  initialProducts,
  allProducts,
  categoryName,
  categoryKey,
}: CategoryFilteredCatalogProps) {
  const isAllPage = categoryName === "All" || categoryName === "All Models" || categoryKey === "all";
  
  const [selectedCategory, setSelectedCategory] = useState<string>(
    isAllPage ? "All" : categoryName
  );
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");
  const [bathroomFilter, setBathroomFilter] = useState<string>("all");
  const [storiesFilter, setStoriesFilter] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [minSqft, setMinSqft] = useState<number>(0);

  // Pool of products to filter from
  const catalogPool = allProducts && allProducts.length > 0 ? allProducts : initialProducts;

  // Filter products in real-time
  const filteredProducts = useMemo(() => {
    return catalogPool.filter((p) => {
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
    selectedCategory !== (isAllPage ? "All" : categoryName) ||
    selectedStyle !== "All" ||
    searchQuery !== "" ||
    bedroomFilter !== "all" ||
    bathroomFilter !== "all" ||
    storiesFilter !== "all" ||
    budgetFilter !== "all" ||
    minSqft > 0;

  const handleResetFilters = () => {
    setSelectedCategory(isAllPage ? "All" : categoryName);
    setSelectedStyle("All");
    setSearchQuery("");
    setBedroomFilter("all");
    setBathroomFilter("all");
    setStoriesFilter("all");
    setBudgetFilter("all");
    setMinSqft(0);
  };

  return (
    <div className="space-y-6">
      {/* Search & Advanced Filters Bar */}
      <div className="py-5 border border-[#e7e9ee] bg-[#f6f7f9] px-4 sm:px-6 rounded-[14px] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search floor plans by name, style, or type..."
              className="w-full bg-white border border-[#dfe2e7] pl-10 pr-4 py-2.5 text-xs text-[#101114] placeholder-[#9ca3af] focus:outline-none focus:border-[#fcb907] rounded-[9px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#101114]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Reset Filter Button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="btn-outline py-2 px-3 text-xs font-bold rounded-[9px] flex items-center gap-1.5 self-start md:self-auto cursor-pointer bg-white"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Grid of 7 Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-2 border-t border-[#e7e9ee]">
          {/* 1. Category */}
          <div className="flex flex-col bg-white border border-[#dfe2e7] px-3 py-2 rounded-[9px]">
            <span className="text-[10px] text-[#6b7280] uppercase font-bold">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-[#101114] focus:outline-none font-bold cursor-pointer pt-0.5 truncate"
            >
              <option value="All">All Categories</option>
              {DEFAULT_CATEGORY_TABS.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Architectural Style */}
          <div className="flex flex-col bg-white border border-[#dfe2e7] px-3 py-2 rounded-[9px]">
            <span className="text-[10px] text-[#6b7280] uppercase font-bold">Style</span>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="bg-transparent text-xs text-[#101114] focus:outline-none font-bold cursor-pointer pt-0.5"
            >
              {ARCHITECTURAL_STYLES.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All Styles" : st}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Bedrooms */}
          <div className="flex flex-col bg-white border border-[#dfe2e7] px-3 py-2 rounded-[9px]">
            <span className="text-[10px] text-[#6b7280] uppercase font-bold">Bedrooms</span>
            <select
              value={bedroomFilter}
              onChange={(e) => setBedroomFilter(e.target.value)}
              className="bg-transparent text-xs text-[#101114] focus:outline-none font-bold cursor-pointer pt-0.5"
            >
              <option value="all">Any Beds</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          {/* 4. Bathrooms */}
          <div className="flex flex-col bg-white border border-[#dfe2e7] px-3 py-2 rounded-[9px]">
            <span className="text-[10px] text-[#6b7280] uppercase font-bold">Bathrooms</span>
            <select
              value={bathroomFilter}
              onChange={(e) => setBathroomFilter(e.target.value)}
              className="bg-transparent text-xs text-[#101114] focus:outline-none font-bold cursor-pointer pt-0.5"
            >
              <option value="all">Any Baths</option>
              <option value="1">1 Bath</option>
              <option value="2">2 Baths</option>
              <option value="3">3+ Baths</option>
            </select>
          </div>

          {/* 5. Stories */}
          <div className="flex flex-col bg-white border border-[#dfe2e7] px-3 py-2 rounded-[9px]">
            <span className="text-[10px] text-[#6b7280] uppercase font-bold">Stories</span>
            <select
              value={storiesFilter}
              onChange={(e) => setStoriesFilter(e.target.value)}
              className="bg-transparent text-xs text-[#101114] focus:outline-none font-bold cursor-pointer pt-0.5"
            >
              <option value="all">Any Levels</option>
              <option value="1">1 Story</option>
              <option value="2">2 Stories</option>
            </select>
          </div>

          {/* 6. Min SQ FT */}
          <div className="flex flex-col bg-white border border-[#dfe2e7] px-3 py-2 rounded-[9px]">
            <span className="text-[10px] text-[#6b7280] uppercase font-bold">Min Sq Ft</span>
            <select
              value={minSqft}
              onChange={(e) => setMinSqft(Number(e.target.value))}
              className="bg-transparent text-xs text-[#101114] focus:outline-none font-bold cursor-pointer pt-0.5"
            >
              <option value={0}>Any Size</option>
              <option value={500}>500+ sq ft</option>
              <option value={1000}>1,000+ sq ft</option>
              <option value={1500}>1,500+ sq ft</option>
              <option value={2000}>2,000+ sq ft</option>
            </select>
          </div>

          {/* 7. Budget */}
          <div className="flex flex-col bg-white border border-[#dfe2e7] px-3 py-2 rounded-[9px]">
            <span className="text-[10px] text-[#6b7280] uppercase font-bold">Budget</span>
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="bg-transparent text-xs text-[#101114] focus:outline-none font-bold cursor-pointer pt-0.5"
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
          </div>
        </div>
      </div>

      {/* Results Counter & Active Criteria */}
      <div className="py-2 flex items-center justify-between text-xs text-[#6b7280] border-b border-[#e7e9ee] pb-4">
        <div>
          Showing <span className="text-[#101114] font-bold">{filteredProducts.length}</span> of {catalogPool.length} models
          {selectedCategory !== "All" && (
            <span className="ml-1 text-[#d97706] font-bold">
              in {selectedCategory}
            </span>
          )}
        </div>
        {isFiltered && (
          <span className="text-[#d97706] font-bold">
            Filtered results active
          </span>
        )}
      </div>

      {/* Product Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
          {filteredProducts.map((model) => {
            const activeCatSlug = selectedCategory !== "All" 
              ? selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
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
        <div className="text-center py-16 bg-[#f6f7f9] border border-[#e7e9ee] rounded-[18px] p-8 space-y-3">
          <Building2 className="w-12 h-12 text-[#6b7280] mx-auto" />
          <h3 className="text-lg font-black uppercase text-[#101114]">
            No Models Match Your Filter Criteria
          </h3>
          <p className="text-xs text-[#6b7280] max-w-md mx-auto">
            Try adjusting your search query, budget tier, or bedrooms filter to discover matching precision models.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="btn-primary py-2.5 px-6 text-xs font-bold rounded-[9px] inline-flex items-center gap-2 cursor-pointer"
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
