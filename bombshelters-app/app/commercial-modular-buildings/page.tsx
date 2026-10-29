import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";
import { CATALOG_CATEGORIES } from "@/config/catalog-category-map";
import { getProductsByCategory } from "@/lib/productStore";

const config = CATALOG_CATEGORIES["commercial-modular-buildings"];

export const metadata: Metadata = {
  title: config?.metaTitle || "commercial-modular-buildings | BombShelters.com",
  description: config?.metaDescription || "Engineered steel structures and shelters by BombShelters.com.",
};

export default async function CommercialModularBuildingsPage() {
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
