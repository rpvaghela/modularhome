import React from "react";
import { Metadata } from "next";
import { SubPageHeader } from "@/components/ui/SubPageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy & Discretion Guarantee | BombShelters.com",
  description: "Learn how BombShelters.com encrypts and protects customer information, parcel coordinates, and custom shelter blueprints.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SubPageHeader
        badge="LEGAL & PRIVACY"
        title="PRIVACY POLICY &"
        highlight="DISCRETION GUARANTEE"
        description="We treat your security and confidential property records with utmost care. Read our strict data protection protocols."
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl prose prose-sm sm:prose-base text-gray-700 space-y-6">
          <p className="text-xs text-gray-400">Last updated: October 2026</p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">1. Introduction &amp; Commitment to Discretion</h3>
          <p>
            At BombShelters.com, we recognize the sensitive and confidential nature of purchasing defense structures, subterranean fallout shelters, and safe rooms. We are fundamentally committed to protecting your personal privacy, property coordinates, architectural layouts, and payment data.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">2. Information We Collect</h3>
          <p>
            We collect only the information necessary to fulfill structural engineering consultations, generate quotes, and coordinate logistics:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact details: Name, email address, phone number, and mailing state.</li>
            <li>Site details: Parcel soil reports, topographical data, and building preferences.</li>
            <li>Technical specs: Custom floor plan blueprints, electrical loads, and occupancy requirements.</li>
          </ul>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">3. Strict Prohibition on Data Selling</h3>
          <p>
            <strong>We do not sell, rent, lease, or monetize client data.</strong> Under no circumstances are customer names, coordinates, or bunker purchases shared with commercial advertisers, third-party marketing brokers, or public registries.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">4. Data Encryption &amp; Storage</h3>
          <p>
            All electronic submissions (inquiries, floor plans, and quotation requests) are transmitted via TLS 1.3 encryption and stored in secure, access-restricted database infrastructure. Technical blueprints are restricted to authorized drafting engineers and licensed installation supervisors.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">5. Non-Disclosure Agreements (NDAs)</h3>
          <p>
            For institutional, commercial, or high-profile residential projects requiring absolute anonymity, BombShelters.com routinely executes formal bilateral Non-Disclosure Agreements prior to site visits or blueprint exchange.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">6. Contact Privacy Officer</h3>
          <p>
            To request information deletion or discuss privacy requirements, contact our privacy desk at <strong>info@bombshelters.com</strong> or call <strong>812-595-4033</strong>.
          </p>
        </div>
      </section>
    </>
  );
}

