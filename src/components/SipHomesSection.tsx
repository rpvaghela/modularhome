import Link from "next/link";
import Image from "next/image";
import { Zap, AlertTriangle, ShieldCheck, Layers, Sparkles } from "lucide-react";
import { BuildingModel } from "@/data/models";
import { isSipHome } from "@/utils/categoryMatching";
import { formatPrice } from "@/utils/currency";
import { getProductUrl } from "@/utils/productUrls";
import { getCategoryFallbackImage } from "@/lib/publicData";
import { sortBySqftAvailability } from "@/utils/productSorting";

interface SipHomesSectionProps {
  products?: BuildingModel[];
}

export default function SipHomesSection({ products = [] }: SipHomesSectionProps) {
  const sipKits = sortBySqftAvailability(
    products.filter((p) => isSipHome(p))
  ).slice(0, 5);

  if (sipKits.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#f4f7f8] border-t border-b border-gray-200/80 font-sans">
      <div className="wrap">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-800 text-[11px] font-black uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>High-Performance SIP Envelopes</span>
              <span className="text-gray-400">•</span>
              <span className="text-red-700">Installation Excluded</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-[-1.2px] text-[#101114] m-0">
              SIP Homes & Panelized Kits
            </h2>
            <p className="text-xs sm:text-base text-[#6b7280] mt-1.5 mb-0 font-medium max-w-2xl">
              Engineered Structural Insulated Panel homes engineered for extreme thermal efficiency, airtight envelope integrity, and rapid jobsite erection.
            </p>
          </div>

          <Link
            href="/sip-homes"
            className="text-teal-700 hover:text-teal-800 font-black text-xs sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1 group"
          >
            <span>Explore All SIP Homes</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white border border-gray-200 rounded-2xl mb-6 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-bold text-[#101114]">R-24 to R-40 EPS Core</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="font-bold text-[#101114]">Airtight Spline System</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-[#101114]">26-Ga Metal Roof & Siding</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-[#101114]">DIY / GC (Install Excluded)</span>
          </div>
        </div>

        {/* 5-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sipKits.map((kit) => {
            const rawImg = kit.primaryImage || kit.image;
            const fallbackImg = getCategoryFallbackImage(kit.category || kit.series, kit.name, kit.slug);
            const imageSrc = (!rawImg || rawImg.includes("newmodularlogo")) ? fallbackImg : rawImg;
            const kitUrl = getProductUrl(kit);
            const price = kit.startingPrice && kit.startingPrice > 0 ? formatPrice(kit.startingPrice) : "Custom Quote";

            return (
              <Link
                key={kit.id || kit.slug}
                href={kitUrl}
                className="group rounded-2xl bg-white border border-gray-200 hover:border-teal-400 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={imageSrc}
                      alt={kit.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-cyan-950/80 backdrop-blur-md text-cyan-200 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border border-cyan-400/30">
                      SIP Envelope
                    </span>
                  </div>

                  <div className="p-3.5">
                    <h3 className="text-sm font-black text-[#101114] group-hover:text-teal-700 transition-colors line-clamp-1 mb-1">
                      {kit.name}
                    </h3>
                    <p className="text-xs text-[#6b7280] m-0 mb-2">
                      {kit.sqft ? `${kit.sqft.toLocaleString()} sq ft` : "High-R SIP Envelope"}
                      {kit.bedrooms ? ` • ${kit.bedrooms} Bed` : ""}
                      {kit.bathrooms ? ` • ${kit.bathrooms} Bath` : ""}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] text-gray-400 uppercase font-bold">From</span>
                      <span className="text-base font-black text-[#101114] group-hover:text-teal-700 transition-colors">
                        {price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-3.5 pb-3.5 pt-0">
                  <div className="w-full py-1.5 rounded-lg bg-teal-50 group-hover:bg-teal-600 text-teal-800 group-hover:text-white text-xs font-bold text-center transition-colors">
                    View SIP Package
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
