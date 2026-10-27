import React from "react";
import { ShieldCheck, Building2, Truck, Wrench, BadgeDollarSign, Headphones } from "lucide-react";
import { TRUST_STRIP_ITEMS } from "@/data/navigation";

export function TrustStrip() {
  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#e11d1d]" />,
    Building2: <Building2 className="w-6 h-6 text-[#e11d1d]" />,
    Truck: <Truck className="w-6 h-6 text-[#e11d1d]" />,
    Wrench: <Wrench className="w-6 h-6 text-[#e11d1d]" />,
    BadgeDollarSign: <BadgeDollarSign className="w-6 h-6 text-[#e11d1d]" />,
    Headset: <Headphones className="w-6 h-6 text-[#e11d1d]" />,
  };

  return (
    <section className="bg-[#111214] border-y border-[#2a2d31] py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {TRUST_STRIP_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group"
            >
              <div className="p-2.5 rounded-[4px] bg-[#16181b] border border-[#2a2d31] group-hover:border-[#e11d1d]/60 transition-colors">
                {iconMap[item.icon] || <ShieldCheck className="w-6 h-6 text-[#e11d1d]" />}
              </div>
              <h4 className="font-display font-bold uppercase text-xs sm:text-sm tracking-wider text-white">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#a1a1aa] leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
