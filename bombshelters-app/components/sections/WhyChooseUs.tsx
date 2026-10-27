import React from "react";
import { Scale, CircleDollarSign, Sliders, CreditCard, Compass, MapPin, Flag } from "lucide-react";
import { WHY_CHOOSE_ITEMS } from "@/data/navigation";

export function WhyChooseUs() {
  const iconMap: Record<string, React.ReactNode> = {
    Scale: <Scale className="w-6 h-6 text-[#e11d1d]" />,
    CircleDollarSign: <CircleDollarSign className="w-6 h-6 text-[#e11d1d]" />,
    Sliders: <Sliders className="w-6 h-6 text-[#e11d1d]" />,
    CreditCard: <CreditCard className="w-6 h-6 text-[#e11d1d]" />,
    Compass: <Compass className="w-6 h-6 text-[#e11d1d]" />,
    MapPin: <MapPin className="w-6 h-6 text-[#e11d1d]" />,
  };

  return (
    <section id="why-choose" className="bg-[#0a0a0a] text-white py-20 lg:py-24 border-b border-[#2a2d31]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#e11d1d] block mb-2">
            UNRIVALED DEFENSE INFRASTRUCTURE
          </span>
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            WHY CHOOSE <span className="text-[#e11d1d]">BOMBSHELTERS.COM?</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            We simplify the complex process of securing, customizing, and installing fortified residential shelters and homestead cabins nationwide.
          </p>
        </div>

        {/* 6 Grid Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-[6px] bg-[#111214] border border-[#2a2d31] hover:border-[#e11d1d]/60 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-[4px] bg-[#16181b] border border-[#2a2d31] flex items-center justify-center mb-5 group-hover:bg-[#e11d1d]/10 transition-colors">
                {iconMap[item.icon] || <Scale className="w-6 h-6 text-[#e11d1d]" />}
              </div>
              <h3 className="font-display font-extrabold uppercase text-lg text-white mb-2 tracking-wide">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Made in USA Banner Accent */}
        <div className="mt-12 p-4 rounded-[4px] bg-[#16181b] border border-[#2a2d31] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e11d1d] flex items-center justify-center shrink-0">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold uppercase text-white tracking-wider text-sm block">
                100% Certified American Heavy-Gauge Structural Steel
              </span>
              <span className="text-xs text-[#a1a1aa]">
                Every component is stamped, engineered, and certified to meet or exceed rigorous FEMA and IBC building codes.
              </span>
            </div>
          </div>
          <span className="font-display font-extrabold text-xs uppercase tracking-widest text-[#e11d1d] shrink-0 border border-[#e11d1d]/40 px-3 py-1.5 rounded-[3px]">
            DOMESTIC MANUFACTURING
          </span>
        </div>
      </div>
    </section>
  );
}
