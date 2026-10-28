import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  ShieldCheck,
  Check,
  ArrowRight,
  Phone,
  HelpCircle,
  Sparkles,
  Zap,
  Lock,
  Layers,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pricing & Packages: Turnkey Shelter Cost Tiers | BombShelters.com",
  description:
    "Explore transparent turnkey pricing tiers for bomb shelters, storm bunkers, safe rooms, and hardened steel cabins with zero hidden fees.",
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Tornado & Storm Shelter",
      price: "$12,900",
      period: "Starting price",
      badge: "FEMA P-320",
      description: "Fast-deployment residential tornado and EF5 storm protection for 4 to 8 occupants.",
      features: [
        "10-gauge structural steel reinforced shell",
        "FEMA P-320 missile-impact tested door",
        "Dual mechanical locking deadbolts",
        "Passive ventilation with debris cowl",
        "Bench seating & emergency battery LED kit",
        "Interior or exterior installation ready",
      ],
      cta: "View Storm Shelters",
      href: "/storm-shelters",
      popular: false,
    },
    {
      name: "Standard Bomb Shelter",
      price: "$49,900",
      period: "Most popular tier",
      badge: "NBC RATED",
      description: "Turnkey subterranean blast and fallout shelter engineered for nuclear, chemical, and severe crisis scenarios.",
      features: [
        "ASTM A36 heavy structural corrugated steel shell",
        "Swiss military-grade NBC positive-pressure air system",
        "Double blast-rated marine latch entrance door",
        "100-year coal tar epoxy subterranean membrane",
        "Secondary concealed emergency escape hatch",
        "Bunk beds, 12V battery bank & LED lighting",
        "Potable water storage integration & chemical toilet",
      ],
      cta: "Explore Standard Bunkers",
      href: "/models",
      popular: true,
    },
    {
      name: "Hardened Cabin & Home",
      price: "$89,900",
      period: "Turnkey modular",
      badge: "CLASS-A FIRE / BALLISTIC",
      description: "Above-ground resilient steel architectural residences engineered against fire, ballistics, and severe weather.",
      features: [
        "Heavy cold-formed structural steel frame",
        "Class-A fire-resistant steel exterior cladding",
        "Impact-resistant security glazing & ballistic shutters",
        "Turnkey kitchen, bathroom, and living floor plans",
        "Solar-ready electrical conduits & off-grid plumbing",
        "Built to International Residential Code (IRC)",
      ],
      cta: "View Steel Homes",
      href: "/modular-homes",
      popular: false,
    },
    {
      name: "Luxury Subterranean Estate",
      price: "$199,900",
      period: "Bespoke luxury",
      badge: "TURNKEY LUXURY",
      description: "Multi-level subterranean survival complexes engineered for long-term off-grid autonomy and executive comfort.",
      features: [
        "Custom square footage (1,000 to 5,000+ sq ft)",
        "Master suite, full gourmet kitchen & luxury baths",
        "Indoor LED automated hydroponic produce garden",
        "Full EMP-hardened electrical conduits & surge units",
        "Geothermal closed-loop HVAC & deep well filtration",
        "CCTV subterranean perimeter surveillance suite",
        "Decontamination airlock with pressurized shower",
      ],
      cta: "Design Custom Estate",
      href: "/quote",
      popular: false,
    },
  ];

  const addOns = [
    {
      name: "EMP Hardening Package",
      price: "$4,500 - $12,000",
      desc: "MIL-STD-188-125 compliant shielding for solar inverters, battery banks, and vital electronics.",
    },
    {
      name: "Autonomous Solar & LiFePO4 Array",
      price: "$9,500 - $28,000",
      desc: "10kWh to 40kWh subterranean battery microgrids with concealed surface solar deployment.",
    },
    {
      name: "Decontamination Airlock & Shower",
      price: "$6,500 - $14,000",
      desc: "Pressurized air shower and chemical wash-down station before entering primary living quarters.",
    },
    {
      name: "Hydroponic Food Production Unit",
      price: "$5,000 - $16,000",
      desc: "Full-spectrum automated vertical farming rack providing continuous fresh greens and vegetables.",
    },
    {
      name: "Secondary Hydraulic Escape Hatch",
      price: "$3,800 - $8,500",
      desc: "Concealed hydraulic escape tunnel with disguised surface outlet for structural collapse egress.",
    },
    {
      name: "Advanced Water Filtration & UV",
      price: "$2,800 - $6,500",
      desc: "Multi-stage sediment, carbon block, reverse osmosis, and ultraviolet germicidal sterilizer.",
    },
  ];

  return (
    <>
      <SubPageHeader
        badge="PRICING & PACKAGES"
        title="TRANSPARENT FACTORY-DIRECT"
        highlight="PRICING"
        description="Clear, itemized pricing tiers for certified bomb shelters, storm bunkers, safe rooms, and hardened modular homes. No hidden broker fees."
        breadcrumbs={[{ label: "Pricing & Packages" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
              Turnkey Shelter Investment Tiers
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Direct manufacturer pricing with precision American steel craftsmanship and certified blast ratings.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.popular
                    ? "border-[#e11d1d] bg-[#0e1014] text-white shadow-2xl scale-[1.02]"
                    : "border-gray-200 bg-white text-[#0a0a0a] hover:border-black hover:shadow-lg"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#e11d1d] text-white text-[10px] font-display font-bold uppercase tracking-wider shadow">
                    Most Popular Choice
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        tier.popular
                          ? "bg-[#e11d1d]/20 text-[#ff4d4d]"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl uppercase tracking-tight mb-2">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl sm:text-4xl font-display font-black tracking-tight">
                      {tier.price}
                    </span>
                    <span
                      className={`text-xs ${
                        tier.popular ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      / {tier.period}
                    </span>
                  </div>

                  <p
                    className={`text-xs mt-3 mb-6 leading-relaxed ${
                      tier.popular ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {tier.description}
                  </p>

                  <div className="space-y-2.5 text-xs mb-8">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#e11d1d] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  asLink
                  href="/quote"
                  size="md"
                  variant={tier.popular ? "primary" : "outline"}
                  className="w-full text-center"
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Optional Add-Ons Menu */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                Modular Upgrades &amp; Autonomous Add-Ons
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Enhance your shelter with military-grade autonomous power, EMP shielding, and extended life support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addOns.map((addon) => (
                <div
                  key={addon.name}
                  className="p-6 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-[#e11d1d] hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-display font-bold text-base text-[#0a0a0a]">
                      {addon.name}
                    </h4>
                    <span className="text-xs font-display font-bold text-[#e11d1d] shrink-0">
                      {addon.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {addon.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How Pricing is Calculated */}
          <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight mb-4">
              What Goes Into Your Itemized Estimate?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              Unlike third-party brokers who add substantial markups, our estimates are broken down into transparent factory categories:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-[#0a0a0a] mb-1">1. Steel Shell &amp; Fabrication</div>
                <div className="text-gray-500">Weight of raw certified ASTM A36 steel, laser cutting, welding &amp; pressure testing.</div>
              </div>
              <div className="p-4 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-[#0a0a0a] mb-1">2. Life-Support &amp; NBC</div>
                <div className="text-gray-500">Swiss air gas adsorbers, blast valves, airtight doors, and electrical systems.</div>
              </div>
              <div className="p-4 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-[#0a0a0a] mb-1">3. Heavy Freight Transit</div>
                <div className="text-gray-500">Distance from factory to your parcel with oversized DOT transport permits.</div>
              </div>
              <div className="p-4 rounded-lg bg-white border border-gray-200">
                <div className="font-bold text-[#0a0a0a] mb-1">4. Crane Rigging &amp; Placement</div>
                <div className="text-gray-500">Crane capacity (50t to 100t+), site leveling, and certified underground setting.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Want an Itemized Estimate for Your Property?"
        subtitle="Use our interactive Quote Wizard or speak directly with an estimator for a guaranteed fixed-price quote."
        ctaText="Start Free Quote Wizard"
        ctaHref="/quote"
      />
    </>
  );
}
