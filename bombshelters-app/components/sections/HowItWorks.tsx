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
    <section id="how-it-works" className="bg-[#ffffff] text-[#0a0a0a] py-10 sm:py-14 lg:py-16 overflow-hidden w-full">
      <div className="site-container">
        <SectionHeading
          title="How It"
          highlight="Works"
          subtitle="Get from browsing to a safer tomorrow in four simple steps."
        />

        <div className="relative">
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="relative flex items-start gap-3 p-5 rounded-[14px] bg-[#ffffff] border border-gray-200 shadow-sm hover:border-[#e11d1d]/60 hover:shadow-md transition-all group"
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
                  <span className="hidden lg:flex absolute -right-[19px] top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 items-center justify-center shadow-xs">
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
