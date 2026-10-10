import { Metadata } from "next";
import Link from "next/link";
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Compass, 
  Sparkles,
  HelpCircle,
  Building
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("delivery");
  const title = page?.seoTitle || "Nationwide Delivery & Crane Installation | ModularHome.com";
  const description = page?.metaDescription || "Learn about our nationwide modular home delivery network, oversized transport logistics, site access requirements, and crane installation procedures.";
  const canonical = getCanonicalUrl("/delivery");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Modular Home Delivery & Installation" }],
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

const LOGISTICS_PILLARS = [
  {
    icon: Truck,
    title: "1. Oversized Freight Transport",
    desc: "Our modules are protected with industrial weather-resistant shrink-wrap and transported using specialized air-ride heavy transport carriers. Certified lead/chase escort vehicles and state DOT oversize permits ensure safe, compliant interstate transit.",
  },
  {
    icon: Compass,
    title: "2. Site Access & Route Feasibility",
    desc: "Prior to shipment, our logistics team reviews satellite imagery, road grade, tight corner radii, and overhead clearance (trees and power lines) to verify that transport carriers and crane equipment can access your property smoothly.",
  },
  {
    icon: Building,
    title: "3. Heavy-Duty Crane Setting",
    desc: "A commercial hydraulic crane lifts each pre-fabricated module directly off the delivery chassis and lowers it onto your permanent concrete foundation with millimeter accuracy. Modules are immediately anchored and mechanically locked together.",
  },
  {
    icon: ShieldCheck,
    title: "4. Rapid Weather-Tight Dry-In",
    desc: "Within 24 to 48 hours of crane arrival, the roof ridgeline is secured, structural marriage walls are bolted, and the building envelope is completely sealed from wind, rain, and elemental exposure.",
  },
];

const SITE_CHECKLIST = [
  {
    title: "Clear Road Access & Width",
    details: "Minimum 14-foot wide access road or driveway with cleared overhead branches and utility lines up to 14 feet high.",
  },
  {
    title: "Level Crane Staging Pad",
    details: "A firm, compacted ground staging area (minimum 30' x 40') adjacent to the foundation for crane outrigger stabilization.",
  },
  {
    title: "Cured & Level Foundation",
    details: "Poured concrete crawlspace, basement, or slab foundation built to our stamped engineering specifications and cured for at least 14 days.",
  },
  {
    title: "Utility Rough-Ins Flagged",
    details: "Water, electrical conduit, and sewer/septic stub-outs placed according to the module mechanical schematics.",
  },
];

export default async function DeliveryPage() {
  const page = await getPublicPageBySlug("delivery");

  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    return <DynamicPageRenderer page={page} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Modular Home Delivery & Installation",
    description: "Nationwide freight logistics, crane placement, and site requirements for modular homes.",
    url: "https://modularhome.com/delivery",
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
          <span className="text-[#d97706] font-bold">Delivery & Installation</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Nationwide Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
            Delivery & Crane Installation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            From factory door to your foundation, our experienced freight carriers and crane coordinators manage nationwide delivery with complete precision.
          </p>
        </div>
      </section>

      {/* Logistics Pillars */}
      <section className="py-14 bg-white">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Our Turnkey Transport & Setting Process
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Every detail is orchestrated to ensure a smooth, safe, and on-schedule delivery day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {LOGISTICS_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-[#f8f9fa] border border-[#e7e9ee] p-6 sm:p-8 rounded-[18px]">
                  <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 text-[#d97706] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#101114] mb-2">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Site Checklist */}
      <section className="py-14 bg-[#f8f9fa] border-y border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Site Readiness Checklist
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Ensure your property is prepped and ready for delivery carrier trucks and crane outriggers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {SITE_CHECKLIST.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[14px] border border-[#e7e9ee] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#101114]">{item.title}</h3>
                  <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-12 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Check Delivery Feasibility for Your Property
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Provide your parcel coordinates or address, and our freight team will run an automated route and delivery cost analysis.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all flex items-center gap-2"
            >
              <span>Get Freight & Crane Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all"
            >
              Speak with Logistics Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
