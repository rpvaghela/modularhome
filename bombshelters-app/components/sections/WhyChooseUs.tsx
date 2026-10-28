import React from "react";
import Image from "next/image";
import { Scale, CircleDollarSign, Sliders, CreditCard, Users, MapPin } from "lucide-react";
import { WHY_CHOOSE_ITEMS } from "@/data/navigation";
import { UsFlag } from "@/components/ui/UsFlag";

export function WhyChooseUs() {
  const iconMap: Record<string, React.ReactNode> = {
    Scale: <Scale className="w-8 h-8" strokeWidth={1.5} />,
    CircleDollarSign: <CircleDollarSign className="w-8 h-8" strokeWidth={1.5} />,
    Sliders: <Sliders className="w-8 h-8" strokeWidth={1.5} />,
    CreditCard: <CreditCard className="w-8 h-8" strokeWidth={1.5} />,
    Compass: <Users className="w-8 h-8" strokeWidth={1.5} />,
    MapPin: <MapPin className="w-8 h-8" strokeWidth={1.5} />,
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
    <section id="why-choose" className="relative bg-[#0a0a0a] text-white py-14 lg:py-16 overflow-hidden">
      {/* Mountain backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_42%] brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 site-container">
        <div className="mb-10">
          <h2 className="font-display font-bold uppercase text-[28px] sm:text-[34px] lg:text-[40px] leading-none tracking-tight">
            Why Choose <span className="text-[#e11d1d]">BombShelters.com?</span>
          </h2>
          <p className="mt-2 text-sm text-[#cbd5e1]">
            The most trusted marketplace for bomb shelters, storm shelters, safe rooms and preparedness solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-8 lg:divide-x divide-white/10">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center px-3 group">
              <div className="w-14 h-14 rounded-full border border-[#e11d1d]/50 bg-black/40 text-[#e11d1d] flex items-center justify-center mb-3 group-hover:bg-[#e11d1d] group-hover:text-white transition-colors">
                {item.iconNode}
              </div>
              <h3 className="font-display font-semibold uppercase text-[13px] text-white tracking-wide leading-tight">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[11px] text-[#a1a1aa] leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
