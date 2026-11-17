"use client";

import Link from "next/link";
import Image from "next/image";
import { BuildingModel } from "@/data/models";
import { formatPrice } from "@/utils/currency";
import ShareButton from "@/components/ShareButton";
import { getCategoryFallbackImage } from "@/lib/publicData";
import { getProductUrl } from "@/utils/productUrls";
import { isSteelHouseKit, isBudgetHouseKit, isSipHome } from "@/utils/categoryMatching";

interface BuildingCardProps {
  model: BuildingModel;
  priority?: boolean;
  categorySlug?: string;
}

export default function BuildingCard({ model, priority = false, categorySlug }: BuildingCardProps) {
  const formattedPrice = model.startingPrice && model.startingPrice > 0 
    ? formatPrice(model.startingPrice) 
    : "Custom Quote";

  const specsList: string[] = [];
  if (model.sqft && model.sqft > 0) {
    specsList.push(`${new Intl.NumberFormat("en-US").format(model.sqft)} sq ft`);
  } else if (model.dimensions) {
    specsList.push(model.dimensions);
  }

  if (model.bedrooms !== undefined && model.bedrooms !== null) {
    if (model.bedrooms > 0) {
      specsList.push(`${model.bedrooms} Bed`);
    } else if (
      model.category === "ADUs & Granny Pods" ||
      model.category === "Tiny Homes" ||
      model.name.toLowerCase().includes("studio") ||
      model.name.toLowerCase().includes("bungalow") ||
      (model.sqft && model.sqft <= 500)
    ) {
      specsList.push("Studio");
    }
  }

  if (model.bathrooms !== undefined && model.bathrooms !== null && model.bathrooms > 0) {
    specsList.push(`${model.bathrooms} Bath`);
  }

  const specsText = specsList.length > 0 ? specsList.join(" | ") : "Precision Modular Construction";
  
  // Always use the definitive canonical category path for the product link to eliminate canonicalised URL warnings
  const modelUrl = getProductUrl(model);

  const fallbackImg = getCategoryFallbackImage(model.category || model.series, model.name, model.slug);
  const rawImage = model.primaryImage || model.image;
  const imageSrc = (!rawImage || rawImage.includes("newmodularlogo") || rawImage.includes("finallogo"))
    ? fallbackImg
    : rawImage;

  const isSteelKit = isSteelHouseKit(model);
  const isSipKit = !isSteelKit && isSipHome(model);
  const isBudgetKit = !isSteelKit && !isSipKit && isBudgetHouseKit(model);
  const isShelter =
    model.category === "Bomb Shelters" ||
    model.product_type === "Bomb Shelters" ||
    Boolean(rawImage && rawImage.includes("/shelter-plans/")) ||
    Boolean(model.architecturalStyle && model.architecturalStyle.toLowerCase().includes("bunker")) ||
    model.name.toLowerCase().includes("bombshelter");

  return (
    <div className="card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between bg-white relative border border-gray-100 shadow-sm hover:shadow-md font-sans">
      {/* Image Viewport (Clickable to details) */}
      <Link
        href={modelUrl}
        className={`relative aspect-[16/10] w-full overflow-hidden block ${
          isShelter ? "bg-[#f8f9fa] p-2" : "bg-gray-100"
        }`}
      >
        <Image
          src={imageSrc}
          alt={model.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={
            isShelter
              ? "object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-105"
              : "object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          }
        />

        {/* Shelter Hardened Badge - Obsidian & Gold ModularHome Theme */}
        {isShelter && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#0f1218]/90 backdrop-blur-md text-[#fcb907] border border-[#fcb907]/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-pulse" />
            <span>Subterranean • Bunker</span>
          </div>
        )}

        {/* Installation Status Badge */}
        {isSteelKit && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#0f1218]/90 backdrop-blur-md text-[#fcb907] border border-[#fcb907]/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Installed Shell</span>
          </div>
        )}
        {isSipKit && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#0f1923]/90 backdrop-blur-md text-cyan-200 border border-cyan-400/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SIP • High-R Envelope</span>
          </div>
        )}
        {isBudgetKit && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#101114]/90 backdrop-blur-md text-amber-200 border border-white/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>DIY • Install Excluded</span>
          </div>
        )}

        {/* Share Button Overlay */}
        <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
          <ShareButton
            variant="icon"
            item={{
              title: model.name,
              url: modelUrl,
              description: `${model.name} - ${specsText}. Starting at ${formattedPrice}`,
              image: imageSrc,
              category: model.category || model.series,
              price: formattedPrice,
            }}
            buttonTitle={`Share ${model.name}`}
          />
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white font-sans">
        <div>
          <Link href={modelUrl} className="block group/title">
            <h3 className="font-sans text-base sm:text-lg font-black tracking-tight text-[#101114] group-hover/title:text-[#d97706] transition-colors line-clamp-2 min-h-[2.5rem]">
              {model.name}
            </h3>
          </Link>
          <p className="text-xs text-[#6b7280] font-medium mt-1 font-sans">
            {specsText}
          </p>
          <div className="text-lg sm:text-[21px] font-black text-[#d97706] mt-2 font-sans">
            {formattedPrice}
          </div>
        </div>

        {/* Action Buttons: View Model & Get Quote in ModularHome Theme */}
        <div className="pt-2 flex items-center gap-2 font-sans">
          <Link
            href={modelUrl}
            className="flex-1 py-2.5 px-3 text-xs font-black rounded-[9px] text-center justify-center bg-[#0f1218] hover:bg-[#1a202c] text-white transition-all duration-200 shadow-xs flex items-center gap-1"
          >
            <span>View Details →</span>
          </Link>
          <Link
            href={`/quote?model=${encodeURIComponent(model.slug || model.id)}`}
            className="py-2.5 px-3.5 text-xs font-black rounded-[9px] text-center justify-center bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] transition-all duration-200 shadow-xs flex items-center gap-1"
          >
            <span>Get Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

