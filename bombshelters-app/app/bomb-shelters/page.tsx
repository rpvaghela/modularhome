import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";
import { CATALOG_CATEGORIES } from "@/config/catalog-category-map";
import { getProductsByCategory } from "@/lib/productStore";

const config = CATALOG_CATEGORIES["bomb-shelters"];

export const metadata: Metadata = {
  title: config?.metaTitle || "Underground Bomb Shelters & Survival Bunkers | BombShelters.com",
  description: config?.metaDescription || "Engineered underground bomb shelters, blast bunkers, and fortified safe rooms.",
};

export default async function BombSheltersPage() {
  const products = await getProductsByCategory(config?.productType || "Bomb Shelters");

  return (
    <CategoryPageTemplate
      badge={config?.badge || "MILITARY-GRADE NBC CERTIFIED"}
      title={config?.headingTitle || "HARDENED UNDERGROUND BOMB SHELTERS &"}
      highlight={config?.headingHighlight || "SURVIVAL BUNKERS"}
      description={
        config?.description ||
        "Defcon-rated underground bomb shelters, nuclear fallout bunkers, and reinforced storm vaults engineered with heavy structural steel. Built to safeguard your family against blast waves, radiation, extreme weather, and civil collapse."
      }
      categoryKey={config?.productType || "Bomb Shelters"}
      breadcrumbs={[{ label: config?.label || "Bomb Shelters" }]}
      keyPoints={config?.keyPoints}
      products={products}
    />
  );
}
