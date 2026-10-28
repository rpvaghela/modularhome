import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Modular Homes & Hardened Residences | BombShelters.com",
  description:
    "Explore precision-engineered modular homes built with certified domestic structural steel. Fire-resistant, blast-resilient, and delivered nationwide.",
};

export default function ModularHomesPage() {
  return (
    <CategoryPageTemplate
      badge="IRC & ASTM CERTIFIED"
      title="MODULAR HOMES & HARDENED"
      highlight="RESIDENCES"
      description="Modern architectural living engineered with indestructible structural steel framing. Immune to rot, termites, wildfire, and severe seismic stress."
      categoryKey="Steel Framed Homes"
      breadcrumbs={[{ label: "Modular Homes" }]}
      keyPoints={[
        {
          title: "Non-Combustible Steel Shell",
          desc: "Cold-formed commercial steel framing rated Class-A fireproof.",
        },
        {
          title: "Integrated Storm Vaults",
          desc: "Optional subterranean bunker integrated directly into the foundation slab.",
        },
        {
          title: "Precision Factory Tolerance",
          desc: "Built in indoor climate-controlled facilities within 1/16th inch tolerance.",
        },
        {
          title: "Rapid Site Assembly",
          desc: "Delivered in modular sections and locked onto foundation in 3 to 7 days.",
        },
      ]}
    />
  );
}

