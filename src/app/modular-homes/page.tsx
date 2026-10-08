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

  const title = "Modular Homes & Prefab Models";
  const description =
    "Explore our full catalog of precision-engineered modular homes and turnkey prefab residences. Customizable floor plans, modern energy efficiency, and nationwide delivery.";
  const canonical = getCanonicalUrl("/modular-homes");
  const heroImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

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
          alt: "Modular Homes Collection",
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

export default async function ModularHomesPage() {
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  const modularProducts = allProducts.filter((p) => matchProductCategory(p, "modular-homes"));

  const catDef = CATEGORIES.find((c) => c.id === "Modular Homes");

  return (
    <CategoryCollectionRenderer
      title="Modular Homes"
      tagline={catDef?.tagline || "Precision-Engineered Architecture"}
      description={
        catDef?.description ||
        "Discover our signature lineup of factory-crafted modular homes and modern prefab floor plans. Built in climate-controlled facilities using high-strength materials, our residences deliver superior energy efficiency, faster build timelines, and turnkey structural reliability."
      }
      image={catDef?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"}
      canonicalPath="/modular-homes"
      products={modularProducts}
      allCollections={allCollections}
      categoryKey="modular-homes"
    />
  );
}
