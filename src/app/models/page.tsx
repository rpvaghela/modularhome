import { Suspense } from "react";
import { Metadata } from "next";
import ModelsCatalog from "./ModelsCatalog";
import { getPublicPageBySlug } from "@/lib/pageDataServer";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("models");
  if (page) {
    const title = page.seoTitle || `${page.title} | ModularHome.com`;
    const description = page.metaDescription || page.subtitle || "Browse our complete catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and custom floor plans with transparent pricing.";
    return {
      title,
      description,
      openGraph: {
        title: page.ogTitle || title,
        description: page.ogDescription || description,
        images: page.ogImage ? [{ url: page.ogImage }] : (page.featuredImage ? [{ url: page.featuredImage }] : [{ url: "/newmodularlogo.png" }]),
      },
      alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    };
  }

  return {
    title: "Floor Plans & Home Catalog | ModularHome.com",
    description: "Browse our complete catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and custom floor plans with transparent pricing and customizable specs.",
  };
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-32 text-center text-[#73777A]">Loading catalog...</div>}>
      <ModelsCatalog />
    </Suspense>
  );
}
