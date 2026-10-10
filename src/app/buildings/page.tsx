import { Suspense } from "react";
import { Metadata } from "next";
import ModelsCatalog from "../models/ModelsCatalog";
import { getPublicPageBySlug } from "@/lib/pageDataServer";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("buildings");
  if (page) {
    const title = page.seoTitle || `${page.title} | ModularHome.com`;
    const description = page.metaDescription || page.subtitle || "Explore our full catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and commercial building solutions.";
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
    title: "Commercial & Residential Homes | ModularHome.com",
    description: "Explore our full catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and commercial building solutions.",
  };
}

export default function BuildingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-32 text-center text-[#73777A]">Loading buildings...</div>}>
      <ModelsCatalog />
    </Suspense>
  );
}
