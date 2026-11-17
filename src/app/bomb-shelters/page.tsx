import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getPublicProducts, getPublicCollections } from "@/lib/publicData";
import { CATEGORIES } from "@/data/models";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import { matchProductCategory } from "@/utils/categoryMatching";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";
import { 
  ShieldCheck, 
  Flame, 
  Compass, 
  Truck, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Maximize2, 
  Zap, 
  Lock, 
  Activity,
  Wind
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "Bomb Shelters, Underground Bunkers & Safe Rooms | ModularHome.com";
const DESCRIPTION =
  "Explore certified subterranean steel bomb shelters, disaster bunkers, and ballistic safe rooms. Engineered with Swiss NBC air filtration, blast-door airlocks, and off-grid life-support systems with nationwide delivery.";
const CANONICAL = getCanonicalUrl("/bomb-shelters");
const HERO_IMAGE = "/images/cat-bomb-shelters.png";

export async function generateMetadata(): Promise<Metadata> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  return {
    title: TITLE,
    description: DESCRIPTION,
    robots,
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: `${TITLE} | ModularHome.com`,
      description: DESCRIPTION,
      url: CANONICAL,
      siteName: "ModularHome.com",
      images: [
        {
          url: HERO_IMAGE,
          alt: "Subterranean Bomb Shelters & Underground Bunkers Collection",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} | ModularHome.com`,
      description: DESCRIPTION,
      images: [HERO_IMAGE],
    },
  };
}

const SHELTER_FAQS = [
  {
    q: "What threat protections do your underground bomb shelters provide?",
    a: "Our subterranean shelters are engineered with ASTM A36 plate and heavy corrugated structural steel, designed to withstand nuclear blast overpressure (3+ BAR / 45+ PSI), gamma radiation fallout attenuation, Category 5 tornado debris impacts, seismic ground displacement, and ballistic penetration up to Level 4 armor-piercing threats.",
  },
  {
    q: "How does the Swiss NBC positive-pressure air filtration system function?",
    a: "Each unit is equipped with military-grade Swiss NBC (Nuclear, Biological, Chemical) filtration and positive-pressure overpressure valves. The system pulls ambient exterior air through certified multi-stage pre-filters, medical HEPA particulate barriers, and military gas-phase activated carbon banks while maintaining a positive interior atmospheric pressure so zero contaminated outside air can seep inside.",
  },
  {
    q: "Can an underground bomb shelter operate completely off-grid?",
    a: "Yes. Our turnkey packages include autonomous subterranean life-support systems with concealed surface solar arrays, high-density LiFePO4 battery storage banks, low-emission backup diesel generators with dedicated subterranean fuel tanks, deep-well water filtration manifolds, and manual mechanical hand-crank failover air systems.",
  },
  {
    q: "How are shelters transported and secretly installed on private property?",
    a: "Units are manufactured in modular steel sections inside climate-controlled facilities and shipped directly via flatbed trailers. Our certified excavation and engineering crews coordinate discreet site excavation, soil compaction, subterranean crane placement, utility tying, structural backfilling, and concealed surface landscaping.",
  },
  {
    q: "What secondary emergency escape options are included?",
    a: "Every multi-occupant bunker includes a primary blast-door entranceway and an independent, secondary concealed escape tunnel extending 30 to 50 feet away from the main structure. The emergency exit features a hydraulic interior release and a discreet, flush-to-grade disguised surface hatch.",
  },
  {
    q: "Are the blueprints and engineering schematics PE-stamped?",
    a: "Yes. All modular bunker plans, foundation load calculations, and structural hulls are prepared by licensed professional engineers (PE) and comply with FEMA P-320, FEMA P-361, and 2026 International Building Code (IBC) standards.",
  },
];

const SHELTER_TIERS = [
  {
    tier: "Compact Blast Pod / Safe Room",
    range: "$45,000 – $85,000",
    sqft: "80 – 200 SQ FT",
    bestFor: "Nuclear fallout refuge, EF5 tornado safe room, secure tactical vault",
    highlights: [
      "ASTM A36 corrugated heavy structural steel shell",
      "Level 4 ballistic blast door with multi-point camlocks",
      "Compact Swiss NBC positive-pressure filtration unit",
      "Rapid subterranean installation within 3 to 5 days",
    ],
  },
  {
    tier: "Family Modular Bunker",
    range: "$95,000 – $250,000",
    sqft: "250 – 800 SQ FT",
    bestFor: "Families (4–10 occupants) seeking extended 3 to 12 month autonomy",
    highlights: [
      "Multi-compartment layout with private bedrooms & bathroom",
      "Gas-tight decontamination airlock & pressure shower",
      "Off-grid LiFePO4 battery array & auxiliary generator room",
      "Concealed secondary hydraulic escape tunnel & hatch",
    ],
  },
  {
    tier: "Subterranean Luxury Complex",
    range: "$350,000 – $2,850,000+",
    sqft: "1,000 – 5,200+ SQ FT",
    bestFor: "Multi-family groups, executive retreats, long-term survival compounds",
    highlights: [
      "Custom multi-module interconnected underground complex",
      "Commercial-grade hydroponics, cold food storage & armory",
      "Redundant dual NBC life-support & water recycling manifolds",
      "Luxury residential finishes, master suites & communication centers",
    ],
  },
];

export default async function BombSheltersPage() {
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  const shelterProducts = (allProducts || []).filter((p) =>
    matchProductCategory(p, "Bomb Shelters")
  );

  const catDef = CATEGORIES.find(
    (c) => c.id.toLowerCase() === "bomb shelters" || c.title.toLowerCase() === "bomb shelters"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      url: "https://modularhome.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: shelterProducts.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: getCanonicalUrl(`/bomb-shelters/${p.slug}`),
        name: p.name,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SHELTER_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <CategoryCollectionRenderer
        title="Bomb Shelters"
        tagline={catDef?.tagline || "Certified Subterranean Blast Shelters, Bunkers & Safe Rooms"}
        description={
          catDef?.description ||
          "Explore our complete lineup of certified subterranean steel bomb shelters, disaster bunkers, and emergency safe rooms. Engineered with Swiss NBC air filtration, military blast doors, and off-grid life-support systems for ultimate family protection."
        }
        image={catDef?.image || HERO_IMAGE}
        canonicalPath="/bomb-shelters"
        products={shelterProducts}
        allProducts={allProducts}
        allCollections={allCollections}
        categoryKey="Bomb Shelters"
      >
        {/* COMPREHENSIVE BOMB SHELTER SPECIFICATION & BUYER GUIDE */}
        <section className="mt-16 pt-12 border-t border-[#e7e9ee] space-y-16">
          {/* Key Metric Highlights Bar */}
          <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Blast Protection</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">3+ BAR</div>
                <div className="text-[11px] text-[#d97706] font-medium">45+ PSI Overpressure</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Life Support</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">Swiss NBC</div>
                <div className="text-[11px] text-[#059669]">Positive Pressure Filtration</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Steel Hull</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">ASTM A36</div>
                <div className="text-[11px] text-[#2563eb]">Heavy Corrugated Plate</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Warranty</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">50-Year</div>
                <div className="text-[11px] text-[#101114] font-medium">Structural Hull Guarantee</div>
              </div>
            </div>
          </div>

          {/* Tier Overview Cards */}
          <div className="space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Turnkey Defense Tiers</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight mt-1">
                Subterranean Shelter Capacities &amp; Investment Levels
              </h2>
              <p className="text-sm text-[#4b5563] mt-2 leading-relaxed">
                From compact backyard blast pods to expansive multi-room survival estates, each bunker is factory-fabricated with precision welded steel and certified positive-pressure air manifolds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SHELTER_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e7e9ee] hover:border-[#101114] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-[#b45309] border border-amber-200/60 text-[11px] font-bold uppercase tracking-wide">
                      {tier.sqft}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#101114] group-hover:text-[#d97706] transition-colors">
                        {tier.tier}
                      </h3>
                      <div className="text-xl sm:text-2xl font-black text-[#101114] mt-1 font-display">
                        {tier.range}
                      </div>
                      <p className="text-xs text-[#6b7280] mt-1.5 leading-relaxed">
                        {tier.bestFor}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#e7e9ee] space-y-2">
                      <div className="text-[11px] uppercase font-bold tracking-wider text-[#6b7280]">Key Inclusions:</div>
                      <ul className="space-y-1.5 text-xs text-[#374151]">
                        {tier.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/quote?category=bomb-shelters"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black transition-all shadow-xs"
                    >
                      <span>Request Turnkey Quote</span>
                      <ShieldCheck className="w-4 h-4 text-[#101114]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defense Engineering Pillars */}
          <div className="bg-[#09151e] text-white rounded-3xl p-8 sm:p-12 space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-[#fcb907] uppercase tracking-wider">Engineering Standards</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Built to Survive Nuclear, Biological, Chemical &amp; Natural Disasters
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Our survival bunkers adhere to FEMA P-320/361 standards, Swiss Civil Defense air-handling specifications, and stringent structural plate engineering to ensure multi-generational survivability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold">Blast &amp; Thermal Resistance</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Heavy corrugated steel acts as a natural dissipation shield, transferring surface thermal pulses and overpressure shockwaves safely into surrounding subterranean bedrock.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Wind className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold">Positive-Pressure NBC Filtration</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Swiss-certified HEPA &amp; gas-adsorption carbon banks neutralize radioactive fallout isotopes, weaponized viral pathogens, blister agents, and toxic particulate matter.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold">EMP Hardening &amp; Microgrid</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  MIL-STD-188-125 electromagnetic shielding protects internal inverters, batteries, radios, and filtration controls from nuclear EMP bursts and geomagnetic coronal mass ejections.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold">Decontamination Airlock</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Dual-door gas-tight airlock chamber with integrated chemical washdown nozzles prevents contaminated boots and gear from entering primary living quarters.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold">Concealed Secondary Escape</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Independent hydraulic egress crawlway positioned away from the primary structure guarantees safe exit even if the primary blast entrance is obstructed by rubble.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold">Confidential Turnkey Delivery</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Direct factory-to-jobsite delivery with nondisclosure protocol. Complete soil survey, deep excavation, and concealed backfilling executed with trusted personnel.
                </p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <div className="max-w-2xl space-y-1">
              <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Buyer Insights &amp; Logistics</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
                Frequently Asked Bomb Shelter Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHELTER_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e7e9ee] rounded-2xl p-5 sm:p-6 space-y-2 shadow-xs"
                >
                  <h4 className="text-sm font-bold text-[#101114] flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-[#4b5563] leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </CategoryCollectionRenderer>
    </>
  );
}
