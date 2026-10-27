import React from "react";
import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { TRUSTED_MANUFACTURERS } from "@/data/navigation";

export function Manufacturers() {
  return (
    <section id="manufacturers" className="bg-[#111214] py-14 border-b border-[#2a2d31]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 text-center md:text-left">
          <div>
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#e11d1d] block mb-1">
              DEFENSE FABRICATION NETWORK
            </span>
            <h3 className="font-display font-black uppercase text-xl sm:text-2xl text-white tracking-wide">
              TRUSTED MANUFACTURERS & PARTNERS
            </h3>
          </div>

          <Link
            href="#financing"
            className="inline-flex items-center justify-center gap-1.5 font-display font-bold uppercase text-xs tracking-wider text-[#a1a1aa] hover:text-[#e11d1d] transition-colors"
          >
            <span>View All Manufacturers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Logo Rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRUSTED_MANUFACTURERS.map((name) => (
            <div
              key={name}
              className="h-20 rounded-[4px] bg-[#16181b] border border-[#2a2d31] flex flex-col items-center justify-center p-3 text-center hover:border-[#e11d1d]/50 hover:bg-[#1a1c20] transition-colors group cursor-default"
            >
              <Shield className="w-4 h-4 text-[#71717a] group-hover:text-[#e11d1d] transition-colors mb-1.5" />
              <span className="font-display font-extrabold uppercase text-[11px] sm:text-xs tracking-wider text-[#cbd5e1] group-hover:text-white transition-colors leading-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
