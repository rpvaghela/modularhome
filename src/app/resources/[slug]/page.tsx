import { permanentRedirect } from "next/navigation";
import { getPublicBlogBySlug } from "@/lib/publicData";

export const dynamic = "force-dynamic";

interface ResourceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { slug } = await params;
  const article = await getPublicBlogBySlug(slug);

  if (article) {
    const categorySlug = (
      article.category_slug ||
      (article.category || "modular-construction").toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ).replace(/^blogs-/, "");
    permanentRedirect(`/blogs/${categorySlug}/${article.slug}`);
  }

  permanentRedirect("/blogs");
}
