import { Metadata } from "next";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import FloorPlansClient from "./FloorPlansClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("floor-plans");
  if (page) {
    const title = page.seoTitle || `${page.title} | ModularHome.com`;
    const description = page.metaDescription || page.subtitle || "Download builder-grade floor plans, structural framing plans, and CAD drawings for modular homes, cabins, ADUs, and barndominiums.";
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
    title: "Architectural Floor Plans & Construction Blueprints | ModularHome.com",
    description: "Download builder-grade floor plans, structural framing plans, and CAD drawings for modular homes, cabins, ADUs, and barndominiums.",
  };
}

export default async function FloorPlansPage() {
  const pageData = await getPublicPageBySlug("floor-plans");
  return <FloorPlansClient pageData={pageData} />;
}
