import { Metadata } from "next";
import { getPublicProducts } from "@/lib/publicData";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const TITLE = "Modular Storage Buildings & Steel Sheds | ModularHome.com";
const DESCRIPTION =
  "Shop modular storage buildings, metal sheds, pole barns, and steel utility structures. Factory-built for maximum durability — delivered and installed nationwide.";
const CANONICAL = getCanonicalUrl("/modular-storage");
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
    images: [{ url: IMAGE, alt: "Modular storage buildings" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE],
  },
};

export default async function ModularStoragePage() {
  const allProducts = await getPublicProducts();

  // Filter products related to storage / pole barns / sheds / utility structures
  const storageProducts = allProducts.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const slug = (p.slug || "").toLowerCase();
    return (
      name.includes("shed") ||
      name.includes("storage") ||
      name.includes("pole barn") ||
      name.includes("utility") ||
      name.includes("garage") ||
      slug.includes("shed") ||
      slug.includes("storage") ||
      slug.includes("pole-barn")
    );
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modular Storage Buildings",
    description: DESCRIPTION,
    url: CANONICAL,
    numberOfItems: storageProducts.length,
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
        title="Modular Storage Buildings"
        tagline="Steel-Frame Storage Structures Built to Last Decades"
        description={DESCRIPTION}
        image={IMAGE}
        canonicalPath="/modular-storage"
        products={storageProducts}
        allProducts={allProducts}
        allCollections={[]}
        categoryKey="modular-storage"
      />
    </>
  );
}
