import React from "react";
import { Metadata } from "next";
import { SubPageHeader } from "@/components/ui/SubPageHeader";

export const metadata: Metadata = {
  title: "Lifetime Structural Warranty & Protection | BombShelters.com",
  description: "Comprehensive details on our Lifetime Structural Steel Warranty, 100-year subterranean corrosion protection, and equipment coverage.",
};

export default function WarrantyPage() {
  return (
    <>
      <SubPageHeader
        badge="MANUFACTURER GUARANTEE"
        title="LIFETIME STRUCTURAL"
        highlight="WARRANTY"
        description="We stand behind every weld, plate, and seam. Review our lifetime structural guarantee and equipment protection terms."
        breadcrumbs={[{ label: "Warranty" }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl prose prose-sm sm:prose-base text-gray-700 space-y-6">
          <p className="text-xs text-gray-400">Effective Date: October 2026</p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">1. Lifetime Structural Steel Shell Warranty</h3>
          <p>
            BombShelters.com warrants the structural steel shell and welded seams of all subterranean bunkers and steel residences against structural collapse, seam separation, or catastrophic failure for the lifetime of the original property installation.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">2. 100-Year Subterranean Corrosion Protection</h3>
          <p>
            Our commercial coal tar epoxy coating system, when paired with our certified sacrificial magnesium/zinc cathodic protection pack and proper perimeter drainage weeping tiles, is engineered for 100+ years of subterranean soil immersion without corrosive breach.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">3. Life-Support &amp; Mechanical Equipment Coverage</h3>
          <p>
            Mechanical components, including Swiss NBC air filtration blowers, blast overpressure valves, marine airtight hatch hinges, and electrical distribution boxes, carry a 5-year comprehensive manufacturer replacement warranty.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">4. Transferability</h3>
          <p>
            The structural warranty conveys with the real property upon sale. Future homeowners inherit full structural coverage provided installation was completed by certified partners.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">5. Warranty Claim Support</h3>
          <p>
            For warranty claims or cathodic inspection scheduling, contact our engineering service desk at <strong>support@bombshelters.com</strong> or call <strong>812-595-4033</strong>.
          </p>
        </div>
      </section>
    </>
  );
}

