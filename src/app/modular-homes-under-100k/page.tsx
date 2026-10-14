import { Metadata } from "next";
import { getPublicProducts } from "@/lib/publicData";
import { matchProductCategory } from "@/utils/categoryMatching";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const TITLE = "Affordable Modular Homes Under $100k | ModularHome.com";
const DESCRIPTION =
  "Browse move-in-ready modular homes, prefab cabins, and starter homes priced under $100,000. Factory-built quality, nationwide delivery, 50-year structural warranty.";
const CANONICAL = getCanonicalUrl("/modular-homes-under-100k");
const IMAGE =
  "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: "ModularHome.com",
    images: [{ url: IMAGE, alt: "Affordable modular homes under $100k" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE],
  },
};

export default async function ModularHomesUnder100kPage() {
  const allProducts = await getPublicProducts();

  // Filter modular/prefab products priced under $100,000
  const affordable = allProducts.filter((p) => {
    const price = p.startingPrice || 0;
    const isModularOrPrefab =
      matchProductCategory(p, "modular homes") ||
      matchProductCategory(p, "prefab homes") ||
      matchProductCategory(p, "tiny homes") ||
      matchProductCategory(p, "modular cabins");
    return isModularOrPrefab && price > 0 && price < 100000;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modular Homes Under $100k",
    description: DESCRIPTION,
    url: CANONICAL,
    numberOfItems: affordable.length,
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      url: "https://modularhome.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryCollectionRenderer
        title="Modular Homes Under $100k"
        tagline="Quality Factory-Built Homes at an Accessible Price Point"
        description={DESCRIPTION}
        image={IMAGE}
        canonicalPath="/modular-homes-under-100k"
        products={affordable}
        allProducts={allProducts}
        allCollections={[]}
        categoryKey="modular-homes-under-100k"
      />
    </>
  );
}
