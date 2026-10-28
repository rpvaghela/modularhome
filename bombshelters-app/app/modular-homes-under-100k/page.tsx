import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Bomb & Storm Shelters Under $100k | BombShelters.com",
  description:
    "Explore certified bomb shelters, storm bunkers, and steel cabins priced under $100,000 with factory-direct savings and financing.",
};

export default function ModularHomesUnder100kPage() {
  return (
    <CategoryPageTemplate
      badge="ACCESSIBLE DEFENSE"
      title="SHELTERS & RESIDENCES"
      highlight="UNDER $100K"
      description="Protect your family without stretching your budget. Certified subterranean storm shelters, compact fallout capsules, and DIY steel house kits under $100,000."
      categoryKey="Modular Homes Under $100k"
      breadcrumbs={[{ label: "Shelters Under $100k" }]}
      keyPoints={[
        {
          title: "Starting at $12,900",
          desc: "Entry-level residential storm shelters providing certified FEMA P-320 tornado protection.",
        },
        {
          title: "Subterranean Corrugated Units",
          desc: "Heavy corrugated steel blast capsules starting at $19,500 with NBC air filtration ports.",
        },
        {
          title: "Low Monthly Financing",
          desc: "Personalized fixed-rate terms starting from ~$145 to $390 per month.",
        },
        {
          title: "Zero Quality Compromise",
          desc: "Built with the same certified domestic ASTM structural steel as our luxury bunker estates.",
        },
      ]}
    />
  );
}

