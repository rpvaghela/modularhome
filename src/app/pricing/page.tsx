import { Metadata } from "next";
import Link from "next/link";
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
  Calculator
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("pricing");
  const title = page?.seoTitle || "Modular Home Pricing & Packages | Factory-Direct Costs";
  const description = page?.metaDescription || "Transparent modular home pricing, package breakdowns, and cost per square foot. Compare factory-built savings vs traditional on-site construction.";
  const canonical = getCanonicalUrl("/pricing");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Modular Home Pricing" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/newmodularlogo.png"],
    },
  };
}

const PRICING_TIERS = [
  {
    name: "Standard Builder Series",
    tagline: "Essential Quality & Speed",
    basePrice: "$110 – $145",
    unit: "/ sq.ft.",
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
    name: "Ultra-Luxury & Off-Grid",
    tagline: "Custom Architectural Masterpiece",
    basePrice: "$210 – $290+",
    unit: "/ sq.ft.",
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
  const page = await getPublicPageBySlug("pricing");

  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    return <DynamicPageRenderer page={page} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Modular Home Pricing & Packages",
    description: "Transparent pricing breakdown for precision modular homes and prefab packages.",
    url: "https://modularhome.com/pricing",
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

      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Direct-From-Factory Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
            Transparent Modular Home Pricing & Packages
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            Eliminate unpredictable construction cost overruns. Our factory-engineered precision delivers 15%–25% overall savings and 50% faster build timelines compared to traditional site-built homes.
          </p>
        </div>
      </section>

      {/* Pricing Tiers Grid */}
      <section className="py-14 bg-white">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Choose Your Architectural Package Tier
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Every package is precision-engineered to meet or exceed your local state building codes and climate conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col justify-between rounded-[20px] p-6 sm:p-8 transition-all ${
                  tier.popular
                    ? "bg-[#101114] text-white shadow-2xl ring-2 ring-[#fcb907] scale-[1.02]"
                    : "bg-[#f8f9fa] text-[#101114] border border-[#e7e9ee] hover:shadow-lg"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#fcb907] text-[#101114] text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

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

                  <div className="mt-6 mb-6 pb-6 border-b border-[#e7e9ee]/30 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight">{tier.basePrice}</span>
                    <span className={`text-xs font-semibold ${tier.popular ? "text-gray-400" : "text-[#6b7280]"}`}>{tier.unit}</span>
                  </div>

                  <div className="space-y-3 mb-8">
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
            ))}
          </div>
        </div>
      </section>

      {/* Cost Breakdown & Transparency Matrix */}
      <section className="py-14 bg-[#f8f9fa] border-y border-[#e7e9ee]">
        <div className="wrap max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Where Does Your Investment Go?
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              A comprehensive turnkey breakdown of a modular home project from factory floor to finished occupancy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {COST_BREAKDOWN.map((item, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-6 rounded-[16px] border border-[#e7e9ee] shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-[#101114]">{item.phase}</h3>
                  <span className="text-xs font-black bg-[#fef3c7] text-[#d97706] px-2.5 py-1 rounded-full">
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
      <section className="py-14 bg-white">
        <div className="wrap max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Modular vs. Traditional Site Construction
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              See why hundreds of American families are switching to factory precision housing.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[16px] border border-[#e7e9ee] shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#101114] text-white">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">Factor</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-[#fcb907]">ModularHome.com</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-400">Traditional Site-Built</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e9ee]">
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Average Timeline</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-emerald-50/50">8 – 16 Weeks Total</td>
                  <td className="p-4 text-[#6b7280]">9 – 18 Months</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Weather Delay Risk</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-emerald-50/50">0% (Built indoors in climate control)</td>
                  <td className="p-4 text-[#6b7280]">High (Rain, snow, mold vulnerability)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Price Certainty</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-emerald-50/50">Fixed Factory Contract Price</td>
                  <td className="p-4 text-[#6b7280]">Frequent 15–30% Cost Overruns</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Energy Efficiency</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-emerald-50/50">Up to 30% lower heating/cooling bills</td>
                  <td className="p-4 text-[#6b7280]">Standard baseline code minimums</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101114]">Material Waste</td>
                  <td className="p-4 font-semibold text-emerald-700 bg-emerald-50/50">&lt; 2% Waste (Sustainable recycling)</td>
                  <td className="p-4 text-[#6b7280]">15%–20% Dumpster landfill waste</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-12 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to Price Your Dream Modular Home?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Get an instant custom quote tailored to your property location, desired floor plan, and preferred finishes.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all flex items-center gap-2"
            >
              <span>Request Free Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/floor-plans"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all"
            >
              Browse Floor Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
