import React from "react";
import { ArrowRight, LayoutGrid, Wrench, FileText, Truck } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/data/navigation";

export function HowItWorks() {
  const stepIcons: Record<number, React.ReactNode> = {
    1: <LayoutGrid className="w-5 h-5 text-white" />,
    2: <Wrench className="w-5 h-5 text-white" />,
    3: <FileText className="w-5 h-5 text-white" />,
    4: <Truck className="w-5 h-5 text-white" />,
  };

  return (
    <section id="how-it-works" className="bg-white text-[#0a0a0a] py-20 lg:py-24 border-b border-[#e2e8f0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#e11d1d] block mb-2">
            STEP-BY-STEP DEPLOYMENT PROCESS
          </span>
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0a0a0a]">
            HOW IT <span className="text-[#e11d1d]">WORKS</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4a5568] leading-relaxed">
            From initial blueprints to final subterranean crane placement, our streamlined 4-step process ensures a seamless turnkey experience.
          </p>
        </div>

        {/* 4 Connected Numbered Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div key={step.step} className="flex flex-col items-center text-center relative group">
              {/* Connector Arrow for desktop */}
              {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+32px)] w-[calc(100%-64px)] z-0">
                  <div className="border-t-2 border-dashed border-[#e2e8f0] relative">
                    <ArrowRight className="w-4 h-4 text-[#e11d1d] absolute -top-2 right-0" />
                  </div>
                </div>
              )}

              {/* Numbered Red Circle */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-[#e11d1d] text-white flex items-center justify-center font-display font-black text-xl shadow-md group-hover:scale-110 transition-transform mb-5">
                {stepIcons[step.step]}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0a0a0a] text-white text-[10px] font-bold flex items-center justify-center border border-white/20">
                  {step.step}
                </span>
              </div>

              {/* Step Title & Description */}
              <h3 className="font-display font-extrabold uppercase text-lg text-[#0a0a0a] mb-2 tracking-wide">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
