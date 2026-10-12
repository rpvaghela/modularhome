import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Building2, 
  ShieldCheck, 
  Zap, 
  Clock, 
  TrendingDown,
  Sparkles,
  Calculator,
  PhoneCall,
  Home
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const ACCURATE_MODULAR_HERO_IMAGE = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("pricing");
  const title = page?.seoTitle || "Modular Home Pricing & Packages | Factory-Direct Costs";
  const description = page?.metaDescription || "Transparent modular home pricing, package breakdowns, and cost per square foot. Compare factory-built savings vs traditional on-site construction.";
  const canonical = getCanonicalUrl("/pricing");
  const metaImage = page?.featuredImage || ACCURATE_MODULAR_HERO_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: metaImage, alt: "Modular Home Pricing & Packages" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [metaImage],
    },
  };
}

const PRICING_TIERS = [
  {
    name: "Standard Builder Series",
    tagline: "Essential Quality & Speed",
    basePrice: "$110 – $145",
    unit: "/ sq.ft.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    imageAlt: "Standard Builder Series Prefab Modular Home",
    modelName: "The Modern Ranch Prefab",
    description: "Ideal for secondary suites, budget-conscious homeowners, and rental property investors.",
    popular: false,
    features: [
      "Precision light-gauge steel or 2x6 timber framing",
      "R-21 Wall & R-38 Roof high-efficiency insulation",
      "Standard double-pane Low-E vinyl windows",
      "Durable architectural shingle or 29-ga metal roof",
      "Standard shaker cabinetry & laminate countertops",
      "Complete MEP factory pre-wiring & plumbing stubs",
      "10-Year Structural Integrity Warranty",
    ],
    ctaText: "Explore Standard Models",
    ctaHref: "/modular-homes",
  },
  {
    name: "Architectural Signature",
    tagline: "Most Popular Turnkey Solution",
    basePrice: "$150 – $195",
    unit: "/ sq.ft.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    imageAlt: "The Modern Craftsman Modular Residence",
    modelName: "The Modern Craftsman Modular Residence (2,150 SQ FT)",
    description: "Premium architectural finishes, open-concept layouts, and elevated energy performance.",
    popular: true,
    features: [
      "Heavy-gauge structural frame with 9-foot ceilings",
      "R-30+ closed-cell spray foam envelope insulation",
      "Commercial-grade black aluminum thermal break windows",
      "Standing seam metal roofing with 40-yr finish",
      "Solid quartz or granite countertops throughout",
      "Luxury vinyl plank (LVP) or engineered hardwood",
      "Smart thermostat & energy monitoring pre-installed",
      "10-Year Structural + 2-Year Workmanship Warranty",
    ],
    ctaText: "Customize Signature Home",
    ctaHref: "/quote",
  },
  {
    name: "Ultra-Luxury & Custom",
    tagline: "Custom Architectural Masterpiece",
    basePrice: "$210 – $290+",
    unit: "/ sq.ft.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM3945-front_1.png?v=1750743065",
    imageAlt: "Modern Modular Barndominium Estate",
    modelName: "The Grandview Modern Barndominium",
    description: "Fully custom architectural engineering, net-zero solar readiness, and executive appointments.",
    popular: false,
    features: [
      "Custom multi-module architectural cantilever designs",
      "Floor-to-ceiling glass curtain walls & bi-fold doors",
      "Net-zero ready insulation with ERV air exchange",
      "Integrated solar roof prep & backup battery enclosure",
      "Custom European millwork & high-end chef kitchen",
      "Designer spa bathrooms with freestanding soaking tubs",
      "White-glove project manager & crane coordination",
      "10-Year Comprehensive Transferable Warranty",
    ],
    ctaText: "Book Custom Consultation",
    ctaHref: "/quote",
  },
];

const COST_BREAKDOWN = [
  {
    phase: "1. Factory Module Fabrication",
    percentage: "50% – 60%",
    details: "Precision structural framing, insulation, interior drywall, flooring, kitchen cabinets, bathroom fixtures, plumbing, and electrical pre-installation.",
  },
  {
    phase: "2. Engineering, Plans & Permitting",
    percentage: "5% – 8%",
    details: "State-stamped architectural blueprints, foundation engineering calculations, local building permit coordination, and municipal zoning compliance.",
  },
  {
    phase: "3. Foundation & Site Preparation",
    percentage: "15% – 20%",
    details: "Site excavation, soil testing, concrete slab/crawlspace/basement pouring, anchor bolt setting, and utility trenching.",
  },
  {
    phase: "4. Freight, Crane & On-Site Stitching",
    percentage: "10% – 15%",
    details: "Oversized highway transport, heavy crane placement on foundation, weather-tight module marriage seam sealing, and utility hookups.",
  },
];

export default async function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Modular Home Pricing & Packages",
    description: "Transparent pricing breakdown for precision modular homes and prefab packages.",
    url: "https://modularhome.com/pricing",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ACCURATE_MODULAR_HERO_IMAGE,
    },
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      logo: "https://modularhome.com/newmodularlogo.png",
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#101114]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-[#e7e9ee] bg-[#fbfbfc]">
        <div className="wrap py-3 text-xs text-[#6b7280] flex items-center gap-2">
          <Link href="/" className="hover:text-[#101114] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#d97706] font-bold">Pricing & Packages</span>
        </div>
      </div>

      {/* Hero Section with Accurate Modular Home Picture */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] bg-[#fef3c7] px-3.5 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Direct-From-Factory Pricing</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05] font-display">
                Transparent Modular Home Pricing &amp; Packages
              </h1>

              <p className="text-base sm:text-lg text-[#4b5563] leading-relaxed font-body">
                Eliminate unpredictable construction cost overruns. Our factory-engineered precision delivers 15%–25% overall savings and 50% faster build timelines compared to traditional site-built homes.
              </p>

              {/* Value Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-[#e7e9ee] shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-[#101114] font-display">15%–25%</div>
                  <div className="text-[11px] font-semibold text-[#6b7280]">Average Savings</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#e7e9ee] shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-display">8–16 Wks</div>
                  <div className="text-[11px] font-semibold text-[#6b7280]">Move-In Speed</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#e7e9ee] shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-[#d97706] font-display">100%</div>
                  <div className="text-[11px] font-semibold text-[#6b7280]">Price Certainty</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/quote"
                  className="px-6 py-3.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Get Instant Turnkey Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/floor-plans"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-[#d5d9e0] text-[#101114] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Browse Floor Plans</span>
                </Link>
              </div>
            </div>

            {/* Right: Accurate Modular Home Hero Picture */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden border border-[#e7e9ee] shadow-2xl group">
                <Image
                  src={ACCURATE_MODULAR_HERO_IMAGE}
                  alt="The Modern Craftsman Modular Residence — Precision Factory-Built Modular Home by ModularHome.com"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                    Real Modular Home Model
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/75 backdrop-blur-md text-white border border-white/15">
                  <div className="text-xs uppercase font-extrabold tracking-wider text-[#fcb907]">
                    The Modern Craftsman Modular Residence
                  </div>
                  <div className="text-sm font-bold mt-0.5 text-white/95">
                    2,150 SQ FT • 3 Bed 2.5 Bath • Starting at $249,900
                  </div>
                  <div className="text-[11px] text-white/70 mt-1">
                    Turnkey Architectural Package • Factory-Built Precision
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Grid with Accurate Visual Model Pictures */}
      <section className="py-16 bg-white">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Package Architecture &amp; Specifications
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101114] tracking-tight font-display mt-1">
              Choose Your Architectural Package Tier
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Every package is precision-engineered to meet or exceed your local state residential building codes (IRC) and climate requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col justify-between rounded-[22px] overflow-hidden transition-all ${
                  tier.popular
                    ? "bg-[#101114] text-white shadow-2xl ring-2 ring-[#fcb907] scale-[1.02]"
                    : "bg-[#f8f9fa] text-[#101114] border border-[#e7e9ee] hover:shadow-lg"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-3 right-3 z-20 bg-[#fcb907] text-[#101114] text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                {/* Accurate Tier Model Picture */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/20">
                  <Image
                    src={tier.image}
                    alt={tier.imageAlt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-bold truncate">
                    {tier.modelName}
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#d97706] mb-1">
                      {tier.tagline}
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${tier.popular ? "text-white" : "text-[#101114]"}`}>
                      {tier.name}
                    </h3>
                    <p className={`text-xs mt-2 leading-relaxed ${tier.popular ? "text-gray-300" : "text-[#6b7280]"}`}>
                      {tier.description}
                    </p>

                    <div className="mt-5 mb-5 pb-5 border-b border-[#e7e9ee]/30 flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight">{tier.basePrice}</span>
                      <span className={`text-xs font-semibold ${tier.popular ? "text-gray-400" : "text-[#6b7280]"}`}>{tier.unit}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className={`text-xs font-bold uppercase tracking-wider ${tier.popular ? "text-gray-300" : "text-[#374151]"}`}>
                        What's Included:
                      </div>
                      {tier.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? "text-[#fcb907]" : "text-[#d97706]"}`} />
                          <span className={tier.popular ? "text-gray-200" : "text-[#4b5563]"}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={tier.ctaHref}
                    className={`w-full text-center py-3.5 px-4 rounded-[12px] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      tier.popular
                        ? "bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] shadow-md"
                        : "bg-[#101114] hover:bg-[#262830] text-white"
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Breakdown & Transparency Matrix */}
      <section className="py-16 bg-[#f8f9fa] border-y border-[#e7e9ee]">
        <div className="wrap max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Turnkey Cost Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#101114] tracking-tight font-display mt-1">
              Where Does Your Investment Go?
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              A comprehensive turnkey breakdown of a modular home project from factory floor to finished occupancy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {COST_BREAKDOWN.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-[#101114]">{item.phase}</h3>
                  <span className="text-xs font-black bg-[#fef3c7] text-[#d97706] px-3 py-1 rounded-full">
                    {item.percentage}
                  </span>
                </div>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modular vs Traditional Comparison Table */}
      <section className="py-16 bg-white">
        <div className="wrap max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Head-To-Head Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#101114] tracking-tight font-display mt-1">
              Modular vs. Traditional Site Construction
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              See why hundreds of American families are switching to factory precision housing.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[18px] border border-[#e7e9ee] shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#101114] text-white">
                  <th className="p-4.5 font-bold text-xs uppercase tracking-wider">Factor</th>
                  <th className="p-4.5 font-bold text-xs uppercase tracking-wider text-[#fcb907]">ModularHome.com</th>
                  <th className="p-4.5 font-bold text-xs uppercase tracking-wider text-gray-400">Traditional Site-Built</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e9ee] text-xs">
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Average Timeline</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/50">8 – 16 Weeks Total (30–50% Faster)</td>
                  <td className="p-4 text-[#6b7280]">9 – 18 Months</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Weather Delay Risk</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/50">0% (Built indoors in climate control)</td>
                  <td className="p-4 text-[#6b7280]">High (Rain, snow, mold vulnerability)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Price Certainty</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/50">Fixed Factory Contract Price</td>
                  <td className="p-4 text-[#6b7280]">Frequent 15–30% Cost Overruns</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Energy Efficiency</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/50">Up to 30% lower heating/cooling bills</td>
                  <td className="p-4 text-[#6b7280]">Standard baseline code minimums</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Material Waste</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/50">&lt; 2% Waste (Recycled at factory)</td>
                  <td className="p-4 text-[#6b7280]">15%–20% Dumpster landfill waste</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#fcb907] text-xs font-black uppercase tracking-widest">
            <span>Guaranteed Price Certainty</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
            Ready to Price Your Dream Modular Home?
          </h2>

          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Get an instant custom quote tailored to your property location, desired floor plan, and preferred finishes.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-4 px-7 rounded-[12px] transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <span>Request Free Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/floor-plans"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-4 px-7 rounded-[12px] transition-all border border-white/20"
            >
              <span>Browse Floor Plans</span>
            </Link>
            <a
              href="tel:8125954033"
              className="bg-transparent hover:bg-white/5 text-stone-300 hover:text-white font-bold text-xs uppercase tracking-wider py-4 px-7 rounded-[12px] transition-all inline-flex items-center gap-2 border border-white/10"
            >
              <PhoneCall className="w-4 h-4 text-[#fcb907]" />
              <span>Call 812-595-4033</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
