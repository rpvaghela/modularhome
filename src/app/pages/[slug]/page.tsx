import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PagesSlugProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PagesSlugProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null") {
    return { title: "Page Not Found | ModularHome.com" };
  }

  const page = await getPublicPageBySlug(slug);

  if (!page || page.status === "DRAFT" || page.status === "ARCHIVED") {
    return {
      title: "Page Not Found | ModularHome.com",
    };
  }

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = page.seoTitle || `${page.title} | ModularHome.com`;
  const description = page.metaDescription || page.subtitle || `Explore ${page.title} on ModularHome.com`;
  const canonical = getCanonicalUrl(`/pages/${page.slug}`);
  const ogImage = page.ogImage || page.featuredImage || "/newmodularlogo.png";

  return {
    title,
    description,
    robots,
    alternates: { canonical },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: ogImage, alt: page.imageAlt || page.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      images: [ogImage],
    },
  };
}

export default async function PagesSlugPage({ params }: PagesSlugProps) {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null") {
    notFound();
  }

  const page = await getPublicPageBySlug(slug);

  if (!page || page.status === "DRAFT" || page.status === "ARCHIVED") {
    notFound();
  }

  const canonical = getCanonicalUrl(`/pages/${page.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.metaDescription || page.subtitle,
    url: canonical,
    ...(page.featuredImage && { image: page.featuredImage }),
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      logo: {
        "@type": "ImageObject",
        url: "https://modularhome.com/newmodularlogo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DynamicPageRenderer page={page} />
    </>
  );
}
