import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { getPublicProducts, getCategoryFallbackImage, toCatalogProducts } from "@/lib/publicData";
import { isBudgetHouseKit } from "@/utils/categoryMatching";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import CategoryFilteredCatalog from "@/components/CategoryFilteredCatalog";
import BuildingCard from "@/components/BuildingCard";
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
  PackageCheck,
  AlertTriangle,
  Hammer,
  DollarSign,
  Layers,
  Wrench,
  Package,
  FileText
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "Budget House Kits & Panelized Home Packages | Installation Excluded | ModularHome.com";
const DESCRIPTION =
  "Explore affordable budget house kits, panelized SIP home packages, and DIY-friendly building shells. Designed for slab foundations with factory-direct savings. Follows Amish Built Cabins budget collection. On-site installation excluded.";
const CANONICAL = getCanonicalUrl("/budget-house-kits");
const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m1_ce95e0cb-7b02-4d09-b913-1fc48d1b48f1.jpg?v=1774680383";

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
          alt: "Budget House Kits and Panelized Home Packages",
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

const BUDGET_KIT_FAQS = [
  {
    q: "What is included in a Budget House Kit package?",
    a: "Our Budget House Kits follow the authentic Amish Built Cabins budget collection standard. Each package includes pre-engineered 2x6 exterior wall framing (or pre-insulated panelized SIP wall panels), engineered roof trusses rated for 40+ PSF ground snow loads, heavy-duty 26-gauge metal roofing and siding, pre-cut roof and wall sheathing, rough openings for windows and doors, hardware fastener packs, and complete stamped architectural layout blueprints.",
  },
  {
    q: "Why is on-site installation excluded from budget kits?",
    a: "Excluding on-site labor allows us to deliver the lowest possible upfront price for homeowners, DIY builders, and licensed general contractors. You save thousands in contractor overhead and travel fees by assembling the pre-cut, pre-drilled components yourself or hiring a trusted local framing crew.",
  },
  {
    q: "What type of foundation is required for a budget house kit?",
    a: "Standard budget house kits are engineered to be erected directly on a level, cured concrete slab foundation (which also serves as your ground-floor subfloor). Because floor joists are omitted by default to maximize affordability, a concrete slab is required unless you add optional floor truss packages for crawlspace or basement applications.",
  },
  {
    q: "How are budget house kits delivered to the site?",
    a: "Kits are palletized, weather-wrapped, and shipped via flatbed freight directly to your jobsite nationwide. A forklift or rough-terrain telehandler is recommended to unload components into your staging area.",
  },
  {
    q: "Can I customize the floor plan or window layout?",
    a: "Yes. While our catalog offers dozens of pre-engineered standard floor plans (including 1 to 5-bedroom configurations, bungalows, and cottages), you can customize room partitions, door positions, and window dimensions during the drafting phase.",
  },
  {
    q: "What if I need professional on-site installation included?",
    a: "If you prefer a turnkey dried-in shell erected by certified factory crews, explore our Steel House Kits collection. Every steel kit includes our specialized installation crew to assemble the 16-gauge commercial steel framing directly on your slab.",
  },
];

export default async function BudgetHouseKitsPage() {
  const allProducts = await getPublicProducts();
  const budgetProducts = (allProducts || []).filter((p) => isBudgetHouseKit(p));
  const leanBudgetProducts = toCatalogProducts(budgetProducts);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. HERO SECTION (ULTRA-COMPACT) */}
      <section className="relative bg-[#0c1017] text-white py-5 sm:py-7 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={HERO_IMAGE}
            alt="Budget House Kits"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1017] via-[#0c1017]/90 to-transparent" />
        </div>

        <div className="wrap relative z-10">
          <div className="max-w-3xl">
            {/* Top Navigation Pill & Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Hammer className="w-3 h-3" />
                DIY & General Contractor Kits
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" />
                Installation Excluded
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-[-0.8px] text-white leading-tight mb-1.5">
              Budget House Kits
            </h1>

            <p className="text-xs sm:text-[13px] text-gray-300 leading-snug font-normal mb-2 max-w-2xl">
              Following the proven <strong className="text-white">Amish Built Cabins budget collection</strong>, these pre-engineered panelized SIP and wood-framed kits deliver maximum square footage per dollar. Built for slab foundations with clear assembly blueprints.
            </p>

            {/* Clear Policy Notice Banner - Ultra-Compact */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151c28]/90 border border-amber-500/40 text-amber-200 text-xs mb-3 shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white font-bold uppercase text-[10px] tracking-wider mr-1">
                  Installation Excluded:
                </strong>
                Pre-cut materials & panelized framing. On-site labor & slab excluded for maximum DIY cost efficiency.
              </span>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#catalog"
                className="btn-primary py-1.5 px-4 text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
              >
                <span>Browse {budgetProducts.length} Budget Kits</span>
                <ArrowRight className="w-3 h-3" />
              </a>

              <Link
                href="/steel-house-kits"
                className="py-1.5 px-4 text-xs font-bold text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Want Installation Included? View Steel Kits →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATALOG (MODELS AT TOP) */}
      <section id="catalog" className="py-6 sm:py-8 bg-white">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#d97706]">
                Explore Models
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] m-0">
                All Budget House Kit Models ({budgetProducts.length})
              </h2>
              <p className="text-sm text-[#6b7280] mt-1.5 mb-0">
                Pre-cut DIY & contractor packages. Verified factory prices, specs, and floor plans.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/steel-house-kits"
                className="text-xs sm:text-sm font-bold text-[#d97706] hover:text-[#b45309] hover:underline"
              >
                Switch to Steel House Kits (Installed) →
              </Link>
            </div>
          </div>

          <CategoryFilteredCatalog
            initialProducts={leanBudgetProducts}
            allProducts={leanBudgetProducts}
            categoryName="Budget House Kits"
            categoryKey="budget-house-kits"
            lockPoolToInitial={true}
          />
        </div>
      </section>

      {/* 3. TRANSPARENT PACKAGE BREAKDOWN (BELOW PRODUCTS) */}
      <section className="py-16 sm:py-24 bg-white border-t border-b border-gray-100">
        <div className="wrap max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#d97706] mb-2.5 block">
              Transparent Package Breakdown
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mb-3">
              What Is Included In A Budget House Kit
            </h2>
            <p className="text-xs sm:text-base text-[#6b7280] leading-relaxed max-w-2xl mx-auto">
              Every kit follows the factory-direct package specifications from the Amish Built Cabins budget collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#fcb907] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff8ed] text-[#d97706] flex items-center justify-center mb-5 shadow-xs">
                  <Layers className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  2x6 Exterior Framing or SIP Panels
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Precision-cut 2x6 structural timber stud framing or high-efficiency structural insulated panel (SIP) wall units engineered for fast bolt-together or nailed assembly.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#fcb907] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff8ed] text-[#d97706] flex items-center justify-center mb-5 shadow-xs">
                  <Home className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  26-Gauge Metal Roof & Siding
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Heavy-duty commercial-grade 26-gauge high-tensile metal roofing and exterior siding with baked-on enamel finish in over 20 architectural color choices.
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#fcb907] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff8ed] text-[#d97706] flex items-center justify-center mb-5 shadow-xs">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Engineered Roof Trusses
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Factory-built, code-compliant roof trusses engineered for regional wind ratings and 40+ PSF ground snow loads with metal gusset plates.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#fcb907] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff8ed] text-[#d97706] flex items-center justify-center mb-5 shadow-xs">
                  <Package className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Windows & Door Rough Openings
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Framed rough openings matched to high-performance double-pane vinyl Low-E window specifications and pre-hung exterior door units.
                </p>
              </div>
            </div>

            {/* 5 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#fcb907] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff8ed] text-[#d97706] flex items-center justify-center mb-5 shadow-xs">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Architectural Blueprints Included
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Comprehensive dimensioned assembly schematics, wall framing diagrams, and structural specifications to guide your contractor through local permitting.
                </p>
              </div>
            </div>

            {/* 6 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-red-200/90 shadow-[0_2px_12px_rgba(239,68,68,0.04)] hover:border-red-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5 shadow-xs">
                  <AlertTriangle className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Installation & Slab Excluded
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Concrete slab pour, interior drywall, plumbing, electrical, and on-site assembly labor are excluded from base kit pricing for maximum DIY cost efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-16 bg-[#f8f9fa] border-t border-gray-200">
        <div className="wrap max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#d97706] mb-1.5 block">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114]">
              Budget House Kits FAQs
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-1.5">
              Clear answers to help you plan your DIY or contractor build.
            </p>
          </div>

          <div className="space-y-4">
            {BUDGET_KIT_FAQS.map((faq, idx) => (
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
                Need Professional On-Site Installation?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 mb-0">
                Explore our commercial-grade Steel House Kits where our certified crew builds the dried-in shell directly on your slab.
              </p>
            </div>
            <Link
              href="/steel-house-kits"
              className="btn-primary py-3 px-6 text-xs sm:text-sm font-black rounded-xl whitespace-nowrap shrink-0"
            >
              Explore Steel House Kits →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
