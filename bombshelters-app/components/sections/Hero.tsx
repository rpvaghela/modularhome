import React from "react";
import Image from "next/image";
import { Radiation, CloudLightning, ShieldAlert, Tornado, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Entrance animations are pure CSS (see .hero-rise in globals.css) so the copy is always visible,
// even before/without client-side hydration.
export function Hero() {
  const threats = [
    { label: "Nuclear threats", Icon: Radiation },
    { label: "Natural disasters", Icon: Tornado },
    { label: "Civil unrest", Icon: ShieldAlert },
    { label: "Extreme weather", Icon: CloudLightning },
  ];

  return (
    <section className="w-full bg-[#ffffff] pt-2 sm:pt-4 overflow-hidden">
      <div className="site-container">
        <div className="hero-fluid relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center lg:flex-col lg:items-stretch overflow-hidden bg-[#0a0a0a] rounded-t-xl sm:rounded-t-2xl border-t border-x border-[#1f2226]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-bg.png"
              alt="Family watching the horizon beside an underground bomb shelter entrance"
              fill
              priority
              sizes="(max-width: 1312px) 100vw, 1312px"
              className="object-cover object-[70%_center] lg:object-center opacity-[0.82] saturate-[0.9]"
            />
            {/* Left-to-right fade behind the copy */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 via-45% to-black/20" />
            {/* Soft fade under the nav and a deeper fade into the trust strip */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            {/* Gentle vignette around the edges */}
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]" />
          </div>

          {/* Same edge as the logo and nav (see .site-container). Desktop sizes scale off --hu (see .hero-fluid in globals.css) */}
          <div className="hero-pad relative z-10 px-4 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-9 w-full overflow-hidden">
            {/* Headline */}
            <h1 className="hero-rise font-display font-bold uppercase leading-[0.95] tracking-tight max-w-[760px] lg:max-w-none">
              <span className="hero-l1 block text-white text-[20px] xs:text-[26px] sm:text-[44px] lg:text-[50px] drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]">
                The World Is
              </span>
              <span className="hero-l2 block text-[#ff1f1f] text-[24px] xs:text-[32px] sm:text-[50px] lg:text-[62px] drop-shadow-[0_0_30px_rgba(225,29,29,0.5)] break-words">
                Unpredictable.
              </span>
              <span className="hero-l3 block text-white text-[16px] xs:text-[20px] sm:text-[30px] lg:text-[38px] mt-1 drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]">
                Your Family&apos;s Safety
              </span>
            </h1>
            <p
              className="hero-rise hero-brush brush-underline font-brush normal-case -rotate-2 text-[#ff1f1f] text-[18px] xs:text-[22px] sm:text-[36px] lg:text-[46px] leading-none mt-1 ml-1 drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]"
              style={{ animationDelay: "0.1s" }}
              aria-hidden="true"
            >
              SHOULDN&apos;T BE.
            </p>

            {/* What we actually offer: the headline sets the mood, this line states the offer */}
            <p
              className="hero-rise hero-sub mt-4 sm:mt-5 max-w-[34rem] text-xs xs:text-sm sm:text-[15px] leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ animationDelay: "0.15s" }}
            >
              Blast-rated bunkers, storm shelters and safe rooms from vetted American manufacturers, delivered and
              installed anywhere in the U.S.
            </p>

            {/* Action Buttons: red leads, consultation is the quieter glass option */}
            <div
              className="hero-rise hero-actions mt-5 sm:mt-6 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 w-full sm:w-auto"
              style={{ animationDelay: "0.2s" }}
            >
              <Button asLink href="#featured-models" size="lg" showArrow className="hero-cta text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-[#e11d1d] hover:border-[#ff2b2b] shadow-redGlow text-center justify-center">
                Explore Shelters
              </Button>
              <a
                href="#financing"
                className="hero-cta inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[4px] border-2 border-white/25 bg-white/[0.08] backdrop-blur-md hover:bg-white hover:border-white hover:text-[#0a0a0a] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm transition-colors text-center"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Request Consultation</span>
              </a>
            </div>

            {/* What the shelters protect against: small bordered glass boxes, square-cornered like the CTAs */}
            <div
              className="hero-rise hero-threats mt-5 sm:mt-6 grid grid-cols-2 gap-1.5 xs:gap-2 sm:flex sm:flex-wrap sm:items-center w-full max-w-full"
              style={{ animationDelay: "0.3s" }}
            >
              {threats.map(({ label, Icon }, i) => (
                <span
                  key={label}
                  className="group/threat hero-threat hero-threat-box flex items-center gap-1 xs:gap-2 px-1.5 xs:px-2.5 py-1 sm:py-1.5 rounded-[4px] bg-white/[0.08] border border-white/20 backdrop-blur-md text-[10px] xs:text-xs sm:text-[13px] min-w-0 font-semibold text-white hover:border-[#e11d1d]/60 hover:bg-[#e11d1d]/10 transition-colors truncate"
                >
                  <Icon
                    className="hero-threat-icon threat-pulse w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-[#ff4d4d] group-hover/threat:animate-[threat-wiggle_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 0.6}s` }}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="truncate">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
