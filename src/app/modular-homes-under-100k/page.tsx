import { Metadata } from "next";
import Link from "next/link";
import { getPublicProducts } from "@/lib/publicData";
import { isHomeUnder100k } from "@/utils/categoryMatching";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";
import { getCanonicalUrl } from "@/lib/seo";
import { 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Zap, 
  Clock, 
  TrendingDown, 
  Home, 
  Compass, 
  FileCheck2, 
  Truck, 
  HelpCircle,
  Sparkles
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "Modular Homes Under $100k | Affordable Prefab & Move-In-Ready Cabins";
const DESCRIPTION =
  "Explore verified modular homes, prefab cabins, studio ADUs, and turnkey starter homes priced under $100,000. Precision factory construction, transparent pricing, and nationwide delivery.";
const CANONICAL = getCanonicalUrl("/modular-homes-under-100k");
const IMAGE =
  "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: "ModularHome.com",
    images: [{ url: IMAGE, alt: "Affordable modular homes under $100k" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE],
  },
};

const UNDER_100K_FAQS = [
  {
    q: "Can you really buy a high-quality modular home for under $100,000?",
    a: "Yes. While larger multi-section 2,000+ square foot homes generally cost $150,000 to $300,000, our curated under-$100k collection focuses on precision-engineered 1 to 3-bedroom modular cabins, park model homes, backyard ADUs, and compact prefab modules ranging from 150 to 900+ square feet. Because these units are built indoors using automated assembly, material bulk purchasing, and zero weather delays, builders can deliver fully finished, code-compliant turnkey living spaces at a fraction of on-site construction costs.",
  },
  {
    q: "What does the base factory price under $100k typically include?",
    a: "Base factory pricing for our sub-$100k homes includes complete structural framing, exterior siding, metal or architectural shingle roofing, full insulation (typically R-21 walls and R-38 roof), double-pane Low-E windows, finished interior wall paneling or drywall, solid flooring, complete electrical wiring with breaker box, PEX plumbing lines, and standard kitchen and bathroom cabinetry and fixtures. Exact specifications vary by model series.",
  },
  {
    q: "What additional on-site costs should I budget for beyond the home price?",
    a: "Homeowners should typically budget an additional 20% to 35% of the home price for on-site preparation. Common on-site costs include: building permits ($1,000 – $3,500), foundation work such as concrete piers or a continuous slab ($4,000 – $10,000), utility connections for water/well, sewer/septic, and electric hookup ($4,000 – $12,000), and freight delivery and crane setup depending on distance from the manufacturing plant ($3,000 – $8,000).",
  },
  {
    q: "Are these homes built to the International Residential Code (IRC) or HUD code?",
    a: "Our collection includes both IRC-compliant modular residences (which appraise and finance exactly like traditional site-built homes) and ANSI A119.5 park models or tiny homes on chassis. IRC-compliant modular homes meet or exceed local state building codes and are permanently set on engineered foundations, making them eligible for conventional mortgages and zoning approval in most jurisdictions.",
  },
  {
    q: "How fast can an under-$100k modular home be manufactured and delivered?",
    a: "Factory fabrication of standard floor plans typically takes just 4 to 8 weeks once engineering permits are cleared. While the factory is constructing your home, your local contractor can simultaneously prepare the foundation and utilities on your land. Once the modules arrive on-site, assembly and final utility connections are completed in 1 to 5 days, making it up to 60% faster than traditional building.",
  },
  {
    q: "Can I use an under-$100k modular home as an Airbnb or rental property?",
    a: "Absolutely. In fact, compact modular cabins and studio ADUs under $100k are among the highest-yielding real estate investments in the hospitality sector. With turnkey purchase prices between $25,000 and $79,000, investors frequently achieve cash-on-cash returns of 25% to 40% when operated as short-term vacation rentals on platforms like Airbnb and Vrbo.",
  },
  {
    q: "How can I finance a modular home that costs under $100,000?",
    a: "Multiple financing paths exist: (1) Construction-to-permanent mortgages for IRC-compliant modular homes placed on owned real estate, (2) Chattel or personal property loans for park models and tiny homes, (3) Home Equity Loans or HELOCs if adding a backyard ADU to an existing residence, and (4) Personal unsecured construction loans for fast, collateral-free funding up to $100,000.",
  },
  {
    q: "How do these homes hold up against severe weather, wind, and winter snow?",
    a: "Every unit is engineered with high-strength structural framing, hurricane strapping, and heavy-gauge fasteners designed to withstand interstate highway transit at 65 MPH—a level of structural rigidity that traditional stick-built homes rarely match. Our models feature wind load ratings certified up to 115–140 MPH and snow load ratings engineered for northern climates up to 40–60 PSF.",
  },
];

const PRICE_TIERS = [
  {
    range: "$20,000 – $40,000",
    category: "Micro Cabins & Studio Prefabs",
    sqft: "150 – 350 SQ FT",
    bestFor: "Hunting cabins, guest bunks, detached backyard offices, glamping retreats",
    features: [
      "Heavy-duty timber or light-gauge steel structural frame",
      "Full insulated thermal envelope with double-pane Low-E glass",
      "Single open-concept living/sleeping area with kitchenette option",
      "Easy delivery via standard tilt-bed trailer with minimal site prep",
    ],
  },
  {
    range: "$40,000 – $75,000",
    category: "1-Bedroom Turnkey Cabins & ADUs",
    sqft: "350 – 550 SQ FT",
    bestFor: "Backyard rental suites, aging-in-place granny pods, lakefront cottages",
    features: [
      "Private separate master bedroom and full 3-piece bathroom",
      "Fully equipped galley kitchen with solid shaker cabinets",
      "Mini-split heat pump heating and air conditioning pre-installed",
      "Finished pine tongue-and-groove or painted drywall interiors",
    ],
  },
  {
    range: "$75,000 – $99,900",
    category: "2 to 3-Bedroom Modular Cottages",
    sqft: "550 – 900+ SQ FT",
    bestFor: "Starter primary residences, retirement homes, full-family vacation lodges",
    features: [
      "Two to three dedicated bedrooms with built-in storage closets",
      "Spacious living room with vaulted cathedral ceilings",
      "Full-sized residential appliances and laundry hookup stubs",
      "Meets IRC modular building codes for conventional mortgage approval",
    ],
  },
];

export default async function ModularHomesUnder100kPage() {
  const allProducts = await getPublicProducts();

  // Filter products strictly under $100,000 and sort ascending so the lowest price entry models appear first
  const affordable = allProducts
    .filter((p) => isHomeUnder100k(p))
    .sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modular Homes Under $100k",
    description: DESCRIPTION,
    url: CANONICAL,
    numberOfItems: affordable.length,
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      url: "https://modularhome.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: affordable.slice(0, 30).map((p, idx) => ({
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
    mainEntity: UNDER_100K_FAQS.map((faq) => ({
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
        title="Modular Homes Under $100k"
        tagline="Affordable Factory-Built Living Under $100,000"
        description="Browse certified move-in-ready modular homes, prefab cabins, studio ADUs, and starter residences priced strictly under $100,000. Precision factory engineering, verified floor plans, and nationwide delivery."
        image={IMAGE}
        canonicalPath="/modular-homes-under-100k"
        products={affordable}
        allProducts={affordable}
        allCollections={[]}
        categoryKey="modular-homes-under-100k"
        lockPoolToInitial={true}
      >
        {/* COMPREHENSIVE ARCHITECTURAL & BUYER GUIDE FOR HOMES UNDER $100K */}
        <section className="mt-16 pt-12 border-t border-[#e7e9ee] space-y-16">
          {/* Key Metric Highlights Bar */}
          <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Entry Price</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">$20,900</div>
                <div className="text-[11px] text-[#059669] font-medium">100% Under $100,000</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Living Space</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">150 – 900+</div>
                <div className="text-[11px] text-[#6b7280]">Square Feet Usable</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Factory Build Time</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">4 – 8 Wks</div>
                <div className="text-[11px] text-[#6b7280]">Indoor Climate-Controlled</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Warranty</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">10 – 50 Yrs</div>
                <div className="text-[11px] text-[#d97706] font-medium">Structural Protection</div>
              </div>
            </div>
          </div>

          {/* Editorial Section 1: Overview */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
              <span>Architectural Insight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#101114] font-display">
              How Factory-Built Construction Delivers Real Homes Under $100,000
            </h2>
            <div className="prose prose-neutral max-w-none text-[#4b5563] text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                In an era where the median price of newly constructed stick-built homes in the United States exceeds $420,000, finding a durable, energy-efficient, and aesthetically compelling home under $100,000 might seem impossible. Traditional on-site homebuilding is plagued by staggering labor shortages, unpredictable weather delays, 15% to 20% jobsite lumber waste, and compounding subcontractor margins.
              </p>
              <p>
                <strong>Modern modular and prefab construction flips this equation entirely.</strong> By moving 85% to 95% of the construction process inside advanced manufacturing facilities, builders achieve economies of scale impossible on an open jobsite. Materials are purchased directly from manufacturers in railcar volumes. High-precision jigs guarantee square framing to 1/16th of an inch. Specialized trades (framers, electricians, plumbers, and drywall finishers) work simultaneously under optimal lighting and dry indoor conditions. The result is a tighter thermal envelope, superior structural rigidity, and dramatic cost savings that are passed directly to the homebuyer.
              </p>
            </div>
          </div>

          {/* Editorial Section 2: Three Distinct Price Tiers */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Budget Planning</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                What Can You Buy Under $100k? Comparing the Three Price Tiers
              </h2>
              <p className="text-sm text-[#6b7280]">
                Understand what layout, square footage, and amenities your budget unlocks across our sub-$100k catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICE_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e7e9ee] rounded-2xl p-6 shadow-sm hover:border-[#fcb907] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-[#e7e9ee]">
                      <div className="text-xs uppercase font-bold text-[#d97706] tracking-wider mb-1">
                        Tier {idx + 1}
                      </div>
                      <div className="text-2xl font-black text-[#101114] font-display">{tier.range}</div>
                      <div className="text-sm font-bold text-[#101114] mt-1">{tier.category}</div>
                      <div className="text-xs text-[#6b7280] mt-0.5">{tier.sqft}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101114] mb-1">Best Suited For:</div>
                      <div className="text-xs text-[#4b5563] leading-relaxed">{tier.bestFor}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#101114]">Key Inclusions:</div>
                      <ul className="space-y-1.5">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-[#4b5563] flex items-start gap-1.5 leading-snug">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Section 3: Four Popular Architectural Archetypes */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Design Archetypes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Four Proven Architectural Archetypes Under $100k
              </h2>
              <p className="text-sm text-[#6b7280]">
                Explore how different modular engineering archetypes fulfill specific homeowner and investor goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  1. Handcrafted Amish & Modern Modular Cabins ($24,900 – $99,900)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  Engineered with solid eastern white pine, heavy timber rafters, vaulted exposed ceilings, and architectural metal roofs. Popular models like The Driftwood ($24,900), Tiny Tim ($29,900), and El Chapo Muchacho ($69,900) provide rustic charm combined with modern residential plumbing, electrical, and spray-foam insulation for year-round four-season living.
                </p>
              </div>

              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  2. Studio & 1-Bedroom Backyard ADUs ($48,900 – $85,000)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  Accessory Dwelling Units are skyrocketing in popularity across California, Texas, Florida, and the Pacific Northwest due to streamlined state ADU zoning laws. These turnkey modules (like the Studio ADU Backyard Suite at $48,900) drop seamlessly into backyard spaces, generating $1,200 to $2,400 per month in long-term rental income or serving as aging-in-place family suites.
                </p>
              </div>

              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  3. Architectural Park Models & Tiny Living ($29,900 – $89,900)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  Built to rigorous ANSI A119.5 engineering standards on integrated heavy-duty steel chassis, park models maximize every square inch. Featuring sleeping lofts, oversized clerestory windows, full residential bathrooms, and designer kitchenettes, units like The Lone Wolf ($29,900) and Firefly ($44,900) are favorites for RV resorts, mountain acreage, and vacation rentals.
                </p>
              </div>

              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  4. Multi-Bedroom Affordable Prefab House Kits ($39,900 – $99,900)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  For property owners seeking larger footprints (700 to 1,200+ SQ FT) under $100k, pre-engineered steel or panelized house kits provide full 2 to 3-bedroom structural shells. Including precision framing components, roof trusses, sheathing, and stamped architectural blueprints, these kits enable owner-builders and local contractors to finish full-size homes on budget.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Section 4: Site Preparation Budget Checklist */}
          <div className="bg-white border border-[#e7e9ee] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Real-World Budgeting</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Complete Site Preparation & Turnkey Installation Budget Checklist
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280]">
                To ensure zero financial surprises, always account for on-site infrastructure alongside your home's factory purchase price.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#101114]">1. Engineered Foundation</span>
                  <span className="text-xs font-black text-[#d97706]">$3,500 – $9,000</span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Options include poured concrete runner footers, sonotube concrete piers, or a full monolithic concrete slab engineered to your local soil bearing capacity and frost depth.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#101114]">2. Municipal Permits & Impact Fees</span>
                  <span className="text-xs font-black text-[#d97706]">$1,000 – $3,500</span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Local city or county building department permits, site plan review, zoning verification, and residential trade inspection sign-offs.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#101114]">3. Utility Trenching & Hookups</span>
                  <span className="text-xs font-black text-[#d97706]">$4,000 – $12,000</span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Electric meter pedestal and underground conduit, septic tank installation or municipal sewer lateral connection, and well pump or city water meter tie-in.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#101114]">4. Delivery Freight & Crane Set</span>
                  <span className="text-xs font-black text-[#d97706]">$3,000 – $7,500</span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Specialized highway transport with pilot escort vehicles, jobsite crane staging, module setting onto the foundation, and structural anchor tie-downs.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Section 5: Frequently Asked Questions */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Answers to Common Questions About Modular Homes Under $100k
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280]">
                Everything you need to know about pricing, financing, building codes, and nationwide delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UNDER_100K_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-[#e7e9ee] rounded-xl space-y-2 hover:border-[#fcb907] transition-colors"
                >
                  <h3 className="text-sm font-bold text-[#101114] leading-snug flex items-start gap-2">
                    <span className="text-[#d97706] font-mono text-xs mt-0.5">Q{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-[#4b5563] leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Call to Action Box */}
          <div className="bg-gradient-to-r from-[#101114] to-[#1f2937] text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcb907]/20 border border-[#fcb907]/40 text-[#fcb907] text-xs font-bold uppercase tracking-wider">
              <span>Ready to Build Within Your Budget?</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-display max-w-2xl mx-auto">
              Get an Itemized Factory Quote & Local Delivery Estimate
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] max-w-xl mx-auto leading-relaxed">
              Connect with our modular engineering team for exact state-delivered pricing, custom floor plan modifications, foundation requirements, and available factory production slots.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/quote"
                className="px-6 py-3 bg-[#fcb907] hover:bg-[#d97706] text-[#101114] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <span>Request Free Factory Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/floor-plans"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20"
              >
                Browse All Floor Plans
              </Link>
            </div>
          </div>
        </section>
      </CategoryCollectionRenderer>
    </>
  );
}
