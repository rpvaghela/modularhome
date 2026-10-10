import { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("refund-cancellation-policy");
  const title = page?.seoTitle || "Refund & Cancellation Policy | ModularHome.com";
  const description = page?.metaDescription || "Review ModularHome.com's Refund & Cancellation Policy regarding custom engineering deposits, manufacturing milestones, and order changes.";
  const canonical = getCanonicalUrl("/refund-cancellation-policy");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Refund & Cancellation Policy" }],
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

export default async function RefundCancellationPolicyPage() {
  const page = await getPublicPageBySlug("refund-cancellation-policy");

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
          <span className="text-[#d97706] font-bold">Refund Policy</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <RotateCcw className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Buyer Assurance & Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-1.5px] text-[#101114]">
            Refund & Cancellation Policy
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
              Because modular and prefabricated homes are custom-engineered, state-stamped, and manufactured to individual customer specifications and property requirements, orders follow milestone-based contractual phases. This policy details refund and cancellation terms across each stage of your project.
            </p>
          </div>

          {/* Milestone 1 */}
          <div className="space-y-3 p-5 rounded-[16px] bg-[#f8f9fa] border border-[#e7e9ee]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-black text-[#101114]">
                Stage 1: Preliminary Design & Feasibility Deposit
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                100% Refundable within 5 Business Days
              </span>
            </div>
            <p className="text-xs text-[#4b5563]">
              Initial design exploration deposits placed to hold production line reservations are 100% refundable if requested in writing within five (5) business days of payment, provided formal state engineering drafting has not commenced.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="space-y-3 p-5 rounded-[16px] bg-[#f8f9fa] border border-[#e7e9ee]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-black text-[#101114]">
                Stage 2: Stamped Engineering & Blueprint Drafting
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">
                Partial Refund (Less Engineering Fees)
              </span>
            </div>
            <p className="text-xs text-[#4b5563]">
              Once architectural blueprints, structural engineering calculations, and state certification stamping are underway, the engineering allocation fee is non-refundable as these costs are paid directly to licensed state structural engineers. The customer retains full ownership of all completed architectural blueprints.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="space-y-3 p-5 rounded-[16px] bg-[#f8f9fa] border border-[#e7e9ee]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-black text-[#101114]">
                Stage 3: Factory Fabrication & Material Procurement
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2.5 py-1 rounded-md">
                Non-Refundable Milestone
              </span>
            </div>
            <p className="text-xs text-[#4b5563]">
              After client sign-off on final production drawings and commencement of raw material procurement (lumber, steel framing, custom cabinetry, thermal windows), manufacturing milestone deposits become non-refundable due to the specialized, custom-cut nature of building components.
            </p>
          </div>

          {/* Change Orders */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              Change Orders & Modifications
            </h2>
            <p>
              Requested changes to floor plans, electrical schematics, or interior finish selections made after final engineering sign-off must be executed via a written Change Order. Change orders may be subject to revision fees depending on production status and material re-stocking costs.
            </p>
          </div>

          {/* Cancellation Procedure */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              How to Submit a Cancellation Request
            </h2>
            <p>
              All cancellation requests must be submitted in writing via certified mail or by email to <a href="mailto:support@modularhome.com" className="text-[#d97706] font-bold underline">support@modularhome.com</a>. Approved refunds are processed back to the original method of payment within 10 to 14 business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
