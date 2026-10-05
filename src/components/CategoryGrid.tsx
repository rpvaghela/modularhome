import Link from "next/link";
import Image from "next/image";
import { PublicCollection, HomeTypeCategoryItem } from "@/lib/publicData";

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  href: string;
  productCount?: number;
  tagline?: string;
}

interface CategoryGridProps {
  categories?: (HomeTypeCategoryItem | CategoryItem)[];
  collections?: PublicCollection[];
}

export default function CategoryGrid({ categories, collections }: CategoryGridProps) {
  let displayItems: CategoryItem[] = [];

  if (categories && categories.length > 0) {
    displayItems = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      image: cat.image,
      href: cat.href,
      productCount: cat.productCount,
      tagline: cat.tagline,
    }));
  } else if (collections && collections.length > 0) {
    // Sort collections by relevance: prioritize primary home categories, then by product count
    const sortedCollections = collections.slice().sort((a, b) => {
      const aIsPrimary = /modular|prefab|cabin|barndo|kit|turnkey|affordable|log home|adu|tiny|house plans/i.test(a.name);
      const bIsPrimary = /modular|prefab|cabin|barndo|kit|turnkey|affordable|log home|adu|tiny|house plans/i.test(b.name);
      if (aIsPrimary && !bIsPrimary) return -1;
      if (!aIsPrimary && bIsPrimary) return 1;
      return (b.productCount || 0) - (a.productCount || 0);
    });

    displayItems = sortedCollections.slice(0, 10).map((col) => {
      let img = col.image || col.bannerImage;
      if (!img || img.includes("placeholder") || img.includes("newmodularlogo") || img.includes("finallogo")) {
        const lower = col.name.toLowerCase();
        if (lower.includes("barndo")) img = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM3945-front_1.png?v=1750743065";
        else if (lower.includes("cabin")) img = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345";
        else if (lower.includes("kit")) img = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m1_ce95e0cb-7b02-4d09-b913-1fc48d1b48f1.jpg?v=1774680383";
        else if (lower.includes("tiny")) img = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418";
        else if (lower.includes("adu") || lower.includes("granny")) img = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308";
        else if (lower.includes("a-frame") || lower.includes("aframe")) img = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284";
        else img = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";
      }

      return {
        id: col.id,
        name: col.name,
        image: img,
        href: `/buildings?category=${encodeURIComponent(col.slug || col.name)}`,
        productCount: col.productCount,
      };
    });
  }

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-16 bg-[#f6f7f9]">
      <div className="wrap">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8 font-sans">
          <div>
            <h2 className="font-sans text-2xl sm:text-4xl font-black tracking-[-1.2px] text-[#101114] m-0">
              Shop by Home Type
            </h2>
            <p className="font-sans text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0 font-medium">
              Explore our most popular home categories and engineered architectural series.
            </p>
          </div>
          <Link
            href="/buildings"
            className="font-sans text-[#d97706] hover:text-[#b45309] font-black text-xs sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1 group"
          >
            <span>View All Categories ({displayItems.length})</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* 10 Canonical Category Cards 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4.5 font-sans">
          {displayItems.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group rounded-2xl bg-white border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 block"
            >
              <div className="relative h-[120px] xs:h-[135px] sm:h-[155px] w-full overflow-hidden bg-gray-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="p-3 sm:p-3.5 bg-white flex items-center justify-between gap-2 border-t border-gray-100">
                <h3 className="font-sans text-xs sm:text-[13.5px] font-bold text-[#101114] group-hover:text-[#b45309] transition-colors m-0 truncate tracking-tight">
                  {cat.name}
                </h3>
                {typeof cat.productCount === "number" && cat.productCount > 0 && (
                  <span className="font-sans text-[10px] sm:text-[11px] font-bold text-[#6b7280] bg-gray-100 group-hover:bg-[#fcb907]/20 group-hover:text-[#926002] px-2 py-0.5 rounded-full shrink-0 transition-colors">
                    ({cat.productCount})
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

