import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getPaginatedVideos } from "@/lib/videoStore";
import VideosClient from "./VideosClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface VideosPageProps {
  searchParams?: Promise<{
    page?: string;
    category?: string;
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: VideosPageProps): Promise<Metadata> {
  const sp = searchParams ? await searchParams : {};
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const category = sp.category && sp.category !== "All" ? sp.category : null;
  const searchQuery = sp.q || "";

  const { totalPages } = await getPaginatedVideos({
    page: pageNum,
    limit: 12,
    category: category || "All",
    search: searchQuery,
  });

  if (pageNum > totalPages && totalPages > 0) {
    return {
      title: "Page Not Found | ModularHome.com",
      robots: { index: false, follow: false },
    };
  }

  const page = await getPublicPageBySlug("videos");

  let title =
    page?.seoTitle && !page.seoTitle.includes("Video Gallery & Home Tours")
      ? page.seoTitle
      : "Modular Home & Prefab Home Video Tours | ModularHome.com";

  if (category) {
    title = `${category} Video Tours | ModularHome.com`;
  }
  if (pageNum > 1) {
    title = `${title} (Page ${pageNum})`;
  }

  const baseDesc = page?.metaDescription || page?.subtitle || "Watch in-depth walkthroughs of our modular homes, prefabs, barndominiums, cabins, and customer project stories.";
  const description = pageNum > 1 ? `${baseDesc} — Page ${pageNum}` : baseDesc;

  const canonicalParams = new URLSearchParams();
  if (category) canonicalParams.set("category", category);
  if (pageNum > 1) canonicalParams.set("page", pageNum.toString());
  const canonicalQuery = canonicalParams.toString();
  const canonicalUrl = canonicalQuery ? `https://modularhome.com/videos?${canonicalQuery}` : "https://modularhome.com/videos";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page?.ogImage ? [{ url: page.ogImage }] : (page?.featuredImage ? [{ url: page.featuredImage }] : [{ url: "/newmodularlogo.png" }]),
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const sp = searchParams ? await searchParams : {};
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const category = sp.category || "All";
  const searchQuery = sp.q || "";

  const [pageData, paginatedData] = await Promise.all([
    getPublicPageBySlug("videos"),
    getPaginatedVideos({
      page,
      limit: 12,
      category,
      search: searchQuery,
    }),
  ]);

  if (page > paginatedData.totalPages && paginatedData.totalPages > 0) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-32 text-center text-[#73777A]">Loading videos...</div>}>
      <VideosClient
        pageData={pageData}
        initialVideos={paginatedData.videos}
        initialTotalCount={paginatedData.totalCount}
        initialPage={paginatedData.page}
        initialTotalPages={paginatedData.totalPages}
        initialCategory={category}
        initialSearchQuery={searchQuery}
        initialCategoryCounts={paginatedData.categoryCounts}
      />
    </Suspense>
  );
}
