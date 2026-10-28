import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BANNERS = [
  {
    title: "Luxury Bunkers",
    copy: ["High-end underground", "living without compromise."],
    cta: "Explore Luxury Bunkers",
    imageUrl: "/images/cat-luxury-bunkers.png",
    alt: "Luxury underground bunker living room",
  },
  {
    title: "Steel Framed Homes",
    copy: ["Modern. Strong. Affordable.", "Built for the future."],
    cta: "Explore Steel Homes",
    imageUrl: "/images/cat-steel-framed-homes.png",
    alt: "Modern steel framed home at dusk",
  },
];

export function PromoBanners() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {BANNERS.map((banner) => (
          <Link
            key={banner.title}
            href="#featured-models"
            className="relative min-h-[260px] sm:min-h-[300px] overflow-hidden flex items-center justify-end group"
          >
            <Image
              src={banner.imageUrl}
              alt={banner.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/55 to-black/10" />

            <div className="relative z-10 w-full sm:w-auto max-w-sm px-6 sm:px-10 py-10">
              <h3 className="font-display font-bold uppercase text-3xl sm:text-4xl text-white tracking-tight leading-none">
                {banner.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#e2e8f0] leading-snug">
                {banner.copy[0]}
                <br />
                {banner.copy[1]}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-[#e11d1d] group-hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-xs sm:text-sm transition-colors shadow-redGlow">
                {banner.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
