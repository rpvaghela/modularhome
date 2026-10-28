import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ShopByCategory() {
  return (
    <section className="bg-white text-[#0a0a0a] py-14 lg:py-16">
      <div className="site-container">
        <SectionHeading
          title="Shop by"
          highlight="Category"
          subtitle="Explore our wide range of shelters and survival solutions for every need."
          linkLabel="View All Categories"
          linkHref="/models"
        />

        {/* 6 Category Cards (horizontal rail on mobile, single row on desktop) */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.link}
              className="min-w-[200px] sm:min-w-0 flex flex-col rounded-[4px] overflow-hidden bg-[#111214] shadow-md hover:shadow-2xl hover:ring-2 hover:ring-[#e11d1d] transition-all duration-300 snap-start group"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={cat.imageUrl}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 33vw, 200px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#111214] to-transparent" />
              </div>

              <div className="flex-1 flex flex-col items-center text-center px-3 pt-1 pb-4">
                <h3 className="font-display font-bold uppercase text-[15px] tracking-wide text-white">
                  {cat.title}
                </h3>
                <p className="mt-1 text-[12px] text-[#cbd5e1] leading-snug min-h-[32px]">
                  {cat.tagline}
                </p>
                <span className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-[3px] bg-[#e11d1d] group-hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-[11px] transition-colors">
                  Shop Now
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
