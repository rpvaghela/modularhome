import { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("terms-of-service");
  const title = page?.seoTitle || "Terms of Service | ModularHome.com";
  const description = page?.metaDescription || "Read ModularHome.com's Terms of Service governing website usage, floor plan quotes, architectural blueprints, and sales agreements.";
  const canonical = getCanonicalUrl("/terms-of-service");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "ModularHome.com Terms of Service" }],
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

export default async function TermsOfServicePage() {
  const page = await getPublicPageBySlug("terms-of-service");

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
          <span className="text-[#d97706] font-bold">Terms of Service</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <FileText className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Legal Agreement & User Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-1.5px] text-[#101114]">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6b7280]">
            Last Updated: {lastUpdated} • ModularHome.com
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 bg-white">
        <div className="wrap max-w-4xl space-y-8 text-xs sm:text-sm text-[#374151] leading-relaxed">
          <div className="p-4 sm:p-5 rounded-[14px] bg-[#f8f9fa] border border-[#e7e9ee]">
            <p className="font-medium text-[#101114]">
              Welcome to ModularHome.com. By accessing or using our website, requesting pricing quotes, downloading or uploading floor plan assets, or placing an order, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of this website.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              1. Acceptance of Terms & Eligibility
            </h2>
            <p>
              By accessing this site, you certify that you are at least 18 years of age and possess the legal authority to enter into binding agreements. Your continued use of the website following any posted modifications constitutes acceptance of those changes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              2. Floor Plans, Pricing & Quotations
            </h2>
            <p>
              All renderings, floor plans, dimensions, and specifications displayed on ModularHome.com are architectural representations designed to illustrate potential configurations.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4b5563]">
              <li><strong>Price Estimates:</strong> Online price calculations and base model rates are estimates subject to regional site conditions, engineering customizations, local snow/wind load adjustments, and current material market indexes.</li>
              <li><strong>Formal Quotations:</strong> Binding project pricing is established exclusively via an executed Written Manufacturing Agreement and itemized scope of work signed by both parties.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              3. Intellectual Property Rights
            </h2>
            <p>
              All content on ModularHome.com—including architectural floor plans, 3D renderings, photography, trademarks, text, code, and graphical logos—is the exclusive intellectual property of ModularHome.com and protected under United States and international copyright laws. Unauthorized reproduction, commercial redistribution, or reverse engineering of proprietary designs without prior written permission is strictly prohibited.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              4. Custom Floor Plan Uploads & User Submissions
            </h2>
            <p>
              When you submit or upload sketches, blueprints, or documents via our &ldquo;Upload Floor Plan&rdquo; portal, you grant ModularHome.com a non-exclusive license to review, analyze, engineer, and generate cost estimates based on those materials. You warrant that you own or have obtained the necessary legal rights to provide any submitted plans without infringing on third-party copyrights.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              5. Local Permitting, Site Prep & Foundation Responsibilities
            </h2>
            <p>
              Unless explicitly contracted under a turnkey general contracting agreement, the buyer is responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4b5563]">
              <li>Ensuring zoning compliance and securing municipal building and driveway permits.</li>
              <li>Contracting site excavation, soil compaction, and foundation pouring to engineered specs.</li>
              <li>Arranging water, electrical, gas, and septic/sewer utility connections.</li>
              <li>Providing unobstructed, cleared roadway access for oversized transport carriers and crane rigs.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              6. Limitation of Liability & Disclaimers
            </h2>
            <p>
              To the maximum extent permitted by applicable law, ModularHome.com provides this website &ldquo;as is&rdquo; without warranties of any kind, whether express or implied. ModularHome.com shall not be liable for indirect, incidental, or consequential damages resulting from website downtime, third-party contractor delays, or force majeure events beyond our reasonable control.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              7. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Indiana, without regard to conflict of law principles. Any dispute arising under these Terms shall be resolved through binding arbitration or state/federal courts located in Indiana.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              8. Contact Information
            </h2>
            <div className="p-4 bg-[#f8f9fa] rounded-[12px] border border-[#e7e9ee] space-y-1 text-xs">
              <div className="font-bold text-[#101114]">ModularHome.com Legal Department</div>
              <div>Email: <a href="mailto:modularhome.admin@gmail.com" className="text-[#d97706]">modularhome.admin@gmail.com</a></div>
              <div>Headquarters Phone: +1 (812) 595-4033</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
