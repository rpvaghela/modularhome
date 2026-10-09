import { Metadata } from "next";
import Link from "next/link";
import { Truck, ShieldCheck, MapPin, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("shipping-delivery-policy");
  const title = page?.seoTitle || "Shipping & Delivery Policy | ModularHome.com";
  const description = page?.metaDescription || "Review ModularHome.com's Shipping & Delivery Policy detailing oversized transport, state DOT permits, escort requirements, and delivery day staging.";
  const canonical = getCanonicalUrl("/shipping-delivery-policy");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Shipping & Delivery Policy" }],
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

export default async function ShippingDeliveryPolicyPage() {
  const page = await getPublicPageBySlug("shipping-delivery-policy");

  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    return <DynamicPageRenderer page={page} />;
  }

  const lastUpdated = "October 2026";

  return (
    <div className="min-h-screen bg-white text-[#101114]">
      {/* Breadcrumb */}
      <div className="border-b border-[#e7e9ee] bg-[#fbfbfc]">
        <div className="wrap py-3 text-xs text-[#6b7280] flex items-center gap-2">
          <Link href="/" className="hover:text-[#101114] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#d97706] font-bold">Shipping & Delivery Policy</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Transport Standards & Freight Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-1.5px] text-[#101114]">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6b7280]">
            Last Updated: {lastUpdated} • ModularHome.com
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12 bg-white">
        <div className="wrap max-w-4xl space-y-8 text-xs sm:text-sm text-[#374151] leading-relaxed">
          <div className="p-4 sm:p-5 rounded-[14px] bg-[#f8f9fa] border border-[#e7e9ee]">
            <p className="font-medium text-[#101114]">
              ModularHome.com coordinates freight transport of modular residences and building kits across the continental United States. This policy outlines transport responsibilities, oversize DOT permits, site accessibility requirements, and delivery day staging protocols.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              1. Delivery Scheduling & Transit Windows
            </h2>
            <p>
              Once factory production reaches 90% completion, our logistics coordinator schedules a tentative 3-day delivery window with the buyer. Final transit dispatch is confirmed 5 business days prior to shipment, subject to weather conditions along the transport route and on-site foundation inspection readiness.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              2. Oversized DOT Permits & Escort Vehicles
            </h2>
            <p>
              Modular sections are classified as oversized freight. We manage all state Department of Transportation (DOT) travel permits, route surveys, and certified pilot/escort vehicles required by state and local transit authorities.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              3. Buyer Property Accessibility Obligations
            </h2>
            <p>
              The customer or their authorized site contractor is responsible for guaranteeing unobstructed access to the property:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4b5563]">
              <li><strong>Road & Gate Width:</strong> A minimum 12-to-14 foot roadway clearance free of parked vehicles, low fences, or narrow gate posts.</li>
              <li><strong>Vertical Clearance:</strong> Minimum 14 feet of overhead clearance free of low-hanging tree branches and power/telephone utility lines.</li>
              <li><strong>Road Grade & Surface:</strong> Firm, compacted gravel or paved access able to support multi-axle freight carriers up to 40,000 lbs.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              4. Delivery Day Inspection & Bill of Lading
            </h2>
            <p>
              Upon carrier arrival, the buyer or their designated representative must conduct a joint visual walkthrough with the freight driver. Any external transit wear or packaging seal disruption must be noted on the Bill of Lading (BOL) prior to signing acceptance. All modules are protected by transit insurance throughout their highway journey.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              5. Weather Delays & Safety Protocols
            </h2>
            <p>
              In the event of severe weather (e.g., gale-force winds exceeding 25 mph, blizzard conditions, or flash flooding), carrier transit or crane placement may be temporarily paused to ensure worker safety and structural protection. Rescheduling fees are waived for verified adverse weather delays.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              6. Freight Questions & Support
            </h2>
            <div className="p-4 bg-[#f8f9fa] rounded-[12px] border border-[#e7e9ee] space-y-1 text-xs">
              <div className="font-bold text-[#101114]">ModularHome.com Logistics Dispatch</div>
              <div>Email: <a href="mailto:support@modularhome.com" className="text-[#d97706]">support@modularhome.com</a></div>
              <div>Direct Dispatch Hotline: +1 (812) 595-4033</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
