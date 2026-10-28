import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Modular Cabins & Factory-Built Units | BombShelters.com",
  description:
    "Factory-assembled precision modular cabins built with certified steel framing and delivered 90% complete to your property.",
};

export default function ModularCabinsPage() {
  return (
    <CategoryPageTemplate
      badge="TURNKEY MODULAR ASSEMBLY"
      title="FACTORY-BUILT MODULAR"
      highlight="CABINS"
      description="Constructed in state-of-the-art manufacturing facilities and shipped to your site nearly 90% finished. Move into your fortified mountain cabin in days, not years."
      categoryKey="Modular Cabins"
      breadcrumbs={[{ label: "Modular Cabins" }]}
      keyPoints={[
        {
          title: "Indoor Construction",
          desc: "Never exposed to rain, snow, or rot during framing and drywall installation.",
        },
        {
          title: "Complete Interior Finishes",
          desc: "Plumbing fixtures, cabinetry, flooring, and electrical wiring pre-installed.",
        },
        {
          title: "Rigid Transport Engineering",
          desc: "Reinforced steel framing resists all transit vibrations and road racking.",
        },
        {
          title: "Fast Move-In Timeline",
          desc: "Crane-set onto your foundation slab and ready for occupancy in under 14 days.",
        },
      ]}
    />
  );
}

