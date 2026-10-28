import React from "react";
import { Metadata } from "next";
import { SubPageHeader } from "@/components/ui/SubPageHeader";

export const metadata: Metadata = {
  title: "Terms of Service | BombShelters.com",
  description: "Terms and conditions governing the use of BombShelters.com, quotation requests, engineering consultations, and structural agreements.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <SubPageHeader
        badge="TERMS OF USE"
        title="TERMS OF"
        highlight="SERVICE"
        description="Standard contractual guidelines and terms governing website use, estimates, blueprints, and fabrication agreements."
        breadcrumbs={[{ label: "Terms of Service" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl prose prose-sm sm:prose-base text-gray-700 space-y-6">
          <p className="text-xs text-gray-400">Effective Date: October 2026</p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">1. Agreement to Terms</h3>
          <p>
            By accessing or using the BombShelters.com website, submitting inquiries, or requesting architectural quotes, you agree to be bound by these Terms of Service and all applicable federal, state, and local laws.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">2. Nature of Quotations &amp; Estimates</h3>
          <p>
            Online calculator figures, preliminary quotes, and website pricing reflect estimated baseline factory costs. Formal binding pricing requires a signed master purchase agreement, structural engineering sign-off, and site-specific freight and soil evaluations.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">3. Intellectual Property</h3>
          <p>
            All custom CAD drawings, floor plan layouts, blast formulas, photography, and website content are the exclusive intellectual property of BombShelters.com and protected by United States copyright laws. Unauthorized reproduction or reverse engineering is strictly prohibited.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">4. Customer Responsibilities</h3>
          <p>
            Clients are responsible for providing accurate property boundary surveys, disclosing known underground utilities, and obtaining local permits where required, with assistance from our engineering documentation team.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">5. Limitation of Liability</h3>
          <p>
            While our shelters are engineered to certified overpressure and storm specifications (such as FEMA P-320 or specified PSI thresholds), extreme catastrophe scenarios beyond calculated tolerances carry inherent physical risks. Liability is governed exclusively by signed project contracts.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">6. Contact Information</h3>
          <p>
            Questions regarding terms should be directed to <strong>legal@bombshelters.com</strong> or our headquarters at <strong>812-595-4033</strong>.
          </p>
        </div>
      </section>
    </>
  );
}

