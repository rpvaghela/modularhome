import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, HardHat, CheckCircle2, Zap, Layers } from "lucide-react";
import { BuildingModel } from "@/data/models";
import { isSteelHouseKit } from "@/utils/categoryMatching";
import { formatPrice } from "@/utils/currency";
import { getProductUrl } from "@/utils/productUrls";
import { getCategoryFallbackImage } from "@/lib/publicData";
import { sortBySqftAvailability } from "@/utils/productSorting";

interface SteelHouseKitsSectionProps {
  products?: BuildingModel[];
}

export default function SteelHouseKitsSection({ products = [] }: SteelHouseKitsSectionProps) {
  const steelKits = sortBySqftAvailability(
    products.filter((p) => isSteelHouseKit(p))
  ).slice(0, 5);

  return (
    <section className="py-12 sm:py-16 bg-[#090d14] text-white font-sans border-b border-gray-800">
      <div className="wrap">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcb907]/15 border border-[#fcb907]/30 text-[#fcb907] text-[11px] font-black uppercase tracking-wider mb-2">
              <HardHat className="w-3.5 h-3.5" />
              <span>Amish Built Cabins Steel Kits Process</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400">Professional Installation Included</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-[-1.2px] text-white m-0">
              Steel House Kits & Barndominiums
            </h2>
            <p className="text-xs sm:text-base text-gray-300 mt-1.5 mb-0 font-medium max-w-2xl">
              Commercial-grade 16-gauge cold-formed steel frames engineered for 140–160+ MPH winds. Every package includes certified factory on-site shell installation on your concrete slab.
            </p>
          </div>

          <Link
            href="/steel-house-kits"
            className="text-[#fcb907] hover:text-amber-300 font-black text-xs sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1 group"
          >
            <span>Explore All Steel Kits</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#121824] border border-gray-800 rounded-2xl mb-6 shadow-xs text-xs text-gray-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-white">Full Installation Included</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#fcb907] shrink-0" />
            <span className="font-bold text-white">16-Gauge Commercial Steel</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-white">ZIP Wall & Roof Sheathing</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="font-bold text-white">Crew Installs Windows/Doors</span>
          </div>
        </div>

        {/* 5-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steelKits.map((kit) => {
            const rawImg = kit.primaryImage || kit.image;
            const fallbackImg = getCategoryFallbackImage(kit.category || kit.series, kit.name, kit.slug);
            const imageSrc = (!rawImg || rawImg.includes("newmodularlogo")) ? fallbackImg : rawImg;
            const kitUrl = getProductUrl(kit);
            const price = kit.startingPrice && kit.startingPrice > 0 ? formatPrice(kit.startingPrice) : "Custom Quote";

            return (
              <Link
                key={kit.id || kit.slug}
                href={kitUrl}
                className="group rounded-2xl bg-[#121824] border border-gray-800 hover:border-[#fcb907] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                    <Image
                      src={imageSrc}
                      alt={kit.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                      Install Included
                    </span>
                  </div>

                  <div className="p-3.5">
                    <h3 className="text-sm font-black text-white group-hover:text-[#fcb907] transition-colors line-clamp-1 mb-1">
                      {kit.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium m-0">
                      {kit.sqft > 0 ? `${kit.sqft} sq ft • ` : ""}{kit.bedrooms > 0 ? `${kit.bedrooms} Bed` : "16-Ga Steel Frame"}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-gray-800/80 flex items-center justify-between">
                  <span className="text-sm font-black text-[#fcb907]">{price}</span>
                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-[#fcb907] flex items-center gap-0.5">
                    Details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

