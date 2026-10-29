import React from "react";
import { ChevronRight, Search, Settings, FileText, Truck } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/data/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorks() {
  const stepIcons: Record<number, React.ReactNode> = {
    1: <Search className="w-8 h-8" strokeWidth={1.75} />,
    2: <Settings className="w-8 h-8" strokeWidth={1.75} />,
    3: <FileText className="w-8 h-8" strokeWidth={1.75} />,
    4: <Truck className="w-8 h-8" strokeWidth={1.75} />,
  };

  return (
    <section id="how-it-works" className="bg-[#ffffff] text-[#0a0a0a] py-10 sm:py-14 lg:py-16 border-b border-[#e2e8f0] overflow-hidden w-full">
      <div className="site-container">
        <SectionHeading
          title="How It"
          highlight="Works"
          subtitle="Get from browsing to a safer tomorrow in four simple steps."
        />

        <div className="relative">
          {/* Soft red/grey blobs behind the cards so the frosted glass has something to blur */}
          <div className="pointer-events-none absolute -top-10 left-[12%] w-72 h-40 rounded-full bg-[#e11d1d]/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-10 right-[10%] w-80 h-40 rounded-full bg-[#64748b]/15 blur-3xl" aria-hidden="true" />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                // Glassmorphism card: translucent white, blurred backdrop, bright top edge
                className="relative flex items-start gap-3 p-5 rounded-[14px] bg-white/55 backdrop-blur-xl backdrop-saturate-150 border border-white/80 ring-1 ring-black/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_rgba(10,10,10,0.06)] hover:bg-white/70 hover:ring-[#e11d1d]/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_36px_rgba(10,10,10,0.1)] transition-all group"
              >
                <span className="shrink-0 w-9 h-9 rounded-full bg-[#e11d1d] text-white font-display font-bold text-lg flex items-center justify-center shadow-redGlow group-hover:scale-110 transition-transform">
                  {step.step}
                </span>
                <span className="shrink-0 text-[#0a0a0a] pt-0.5">{stepIcons[step.step]}</span>
                <div>
                  <h3 className="font-display font-bold uppercase text-[14px] tracking-wide text-[#0a0a0a]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#4a5568] leading-snug">{step.desc}</p>
                </div>

                {/* Arrow in the gap between cards */}
                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <span className="hidden lg:flex absolute -right-[19px] top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur border border-white ring-1 ring-black/[0.06] items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-[#e11d1d]" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
