import React from "react";
import { Metadata } from "next";
import { getBombShelterProducts } from "@/lib/productStore";
import { ModelsCatalogClient } from "@/components/models/ModelsCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Bomb Shelter Models & Defense Bunkers | BombShelters.com",
  description:
    "Explore our complete catalog of certified blast-resistant underground bomb shelters, severe storm bunkers, ballistic safe rooms, and hardened modular living quarters.",
};

export default async function ModelsPage() {
  const products = await getBombShelterProducts(true);

  return <ModelsCatalogClient initialModels={products} />;
}
