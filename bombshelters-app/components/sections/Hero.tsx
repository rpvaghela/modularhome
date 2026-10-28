import React from "react";
import Image from "next/image";
import { Radiation, CloudLightning, ShieldAlert, Tornado, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Entrance animations are pure CSS (see .hero-rise in globals.css) so the copy is always visible,
// even before/without client-side hydration.
export function Hero() {
  const threatPillars = [
    { title: ["Nuclear", "Threats"], icon: <Radiation className="w-7 h-7" strokeWidth={2} /> },
    { title: ["Natural", "Disasters"], icon: <Tornado className="w-7 h-7" strokeWidth={2} /> },
    { title: ["Civil", "Unrest"], icon: <ShieldAlert className="w-7 h-7" strokeWidth={2} /> },
    { title: ["Extreme", "Weather"], icon: <CloudLightning className="w-7 h-7" strokeWidth={2} /> },
  ];

  return (
    <section className="relative min-h-[560px] lg:min-h-[600px] lg:h-[calc(100vh-120px)] lg:max-h-[760px] flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Family watching the horizon beside an underground bomb shelter entrance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 via-45% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Same edge as the logo and nav (see .site-container) */}
      <div className="relative z-10 site-container py-10 lg:py-8">
        {/* Headline */}
        <h1 className="hero-rise font-display font-bold uppercase leading-[0.92] tracking-[-0.01em] text-heavy max-w-[760px]">
          <span className="block text-white text-[38px] sm:text-[56px] lg:text-[64px] 2xl:text-[72px] drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]">
            The World Is
          </span>
          <span className="block text-[#ff1f1f] text-[44px] sm:text-[68px] lg:text-[80px] 2xl:text-[92px] drop-shadow-[0_0_30px_rgba(225,29,29,0.5)]">
            Unpredictable.
          </span>
          <span className="block text-white text-[28px] sm:text-[42px] lg:text-[48px] 2xl:text-[54px] mt-1 drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]">
            Your Family&apos;s Safety
          </span>
        </h1>
        <p
          className="hero-rise brush-underline font-brush normal-case -rotate-2 text-[#ff1f1f] text-[36px] sm:text-[52px] lg:text-[58px] 2xl:text-[66px] leading-none mt-1 ml-1 drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]"
          style={{ animationDelay: "0.1s" }}
          aria-hidden="true"
        >
          SHOULDN&apos;T BE.
        </p>

        {/* 4 Threat Pillars */}
        <div className="hero-rise flex flex-wrap gap-4 sm:gap-6 mt-12 mb-10" style={{ animationDelay: "0.2s" }}>
          {threatPillars.map((item) => (
            <div key={item.title[0]} className="flex flex-col items-center text-center w-[72px] group">
              <div className="w-[56px] h-[56px] 2xl:w-[62px] 2xl:h-[62px] rounded-full bg-[#e11d1d] ring-2 ring-white/90 ring-offset-2 ring-offset-black/60 text-white flex items-center justify-center mb-2.5 shadow-redGlow group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[12px] font-display font-bold uppercase tracking-wide text-white leading-[1.1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {item.title[0]}
                <br />
                {item.title[1]}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          className="hero-rise flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <Button asLink href="#featured-models" size="lg" showArrow className="text-sm px-7 py-3.5 shadow-redGlow">
            Explore Shelters
          </Button>
          <a
            href="#financing"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-[4px] border-2 border-white/80 bg-black/50 backdrop-blur-sm hover:bg-white hover:text-[#0a0a0a] text-white font-display font-bold uppercase tracking-wider text-sm transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Request Consultation</span>
          </a>
        </div>
      </div>
    </section>
  );
}
