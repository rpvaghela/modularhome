import React from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { FAQS } from "@/data/faqs";

export function FaqSection() {
  return (
    <section id="faq" className="bg-white text-[#0a0a0a] py-20 lg:py-24 border-b border-[#e2e8f0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#e11d1d] block mb-2">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0a0a0a]">
            COMMON <span className="text-[#e11d1d]">QUESTIONS</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4a5568] leading-relaxed">
            Essential facts, permit guidance, and turnkey delivery protocols for residential and commercial underground installations.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Accordion */}
          <div className="lg:col-span-7">
            <Accordion items={FAQS} />
          </div>

          {/* Right Column: CTA Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[6px] overflow-hidden border border-[#2a2d31] bg-[#111214] p-8 sm:p-10 flex flex-col justify-between min-h-[420px] shadow-xl group">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80"
                  alt="Fortified subterranean shelter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-30 filter contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#e11d1d] flex items-center justify-center shadow-redGlow">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-black uppercase text-3xl sm:text-4xl text-white tracking-wide leading-tight">
                  PREPARE TODAY. <br />
                  <span className="text-[#e11d1d]">PROTECT TOMORROW.</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  Join hundreds of forward-thinking American families who refuse to leave their safety to chance. Custom design consultations are free, confidential, and comprehensive.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <Button
                  asLink
                  href="#financing"
                  size="md"
                  showArrow
                  className="w-full py-3.5 text-xs sm:text-sm shadow-redGlow"
                >
                  START YOUR PROJECT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
