import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { FEATURED_MODELS } from "@/data/products";

export function FeaturedModels() {
  const badgeColorStyles: Record<string, string> = {
    green: "bg-[#15803d] text-white",
    gold: "bg-[#b45309] text-white",
    blue: "bg-[#1d4ed8] text-white",
    red: "bg-[#b91c1c] text-white",
    purple: "bg-[#7e22ce] text-white",
  };

  return (
    <section id="featured-models" className="bg-[#f8fafc] text-[#0a0a0a] py-20 lg:py-24 border-b border-[#e2e8f0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#e11d1d] block mb-2">
              VERIFIED ARCHITECTURAL SPECIFICATIONS
            </span>
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0a0a0a]">
              FEATURED <span className="text-[#e11d1d]">MODELS</span>
            </h2>
            <p className="mt-2 text-[#4a5568] text-sm sm:text-base max-w-xl">
              Turnkey delivery, stamped engineering drawings, and heavy-gauge steel structures ready for rapid deployment.
            </p>
          </div>

          <Link
            href="#featured-models"
            className="inline-flex items-center gap-1.5 font-display font-bold uppercase text-xs sm:text-sm tracking-wider text-[#e11d1d] hover:text-[#b91c1c] transition-colors self-start md:self-auto"
          >
            <span>View All Models</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_MODELS.map((model) => (
            <div
              key={model.id}
              className="flex flex-col rounded-[6px] overflow-hidden border border-[#e2e8f0] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Image & Badges */}
              <div className="relative h-60 w-full overflow-hidden bg-[#111214]">
                <Image
                  src={model.imageUrl}
                  alt={model.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-block text-[10px] font-display font-black tracking-widest uppercase px-2.5 py-1 rounded-[3px] shadow ${
                      badgeColorStyles[model.badge.color] || "bg-gray-800 text-white"
                    }`}
                  >
                    {model.badge.text}
                  </span>
                </div>

                {/* Category tag */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-display font-semibold uppercase px-2 py-0.5 rounded-[3px]">
                  {model.category}
                </div>

                {/* Price Display */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-white/70 block">
                      Starting From
                    </span>
                    <span className="text-2xl font-display font-black text-white tracking-tight">
                      {model.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display font-extrabold uppercase text-lg text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors leading-snug">
                    {model.name}
                  </h3>
                  <p className="mt-2 text-xs text-[#4a5568] leading-relaxed line-clamp-2">
                    {model.description}
                  </p>
                </div>

                {/* 2 Spec Icons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f1f5f9] text-xs text-[#334155]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Users className="w-4 h-4 text-[#e11d1d] shrink-0" />
                    <span className="truncate">{model.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Shield className="w-4 h-4 text-[#e11d1d] shrink-0" />
                    <span className="truncate">{model.specs}</span>
                  </div>
                </div>

                {/* Key Bullet Features */}
                <div className="space-y-1.5 pt-1">
                  {model.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA Button */}
                <div className="pt-2">
                  <Link
                    href="#financing"
                    className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-[4px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-bold uppercase tracking-wider text-xs transition-colors shadow-sm gap-2"
                  >
                    <span>VIEW DETAILS & QUOTE</span>
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
