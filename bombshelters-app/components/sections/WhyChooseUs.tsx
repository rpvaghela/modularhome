import React from "react";
import Image from "next/image";
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
    <section id="why-choose" className="w-full bg-[#ffffff] py-8 sm:py-12 overflow-hidden">
      <div className="site-container">
        <div className="relative bg-[#0a0a0a] text-white py-10 sm:py-12 lg:py-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl border border-[#1f2226] overflow-hidden shadow-xl">
          {/* Mountain & terrain backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80"
              alt=""
              fill
              sizes="(max-width: 1312px) 100vw, 1312px"
              className="object-cover object-[center_42%] brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/45" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          <div className="relative z-10 w-full">
            <SectionHeading
              dark
              title="Why Choose"
              highlight="BombShelters.com?"
              subtitle="The most trusted marketplace for bomb shelters, storm shelters, safe rooms and preparedness solutions."
              className="!mb-10"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 lg:divide-x divide-white/10">
              {items.map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center px-2 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/15 bg-black/40 backdrop-blur-xs text-[#e11d1d] flex items-center justify-center mb-3 shadow-md group-hover:bg-[#e11d1d] group-hover:text-white group-hover:border-[#e11d1d] transition-all">
                    {item.iconNode}
                  </div>
                  <h3 className="font-display font-semibold uppercase text-[13px] text-white tracking-wide leading-tight group-hover:text-[#e11d1d] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-gray-300 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
