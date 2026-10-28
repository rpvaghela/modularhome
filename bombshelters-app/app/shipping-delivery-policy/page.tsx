import React from "react";
import { Metadata } from "next";
import { SubPageHeader } from "@/components/ui/SubPageHeader";

export const metadata: Metadata = {
  title: "Freight, Shipping & Delivery Policy | BombShelters.com",
  description: "Official shipping, heavy-haul transit permits, crane staging, and on-site delivery terms for BombShelters.com.",
};

export default function ShippingDeliveryPolicyPage() {
  return (
    <>
      <SubPageHeader
        badge="LOGISTICS STANDARDS"
        title="SHIPPING & HEAVY-HAUL"
        highlight="DELIVERY POLICY"
        description="Detailed terms covering oversized highway permits, freight insurance, carrier escorts, and property delivery protocol."
        breadcrumbs={[{ label: "Shipping & Delivery Policy" }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl prose prose-sm sm:prose-base text-gray-700 space-y-6">
          <p className="text-xs text-gray-400">Effective Date: October 2026</p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">1. Nationwide Transit Coverage</h3>
          <p>
            BombShelters.com delivers to all 50 U.S. states and Canadian border territories. Delivery is conducted via commercial lowboy carriers specializing in oversized and heavy-haul industrial freight.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">2. Transit Permits &amp; Pilot Escorts</h3>
          <p>
            Depending on shelter dimensions (units exceeding 8.5 feet in width or 13.5 feet in height), our dispatch team procures all necessary state Department of Transportation (DOT) oversized permits, route surveys, and civilian/police escort vehicles.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">3. Property Ingress &amp; Access Requirements</h3>
          <p>
            The buyer is responsible for verifying that the property has an accessible roadway suitable for a 65-foot tractor-trailer. Ingress roads must be cleared of low-hanging overhead electrical wires (minimum 14-foot clearance) and tree limbs.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">4. Transit Insurance</h3>
          <p>
            Every shipment is covered by 100% full-value carrier cargo transit insurance from factory departure until the shelter is transferred to the on-site crane rigging team.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">5. Delivery Scheduling &amp; Weather Contingencies</h3>
          <p>
            Delivery dates are coordinated with your local excavation schedule. In the event of severe weather (e.g. torrential rain causing excavation trench instability), transit may be adjusted to protect structural safety.
          </p>
        </div>
      </section>
    </>
  );
}

