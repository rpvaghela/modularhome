import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Blast-Rated A-Frame Homes & Mountain Cabins | BombShelters.com",
  description:
    "Iconic steep-pitch A-frame architectural designs built with indestructible structural steel trusses and impact-resistant glazing.",
};

export default function AFramesPage() {
  return (
    <CategoryPageTemplate
      badge="SEVERE WEATHER RESILIENCE"
      title="BLAST-RATED A-FRAME"
      highlight="HOMES"
      description="Iconic steep 60-degree pitch architecture engineered with structural steel A-frame trusses. Maximum snow shedding, panoramic armored glass, and high-altitude durability."
      categoryKey="A-Frames"
      breadcrumbs={[{ label: "A-Frames" }]}
      keyPoints={[
        {
          title: "Steep 60° Roof Pitch",
          desc: "Heavy snow naturally slides off, eliminating structural roof collapse risks.",
        },
        {
          title: "Rigid Structural Steel Trusses",
          desc: "Cold-formed steel rafters engineered to span wide open 2-story vaulted living spaces.",
        },
        {
          title: "Panoramic Armored Glazing",
          desc: "Triple-pane laminated security glass providing breathtaking views with ballistic defense.",
        },
        {
          title: "Upper Loft Sanctuary",
          desc: "Cozy master loft bedroom with structural steel safety railing and emergency egress.",
        },
      ]}
    />
  );
}

