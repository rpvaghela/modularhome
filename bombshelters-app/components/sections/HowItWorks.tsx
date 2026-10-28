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
    <section id="how-it-works" className="bg-white text-[#0a0a0a] py-14 lg:py-16 border-b border-[#e2e8f0]">
      <div className="site-container">
        <SectionHeading
          title="How It"
          highlight="Works"
          subtitle="Get from browsing to a safer tomorrow in four simple steps."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div key={step.step} className="relative flex items-start gap-3 group">
              <span className="shrink-0 w-9 h-9 rounded-full bg-[#e11d1d] text-white font-display font-bold text-lg flex items-center justify-center shadow-redGlow group-hover:scale-110 transition-transform">
                {step.step}
              </span>
              <span className="shrink-0 text-[#0a0a0a] pt-0.5">{stepIcons[step.step]}</span>
              <div className="pr-6">
                <h3 className="font-display font-bold uppercase text-[14px] tracking-wide text-[#0a0a0a]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[12px] text-[#4a5568] leading-snug">{step.desc}</p>
              </div>

              {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                <ChevronRight className="hidden lg:block absolute right-0 top-1.5 w-6 h-6 text-[#cbd5e1]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
