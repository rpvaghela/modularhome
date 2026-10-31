import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getPublicProducts, getPublicCollections } from "@/lib/publicData";
import { CATEGORIES } from "@/data/models";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import { matchProductCategory } from "@/utils/categoryMatching";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  TrendingDown, 
  Home, 
  Compass, 
  FileCheck2, 
  Truck, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Maximize2
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "Modular Homes & Modern Prefab Floor Plans | ModularHome.com";
const DESCRIPTION =
  "Explore precision-engineered modular homes, custom prefab floor plans, and turnkey residences. Factory-built with commercial-grade steel framing, superior insulation, and nationwide delivery.";
const CANONICAL = getCanonicalUrl("/modular-homes");
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

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
          alt: "Modular Homes Collection",
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

const MODULAR_HOME_FAQS = [
  {
    q: "How long does it take from order to move-in for a modular home?",
    a: "A typical modular home project takes 12 to 24 weeks from approved architectural plans to final occupancy. Indoor factory fabrication of the building modules requires only 4 to 8 weeks in climate-controlled facilities. Because site excavation and foundation pouring happen simultaneously with factory construction, modular projects finish 40% to 60% faster than traditional site-built homes.",
  },
  {
    q: "Do modular homes appreciate in value like traditional site-built homes?",
    a: "Yes. Modular homes are built to the exact same International Residential Code (IRC) standards as traditional stick-built houses. They are permanently installed on engineered concrete foundations (stem wall, slab, or basement) and appraised as real property. Numerous national appraisal studies confirm that modular homes appreciate at identical rates to conventionally constructed homes.",
  },
  {
    q: "What is the key difference between a modular home and a manufactured (mobile) home?",
    a: "Modular homes are engineered to meet or exceed state and local International Residential Codes (IRC), have no permanent chassis, and sit on permanent foundations just like site-built custom homes. In contrast, manufactured homes are built to the federal HUD code and are constructed on a permanent wheeled chassis. Modular homes qualify for standard 30-year conventional mortgages (Fannie Mae / Freddie Mac) and face none of the zoning restrictions associated with mobile homes.",
  },
  {
    q: "How does financing work for purchasing a modular home?",
    a: "Financing a modular home is typically structured through a construction-to-permanent loan (single-close loan). During fabrication and site assembly, the lender disburses payments in scheduled milestones (draws). Once the home is installed and receives its certificate of occupancy, the loan automatically converts into a standard long-term 15- or 30-year fixed-rate mortgage. We also support cash buyers and partner with national lenders specialized in prefab construction.",
  },
  {
    q: "Can modular home floor plans and finishes be customized?",
    a: "Yes. Every model in our catalog can be customized. You can reconfigure interior wall placements, expand square footage, add covered porches, select kitchen cabinetry, specify tile and quartz countertops, and choose exterior siding options (standing-seam metal, engineered wood, or board-and-batten). Our architectural team works directly with your site plans.",
  },
  {
    q: "How are modular homes transported and assembled on-site?",
    a: "Completed modules are transported on specialized hydraulic transport carriers directly to your parcel. On build day, a mobile crane lifts each precision module from the carrier and positions it onto your cured concrete foundation. Our factory-certified set crew bolts the modules together with heavy-duty structural plates, secures seismic/hurricane anchors, and weathertights the marriage walls in 1 to 3 days.",
  },
];

const COST_TIERS = [
  {
    tier: "Shell & Kit Packages",
    range: "$90 – $130 / sq ft",
    idealFor: "DIY builders, general contractors, rural properties",
    inclusions: [
      "Precision-welded steel framing & roof truss system",
      "Exterior wall sheathing & moisture barrier wrap",
      "Pre-engineered architectural blueprints & load calculations",
      "Factory-installed rough openings for doors and windows",
    ],
  },
  {
    tier: "Semi-Finished Interior",
    range: "$135 – $185 / sq ft",
    idealFor: "Homeowners working with local finish carpenters",
    inclusions: [
      "Complete weather-tight exterior with siding & roofing",
      "Closed-cell spray foam or high-R bat insulation installed",
      "Pre-run electrical conduit, rough plumbing & HVAC ducting",
      "Drywall hung, taped, and primed for final paint",
    ],
  },
  {
    tier: "Turnkey Residential",
    range: "$190 – $275 / sq ft",
    idealFor: "Families seeking immediate move-in ready quality",
    inclusions: [
      "Fully finished gourmet kitchen with shaker cabinets & quartz",
      "Complete designer bathrooms with tiled showers & fixtures",
      "Commercial-grade luxury vinyl plank (LVP) flooring throughout",
      "High-efficiency ductless mini-split or central heat pump systems",
    ],
  },
  {
    tier: "Architectural Custom",
    range: "$280 – $380+ / sq ft",
    idealFor: "Luxury retreats, cliffside builds, multi-story residences",
    inclusions: [
      "Floor-to-ceiling Low-E commercial architectural glass walls",
      "Cantilevered steel balconies and integrated covered decks",
      "Smart-home automation, solar-ready panels & battery tie-ins",
      "Custom architect-stamped engineering for extreme snow/wind zones",
    ],
  },
];

export default async function ModularHomesPage() {
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  const modularProducts = allProducts.filter((p) => matchProductCategory(p, "modular-homes"));
  const catDef = CATEGORIES.find((c) => c.id === "Modular Homes");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    numberOfItems: modularProducts.length,
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      url: "https://modularhome.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: modularProducts.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: getCanonicalUrl(`/modular-homes/${p.slug}`),
        name: p.name,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MODULAR_HOME_FAQS.map((faq) => ({
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
        title="Modular Homes"
        tagline={catDef?.tagline || "Precision-Engineered Architecture"}
        description={
          catDef?.description ||
          "Discover our signature lineup of factory-crafted modular homes and modern prefab floor plans. Built in climate-controlled facilities using high-strength steel framing and premium materials, our residences deliver superior energy efficiency, faster build timelines, and turnkey structural reliability."
        }
        image={catDef?.image || HERO_IMAGE}
        canonicalPath="/modular-homes"
        products={modularProducts}
        allProducts={allProducts}
        allCollections={allCollections}
        categoryKey="modular-homes"
      >
        {/* COMPREHENSIVE MODULAR HOME BUYER & ARCHITECTURAL GUIDE */}
        <section className="mt-16 pt-12 border-t border-[#e7e9ee] space-y-16">
          {/* Key Metric Highlights Bar */}
          <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Living Space</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">400 – 4,500+</div>
                <div className="text-[11px] text-[#059669] font-medium">Usable Square Feet</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Cost Savings</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">20% – 35%</div>
                <div className="text-[11px] text-[#6b7280]">vs Traditional Stick-Built</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Factory Build Window</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">6 – 10 Wks</div>
                <div className="text-[11px] text-[#6b7280]">Climate-Controlled Facility</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Structural Warranty</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">Up to 50 Yrs</div>
                <div className="text-[11px] text-[#d97706] font-medium">Commercial-Grade Steel</div>
              </div>
            </div>
          </div>

          {/* Editorial Section 1: Overview & Advantages */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
              <span>Architectural Innovation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#101114] font-display">
              The Architecture of Precision: Why Modern Modular Construction Outperforms Stick-Built
            </h2>
            <div className="prose prose-neutral max-w-none text-[#4b5563] text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Building a custom home on-site has historically meant accepting months of unpredictable weather delays, warped lumber exposed to torrential rains, subcontractor scheduling conflicts, and recurring cost overruns. Today, discerning homeowners and developers are turning to <strong>precision factory-built modular construction</strong> as the superior alternative.
              </p>
              <p>
                By building modules inside an engineered, climate-controlled facility, materials are never exposed to rain or mold. High-precision laser jigs ensure every wall is square to 1/16th of an inch. Structural framing is reinforced with heavy-gauge steel gussets and continuous strapping designed to withstand highway transport speeds of 65 MPH—creating a structural envelope far stiffer and more resilient than typical site-built framing.
              </p>
            </div>
          </div>

          {/* Editorial Section 2: Modular Home Pricing Tiers */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Transparent Cost Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Modular Home Pricing Breakdown: Price Per Square Foot
              </h2>
              <p className="text-sm text-[#6b7280]">
                Understand your investment options. From structural kits to full turnkey luxury living, our modular construction packages are tailored to your budget and site requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {COST_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e7e9ee] rounded-2xl p-6 flex flex-col justify-between hover:border-[#fcb907] transition-all hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#d97706]">Package Tier {idx + 1}</span>
                      <h3 className="text-lg font-black text-[#101114] mt-0.5">{tier.tier}</h3>
                      <div className="text-xl font-black text-[#101114] mt-2 font-display">{tier.range}</div>
                    </div>
                    <p className="text-xs text-[#6b7280] font-medium leading-relaxed">{tier.idealFor}</p>
                    <div className="pt-2 border-t border-[#f0f2f5] space-y-2">
                      <div className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Package Highlights</div>
                      <ul className="space-y-1.5 text-xs text-[#4b5563]">
                        {tier.inclusions.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Section 3: Engineering & Foundation Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e7e9ee] flex items-center justify-center text-[#d97706]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#101114]">Stem Wall & Crawlspace</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                The most popular modular foundation. Reinforced concrete stem walls elevate the structure, allowing clean mechanical access for plumbing and electrical inspection while protecting against ground moisture.
              </p>
            </div>
            <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e7e9ee] flex items-center justify-center text-[#d97706]">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#101114]">Full Concrete Basement</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Instantly double your home&apos;s usable square footage. Poured concrete basement walls support the modular floor spans above, offering space for additional bedrooms, storm shelters, or entertainment rooms.
              </p>
            </div>
            <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e7e9ee] flex items-center justify-center text-[#d97706]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#101114]">Engineered Monolithic Slab</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Ideal for level parcels with stable soil composition. Concrete slab-on-grade provides a solid thermal mass foundation with integrated radiant floor heating compatibility and rapid turnaround.
              </p>
            </div>
          </div>

          {/* Editorial Section 4: Frequently Asked Questions */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Buyer Guidance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Frequently Asked Questions About Modular Homes
              </h2>
              <p className="text-sm text-[#6b7280]">
                Everything you need to know about zoning, appraisals, delivery, financing, and building codes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODULAR_HOME_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e7e9ee] rounded-xl p-5 hover:border-[#fcb907] transition-colors"
                >
                  <h3 className="text-sm font-bold text-[#101114] mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-[#4b5563] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Section 5: Internal Linking Hub */}
          <div className="bg-[#101114] text-white rounded-2xl p-8 sm:p-10 space-y-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#fcb907]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Your Build Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                Explore Floor Plans, Pricing &amp; Engineering Resources
              </h2>
              <p className="text-sm text-gray-300">
                Browse our architectural library, calculate turnkey estimates, or connect directly with our engineering team.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <Link
                href="/floor-plans"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Floor Plans</div>
                <div className="text-[10px] text-gray-400 mt-0.5">2D &amp; 3D Layouts</div>
              </Link>
              <Link
                href="/modular-homes-under-100k"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Under $100k</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Affordable Prefabs</div>
              </Link>
              <Link
                href="/pricing"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Pricing Guide</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Transparent Costs</div>
              </Link>
              <Link
                href="/financing"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Financing</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Mortgage Partners</div>
              </Link>
              <Link
                href="/blogs"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Builder Journal</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Guides &amp; Case Studies</div>
              </Link>
              <Link
                href="/quote"
                className="bg-[#fcb907] hover:bg-[#e5a806] text-[#101114] transition-colors p-3.5 rounded-xl text-center font-bold"
              >
                <div className="text-xs font-bold">Request Quote</div>
                <div className="text-[10px] text-[#101114]/80 mt-0.5">Custom Estimate</div>
              </Link>
            </div>
          </div>
        </section>
      </CategoryCollectionRenderer>
    </>
  );
}
