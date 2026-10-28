import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Commercial & Municipal Blast Shelters | BombShelters.com",
  description:
    "Large-scale subterranean and above-ground shelters engineered for corporate facilities, schools, hospitals, and municipal emergency management.",
};

export default function CommercialModularBuildingsPage() {
  return (
    <CategoryPageTemplate
      badge="FEMA P-361 & IBC COMMERCIAL"
      title="COMMERCIAL & MUNICIPAL"
      highlight="BLAST SHELTERS"
      description="Engineered high-capacity shelters designed to safeguard corporate workforce, medical personnel, emergency dispatch teams, and community populations."
      categoryKey="Commercial"
      breadcrumbs={[{ label: "Commercial Buildings" }]}
      keyPoints={[
        {
          title: "50 to 500+ Occupancy",
          desc: "Engineered multi-room complexes compliant with FEMA P-361 community shelter criteria.",
        },
        {
          title: "Redundant Life-Support Systems",
          desc: "Dual industrial Swiss NBC air handling units, dual diesel generators, and waste management.",
        },
        {
          title: "ADA Accessibility",
          desc: "Heavy-duty hydraulic elevator lifts and wide gradual ingress ramps for universal access.",
        },
        {
          title: "Government & Corporate Procurement",
          desc: "Assistance with federal grant compliance, GSA schedules, and municipal bonding.",
        },
      ]}
    />
  );
}

