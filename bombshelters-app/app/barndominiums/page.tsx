import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Steel Barndominiums & Hardened Homesteads | BombShelters.com",
  description:
    "Massive open-concept steel barndominiums engineered with rigid commercial framing, workshop bays, and integrated below-ground storm shelters.",
};

export default function BarndominiumsPage() {
  return (
    <CategoryPageTemplate
      badge="HEAVY COMMERCIAL FRAMING"
      title="STEEL BARNDOMINIUMS &"
      highlight="HOMESTEAD ESTATES"
      description="Combining sweeping open-concept luxury interiors with rigid structural steel engineering. Ample space for family living, vehicle storage, and an in-slab survival bunker."
      categoryKey="Barndominiums"
      breadcrumbs={[{ label: "Barndominiums" }]}
      keyPoints={[
        {
          title: "Clear-Span Architecture",
          desc: "Zero load-bearing interior walls allowing infinite custom room layout freedom.",
        },
        {
          title: "Integrated Sub-Slab Vaults",
          desc: "Underground blast or tornado shelter engineered directly beneath the shop floor.",
        },
        {
          title: "Extreme Wind & Snow Ratings",
          desc: "Engineered to withstand 150+ MPH hurricane winds and heavy snow loads.",
        },
        {
          title: "Dual Living & Equipment Space",
          desc: "Seamless integration between luxury living quarters and heavy equipment workshops.",
        },
      ]}
    />
  );
}

