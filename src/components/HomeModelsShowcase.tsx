"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BuildingModel } from "@/data/models";
import HomeProductCard, { ProductItem } from "@/components/HomeProductCard";
import { matchProductCategory } from "@/utils/categoryMatching";
import { getCategoryFallbackImage } from "@/lib/publicData";
import { ArrowRight, Layers } from "lucide-react";

interface CategoryTabConfig {
  id: string;
  label: string;
  categoryQuery: string;
  slug: string;
  subtitle: string;
  viewAllHref: string;
}

const HOME_CATEGORY_TABS: CategoryTabConfig[] = [
  {
    id: "all",
    label: "All Homes",
    categoryQuery: "All",
    slug: "buildings",
    subtitle: "Move-in ready and quick-ship precision steel modular residences nationwide.",
    viewAllHref: "/buildings",
  },
  {
    id: "modular-homes",
    label: "Modular Homes",
    categoryQuery: "modular-homes",
    slug: "modular-homes",
    subtitle: "Factory-direct precision residences engineered with commercial light-gauge steel.",
    viewAllHref: "/modular-homes",
  },
  {
    id: "prefab-homes",
    label: "Prefab Homes",
    categoryQuery: "prefab-homes",
    slug: "prefab-homes",
    subtitle: "Climate-controlled prefab living with turn-key assembly and lifetime durability.",
    viewAllHref: "/prefab-homes",
  },
  {
    id: "barndominiums",
    label: "Barndominiums",
    categoryQuery: "barndominiums",
    slug: "barndominiums",
    subtitle: "Open-span steel framing, soaring cathedral ceilings, and modern country living.",
    viewAllHref: "/barndominiums",
  },
  {
    id: "cabins",
    label: "Cabins",
    categoryQuery: "cabins",
    slug: "cabins",
    subtitle: "Handcrafted rustic retreats and modern modular cabins built for all seasons.",
    viewAllHref: "/cabins",
  },
  {
    id: "house-kits",
    label: "House Kits",
    categoryQuery: "house-kits",
    slug: "house-kits",
    subtitle: "Precision-cut light gauge steel framing kits and energy-efficient SIP panel systems.",
    viewAllHref: "/house-kits",
  },
  {
    id: "tiny-homes",
    label: "Tiny Homes",
    categoryQuery: "tiny-homes",
    slug: "tiny-homes",
    subtitle: "Smart small-footprint living maximizing every square foot with premium finishes.",
    viewAllHref: "/tiny-homes",
  },
  {
    id: "adus",
    label: "ADUs & Pods",
    categoryQuery: "adus",
    slug: "adus",
    subtitle: "Detached backyard living units, private home offices, and luxury guest suites.",
    viewAllHref: "/adus",
  },
  {
    id: "a-frames",
    label: "A-Frames",
    categoryQuery: "a-frames",
    slug: "a-frame-homes",
    subtitle: "Iconic architectural steep-pitch rooflines with panoramic glass views.",
    viewAllHref: "/a-frame-homes",
  },
];

interface HomeModelsShowcaseProps {
  allProducts: BuildingModel[];
  initialHomes?: ProductItem[];
}

export default function HomeModelsShowcase({
  allProducts,
  initialHomes = [],
}: HomeModelsShowcaseProps) {
  const [activeTabId, setActiveTabId] = useState<string>("all");

  const activeConfig = useMemo(() => {
    return HOME_CATEGORY_TABS.find((t) => t.id === activeTabId) || HOME_CATEGORY_TABS[0];
  }, [activeTabId]);

  // Filter distinct models for the chosen category tab
  const categoryProducts = useMemo(() => {
    if (activeTabId === "all") {
      return allProducts;
    }
    return allProducts.filter((p) => matchProductCategory(p, activeConfig.categoryQuery));
  }, [allProducts, activeTabId, activeConfig]);

  // Convert top 10 products into ProductItem card format
  const displayHomes: ProductItem[] = useMemo(() => {
    if (activeTabId === "all" && initialHomes.length > 0) {
      return initialHomes;
    }

    const seenRoots = new Set<string>();
    const distinctList = categoryProducts.filter((p) => {
      const root = p.name
        .replace(/\s*-\s*\([A-Z\s]+\s*PRICING\)/i, "")
        .replace(/\s*-\s*[A-Za-z\s]+Pricing.*/i, "")
        .replace(/\s*\(Shipping.*/i, "")
        .trim();
      if (seenRoots.has(root)) return false;
      seenRoots.add(root);
      return true;
    });

    return distinctList.slice(0, 10).map((p, idx) => {
      const cleanName = p.name
        .replace(/\s*-\s*\([A-Z\s]+\s*PRICING\)/i, "")
        .replace(/\s*-\s*[A-Za-z\s]+Pricing.*/i, "")
        .replace(/\s*\(Shipping.*/i, "")
        .trim();

      const badge =
        idx === 0
          ? "Best Seller"
          : idx === 1
          ? "Quick Ship"
          : idx === 2
          ? "Popular"
          : idx === 3
          ? "Top Rated"
          : idx === 5
          ? "Featured"
          : idx === 7
          ? "New Arrival"
          : idx === 9
          ? "Customer Favorite"
          : undefined;

      const fallback = getCategoryFallbackImage(p.category || p.series, p.name, p.slug);
      const img =
        (!p.primaryImage && !p.image) || (p.primaryImage || p.image || "").includes("newmodularlogo")
          ? fallback
          : p.primaryImage || p.image || fallback;

      return {
        id: p.id || String(idx),
        slug: p.slug,
        name: cleanName,
        badge,
        image: img,
        bedrooms: p.bedrooms || 3,
        bathrooms: p.bathrooms || 2,
        sqft: p.sqft || 1600,
        price: p.startingPrice || 189000,
        category: p.category,
      };
    });
  }, [categoryProducts, activeTabId, initialHomes]);

  return (
    <section id="homes" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="wrap">
        {/* Header with Title and Category Counter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 font-sans">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcb907]/15 border border-[#fcb907]/30 text-[#d97706] text-xs font-black uppercase tracking-wider mb-2">
              <span>Architectural Model Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-[-1.3px] text-[#101114] m-0 font-display">
              Homes Available Right Now
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] mt-1.5 mb-0 font-medium max-w-2xl">
              {activeConfig.subtitle}
            </p>
          </div>

          <Link
            href={activeConfig.viewAllHref}
            className="text-[#d97706] hover:text-[#b45309] font-black text-sm sm:text-base hover:underline whitespace-nowrap self-start md:self-auto flex items-center gap-1 group"
          >
            <span>
              {activeTabId === "all"
                ? `View All Models (${allProducts.length})`
                : `View All ${activeConfig.label} (${categoryProducts.length})`}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar scroll-smooth">
          {HOME_CATEGORY_TABS.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#101114] text-[#fcb907] border-[#101114] shadow-md -translate-y-0.5"
                    : "bg-[#f8f9fa] text-[#4b5563] border-[#e7e9ee] hover:bg-gray-100 hover:text-[#101114]"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 5-Column Product Grid */}
        {displayHomes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-4.5">
            {displayHomes.map((home) => (
              <HomeProductCard key={home.id} product={home} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-[#f8f9fa] rounded-[18px] border border-[#e7e9ee] text-[#6b7280]">
            <p className="text-base font-bold text-[#101114]">No models currently listed in this category.</p>
            <p className="text-xs sm:text-sm mt-1 text-[#6b7280]">
              Browse our complete catalog or request custom architectural plans for your land.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/buildings"
                className="px-5 py-2.5 bg-[#fcb907] hover:bg-[#e0a406] text-[#101114] font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                Browse All Models
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Quick-Action Bar */}
        <div className="mt-8 pt-6 border-t border-[#e7e9ee] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-[#6b7280]">
            Showing <strong className="text-[#101114]">{displayHomes.length}</strong> of{" "}
            <strong className="text-[#101114]">{categoryProducts.length}</strong> {activeConfig.label} models engineered for rapid delivery.
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={activeConfig.viewAllHref}
              className="px-5 py-2.5 bg-[#101114] hover:bg-[#202530] text-[#fcb907] font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Explore All {activeConfig.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/quote"
              className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-[#e7e9ee] text-[#101114] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Request Quote</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
