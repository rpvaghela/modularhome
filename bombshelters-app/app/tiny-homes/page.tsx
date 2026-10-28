import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Off-Grid Tiny Shelters & Bug-Out Cabins | BombShelters.com",
  description:
    "Compact, highly fortified tiny homes and bug-out cabins engineered for remote land, survival retreats, and rapid setup.",
};

export default function TinyHomesPage() {
  return (
    <CategoryPageTemplate
      badge="OFF-GRID AUTONOMY"
      title="TINY HOMES & BUG-OUT"
      highlight="SHELTERS"
      description="Maximized interior utility and uncompromising steel durability packed into a compact footprint. Ideal for hunting acreage, remote cabins, or emergency off-grid retreats."
      categoryKey="Tiny Homes"
      breadcrumbs={[{ label: "Tiny Homes" }]}
      keyPoints={[
        {
          title: "Complete Micro Living",
          desc: "Full kitchenettes, fold-down bunk systems, and bathroom modules within 200-400 sq ft.",
        },
        {
          title: "Solar & Battery Ready",
          desc: "Pre-wired for 12V/24V/48V solar arrays, lithium battery banks, and backup generators.",
        },
        {
          title: "Heavy-Gauge Steel Armor",
          desc: "Resistant to perimeter forced entry, wildfire ember storms, and extreme wind.",
        },
        {
          title: "Effortless Relocation",
          desc: "Built on heavy structural skids or integrated chassis for simplified transport.",
        },
      ]}
    />
  );
}

