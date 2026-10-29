import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";
import { CATALOG_CATEGORIES } from "@/config/catalog-category-map";
import { getProductsByCategory } from "@/lib/productStore";

const config = CATALOG_CATEGORIES["house-kits"];

export const metadata: Metadata = {
  title: config?.metaTitle || "house-kits | BombShelters.com",
  description: config?.metaDescription || "Engineered steel structures and shelters by BombShelters.com.",
};

export default async function HouseKitsPage() {
  const products = await getProductsByCategory(config.productType);

  return (
    <CategoryPageTemplate
      badge={config.badge}
      title={config.headingTitle}
      highlight={config.headingHighlight}
      description={config.description}
      categoryKey={config.productType}
      breadcrumbs={[{ label: config.label }]}
      keyPoints={config.keyPoints}
      products={products}
    />
  );
}
