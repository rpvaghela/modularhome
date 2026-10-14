"use client";

import { 
  Layout, 
  Grid, 
  Utensils, 
  Bath, 
  Sun, 
  Home, 
  Layers, 
  Compass, 
  Hammer, 
  Wrench, 
  Sliders, 
  Maximize, 
  Paintbrush, 
  ShieldCheck 
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const CUSTOMIZATION_ITEMS = [
  {
    icon: Layout,
    title: "Floor Plan Modifications",
    desc: "Expand living rooms, adjust hallway clearance, or add multi-generational wings.",
  },
  {
    icon: Grid,
    title: "Room Layouts",
    desc: "Reconfigure bedroom counts, home office placements, and open great room proportions.",
  },
  {
    icon: Utensils,
    title: "Kitchen Configuration",
    desc: "Custom island dimensions, prep pantries, appliance placement, and breakfast nooks.",
  },
  {
    icon: Bath,
    title: "Bathroom Layouts",
    desc: "Double-vanity master ensuites, walk-in stone showers, and soaking tub placement.",
  },
  {
    icon: Sun,
    title: "Windows & Doors",
    desc: "Energy Star Low-E glass, floor-to-ceiling gable glass walls, and sliding patio doors.",
  },
  {
    icon: Home,
    title: "Exterior Finishes",
    desc: "Engineered lap siding, rustic timber log wraps, board & batten, or stone veneer accents.",
  },
  {
    icon: Layers,
    title: "Roofing Options",
    desc: "Standing seam concealed fastener metal, architectural shingles, or alpine snow roofs.",
  },
  {
    icon: Compass,
    title: "Flooring Materials",
    desc: "Waterproof LVP timber planks, stained concrete, solid hardwood, or tile.",
  },
  {
    icon: Hammer,
    title: "Custom Cabinets",
    desc: "Solid wood shaker cabinets, soft-close hardware, and custom pantry shelving.",
  },
  {
    icon: Wrench,
    title: "Fixtures & Hardware",
    desc: "Matte black, brushed brass, or oil-rubbed bronze plumbing and lighting fixtures.",
  },
  {
    icon: Sliders,
    title: "Porches & Decks",
    desc: "Covered timber breezeways, wraparound cedar decks, and screened-in porches.",
  },
  {
    icon: Maximize,
    title: "Square Footage",
    desc: "Scale footprints from cozy 650 sq ft ADUs up to 4,000+ sq ft multi-level estates.",
  },
  {
    icon: Paintbrush,
    title: "Interior Finishes",
    desc: "Tongue-and-groove pine ceilings, drywalled accent walls, and timber beam wraps.",
  },
  {
    icon: ShieldCheck,
    title: "Exterior Colors",
    desc: "Curated architectural color palettes, Kynar 500 paint finishes, and custom stains.",
  },
];

export default function CustomizationSection() {
  return (
    <section id="customization" className="py-20 bg-[var(--soft)] border-b border-[var(--line)] text-[var(--ink)]">
      <div className="wrap">
        <SectionHeading
          eyebrow="Architectural Freedom"
          title="CUSTOMIZE EVERY DETAIL OF YOUR HOME"
          subtitle="Modular homes are not one-size-fits-all. Every floor plan, interior finish, and exterior feature can be tailored to match your property and lifestyle."
          align="center"
        />

        {/* 14 Feature Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-12">
          {CUSTOMIZATION_ITEMS.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[var(--line)] rounded-[18px] p-6 space-y-3 hover:border-[var(--r)] hover:shadow-md transition-all group duration-200"
              >
                <div className="w-11 h-11 rounded-[12px] bg-[var(--soft)] group-hover:bg-[var(--r)] group-hover:text-white text-[var(--r)] flex items-center justify-center transition-colors border border-[var(--line)]">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase text-[var(--ink)] font-display group-hover:text-[var(--r)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed font-body">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-[var(--ink)] text-white p-7 sm:p-9 rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-black uppercase font-display text-white">Have Custom Blueprints or Architectural Sketches?</h4>
            <p className="text-xs text-white/70">Our engineering team can convert your existing floor plans into factory-ready modular blueprints.</p>
          </div>
          <a
            href="/upload-floor-plan"
            className="px-7 py-3.5 bg-[var(--r)] hover:bg-[var(--r-dark)] text-white text-xs font-bold uppercase tracking-wider rounded-[14px] shrink-0 transition-all shadow-md"
          >
            Upload Custom Floor Plan
          </a>
        </div>
      </div>
    </section>
  );
}
