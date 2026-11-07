import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { getPublicProducts, toCatalogProducts } from "@/lib/publicData";
import { isSipHome } from "@/utils/categoryMatching";
import { sortBySqftAvailability } from "@/utils/productSorting";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import CategoryFilteredCatalog from "@/components/CategoryFilteredCatalog";
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Home, 
  Package, 
  FileText, 
  AlertTriangle,
  Zap,
  Sparkles,
  HelpCircle,
  Hammer
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "SIP Homes & Panelized House Kits | Structural Insulated Panels | ModularHome.com";
const DESCRIPTION =
  "Explore energy-efficient SIP homes and panelized house kits. Engineered structural insulated panels deliver extreme thermal performance (R-24 to R-40) and fast on-site envelope assembly. Installation excluded.";
const CANONICAL = getCanonicalUrl("/sip-homes");
const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098";

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
          alt: "SIP Homes and Structural Insulated Panel House Kits",
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

const SIP_HOME_FAQS = [
  {
    q: "What makes SIP homes significantly more energy-efficient?",
    a: "Structural Insulated Panels (SIPs) feature a solid core of continuous expanded polystyrene (EPS) rigid foam insulation laminated between two structural OSB facings. Unlike stick-built homes with repetitive thermal bridging studs every 16 inches, SIP envelopes eliminate thermal breaks and drafts, reducing heating and cooling energy consumption by up to 50%.",
  },
  {
    q: "What is included in a factory-direct SIP home package?",
    a: "Each SIP home package includes precision factory-cut structural insulated wall panels (R-24+), engineered SIP roof panels or truss assemblies (up to R-40), structural connection splines, specialty long-shank SIP panel screws, mastic sealant, expanding foam sealant, pre-cut rough openings for windows and doors with pre-drilled electrical chases, 26-gauge metal roofing & siding, and complete architectural blueprint schematics.",
  },
  {
    q: "Is on-site installation included with SIP kits?",
    a: "Standard SIP home kits are delivered directly to your jobsite as pre-numbered panelized packages. On-site erection labor and concrete slab preparation are excluded from the base kit price, giving you the flexibility to assemble the envelope yourself or hire a local framing crew. If you require full factory shell erection included, explore our Steel House Kits collection.",
  },
  {
    q: "What type of foundation is needed for a SIP home?",
    a: "SIP home kits are engineered for direct anchor bolt attachment to a level, cured concrete slab foundation (which serves as the finished ground subfloor). They can also be adapted to crawlspaces or walkout basements with an optional engineered floor joist system.",
  },
  {
    q: "How fast can a SIP panel home envelope be erected?",
    a: "Because whole wall and roof sections arrive factory-cut with pre-engineered spline joints, an experienced 3 to 4 person crew can typically erect and dry-in a complete SIP home shell in just 3 to 7 days, cutting typical on-site framing schedules by over 50%.",
  },
  {
    q: "How do electricians run wiring through SIP panels?",
    a: "All exterior SIP wall panels come standard with pre-drilled 1.5-inch horizontal and vertical electrical chases molded directly into the EPS insulation foam core, allowing electricians to easily pull Romex wiring without cutting into structural walls.",
  },
];

export default async function SipHomesPage() {
  const allProducts = await getPublicProducts();
  const sipProducts = sortBySqftAvailability(
    (allProducts || []).filter((p) => isSipHome(p))
  );
  const leanSipProducts = toCatalogProducts(sipProducts);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. HERO SECTION (ULTRA-COMPACT) */}
      <section className="relative bg-[#09151e] text-white py-5 sm:py-7 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src={HERO_IMAGE}
            alt="SIP Homes & Panelized House Kits"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09151e] via-[#09151e]/90 to-transparent" />
        </div>

        <div className="wrap relative z-10">
          <div className="max-w-3xl">
            {/* Top Navigation Pill & Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-cyan-400" />
                High-Performance SIP Envelope
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" />
                Installation Excluded
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-[-0.8px] text-white leading-tight mb-1.5">
              SIP Homes & Panelized Kits
            </h1>

            <p className="text-xs sm:text-[13px] text-gray-300 leading-snug font-normal mb-2 max-w-2xl">
              Engineered <strong className="text-white">Structural Insulated Panel (SIP) home packages</strong> combining continuous rigid foam insulation cores with heavy-duty structural sheathing. Deliver superior R-values, airtight envelopes, and rapid bolt-and-spline assembly.
            </p>

            {/* Clear Policy Notice Banner - Ultra-Compact */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#112433]/90 border border-cyan-500/40 text-cyan-200 text-xs mb-3 shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-white font-bold uppercase text-[10px] tracking-wider mr-1">
                  Installation Excluded:
                </strong>
                Pre-cut SIP panels & hardware. On-site erection labor & slab excluded for maximum DIY/contractor cost savings.
              </span>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#catalog"
                className="btn-primary py-1.5 px-4 text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
              >
                <span>Browse {sipProducts.length} SIP Models</span>
                <ArrowRight className="w-3 h-3" />
              </a>

              <Link
                href="/budget-house-kits"
                className="py-1.5 px-4 text-xs font-bold text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Hammer className="w-3 h-3 text-amber-400" />
                <span>Looking for Budget Wood Kits? View Budget Kits →</span>
              </Link>

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
              <span className="text-xs font-black uppercase tracking-widest text-teal-600">
                Explore Models
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] m-0">
                All SIP Home Kit Models ({sipProducts.length})
              </h2>
              <p className="text-sm text-[#6b7280] mt-1.5 mb-0">
                Precision-engineered structural insulated panel packages. Verified factory pricing, specs, and architectural layouts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/budget-house-kits"
                className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline"
              >
                Switch to Budget House Kits →
              </Link>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <Link
                href="/steel-house-kits"
                className="text-xs sm:text-sm font-bold text-[#d97706] hover:text-[#b45309] hover:underline"
              >
                Switch to Steel House Kits (Installed) →
              </Link>
            </div>
          </div>

          <CategoryFilteredCatalog
            initialProducts={leanSipProducts}
            allProducts={leanSipProducts}
            categoryName="SIP Homes"
            categoryKey="sip-homes"
            lockPoolToInitial={true}
          />
        </div>
      </section>

      {/* 3. TRANSPARENT PACKAGE BREAKDOWN (BELOW PRODUCTS) */}
      <section className="py-16 sm:py-24 bg-white border-t border-b border-gray-100">
        <div className="wrap max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-teal-600 mb-2.5 block">
              Transparent Package Breakdown
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mb-3">
              What Is Included In A SIP Home Kit
            </h2>
            <p className="text-xs sm:text-base text-[#6b7280] leading-relaxed max-w-2xl mx-auto">
              Every package is factory-engineered for extreme thermal efficiency, airtight envelope integrity, and rapid jobsite erection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-teal-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 shadow-xs">
                  <Layers className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Structural Insulated Wall Panels (SIP)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Precision factory-laminated EPS continuous insulation core sandwiched between structural OSB facings delivering R-24+ continuous thermal performance without thermal bridging studs.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-teal-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 shadow-xs">
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
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-teal-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 shadow-xs">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Engineered Roof Trusses & SIP Roof Panels
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Code-compliant roof system engineered for regional wind criteria and 40+ PSF ground snow loads, maximizing cathedral ceiling heights and insulation performance (up to R-40).
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-teal-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 shadow-xs">
                  <Zap className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Pre-Cut Electrical Chases & Openings
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Factory-drilled 1.5&quot; electrical chases molded through EPS cores for easy wiring pulls, with pre-cut rough openings for high-performance Low-E vinyl windows and doors.
                </p>
              </div>
            </div>

            {/* 5 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-teal-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 shadow-xs">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Architectural Blueprints & Fastener Pack
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Comprehensive dimensioned panel installation maps, spline connectors, structural SIP screws, specialized foam sealants, and engineering blueprints for local permitting.
                </p>
              </div>
            </div>

            {/* 6 */}
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-red-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-red-400 transition-all duration-300 flex flex-col justify-between bg-gradient-to-br from-white via-white to-red-50/20">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5 shadow-xs">
                  <AlertTriangle className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#101114] mb-2.5">
                  Installation & Slab Excluded
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed m-0">
                  Concrete slab pour, interior drywall, plumbing, electrical, and on-site assembly labor are excluded from base kit pricing for maximum DIY and contractor cost efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-24 bg-[#fafaf9]">
        <div className="wrap max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-teal-600 mb-2.5 block">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mb-3">
              Frequently Asked Questions About SIP Homes
            </h2>
            <p className="text-xs sm:text-base text-[#6b7280]">
              Everything you need to know about structural insulated panels, thermal efficiency, delivery, and assembly.
            </p>
          </div>

          <div className="space-y-4">
            {SIP_HOME_FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl border border-gray-200/70 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-200 hover:border-teal-400"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-black text-[#101114] text-base sm:text-lg">
                  <span>{faq.q}</span>
                  <span className="shrink-0 rounded-full bg-gray-50 p-1.5 text-gray-900 group-open:rotate-180 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* Bottom Upgrade CTA */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#09151e] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-cyan-400 text-xs font-black uppercase tracking-widest block mb-1">
                Prefer Factory Assembly?
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white m-0">
                Want certified factory crews to erect your shell on your slab?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 mb-0">
                Explore our Steel House Kits with professional on-site installation included in base pricing.
              </p>
            </div>
            <Link
              href="/steel-house-kits"
              className="btn-primary py-3 px-6 text-xs sm:text-sm font-black whitespace-nowrap shrink-0"
            >
              Explore Steel House Kits →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

