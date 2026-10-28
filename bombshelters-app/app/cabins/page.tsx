import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Fortified Steel Cabins & Mountain Retreats | BombShelters.com",
  description:
    "Handcrafted aesthetic cabins reinforced with cold-formed structural steel skeletons. Built to endure heavy snow, wildfire, and off-grid mountain conditions.",
};

export default function CabinsPage() {
  return (
    <CategoryPageTemplate
      badge="HEAVY MOUNTAIN LOAD"
      title="STEEL CABINS &"
      highlight="MOUNTAIN RETREATS"
      description="Enjoy the timeless warmth of rustic timber architecture supported by an unbreakable internal structural steel frame. Designed for remote off-grid retreats and four-season mountain living."
      categoryKey="Cabins"
      breadcrumbs={[{ label: "Cabins" }]}
      keyPoints={[
        {
          title: "Hybrid Timber & Steel",
          desc: "Heavy timber aesthetics backed by cold-formed structural steel trusses.",
        },
        {
          title: "High Snow Load Engineering",
          desc: "Engineered roof trusses rated for 60 to 120+ PSF mountain snow accumulation.",
        },
        {
          title: "Fire-Resistant Exterior",
          desc: "Steel standing-seam roofing and non-combustible exterior board options.",
        },
        {
          title: "Off-Grid Microgrid Ready",
          desc: "Pre-engineered battery vaults, generator tie-ins, and solar roof conduits.",
        },
      ]}
    />
  );
}

