import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#111214] py-20 lg:py-24 border-b border-[#2a2d31]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#e11d1d] block mb-2">
              AUTHENTIC PROPERTY INSTALLATIONS
            </span>
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              REAL CUSTOMERS. <span className="text-[#e11d1d]">REAL PEACE OF MIND.</span>
            </h2>
            <p className="mt-2 text-[#a1a1aa] text-sm sm:text-base max-w-xl">
              Hear directly from American families, landowners, and homesteaders who placed their trust in our structural engineering.
            </p>
          </div>

          <Link
            href="#financing"
            className="inline-flex items-center gap-1.5 font-display font-bold uppercase text-xs sm:text-sm tracking-wider text-[#e11d1d] hover:text-[#ff2b2b] transition-colors self-start md:self-auto"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-[6px] bg-[#16181b] border border-[#2a2d31] flex flex-col justify-between hover:border-[#e11d1d]/60 hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <Quote className="w-8 h-8 text-[#2a2d31] absolute top-6 right-6 group-hover:text-[#e11d1d]/30 transition-colors" />

              <div>
                {/* 5 Red Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#e11d1d] text-[#e11d1d]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author & Avatar */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#2a2d31]">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#e11d1d]/40">
                  <Image
                    src={item.avatarUrl}
                    alt={item.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold uppercase text-sm text-white tracking-wide">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#a1a1aa]">
                    {item.roleOrContext} • {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
