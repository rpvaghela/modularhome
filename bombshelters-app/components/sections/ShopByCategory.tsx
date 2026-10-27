import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export function ShopByCategory() {
  return (
    <section className="bg-white text-[#0a0a0a] py-20 lg:py-24 border-b border-[#e2e8f0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#e11d1d] block mb-2">
              ENGINEERED DEFENSE SOLUTIONS
            </span>
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0a0a0a]">
              SHOP BY <span className="text-[#e11d1d]">CATEGORY</span>
            </h2>
            <p className="mt-2 text-[#4a5568] text-sm sm:text-base max-w-xl">
              From subterranean blast vaults to modular steel cabins, choose from certified models built to secure life and liberty.
            </p>
          </div>

          <Link
            href="#featured-models"
            className="inline-flex items-center gap-1.5 font-display font-bold uppercase text-xs sm:text-sm tracking-wider text-[#e11d1d] hover:text-[#b91c1c] transition-colors self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Category Cards Grid (Horizontal scroll on mobile) */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-0 flex-1 flex flex-col rounded-[6px] overflow-hidden border border-[#e2e8f0] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 snap-center group"
            >
              {/* Card Image with overlay gradient and badge */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#111214]">
                <Image
                  src={cat.imageUrl}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {cat.badge && (
                  <span className="absolute top-3 left-3 bg-[#e11d1d] text-white text-[10px] font-display font-bold uppercase tracking-wider px-2.5 py-1 rounded-[3px] shadow">
                    {cat.badge}
                  </span>
                )}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display font-extrabold uppercase text-xl sm:text-2xl text-white tracking-wide">
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Card Content & Action */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed line-clamp-3">
                  {cat.description}
                </p>

                <div className="pt-2">
                  <Link
                    href={cat.link}
                    className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-[4px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-bold uppercase tracking-wider text-xs transition-colors shadow-sm gap-2"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
