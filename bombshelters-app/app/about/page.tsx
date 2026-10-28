import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Truck,
  HardHat,
  Scale,
  CheckCircle2,
  FileCheck2,
  Lock,
  ArrowRight,
  Phone,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About BombShelters.com | America's Defense & Shelter Builders",
  description:
    "Learn about BombShelters.com, our certified structural blast engineering standards, American steel manufacturing, and nationwide subterranean installation crews.",
};

export default function AboutPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Certified Blast Engineering",
      desc: "Every subterranean unit is engineered and stamped by certified structural engineers to withstand calculated peak overpressures and ground shock waves.",
    },
    {
      icon: HardHat,
      title: "100% Domestic Structural Steel",
      desc: "Fabricated exclusively with certified ASTM A36 and high-tensile corrugated steel plate. No shortcuts, no thin corrugated culverts.",
    },
    {
      icon: Lock,
      title: "Swiss NBC Air Filtration",
      desc: "Hermetically sealed positive-pressure blast valves and multi-stage military NBC (Nuclear, Biological, Chemical) gas scrubbing systems.",
    },
    {
      icon: Truck,
      title: "Nationwide Rigging & Excavation",
      desc: "Over 200 vetted subterranean excavation crews and heavy crane operators across all 50 states ensure turn-key underground placement.",
    },
  ];

  const comparisons = [
    {
      feature: "Structural Shell",
      bombShelter: "Heavy-gauge ASTM A36 plate & corrugated blast arcs",
      conventional: "Standard fiberglass, light sheet metal or bare culvert",
    },
    {
      feature: "Blast Overpressure Rating",
      bombShelter: "Up to 50+ PSI direct blast rating with double steel doors",
      conventional: "Often unrated or tested only for windblown debris",
    },
    {
      feature: "Air Filtration Systems",
      bombShelter: "Swiss military-spec NBC gas adsorber with manual backup",
      conventional: "Passive vent tubes with zero filtration or blast valves",
    },
    {
      feature: "Corrosion Protection",
      bombShelter: "Multi-coat coal tar epoxy & sacrificial zinc anode packs (100+ yr life)",
      conventional: "Standard primer paint prone to soil moisture degradation",
    },
    {
      feature: "Emergency Escape Hatch",
      bombShelter: "Hydraulic/mechanical secondary escape hatch with concealed outlet",
      conventional: "Single entry door only; trap risk during structural collapse",
    },
  ];

  return (
    <>
      <SubPageHeader
        badge="ABOUT BOMBSHELTERS.COM"
        title="ENGINEERING UNCOMPROMISING"
        highlight="PROTECTION"
        description="For over two decades, BombShelters.com has provided American homeowners, institutions, and off-grid families with certified subterranean survival shelters and hardened steel residences."
        breadcrumbs={[{ label: "About Us" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#e11d1d] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <span>OUR CORE MISSION</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
                A Stronger Tomorrow Starts With Hardened Preparation
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                In an unpredictable world marked by extreme climatic events, geopolitical tension, and grid vulnerabilities, our mission is simple: design and build the most resilient, survivable, and comfortable residential bunkers and hardened steel cabins available in North America.
              </p>
              <p className="mt-3 text-gray-700 leading-relaxed text-sm sm:text-base">
                We bridge the gap between heavy military defense engineering and residential luxury. From compact backyard storm shelters to multi-level subterranean self-contained estates with hydroponics and solar microgrids, every structure is built to protect what matters most.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button asLink href="/quote" size="md">
                  <span>Get a Consultation</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <a
                  href="tel:812-595-4033"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] border border-gray-300 hover:border-black font-display font-bold text-sm tracking-wide transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#e11d1d]" />
                  <span>812-595-4033</span>
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-900 shadow-xl border border-gray-200">
              <Image
                src="/images/hillside-bunker.png"
                alt="Bomb Shelter Subterranean Engineering"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase font-bold text-[#ff4d4d] tracking-wider">
                    Factory Precision
                  </div>
                  <div className="text-lg font-display font-extrabold">
                    Individually Tested &amp; Hydrostatically Sealed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars */}
          <div className="mt-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                The Four Pillars of BombShelter Construction
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Rigorous testing and certified manufacturing protocols that set the industry benchmark.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#e11d1d] hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#e11d1d]/10 text-[#e11d1d] flex items-center justify-center mb-4 group-hover:bg-[#e11d1d] group-hover:text-white transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-[#0a0a0a]">
                      {pillar.title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-20">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                The BombShelter Difference
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                How our structural engineering compares to conventional storm shelters on the market.
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0f1115] text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Feature / Specification</th>
                    <th className="py-3.5 px-4 sm:px-6 bg-[#e11d1d] text-white">
                      BombShelters.com
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-gray-300">
                      Standard Market Shelters
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {comparisons.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-semibold text-[#0a0a0a]">
                        {item.feature}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-[#0a0a0a] font-medium bg-[#e11d1d]/5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0" />
                          <span>{item.bombShelter}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-gray-500">
                        {item.conventional}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Build Your Family's Secure Haven?"
        subtitle="Speak directly with our blast engineers. Every project includes complimentary site soil analysis, preliminary layout sketches, and a transparent cost breakdown."
        ctaText="Request Free Consultation"
        ctaHref="/contact"
      />
    </>
  );
}

