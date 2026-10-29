import React from "react";
import { ShieldCheck, Truck, Settings, BadgeDollarSign, Users } from "lucide-react";
import { TRUST_STRIP_ITEMS } from "@/data/navigation";
import { UsFlag } from "@/components/ui/UsFlag";

export function TrustStrip() {
  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <UsFlag className="w-10 h-auto rounded-[2px]" />,
    Building2: <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />,
    Truck: <Truck className="w-6 h-6 text-white" strokeWidth={1.5} />,
    Wrench: <Settings className="w-6 h-6 text-white" strokeWidth={1.5} />,
    BadgeDollarSign: <BadgeDollarSign className="w-6 h-6 text-white" strokeWidth={1.5} />,
    Headset: <Users className="w-6 h-6 text-white" strokeWidth={1.5} />,
  };

  return (
    <section className="bg-[#ffffff] pt-1 pb-3 sm:pb-4 overflow-hidden w-full">
      <div className="site-container">
        <div className="bg-[#0a0a0a] rounded-xl border border-[#1f2226] overflow-hidden shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#2a2d31]">
            {TRUST_STRIP_ITEMS.map((item) => (
              <div
                key={item.title}
                title={item.desc}
                className="flex items-center gap-2 xs:gap-2.5 px-2 lg:px-3 py-3 sm:py-3.5 group min-w-0"
              >
                <div className="shrink-0 group-hover:scale-110 transition-transform">
                  {iconMap[item.icon] || <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />}
                </div>
                <h4 className="font-display font-semibold uppercase text-[9.5px] xs:text-[10.5px] sm:text-[11px] tracking-wider text-white leading-tight sm:leading-snug group-hover:text-[#e11d1d] transition-colors min-w-0 break-words">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
