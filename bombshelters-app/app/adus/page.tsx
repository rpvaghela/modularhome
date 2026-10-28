import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Hardened ADUs & Backyard Safe Rooms | BombShelters.com",
  description:
    "Accessory dwelling units engineered with ballistic armor plate, concrete slab anchoring, and independent off-grid life support.",
};

export default function AdusPage() {
  return (
    <CategoryPageTemplate
      badge="BALLISTIC LEVEL 4 / FEMA P-320"
      title="HARDENED ADUS &"
      highlight="BACKYARD SAFE ROOMS"
      description="Dual-purpose secondary dwellings that provide guest accommodations, family rental revenue, and an immediate ballistic safe haven in a crisis."
      categoryKey="ADUs & Granny Pods"
      breadcrumbs={[{ label: "ADUs & Granny Pods" }]}
      keyPoints={[
        {
          title: "Dual-Purpose Value",
          desc: "Functions as a luxury guest suite or rental unit while doubling as a ballistic safe room.",
        },
        {
          title: "Reinforced Steel Vault Doors",
          desc: "Multi-point deadbolts with internal panic locking and biometric credentials.",
        },
        {
          title: "Independent Power & Water",
          desc: "Dedicated utility loops with solar battery backup and backup water storage.",
        },
        {
          title: "Permit Streamlining",
          desc: "Meets standard residential ADU zoning guidelines across most municipalities.",
        },
      ]}
    />
  );
}

