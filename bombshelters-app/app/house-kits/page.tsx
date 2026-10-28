import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Pre-Engineered Steel House Kits | BombShelters.com",
  description:
    "Bolt-together pre-engineered cold-formed steel house kits for DIY builders, rural homesteads, and contractor assembly.",
};

export default function HouseKitsPage() {
  return (
    <CategoryPageTemplate
      badge="BOLT-TOGETHER PRECISION"
      title="PRE-ENGINEERED STEEL"
      highlight="HOUSE KITS"
      description="Pre-cut, pre-punched, and pre-labeled structural steel framing packages. Build faster, eliminate jobsite waste, and achieve lifetime structural defense."
      categoryKey="House Kits"
      breadcrumbs={[{ label: "House Kits" }]}
      keyPoints={[
        {
          title: "Pre-Numbered Steel Members",
          desc: "Every component is clearly labeled to match our comprehensive 3D assembly manual.",
        },
        {
          title: "Zero Waste Jobsite",
          desc: "Precision factory laser cutting eliminates costly on-site cutting and scrap.",
        },
        {
          title: "Non-Combustible Material",
          desc: "100% recyclable certified American steel that never rots, twists, or burns.",
        },
        {
          title: "Fast Assembly Timeline",
          desc: "A crew of 3-4 builders can erect the primary structural framing in under 5 days.",
        },
      ]}
    />
  );
}

