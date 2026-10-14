import { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Wrench, 
  FileCheck2, 
  Clock, 
  Phone,
  Mail
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("warranty");
  const title = page?.seoTitle || "10-Year Structural Warranty & Homeowner Guarantee | ModularHome.com";
  const description = page?.metaDescription || "Learn about our comprehensive 10-year major structural warranty, 2-year mechanical protection, and 1-year fit-and-finish homeowner guarantee.";
  const canonical = getCanonicalUrl("/warranty");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Modular Home Warranty Coverage" }],
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

const WARRANTY_TIERS = [
  {
    period: "10-Year",
    badge: "Maximum Structural Protection",
    title: "Major Structural Defects Warranty",
    description: "Covers all primary load-bearing components of the factory-built structure against structural failure that makes the home unsafe or unlivable.",
    includes: [
      "Load-bearing wall framing and steel columns",
      "Engineered roof trusses and primary ceiling joists",
      "Engineered floor joist systems and subfloor framing",
      "Structural module marriage line connections",
      "100% Transferable to subsequent homebuyers",
    ],
  },
  {
    period: "2-Year",
    badge: "Systems & Mechanical",
    title: "Mechanical, Electrical & Plumbing (MEP)",
    description: "Covers all internal factory-installed supply lines, distribution systems, and conduit networks behind the walls.",
    includes: [
      "Internal electrical wiring and distribution panel stubs",
      "Factory PEX water supply piping and drainage rough-ins",
      "HVAC internal ductwork and ventilation venting",
      "Structural insulation thermal envelope integrity",
    ],
  },
  {
    period: "1-Year",
    badge: "Turnkey Peace of Mind",
    title: "Workmanship & Fit-and-Finish",
    description: "Comprehensive coverage for factory craftsmanship, interior finishes, and cosmetic components during your first year of occupancy.",
    includes: [
      "Interior drywall settlement cracks and seam tape touch-ups",
      "Doors, windows, and hardware alignment",
      "Kitchen and bath cabinetry hinges and drawer tracks",
      "Baseboards, crown molding, and trim transitions",
    ],
  },
];

const CLAIM_STEPS = [
  {
    num: "1",
    title: "Document the Item",
    desc: "Take clear photos or a short video of the issue, noting the location in the home and when the issue was first observed.",
  },
  {
    num: "2",
    title: "Submit Claim Ticket",
    desc: "Email our Customer Care team at support@modularhome.com with your original build contract number and property address.",
  },
  {
    num: "3",
    title: "Rapid Review & Dispatch",
    desc: "Our warranty coordinator reviews your submission within 2 business days and coordinates with certified service technicians to inspect and resolve the claim.",
  },
];

export default async function WarrantyPage() {
  const page = await getPublicPageBySlug("warranty");

  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    return <DynamicPageRenderer page={page} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Modular Home Warranty Coverage",
    description: "10-year structural warranty and homeowner protection policies for modular residences.",
    url: "https://modularhome.com/warranty",
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

      {/* Breadcrumb */}
      <div className="border-b border-[#e7e9ee] bg-[#fbfbfc]">
        <div className="wrap py-3 text-xs text-[#6b7280] flex items-center gap-2">
          <Link href="/" className="hover:text-[#101114] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#d97706] font-bold">Warranty Information</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Built to Last for Generations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
            10-Year Structural Warranty & Guarantee
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            Every home manufactured through ModularHome.com is backed by our multi-tiered warranty coverage, protecting your investment with absolute peace of mind.
          </p>
        </div>
      </section>

      {/* Warranty Tiers */}
      <section className="py-14 bg-white">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {WARRANTY_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className="bg-[#f8f9fa] border border-[#e7e9ee] p-6 sm:p-8 rounded-[20px] flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-[#101114]">{tier.period}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fef3c7] text-[#d97706] px-2.5 py-1 rounded-md">
                      {tier.badge}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#101114] mb-2">{tier.title}</h2>
                  <p className="text-xs text-[#6b7280] leading-relaxed mb-6">{tier.description}</p>
                  <div className="space-y-2.5">
                    {tier.includes.map((inc, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2 text-xs text-[#374151]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pass-Through Manufacturer Warranties */}
      <section className="py-14 bg-[#f8f9fa] border-y border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Direct Manufacturer Pass-Through Warranties
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              In addition to our structural warranty, your home includes industry-leading warranties from our premium brand partners.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white rounded-[14px] border border-[#e7e9ee]">
              <div className="text-xl font-black text-[#101114]">30–50 Yrs</div>
              <div className="text-xs text-[#6b7280] mt-1">Roofing Shingles & Metal</div>
            </div>
            <div className="p-4 bg-white rounded-[14px] border border-[#e7e9ee]">
              <div className="text-xl font-black text-[#101114]">20 Yrs</div>
              <div className="text-xs text-[#6b7280] mt-1">Low-E Window Glass Seals</div>
            </div>
            <div className="p-4 bg-white rounded-[14px] border border-[#e7e9ee]">
              <div className="text-xl font-black text-[#101114]">10 Yrs</div>
              <div className="text-xs text-[#6b7280] mt-1">HVAC Compressor & Heat Pump</div>
            </div>
            <div className="p-4 bg-white rounded-[14px] border border-[#e7e9ee]">
              <div className="text-xl font-black text-[#101114]">25 Yrs</div>
              <div className="text-xs text-[#6b7280] mt-1">Engineered Siding & Trim</div>
            </div>
          </div>
        </div>
      </section>

      {/* Claim Steps */}
      <section className="py-14 bg-white">
        <div className="wrap max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              How to Submit a Warranty Claim
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Our dedicated customer support team is always standing by to resolve any issue promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CLAIM_STEPS.map((step) => (
              <div key={step.num} className="bg-[#f8f9fa] p-6 rounded-[16px] border border-[#e7e9ee]">
                <div className="w-8 h-8 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center font-black text-sm mb-3">
                  {step.num}
                </div>
                <h3 className="font-bold text-sm text-[#101114] mb-1.5">{step.title}</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-12 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Have Questions About Your Warranty Coverage?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Contact our warranty department or speak with our customer care representatives.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:support@modularhome.com"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Warranty Department</span>
            </a>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
