import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Prefab Homes & Fortified Housing | BombShelters.com",
  description:
    "Explore precision-fabricated prefab homes engineered with heavy steel frames and turnkey off-grid survival capabilities.",
};

export default function PrefabHomesPage() {
  return (
    <CategoryPageTemplate
      badge="PRECISION PREFABRICATION"
      title="PREFAB HOMES &"
      highlight="FORTIFIED HOUSING"
      description="Factory-manufactured modern residences featuring high-tensile structural steel skeletons, energy-efficient thermal envelopes, and disaster-proof durability."
      categoryKey="Steel Framed Homes"
      breadcrumbs={[{ label: "Prefab Homes" }]}
      keyPoints={[
        {
          title: "Climate-Controlled Quality",
          desc: "Built indoors with continuous robotic quality control and zero weather delays.",
        },
        {
          title: "Superior Thermal Envelope",
          desc: "Closed-cell spray foam insulation providing exceptional R-30+ thermal efficiency.",
        },
        {
          title: "Blast & Impact Windows",
          desc: "Laminated hurricane and ballistic security glazing options for perimeter security.",
        },
        {
          title: "Turnkey Nationwide Setup",
          desc: "Complete crane hoisting, utility connection, and interior finish handover.",
        },
      ]}
    />
  );
}

