import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Resort Park Models & Recreational Steel Cabins | BombShelters.com",
  description:
    "Architectural ANSI A119.5 park models combining luxury recreation with high-tensile structural steel durability.",
};

export default function ParkModelsPage() {
  return (
    <CategoryPageTemplate
      badge="ANSI A119.5 SPECIFICATION"
      title="PARK MODELS & RECREATIONAL"
      highlight="CABINS"
      description="Architectural park model cabins designed for seasonal retreat communities, private hunting ranches, and recreational living without compromising on structural strength."
      categoryKey="Park Models"
      breadcrumbs={[{ label: "Park Models" }]}
      keyPoints={[
        {
          title: "400 Sq Ft Max Efficiency",
          desc: "Full master bedroom, sleeping lofts, and screened porches tailored to park model codes.",
        },
        {
          title: "Heavy Steel Under-Chassis",
          desc: "Robust cambered structural I-beam frame engineered for long-term placement.",
        },
        {
          title: "Residential Grade Appointments",
          desc: "Quartz countertops, stainless appliances, and full-size residential showers.",
        },
        {
          title: "Four-Season Insulation",
          desc: "Dual-pane low-E argon windows and thermal wrap engineered for sub-zero climates.",
        },
      ]}
    />
  );
}

