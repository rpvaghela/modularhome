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
  Trees, 
  Flame, 
  Compass, 
  Truck, 
  HelpCircle,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  SunMedium
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "Modular Cabins & Prefab Log Cabin Models | ModularHome.com";
const DESCRIPTION =
  "Explore precision-engineered modular cabins, prefab log cabins, and rustic mountain retreats. Built for four-season durability with high-R thermal envelopes and turnkey nationwide delivery.";
const CANONICAL = getCanonicalUrl("/modular-cabins");
const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345";

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
          alt: "Modular Cabins & Prefab Log Cabins Collection",
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

const CABIN_FAQS = [
  {
    q: "Can modular cabins be built completely off-grid?",
    a: "Yes. Our modular cabins are ideal for off-grid recreation and homesteading. We offer turnkey off-grid packages including roof-integrated solar arrays with lithium battery storage, propane-fired tankless water heaters, high-efficiency wood stoves, rainwater harvesting tie-ins, and composting toilet systems.",
  },
  {
    q: "How are modular cabins engineered for severe winter climates and heavy snow loads?",
    a: "Every cabin model is engineered with heavy-gauge structural framing and certified truss systems rated for snow loads from 40 to 120+ PSF (pounds per square foot). Continuous exterior rigid insulation and double- or triple-pane Low-E argon windows prevent ice damming and minimize heat loss in high-alpine environments.",
  },
  {
    q: "Can a modular cabin be delivered to steep or remote mountain sites?",
    a: "Yes. We specialize in remote and difficult-access parcel deliveries. Prior to shipping, our logistics team reviews satellite topography and access road clearances. Depending on site access, modules can be delivered via tilt-bed trailers, 4x4 transport rigs, or set using all-terrain mobile cranes.",
  },
  {
    q: "Are modular cabins suitable for short-term vacation rentals (Airbnb & Vrbo)?",
    a: "Modular cabins are among the top-performing assets in the short-term rental industry. Their rapid build timeline (under 8 weeks factory construction) means you start generating rental revenue months faster than with on-site builders, while factory-built precision ensures minimal ongoing maintenance overhead.",
  },
  {
    q: "What foundations work best for prefab cabins on sloped land?",
    a: "For sloping mountain terrain, helical steel piers or poured concrete sonotube piers minimize excavation costs and earth disturbance. For level parcels, poured concrete frost walls or continuous slab foundations provide excellent thermal performance.",
  },
  {
    q: "What exterior siding options are available for wildfire defense?",
    a: "We offer Class-A fire-rated non-combustible exterior siding, including heavy-gauge standing seam steel siding, fiber-cement lap siding, and treated fire-resistant timber cladding designed to meet strict Wildland-Urban Interface (WUI) building codes.",
  },
];

const CABIN_TIERS = [
  {
    tier: "Micro Outpost & Bunkhouse",
    range: "$22,000 – $45,000",
    sqft: "160 – 380 SQ FT",
    bestFor: "Hunting camps, backyard guest studios, glamping rentals",
    highlights: [
      "Heavy-duty timber or light-gauge structural steel frame",
      "Full four-season insulated thermal envelope (R-21+)",
      "Open-concept studio living with sleeping loft option",
      "Pre-wired for 12V solar or 110V grid connection",
    ],
  },
  {
    tier: "One-Bedroom Mountain Retreat",
    range: "$48,000 – $88,000",
    sqft: "400 – 720 SQ FT",
    bestFor: "Vacation getaways, Airbnb rentals, couple residences",
    highlights: [
      "Separate private master bedroom with walk-in closet space",
      "Full residential 3-piece bathroom with standing shower",
      "Equipped kitchen with butcher-block or quartz counters",
      "Covered front porch option with rustic timber beams",
    ],
  },
  {
    tier: "Two to Three-Bedroom Lodge",
    range: "$92,000 – $165,000",
    sqft: "750 – 1,400+ SQ FT",
    bestFor: "Primary residential homes, family ski chalets, lakehouses",
    highlights: [
      "Multiple bedrooms with vaulted cathedral ceilings",
      "Dual bathrooms with full washer/dryer hookups",
      "Spacious great room with panoramic picture windows",
      "IRC building code certified for standard mortgage financing",
    ],
  },
];

export default async function ModularCabinsPage() {
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  const modularCabinProducts = allProducts.filter((p) => matchProductCategory(p, "modular-cabins"));
  const catDef = CATEGORIES.find(
    (c) => c.id === "Modular Cabins" || c.href === "/modular-cabins"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    numberOfItems: modularCabinProducts.length,
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      url: "https://modularhome.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: modularCabinProducts.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: getCanonicalUrl(`/modular-cabins/${p.slug}`),
        name: p.name,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CABIN_FAQS.map((faq) => ({
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
        title="Modular Cabins"
        tagline={catDef?.tagline || "Factory-Built Precision Prefab & Modular Cabins"}
        description={
          catDef?.description ||
          "Explore our complete lineup of factory-crafted modular cabins, prefab log homes, and mountain retreat models. Built with superior craftsmanship, high-efficiency insulation, and rugged structural framing for year-round residential or vacation living."
        }
        image={catDef?.image || HERO_IMAGE}
        canonicalPath="/modular-cabins"
        products={modularCabinProducts}
        allProducts={allProducts}
        allCollections={allCollections}
        categoryKey="modular-cabins"
      >
        {/* COMPREHENSIVE MODULAR CABIN BUYER & SPECIFICATION GUIDE */}
        <section className="mt-16 pt-12 border-t border-[#e7e9ee] space-y-16">
          {/* Key Metric Highlights Bar */}
          <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Footprint Sizes</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">160 – 1,400+</div>
                <div className="text-[11px] text-[#059669] font-medium">Usable Square Feet</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Climate Rating</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">4-Season</div>
                <div className="text-[11px] text-[#6b7280]">Arctic &amp; Alpine Certified</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Off-Grid Ready</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">100%</div>
                <div className="text-[11px] text-[#6b7280]">Solar, Wood Stove &amp; Cistern</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Snow Load Rating</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">40 – 120 PSF</div>
                <div className="text-[11px] text-[#d97706] font-medium">Engineered Roof Trusses</div>
              </div>
            </div>
          </div>

          {/* Editorial Section 1: Overview */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
              <span>Mountain Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#101114] font-display">
              Built for Wilderness: Modern Precision Engineering Meets Rustic Character
            </h2>
            <div className="prose prose-neutral max-w-none text-[#4b5563] text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Building in remote recreational destinations presents notorious logistical headaches: finding skilled subcontractors willing to drive hours into the backcountry, protecting raw lumber from unpredictable mountain blizzards, and navigating harsh winter construction shut-downs.
              </p>
              <p>
                <strong>Modular cabin construction completely eliminates site-building headaches.</strong> Your cabin is precision-crafted inside our climate-controlled factory, arriving on your land up to 90% finished with pre-installed insulation, double-pane Low-E windows, pre-hung doors, rough plumbing, and finished electrical. In a single day, a specialized mobile crane positions the modules onto your foundation, giving you an instantly weather-tight retreat.
              </p>
            </div>
          </div>

          {/* Editorial Section 2: Three Cabin Footprint Tiers */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Cabin Collections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Cabin Categories: From Studio Outposts to Multi-Bedroom Lodges
              </h2>
              <p className="text-sm text-[#6b7280]">
                Choose the exact footprint engineered for your land, lifestyle, and recreational requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CABIN_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e7e9ee] rounded-2xl p-6 flex flex-col justify-between hover:border-[#fcb907] transition-all hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#d97706]">Model Class {idx + 1}</span>
                      <h3 className="text-lg font-black text-[#101114] mt-0.5">{tier.tier}</h3>
                      <div className="text-xl font-black text-[#101114] mt-1 font-display">{tier.range}</div>
                      <div className="text-xs font-bold text-[#6b7280] mt-0.5">{tier.sqft}</div>
                    </div>
                    <p className="text-xs text-[#6b7280] font-medium leading-relaxed">{tier.bestFor}</p>
                    <div className="pt-2 border-t border-[#f0f2f5] space-y-2">
                      <div className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Features Included</div>
                      <ul className="space-y-1.5 text-xs text-[#4b5563]">
                        {tier.highlights.map((item, itemIdx) => (
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

          {/* Editorial Section 3: Engineering Resilience */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e7e9ee] flex items-center justify-center text-[#d97706]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#101114]">Wildfire-Resistant Envelope</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Engineered with Class-A non-combustible metal roofing, fiber-cement exterior siding, and spark-arresting soffit venting compliant with strict WUI building zones.
              </p>
            </div>
            <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e7e9ee] flex items-center justify-center text-[#d97706]">
                <SunMedium className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#101114]">Turnkey Off-Grid Solar</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Pre-engineered roof orientations accommodate high-efficiency monocrystalline solar panels with plug-and-play lithium battery inverter systems.
              </p>
            </div>
            <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e7e9ee] flex items-center justify-center text-[#d97706]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#101114]">Pier &amp; Post Sloped Foundations</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Save tens of thousands on excavation. Our steel and timber chassis systems mount securely to helical screw piers or concrete posts on steep terrain.
              </p>
            </div>
          </div>

          {/* Editorial Section 4: Cabin FAQs */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Cabin Buyer FAQ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Frequently Asked Questions About Modular Cabins
              </h2>
              <p className="text-sm text-[#6b7280]">
                Everything you need to know about off-grid packages, foundation requirements, delivery logistics, and winterization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CABIN_FAQS.map((faq, idx) => (
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
                <span>Plan Your Mountain Escape</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                Explore Cabin Floor Plans, Pricing &amp; Custom Options
              </h2>
              <p className="text-sm text-gray-300">
                Browse our rustic models, calculate build costs, or configure a custom floor plan for your land.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <Link
                href="/modular-homes"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Modular Homes</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Primary Residences</div>
              </Link>
              <Link
                href="/modular-homes-under-100k"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Under $100k</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Budget Cabins</div>
              </Link>
              <Link
                href="/floor-plans"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3.5 rounded-xl text-center group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#fcb907]">Floor Plans</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Cabins &amp; Cottages</div>
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
                <div className="text-[10px] text-gray-400 mt-0.5">Land &amp; Cabin Loans</div>
              </Link>
              <Link
                href="/quote"
                className="bg-[#fcb907] hover:bg-[#e5a806] text-[#101114] transition-colors p-3.5 rounded-xl text-center font-bold"
              >
                <div className="text-xs font-bold">Request Quote</div>
                <div className="text-[10px] text-[#101114]/80 mt-0.5">Itemized Pricing</div>
              </Link>
            </div>
          </div>
        </section>
      </CategoryCollectionRenderer>
    </>
  );
}
