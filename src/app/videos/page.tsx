import { Suspense } from "react";
import { Metadata } from "next";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getPublishedVideos } from "@/lib/videoStore";
import VideosClient from "./VideosClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("videos");
  if (page) {
    const title =
      page.seoTitle && !page.seoTitle.includes("Video Gallery & Home Tours")
        ? page.seoTitle
        : "Modular Home & Prefab Home Video Tours | ModularHome.com";
    const description = page.metaDescription || page.subtitle || "Watch in-depth walkthroughs of our modular homes, prefabs, barndominiums, cabins, and customer project stories.";
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
    title: "Modular Home & Prefab Home Video Tours | ModularHome.com",
    description: "Watch factory walkthroughs, crane assembly days, and customer build walkthroughs of our modular homes, prefabs, barndominiums, cabins, and customer project stories.",
  };
}

export default async function VideosPage() {
  const [pageData, initialVideos] = await Promise.all([
    getPublicPageBySlug("videos"),
    Promise.resolve().then(() => getPublishedVideos()),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-32 text-center text-[#73777A]">Loading videos...</div>}>
      <VideosClient pageData={pageData} initialVideos={initialVideos} />
    </Suspense>
  );
}
