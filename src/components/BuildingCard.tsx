"use client";

import Link from "next/link";
import Image from "next/image";
import { BuildingModel } from "@/data/models";
import { formatPrice } from "@/utils/currency";
import ShareButton from "@/components/ShareButton";
import { getCategoryFallbackImage } from "@/lib/publicData";
import { getProductUrl } from "@/utils/productUrls";

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
    specsList.push(model.bedrooms === 0 ? "Studio" : `${model.bedrooms} Bed`);
  }

  if (model.bathrooms !== undefined && model.bathrooms !== null && model.bathrooms > 0) {
    specsList.push(`${model.bathrooms} Bath`);
  }

  const specsText = specsList.length > 0 ? specsList.join(" | ") : "Precision Modular Construction";
  
  const cleanCatSlug = categorySlug ? categorySlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "") : "";
  const modelUrl = cleanCatSlug && cleanCatSlug !== "all" && cleanCatSlug !== "buildings"
    ? `/${cleanCatSlug}/${model.slug}`
    : getProductUrl(model);

  const fallbackImg = getCategoryFallbackImage(model.category || model.series, model.name, model.slug);
  const rawImage = model.primaryImage || model.image;
  const imageSrc = (!rawImage || rawImage.includes("newmodularlogo") || rawImage.includes("finallogo"))
    ? fallbackImg
    : rawImage;

  return (
    <div className="card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between bg-white relative">
      {/* Image Viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={model.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
        />

        {/* Share Button Overlay */}
        <div className="absolute top-2.5 right-2.5 z-10">
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
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-[#101114] group-hover:text-[#d97706] transition-colors">
            {model.name}
          </h3>
          <p className="text-xs text-[#6b7280] font-medium mt-1">
            {specsText}
          </p>
          <div className="text-lg sm:text-[21px] font-black text-[#d97706] mt-2">
            {formattedPrice}
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-2">
          <Link
            href={modelUrl}
            className="w-full py-2.5 px-4 text-xs font-black rounded-[9px] text-center justify-center bg-[#0f1218] hover:bg-[#fcb907] text-white hover:text-[#101114] transition-all duration-200 shadow-xs flex items-center gap-1.5"
          >
            <span>View Details →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

