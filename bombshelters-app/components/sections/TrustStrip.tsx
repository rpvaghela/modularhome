import React from "react";
import { ShieldCheck, Truck, Settings, BadgeDollarSign, Users } from "lucide-react";
import { TRUST_STRIP_ITEMS } from "@/data/navigation";
import { UsFlag } from "@/components/ui/UsFlag";

export function TrustStrip() {
  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <UsFlag className="w-10 h-auto rounded-[2px]" />,
    Building2: <ShieldCheck className="w-7 h-7 text-white" strokeWidth={1.5} />,
    Truck: <Truck className="w-7 h-7 text-white" strokeWidth={1.5} />,
    Wrench: <Settings className="w-7 h-7 text-white" strokeWidth={1.5} />,
    BadgeDollarSign: <BadgeDollarSign className="w-7 h-7 text-white" strokeWidth={1.5} />,
    Headset: <Users className="w-7 h-7 text-white" strokeWidth={1.5} />,
  };

  return (
    <section className="bg-[#0a0a0a] border-y border-[#1f2226] overflow-hidden w-full">
      <div className="site-container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:divide-x divide-[#2a2d31]">
          {TRUST_STRIP_ITEMS.map((item) => (
            <div
              key={item.title}
              title={item.desc}
              className="flex items-center gap-2 xs:gap-3 px-1.5 sm:px-2 lg:px-4 py-3.5 sm:py-5 group min-w-0"
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform">
                {iconMap[item.icon] || <ShieldCheck className="w-7 h-7 text-white" strokeWidth={1.5} />}
              </div>
              <h4 className="font-display font-semibold uppercase text-[10px] xs:text-[11px] sm:text-xs tracking-wider text-white leading-tight sm:leading-snug group-hover:text-[#e11d1d] transition-colors min-w-0 break-words">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
