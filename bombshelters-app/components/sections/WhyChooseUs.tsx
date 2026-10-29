import React from "react";
import { Scale, CircleDollarSign, Sliders, CreditCard, Users, MapPin } from "lucide-react";
import { WHY_CHOOSE_ITEMS } from "@/data/navigation";
import { UsFlag } from "@/components/ui/UsFlag";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyChooseUs() {
  const iconMap: Record<string, React.ReactNode> = {
    Scale: <Scale className="w-7 h-7" strokeWidth={1.5} />,
    CircleDollarSign: <CircleDollarSign className="w-7 h-7" strokeWidth={1.5} />,
    Sliders: <Sliders className="w-7 h-7" strokeWidth={1.5} />,
    CreditCard: <CreditCard className="w-7 h-7" strokeWidth={1.5} />,
    Compass: <Users className="w-7 h-7" strokeWidth={1.5} />,
    MapPin: <MapPin className="w-7 h-7" strokeWidth={1.5} />,
  };

  const items = [
    ...WHY_CHOOSE_ITEMS.map((item) => ({ ...item, iconNode: iconMap[item.icon] })),
    {
      title: "Made in the USA",
      desc: "Support American manufacturing and certified domestic steel.",
      iconNode: <UsFlag className="w-8 h-auto rounded-[2px]" />,
    },
  ];

  return (
    <section id="why-choose" className="bg-[#ffffff] text-[#0a0a0a] py-10 sm:py-14 lg:py-16 border-b border-gray-100 overflow-hidden w-full">
      <div className="site-container">
        <SectionHeading
          title="Why Choose"
          highlight="BombShelters.com?"
          subtitle="The most trusted marketplace for bomb shelters, storm shelters, safe rooms and preparedness solutions."
          className="!mb-10"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 lg:divide-x divide-gray-200">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center px-2 group">
              <div className="w-14 h-14 rounded-2xl border border-gray-200 bg-gray-50 text-[#e11d1d] flex items-center justify-center mb-3 shadow-xs group-hover:bg-[#e11d1d] group-hover:text-white group-hover:border-[#e11d1d] transition-all">
                {item.iconNode}
              </div>
              <h3 className="font-display font-semibold uppercase text-[13px] text-[#0a0a0a] tracking-wide leading-tight group-hover:text-[#e11d1d] transition-colors">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[11px] text-gray-500 leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
