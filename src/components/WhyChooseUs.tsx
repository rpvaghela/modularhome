"use client";

import { 
  Building2, 
  Compass, 
  Sliders, 
  Clock, 
  ShieldCheck, 
  Headphones, 
  Home, 
  DollarSign, 
  Truck 
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const TRUST_CARDS = [
  {
    icon: Building2,
    title: "Factory-Controlled Construction",
    desc: "Built in indoor facilities protected from moisture, rain, and UV damage for maximum structural precision.",
  },
  {
    icon: Compass,
    title: "Modern Designs",
    desc: "Architect-designed floor plans featuring soaring vaulted ceilings, open layouts, and panoramic glass curtain walls.",
  },
  {
    icon: Sliders,
    title: "Customizable Floor Plans",
    desc: "Tailor room layouts, kitchen island proportions, bathroom finishes, siding, and porch wraps to your vision.",
  },
  {
    icon: Clock,
    title: "Efficient Building Process",
    desc: "Concurrent site preparation and indoor manufacturing cuts total completion timelines by up to 50%.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Materials",
    desc: "Constructed with commercial-grade steel, solid timber framing, Energy Star windows, and Kynar paint systems.",
  },
  {
    icon: Headphones,
    title: "Professional Support",
    desc: "Dedicated structural engineering team and project advisors guide you from initial blueprint to final move-in.",
  },
  {
    icon: Home,
    title: "Flexible Home Options",
    desc: "Ranging from compact 650 sq ft ADUs and cabins to sprawling 3,500+ sq ft multi-generational barndominiums.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    desc: "Clear itemized shell pricing with predictable cost structure—no surprise site change orders or budget bloat.",
  },
  {
    icon: Truck,
    title: "Delivery & Installation Support",
    desc: "Coordinated freight transport and installation support to ensure your home is set with millimeter accuracy.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 bg-white border-b border-[var(--line)] text-[var(--ink)]">
      <div className="wrap">
        <SectionHeading
          eyebrow="Uncompromised Excellence"
          title="WHY CHOOSE OUR MODULAR HOMES"
          subtitle="Combining traditional American craftsmanship with modern precision engineering, transparent pricing, and comprehensive customer support."
          align="center"
        />

        {/* 9 Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {TRUST_CARDS.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className="bg-[var(--soft)] border border-[var(--line)] rounded-[18px] p-6 space-y-3 hover:border-[var(--r)] hover:shadow-md transition-all group duration-200"
              >
                <div className="w-12 h-12 rounded-[14px] bg-white text-[var(--r)] border border-[var(--line)] flex items-center justify-center group-hover:bg-[var(--r)] group-hover:text-white transition-colors shadow-xs">
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase text-[var(--ink)] font-display group-hover:text-[var(--r)] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-body">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
