import React from "react";
import Link from "next/link";
import { Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function CtaBanner({
  title = "Ready to Engineer Your Hardened Shelter?",
  subtitle = "Speak directly with a certified structural blast engineer. We provide transparent turnkey estimates, site soil analysis, and certified blueprints.",
  ctaText = "Get Your Custom Quote",
  ctaHref = "/quote",
}: CtaBannerProps) {
  return (
    <section className="bg-[#111317] border-y border-[#22252a] text-white py-12 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#e11d1d]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-[#ff4d4d] text-xs font-display font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-[#e11d1d]" />
            <span>Turnkey Subterranean & Above-Ground Solutions</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
          <a
            href="tel:812-595-4033"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[3px] border border-[#2a2d33] hover:border-white bg-[#1a1c22] text-white font-display font-bold text-sm tracking-wide transition-colors"
          >
            <Phone className="w-4 h-4 text-[#e11d1d]" />
            <span>812-595-4033</span>
          </a>

          <Button asLink href={ctaHref} size="lg" className="w-full sm:w-auto text-sm px-6 py-3.5">
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

