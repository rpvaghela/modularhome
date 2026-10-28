import React from "react";
import { Metadata } from "next";
import { SubPageHeader } from "@/components/ui/SubPageHeader";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | BombShelters.com",
  description: "Terms governing custom structural steel manufacturing deposits, engineering drafting fees, and cancellation milestones.",
};

export default function RefundCancellationPolicyPage() {
  return (
    <>
      <SubPageHeader
        badge="CONTRACTUAL GUIDELINES"
        title="REFUND &"
        highlight="CANCELLATION POLICY"
        description="Understanding milestones, engineering deposits, and custom structural steel manufacturing cancellation terms."
        breadcrumbs={[{ label: "Refund & Cancellation Policy" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl prose prose-sm sm:prose-base text-gray-700 space-y-6">
          <p className="text-xs text-gray-400">Effective Date: October 2026</p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">1. Custom Capital Manufacturing Nature</h3>
          <p>
            Every bomb shelter, storm bunker, and hardened steel cabin produced by BombShelters.com is a custom-engineered, build-to-order structural asset fabricated to specific soil, threat, and parcel dimensions. Because raw ASTM steel is laser-cut and welded specifically for each order, cancellation terms reflect committed manufacturing milestones.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">2. Preliminary Consultation &amp; Drafting Phase</h3>
          <p>
            Initial consultation and conceptual quotes are 100% complimentary. If a formal architectural engineering deposit is paid to create state-stamped CAD blueprints, that deposit covers drafting labor and is non-refundable once engineering stamps are completed.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">3. Fabrication Milestone Cancellations</h3>
          <p>
            Once structural steel is procured and welding commences:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Prior to steel cutting:</strong> Deposit refunded minus incurred drafting and administrative expenses.</li>
            <li><strong>During active steel welding:</strong> Client is responsible for committed materials and labor up to the date of written notice.</li>
            <li><strong>Post-fabrication &amp; coating:</strong> Orders cannot be cancelled as units are completed custom pressure vessels.</li>
          </ul>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">4. Defect &amp; Warranty Remediations</h3>
          <p>
            In the rare event that a shelter does not meet contracted structural specifications, BombShelters.com will immediately repair, replace, or rectify the issue under our Lifetime Structural Warranty.
          </p>
        </div>
      </section>
    </>
  );
}

