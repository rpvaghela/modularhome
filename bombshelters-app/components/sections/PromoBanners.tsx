import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="bg-[#0a0a0a] py-14 border-b border-[#2a2d31]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner 1: Luxury Bunkers */}
          <div className="relative rounded-[6px] overflow-hidden border border-[#2a2d31] bg-[#111214] p-8 sm:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] group">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Subterranean Living"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-30 filter grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#e11d1d]/20 border border-[#e11d1d]/40 text-[#e11d1d] text-xs font-display font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Underground Architecture</span>
              </div>
              <h3 className="font-display font-black uppercase text-2xl sm:text-3xl text-white tracking-wide leading-tight">
                LUXURY BUNKERS
              </h3>
              <p className="mt-2 text-[#cbd5e1] text-sm leading-relaxed">
                High-end underground living without compromise. Self-sustaining power, bespoke finishes, and multi-year life-support redundancy.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href="#featured-models"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-redGlow group-hover:translate-x-1"
              >
                <span>EXPLORE LUXURY BUNKERS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Banner 2: Steel Framed Homes */}
          <div className="relative rounded-[6px] overflow-hidden border border-[#2a2d31] bg-[#111214] p-8 sm:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] group">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                alt="Steel Framed Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-30 filter grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#16181b] border border-[#2a2d31] text-[#cbd5e1] text-xs font-display font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e11d1d]" />
                <span>Heavy-Gauge Resilience</span>
              </div>
              <h3 className="font-display font-black uppercase text-2xl sm:text-3xl text-white tracking-wide leading-tight">
                STEEL FRAMED HOMES
              </h3>
              <p className="mt-2 text-[#cbd5e1] text-sm leading-relaxed">
                Modern. Strong. Affordable. Built for the future. Immune to rot, termites, and fire, engineered to withstand EF-5 hurricane force winds.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href="#featured-models"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-[#16181b] hover:bg-[#202428] border border-[#2a2d31] hover:border-white/40 text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm transition-all group-hover:translate-x-1"
              >
                <span>EXPLORE STEEL HOMES</span>
                <ArrowRight className="w-4 h-4 text-[#e11d1d]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
