import { Metadata } from "next";
import { getPublicBlogs } from "@/lib/publicData";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import ResourcesClient from "./ResourcesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("resources");
  if (page) {
    const title = page.seoTitle || `${page.title} | ModularHome.com`;
    const description = page.metaDescription || page.subtitle || "Comprehensive educational guides on modular home construction, pricing, financing, land preparation, delivery, and custom floor plans.";
    return {
      title,
      description,
      openGraph: {
        title: page.ogTitle || title,
        description: page.ogDescription || description,
        images: page.ogImage ? [{ url: page.ogImage }] : (page.featuredImage ? [{ url: page.featuredImage }] : [{ url: "/finallogo.avif" }]),
      },
      alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    };
  }

  return {
    title: "Modular Home Educational Resources & Guides | ModularHome.com",
    description: "Comprehensive educational guides on modular home construction, pricing, financing, land preparation, delivery, and custom floor plans.",
  };
}

export default async function ResourcesPage() {
  const [articles, pageData] = await Promise.all([
    getPublicBlogs(),
    getPublicPageBySlug("resources"),
  ]);

  return <ResourcesClient initialArticles={articles} pageData={pageData} />;
}
