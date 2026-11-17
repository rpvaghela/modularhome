"use client";

import Link from "next/link";
import Image from "next/image";
import ShareButton from "@/components/ShareButton";
import { getProductUrl } from "@/utils/productUrls";

export interface ProductItem {
  id: string;
  slug?: string;
  name: string;
  badge?: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  meta?: string;
  price: string | number;
  category?: string;
}

interface HomeProductCardProps {
  product: ProductItem;
}

export default function HomeProductCard({ product }: HomeProductCardProps) {
  const formattedPrice = typeof product.price === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(product.price)
    : product.price;

  const metaString = product.meta || (
    product.sqft 
      ? `${product.bedrooms} Bed | ${product.bathrooms} Bath | ${new Intl.NumberFormat("en-US").format(product.sqft)} Sq Ft`
      : `${product.bedrooms} Bed | ${product.bathrooms} Bath`
  );

  const href = product.slug ? getProductUrl(product) : `/buildings`;
  const isShelter =
    product.category === "Bomb Shelters" ||
    Boolean(product.image && product.image.includes("/shelter-plans/")) ||
    product.name.toLowerCase().includes("bombshelter") ||
    product.name.toLowerCase().includes("bunker");

  return (
    <div className="card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between relative bg-white border border-gray-100">
      {/* Optional Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-[#fcb907] text-[#101114] px-2.5 py-1 rounded-[8px] text-[11px] font-black shadow-sm tracking-tight">
          {product.badge}
        </span>
      )}

      {/* Product Image (Clickable) */}
      <Link
        href={href}
        className={`relative h-[170px] sm:h-[185px] w-full overflow-hidden block ${
          isShelter ? "bg-[#f8f9fa] p-2" : "bg-gray-100"
        }`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
          className={
            isShelter
              ? "object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-105"
              : "object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          }
        />

        {/* Share Button Overlay */}
        <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
          <ShareButton
            variant="icon"
            item={{
              title: product.name,
              url: href,
              description: `${product.name} - ${metaString}. Starting at ${formattedPrice}`,
              image: product.image,
              category: product.badge || "Modular Home",
              price: formattedPrice,
            }}
            buttonTitle={`Share ${product.name}`}
          />
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between font-sans">
        <div>
          <h3 className="font-sans text-base sm:text-[17px] font-black text-[#101114] mb-1 group-hover:text-[#d97706] transition-colors line-clamp-2 min-h-[44px] sm:min-h-[50px] leading-snug">
            {product.name}
          </h3>
          <div className="font-sans text-[13px] text-[#6b7280] font-medium">
            {metaString}
          </div>
          <div className="font-sans text-[20px] sm:text-[22px] text-[#101114] font-black my-2.5 flex items-baseline gap-1">
            <span className="text-[#d97706]">{formattedPrice}</span>
          </div>
        </div>

        {/* Action Buttons: View Model & Get Quote in ModularHome Theme */}
        <div className="pt-2 flex items-center gap-2 font-sans">
          <Link
            href={href}
            className="flex-1 py-2.5 px-3 text-xs font-black rounded-[9px] text-center justify-center bg-[#0f1218] hover:bg-[#1a202c] text-white transition-all duration-200 shadow-xs flex items-center gap-1 font-sans"
          >
            <span>View Details →</span>
          </Link>
          <Link
            href={`/quote?model=${encodeURIComponent(product.slug || product.id)}`}
            className="py-2.5 px-3.5 text-xs font-black rounded-[9px] text-center justify-center bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] transition-all duration-200 shadow-xs flex items-center gap-1 font-sans"
          >
            <span>Get Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

