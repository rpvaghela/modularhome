import { Metadata } from "next";
import Link from "next/link";
import { Eye, ShieldCheck, CheckCircle2, FileText, HeartHandshake } from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("accessibility");
  const title = page?.seoTitle || "Accessibility Statement | ModularHome.com";
  const description = page?.metaDescription || "Read ModularHome.com's Accessibility Statement highlighting our commitment to ADA and WCAG 2.1 AA digital accessibility standards.";
  const canonical = getCanonicalUrl("/accessibility");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Accessibility Statement" }],
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

export default async function AccessibilityPage() {
  const page = await getPublicPageBySlug("accessibility");

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
          <span className="text-[#d97706] font-bold">Accessibility Statement</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <HeartHandshake className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Inclusion & Digital Accessibility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-1.5px] text-[#101114]">
            Accessibility Statement
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
              ModularHome.com is dedicated to ensuring digital accessibility for all visitors, including individuals with visual, auditory, cognitive, or motor impairments. We are continually improving the user experience for everyone and applying relevant accessibility standards.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              1. Conformance Status (WCAG 2.1 Level AA)
            </h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to adhere strictly to the <strong>WCAG 2.1 Level AA guidelines</strong> across all floor plan catalogs, interactive calculators, checkout flows, and model discovery pages.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              2. Accessibility Measures We Implement
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4b5563]">
              <li><strong>Keyboard Navigation:</strong> Full keyboard navigability across menus, filters, modals, and interactive buttons without keyboard traps.</li>
              <li><strong>Screen Reader Optimization:</strong> Descriptive ARIA labels, semantic HTML headings (h1, h2, h3), and meaningful alternative text for architectural images and diagrams.</li>
              <li><strong>High Color Contrast:</strong> Strict color contrast ratios meeting or exceeding 4.5:1 for body copy and UI elements.</li>
              <li><strong>Responsive Zoom:</strong> Seamless zoom compatibility up to 200% without loss of content or functionality.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              3. Feedback & Contact Assistance
            </h2>
            <p>
              We welcome your feedback on the accessibility of ModularHome.com. If you encounter accessibility barriers or require assistance with floor plan blueprints in an alternative accessible format, please reach out to us:
            </p>
            <div className="p-4 bg-[#f8f9fa] rounded-[12px] border border-[#e7e9ee] space-y-1 text-xs">
              <div className="font-bold text-[#101114]">Accessibility Coordinator</div>
              <div>Email: <a href="mailto:modularhome.admin@gmail.com" className="text-[#d97706]">modularhome.admin@gmail.com</a></div>
              <div>Phone: +1 (812) 595-4033</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
