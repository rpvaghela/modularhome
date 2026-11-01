import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { getPublicProducts, toCatalogProducts } from "@/lib/publicData";
import { isSteelHouseKit } from "@/utils/categoryMatching";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import CategoryFilteredCatalog from "@/components/CategoryFilteredCatalog";
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  TrendingDown, 
  Home, 
  Compass, 
  FileCheck2, 
  Truck, 
  HelpCircle,
  Sparkles,
  HardHat,
  Check,
  Wrench,
  Layers,
  Zap,
  Shield,
  FileText
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "Steel House Kits & Barndominium Shells | Professional Installation Included | ModularHome.com";
const DESCRIPTION =
  "Explore commercial-grade 16-gauge steel house kits and barndominium shells. Follows Amish Built Cabins steel kits process. Stamped blueprints and professional factory installation included on your concrete slab.";
const CANONICAL = getCanonicalUrl("/steel-house-kits");
const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Florida-01_f886afd7-dcf0-4eca-b349-5e022fe0ce33.jpg?v=1786101890";

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
          alt: "Steel House Kits and Barndominium Shells with Professional Installation Included",
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

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Choose or Customize Your Floor Plan",
    desc: "Select from our pre-engineered catalog of residential steel kits and barndominiums (1 to 5+ bedrooms, ADUs, two-story, or shop houses), or submit your custom architectural sketches for engineering adaptation.",
  },
  {
    step: "02",
    title: "Engineering & Stamped Drawings",
    desc: "Every package is custom-engineered to your specific building site's local codes, including stamped structural blueprints, steel framing layouts, roof plans, and wind load (up to 160 MPH) and snow load calculations for county permitting.",
  },
  {
    step: "03",
    title: "Precision Factory Fabrication",
    desc: "Components are fabricated in a climate-controlled plant utilizing heavy-duty 16-gauge cold-formed galvanized real steel studs, pre-punched utility conduits, and custom-cut commercial metal panels.",
  },
  {
    step: "04",
    title: "Professional On-Site Installation",
    desc: "Our specialized factory crew travels directly to your prepared concrete slab. We erect the exterior steel framing, interior partition studs, ZIP System weather barrier, and metal roofing and siding to deliver a certified dried-in structural shell. If you provide windows and exterior doors on site, our crew installs them at no additional labor charge.",
  },
  {
    step: "05",
    title: "Interior Finishing on Your Timeline",
    desc: "Once your dried-in shell is safely sealed against the weather, you have full flexibility to complete plumbing, electrical, insulation, drywall, and cabinetry using local contractors or your own timeline and budget.",
  },
];

const STEEL_KIT_FAQS = [
  {
    q: "What gauge of steel is used in these house kits?",
    a: "We build with heavy-duty 16-gauge to 18-gauge cold-formed commercial structural steel studs for both exterior perimeter load-bearing walls and interior room partition framing. This commercial steel will not rot, warp, shrink, or host termites, and delivers unmatched resistance against extreme 140–160+ MPH hurricane winds and heavy snow loads.",
  },
  {
    q: "What does 'Professional Installation Included' actually cover?",
    a: "Unlike typical material-only suppliers who simply dump parts in your driveway, our Steel House Kit packages include a certified factory installation crew that travels to your jobsite. Our team erects the structural steel frame, interior room studs, ZIP System sheathing, metal siding, and metal roofing. The crew completes a fully dried-in shell ready for interior trades.",
  },
  {
    q: "Will your installation crew install my windows and exterior doors?",
    a: "Yes! As long as you purchase and have your windows and exterior doors delivered to the jobsite before our crew finishes the framing phase, our installation team will set and flash them into the shell at no additional labor charge.",
  },
  {
    q: "What must the homeowner provide before the crew arrives?",
    a: "The homeowner or their local general contractor is responsible for site clearing, dirt work, utility trenching, and pouring the level, fully cured concrete slab foundation according to the engineered anchor bolt placement plan provided in your blueprint package.",
  },
  {
    q: "How does pricing work for installed steel shells?",
    a: "Following the Amish Built Cabins steel kits pricing framework, professionally installed dried-in steel shells typically range between $110 to $135 per square foot of enclosed living space (or $65 to $75 per square foot under total roof for barndominiums with large porches/garages). Materials-only self-install packages are also available at approximately $65 to $75 per sq. ft.",
  },
  {
    q: "How do Steel House Kits differ from Budget House Kits?",
    a: "Budget House Kits are wood-frame or SIP panelized DIY packages where on-site installation is completely excluded (shipped as materials for self-assembly or local contractor framing). Steel House Kits are commercial 16-gauge steel structural packages that include professional factory installation on your slab with weather-tight dried-in certification.",
  },
];

export default async function SteelHouseKitsPage() {
  const allProducts = await getPublicProducts();
  const steelProducts = (allProducts || []).filter((p) => isSteelHouseKit(p));
  const leanSteelProducts = toCatalogProducts(steelProducts);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. HERO SECTION (ULTRA-COMPACT) */}
      <section className="relative bg-[#090d14] text-white py-5 sm:py-7 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={HERO_IMAGE}
            alt="Steel House Kits and Barndominium Shells"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d14] via-[#090d14]/90 to-transparent" />
        </div>

        <div className="wrap relative z-10">
          <div className="max-w-3xl">
            {/* Top Navigation Pill & Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fcb907]/20 border border-[#fcb907]/40 text-[#fcb907] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                16-Gauge Real Steel Framing
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                Factory Installation Included
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-[-0.8px] text-white leading-tight mb-1.5">
              Steel House Kits & Barndominiums
            </h1>

            <p className="text-xs sm:text-[13px] text-gray-300 leading-snug font-normal mb-2 max-w-2xl">
              Following the proven <strong className="text-white">Amish Built Cabins steel kits process</strong>, our packages include stamped engineered plans, precision 16-gauge steel framing, and a certified factory crew to erect your dried-in structural shell directly on your concrete slab.
            </p>

            {/* Clear Advantage Callout Banner - Ultra-Compact */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121824]/90 border border-[#fcb907]/40 text-amber-200 text-xs mb-3 shadow-xs">
              <HardHat className="w-3.5 h-3.5 text-[#fcb907] shrink-0" />
              <span>
                <strong className="text-white font-bold uppercase text-[10px] tracking-wider mr-1">
                  Factory Installation Included:
                </strong>
                Certified crew erects dried-in shell directly on your slab. Free owner-supplied door/window setting.
              </span>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#catalog"
                className="btn-primary py-1.5 px-4 text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
              >
                <span>Browse {steelProducts.length} Steel Kit Models</span>
                <ArrowRight className="w-3 h-3" />
              </a>

              <Link
                href="/budget-house-kits"
                className="py-1.5 px-4 text-xs font-bold text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Looking for DIY Wood Packages? View Budget Kits →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATALOG (AT TOP) */}
      <section id="catalog" className="py-6 sm:py-8 bg-white">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#d97706]">
                Commercial Steel Catalog
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] m-0">
                All Steel House Kit Models ({steelProducts.length})
              </h2>
              <p className="text-sm text-[#6b7280] mt-1.5 mb-0">
                16-Gauge real steel frames with professional installation included. Verified source specifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/budget-house-kits"
                className="text-xs sm:text-sm font-bold text-[#d97706] hover:text-[#b45309] hover:underline"
              >
                Switch to Budget House Kits (DIY) →
              </Link>
            </div>
          </div>

          <CategoryFilteredCatalog
            initialProducts={leanSteelProducts}
            allProducts={leanSteelProducts}
            categoryName="Steel House Kits"
            categoryKey="steel-house-kits"
            lockPoolToInitial={true}
          />
        </div>
      </section>

      {/* 3. THE 5-STEP HOW IT WORKS PROCESS (BELOW PRODUCTS) */}
      <section className="py-14 sm:py-20 bg-[#fafafa] border-t border-b border-gray-200/80">
        <div className="wrap max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#d97706] mb-2 block">
              Proven 5-Step Execution
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mb-3">
              How Steel House Kits & Shell Installs Work
            </h2>
            <p className="text-xs sm:text-base text-[#6b7280] leading-relaxed max-w-2xl mx-auto">
              Based on the authentic Amish Built Cabins steel kits methodology from blueprints to dried-in delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#fcb907] transition-all duration-300"
              >
                <div>
                  <div className="text-2xl font-black text-[#d97706] mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#101114] mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#4b5563] leading-relaxed m-0">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INCLUSIONS VS EXCLUSIONS BREAKDOWN (BELOW PRODUCTS) */}
      <section className="py-14 sm:py-20 bg-white border-b border-gray-200/80">
        <div className="wrap max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Included */}
            <div className="p-7 sm:p-9 rounded-3xl bg-emerald-50/40 border border-emerald-200/90 shadow-[0_2px_12px_rgba(16,185,129,0.04)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#101114] m-0">
                  What&apos;s Included In The Installed Package
                </h3>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-[#1f2937] m-0 p-0 list-none">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>16-Gauge Real Steel Framing:</strong> Commercial cold-formed steel studs for exterior walls and interior room partition layouts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Professional Factory Installation Crew:</strong> On-site erection team travels to your site and builds the structural shell on your slab.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ZIP System Wall & Roof Sheathing:</strong> Engineered structural panels with integrated weather-resistant barrier and taped seams.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>26-Gauge Metal Roofing & Siding:</strong> High-tensile commercial standing seam or ribbed panels in your choice of 20+ architectural colors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Window & Exterior Door Setting:</strong> Installation crew sets homeowner-supplied exterior doors & windows at zero extra labor fee.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Stamped Engineering Drawings:</strong> State-sealed blueprints with regional wind, snow, and seismic calculations for county permits.</span>
                </li>
              </ul>
            </div>

            {/* Excluded */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#f8fafc] border border-gray-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-xs">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#101114] m-0">
                    Homeowner Scope (Excluded From Shell)
                  </h3>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-[#4b5563] m-0 p-0 list-none">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span><strong>Concrete Slab Foundation:</strong> Excavation, grading, dirt work, and poured concrete slab with anchor bolts (must be cured prior to install).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span><strong>Utility Hookups:</strong> Septic system, municipal water connection, electrical grid drop, and gas lines.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span><strong>Interior MEP Rough-Ins:</strong> Interior plumbing pipe runs, electrical wiring, switches, breaker panel, and HVAC systems.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span><strong>Interior Finish Trades:</strong> Insulation (spray foam or batt), interior drywall, paint, flooring, cabinets, and fixtures.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <span className="text-base leading-none shrink-0">💡</span>
                <span>
                  <strong>Benefit of dried-in shell packages:</strong> You lock in certified structural integrity and weatherproofing while maintaining full control over your interior finishes and budget.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-16 bg-[#f8f9fa] border-t border-gray-200">
        <div className="wrap max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#d97706] mb-1.5 block">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114]">
              Steel House Kits & Barndominiums FAQs
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-1.5">
              Clear answers regarding steel gauge, engineering, installation crews, and slab prep.
            </p>
          </div>

          <div className="space-y-4">
            {STEEL_KIT_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 sm:p-6 bg-white rounded-2xl border border-gray-200/90 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-[#101114] mb-2 flex items-start gap-2.5">
                  <span className="text-[#d97706] font-black">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed pl-6 m-0">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Cross link card */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#0c1017] to-[#151c28] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white m-0">
                Looking for Budget DIY Wood or SIP Packages?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 mb-0">
                Explore our Budget House Kits collection designed for self-assembly or local framing crews (installation excluded).
              </p>
            </div>
            <Link
              href="/budget-house-kits"
              className="btn-primary py-3 px-6 text-xs sm:text-sm font-black rounded-xl whitespace-nowrap shrink-0"
            >
              Explore Budget House Kits →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
