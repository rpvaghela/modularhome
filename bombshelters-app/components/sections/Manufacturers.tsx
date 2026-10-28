import React from "react";
import { Shield, Flag, Mountain, Star, Hexagon, Triangle } from "lucide-react";
import { TRUSTED_MANUFACTURERS } from "@/data/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Manufacturers() {
  const logoIcons = [
    <Shield key="shield" className="w-8 h-8" strokeWidth={1.75} />,
    <Flag key="flag" className="w-8 h-8 text-[#e11d1d]" strokeWidth={1.75} />,
    <Mountain key="mountain" className="w-8 h-8" strokeWidth={1.75} />,
    <Star key="star" className="w-8 h-8 text-[#e11d1d] fill-[#e11d1d]" strokeWidth={1.5} />,
    <Hexagon key="hexagon" className="w-8 h-8" strokeWidth={1.75} />,
    <Triangle key="triangle" className="w-8 h-8" strokeWidth={1.75} />,
  ];

  return (
    <section id="manufacturers" className="bg-paper text-[#0a0a0a] py-12 lg:py-14">
      <div className="site-container">
        <SectionHeading
          title="Trusted Manufacturers"
          highlight="& Partners"
          subtitle="We work with leading American manufacturers to bring you the best shelter solutions."
          linkLabel="View All Manufacturers"
          linkHref="#financing"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TRUSTED_MANUFACTURERS.map((name, idx) => {
            const [first, ...rest] = name.split(" ");
            return (
              <div
                key={name}
                // White card so it reads against the off-white (paper) section background
                className="h-20 rounded-[4px] bg-white border border-[#e4e4e7] shadow-[0_1px_2px_rgba(10,10,10,0.05),0_4px_12px_rgba(10,10,10,0.04)] flex items-center justify-center gap-2.5 px-3 text-[#0a0a0a] grayscale hover:grayscale-0 hover:border-[#e11d1d]/50 hover:shadow-md transition-all cursor-default"
              >
                {logoIcons[idx % logoIcons.length]}
                <span className="font-display font-bold uppercase tracking-wide leading-[1.05]">
                  <span className="block text-[15px]">{first}</span>
                  <span className="block text-[10px] tracking-[0.18em] text-[#475569]">{rest.join(" ")}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
