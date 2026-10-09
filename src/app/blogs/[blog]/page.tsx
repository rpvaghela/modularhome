import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPublicBlogBySlug } from "@/lib/publicData";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface BlogCategoryPageProps {
  params: Promise<{ blog: string }>;
}

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { blog } = await params;
  if (!blog || blog === "undefined" || blog === "null") {
    return { title: "Blogs | ModularHome.com" };
  }

  const directArticle = await getPublicBlogBySlug(blog);
  if (directArticle) {
    return {
      title: directArticle.seoTitle || `${directArticle.title} | ModularHome.com Guide`,
      description: directArticle.metaDescription || directArticle.excerpt,
    };
  }

  return {
    title: "All Modular Home Blogs & Guides | ModularHome.com",
    description: "Explore all modular home building guides, cost breakdowns, and floor plan insights.",
    alternates: { canonical: getCanonicalUrl("/blogs") },
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { blog } = await params;
  if (!blog || blog === "undefined" || blog === "null") {
    notFound();
  }

  // If this slug is a direct article (legacy 2-level URL: /blogs/my-article)
  const directArticle = await getPublicBlogBySlug(blog);
  if (directArticle) {
    const catSlug = (
      directArticle.category_slug ||
      (directArticle.category || "modular-construction").toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ).replace(/^blogs-/, "");
    permanentRedirect(`/blogs/${catSlug}/${directArticle.slug}`);
  }

  // Category routes (or unrecognized routes) redirect to the unified all-in-one /blogs catalog
  permanentRedirect("/blogs");
}

