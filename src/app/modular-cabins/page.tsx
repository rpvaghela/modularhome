import { Metadata } from "next";
import { headers } from "next/headers";
import { getPublicProducts, getPublicCollections } from "@/lib/publicData";
import { CATEGORIES } from "@/data/models";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import { matchProductCategory } from "@/utils/categoryMatching";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = "Modular Cabins & Prefab Log Cabin Models";
  const description =
    "Explore our complete collection of precision-engineered modular cabins, prefab log cabins, and rustic timber retreats. Turnkey nationwide delivery, high-efficiency insulation, and custom floor plans.";
  const canonical = getCanonicalUrl("/modular-cabins");
  const heroImage =
    "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345";

  return {
    title,
    description,
    robots,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ModularHome.com`,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [
        {
          url: heroImage,
          alt: "Modular Cabins & Prefab Log Cabins Collection",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ModularHome.com`,
      description,
      images: [heroImage],
    },
  };
}

export default async function ModularCabinsPage() {
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  const modularCabinProducts = allProducts.filter((p) => matchProductCategory(p, "modular-cabins"));

  const catDef = CATEGORIES.find(
    (c) => c.id === "Modular Cabins" || c.href === "/modular-cabins"
  );

  return (
    <CategoryCollectionRenderer
      title="Modular Cabins"
      tagline={catDef?.tagline || "Factory-Built Precision Prefab & Modular Cabins"}
      description={
        catDef?.description ||
        "Explore our complete lineup of factory-crafted modular cabins, prefab log homes, and mountain retreat models. Built with superior craftsmanship and high-efficiency insulation for year-round residential or vacation living."
      }
      image={catDef?.image || "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"}
      canonicalPath="/modular-cabins"
      products={modularCabinProducts}
      allProducts={allProducts}
      allCollections={allCollections}
      categoryKey="modular-cabins"
    />
  );
}
