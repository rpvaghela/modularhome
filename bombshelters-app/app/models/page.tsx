"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  Shield,
  ArrowRight,
  Award,
  Crown,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { FEATURED_MODELS, ProductModel } from "@/data/products";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
  "All Models",
  "Bomb Shelters",
  "Storm Shelters",
  "Safe Rooms",
  "Luxury Bunkers",
  "Steel Framed Homes",
  "Cabins",
  "Barndominiums",
  "House Kits",
  "Tiny Homes",
  "ADUs & Granny Pods",
  "A-Frames",
  "Commercial",
];

export default function ModelsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Models");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [modelsList, setModelsList] = useState<ProductModel[]>(FEATURED_MODELS);

  useEffect(() => {
    fetch("/api/bombshelter/products")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setModelsList(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const badgeStyles: Record<string, { className: string; icon: React.ReactNode }> = {
    green: { className: "bg-[#16a34a]", icon: <Award className="w-3 h-3" /> },
    gold: { className: "bg-[#d97706]", icon: <Crown className="w-3 h-3" /> },
    blue: { className: "bg-[#2563eb]", icon: <Flame className="w-3 h-3" /> },
    red: { className: "bg-[#e11d1d]", icon: <Sparkles className="w-3 h-3" /> },
    purple: { className: "bg-[#7c3aed]", icon: <TrendingUp className="w-3 h-3" /> },
  };

  const filteredModels = useMemo(() => {
    let result = modelsList.filter((model) => {
      const matchCat =
        selectedCategory === "All Models" ||
        model.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(model.category.toLowerCase());
      const matchSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.rawPrice - a.rawPrice);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, modelsList]);

  return (
    <>
      <SubPageHeader
        badge="CERTIFIED SHELTERS & RESIDENCES"
        title="ALL BOMBSHELTER"
        highlight="MODELS"
        description="Explore our complete catalog of blast-rated bomb shelters, severe storm bunkers, ballistic safe rooms, and resilient steel cabins."
        breadcrumbs={[{ label: "Models Catalog" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, blast ratings, specs..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#e11d1d] focus:ring-1 focus:ring-[#e11d1d]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-4">
              <span className="text-xs text-gray-500 font-medium">
                Showing <strong>{filteredModels.length}</strong> Models
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#e11d1d]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0a0a0a] text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Models */}
          {filteredModels.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <Shield className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-gray-800">No Models Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No shelters matched your current filter criteria. Try clearing your search or switching categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Models");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded bg-[#e11d1d] text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModels.map((model) => {
                const badge = badgeStyles[model.badge.color] || badgeStyles.red;
                return (
                  <div
                    key={model.id}
                    className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d]/60 transition-all duration-300 group"
                  >
                    {/* Image & Badge */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-950">
                      <Image
                        src={model.imageUrl}
                        alt={model.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span
                        className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[10px] font-display font-bold tracking-wider uppercase text-white px-2 py-1 rounded shadow ${badge.className}`}
                      >
                        {badge.icon}
                        {model.badge.text}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-1">
                          {model.category}
                        </div>
                        <h3 className="font-display font-bold text-base text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors line-clamp-2 min-h-[44px]">
                          {model.name}
                        </h3>
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                          {model.description}
                        </p>

                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-xs text-gray-400">Starting from</span>
                          <span className="font-display font-black text-xl text-[#e11d1d] tracking-tight">
                            {model.price}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>{model.capacity}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[100px]">{model.specs}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 flex items-center gap-2">
                        <Link
                          href={`/models/${model.id}`}
                          className="flex-1 py-2 px-3 rounded bg-gray-100 hover:bg-[#0a0a0a] hover:text-white text-[#0a0a0a] font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors"
                        >
                          Specs &amp; Details
                        </Link>
                        <Link
                          href={`/quote?model=${model.id}`}
                          className="py-2 px-3 rounded bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Quote</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        title="Need a Custom Engineered Blueprint?"
        subtitle="Every property is unique. Our CAD drafting team customizes wall thickness, door blast ratings, and life-support capacities for any family or corporate requirement."
        ctaText="Upload Custom Blueprint"
        ctaHref="/upload-floor-plan"
      />
    </>
  );
}

