import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("privacy-policy");
  const title = page?.seoTitle || "Privacy Policy | ModularHome.com";
  const description = page?.metaDescription || "Read ModularHome.com's Privacy Policy to learn how we protect your personal information, quote requests, and browsing data.";
  const canonical = getCanonicalUrl("/privacy-policy");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "ModularHome.com Privacy Policy" }],
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

export default async function PrivacyPolicyPage() {
  const page = await getPublicPageBySlug("privacy-policy");

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
          <span className="text-[#d97706] font-bold">Privacy Policy</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-1.5px] text-[#101114]">
            Privacy Policy
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
              ModularHome.com (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to safeguarding your personal privacy. This Privacy Policy outlines how we collect, use, disclose, and secure your information when you browse our website, request floor plan quotes, upload custom floor plans, or interact with our sales and customer care teams.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              1. Information We Collect
            </h2>
            <p>
              We collect information that you directly provide to us, as well as certain data automatically collected during your visits:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4b5563]">
              <li><strong>Contact Information:</strong> Your full name, email address, telephone number, mailing address, and physical building parcel location when submitting a quote or enquiry.</li>
              <li><strong>Custom Plan Uploads & Specifications:</strong> Blueprints, sketches, square footage targets, budget ranges, and structural preferences you upload through our portal.</li>
              <li><strong>Technical & Analytics Data:</strong> IP address, browser type, device identifiers, referring URLs, operating system, and on-page interaction behavior collected via cookies and analytics beacons.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect strictly for legitimate business operations, including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4b5563]">
              <li>Preparing accurate itemized modular home pricing proposals and architectural estimates.</li>
              <li>Coordinating with regional manufacturing facilities, freight logistics carriers, and crane rigging teams.</li>
              <li>Communicating project updates, permit guidelines, and responding to your customer support inquiries.</li>
              <li>Optimizing website responsiveness, floor plan catalog usability, and search experience.</li>
              <li>Complying with legal, tax, and building regulatory obligations.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              3. Information Sharing & Third Parties
            </h2>
            <p>
              <strong>We do NOT sell, rent, or trade your personal information to third-party data brokers.</strong> We only share information with trusted service partners under strict confidentiality agreements for the direct fulfillment of your home purchase:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4b5563]">
              <li><strong>Certified Manufacturing Facilities:</strong> To engineer and fabricate your chosen modular residence.</li>
              <li><strong>Freight & Logistics Providers:</strong> To calculate oversized route feasibility and coordinate delivery trucks.</li>
              <li><strong>Approved Financing Partners:</strong> Only upon your explicit request to explore loan pre-approvals.</li>
              <li><strong>Legal & Regulatory Authorities:</strong> When required by lawful subpoena, court order, or building department compliance.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              4. Cookies and Tracking Technologies
            </h2>
            <p>
              We use essential, analytical, and functional cookies to remember your filter preferences, maintain shopping cart sessions, and evaluate site traffic. You can customize your cookie preferences anytime via the &ldquo;Cookie Settings&rdquo; link in our website footer or adjust your web browser settings.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              5. Data Security & Retention
            </h2>
            <p>
              We implement industry-standard 256-bit SSL encryption, firewalls, and strict role-based access controls to safeguard your personal data. We retain personal records only as long as necessary to fulfill project requirements, manage warranty coverage, and satisfy statutory tax and legal retention periods.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              6. Your Privacy Rights (CCPA / GDPR)
            </h2>
            <p>
              Depending on your state or jurisdiction of residence, you may have the right to request access to the personal data we hold about you, request corrections or deletion, or opt-out of marketing communications. To exercise your privacy rights, email us at <a href="mailto:support@modularhome.com" className="text-[#d97706] font-bold underline">support@modularhome.com</a>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#101114] tracking-tight">
              7. Contact Our Privacy Officer
            </h2>
            <div className="p-4 bg-[#f8f9fa] rounded-[12px] border border-[#e7e9ee] space-y-1 text-xs">
              <div className="font-bold text-[#101114]">ModularHome.com Privacy Team</div>
              <div>Email: <a href="mailto:support@modularhome.com" className="text-[#d97706]">support@modularhome.com</a></div>
              <div>Phone: +1 (812) 595-4033</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
