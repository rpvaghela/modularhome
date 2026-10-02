import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";

export const dynamic = "force-dynamic";

interface DynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DynamicSlugPageProps): Promise<Metadata> {
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

  const title = page.seoTitle || `${page.title} | ModularHome.com`;
  const description = page.metaDescription || page.subtitle || `Explore ${page.title} on ModularHome.com`;
  const ogTitle = page.ogTitle || title;
  const ogDescription = page.ogDescription || description;
  const ogImage = page.ogImage || page.featuredImage || "/newmodularlogo.png";

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `https://modularhome.com/${page.slug}`,
      siteName: "ModularHome.com",
      images: [{ url: ogImage, alt: page.imageAlt || page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: page.robots || "index, follow",
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
  };
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;

  if (!slug || slug === "undefined" || slug === "null") {
    notFound();
  }

  // Prevent collision with reserved top-level paths that have dedicated directory handlers
  const reservedPaths = [
    "api",
    "admin",
    "account",
    "auth",
    "buildings",
    "checkout",
    "floor-plans",
    "login",
    "models",
    "quote",
    "resources",
    "signup",
    "upload-floor-plan",
    "verify-email",
    "videos",
    "sitemap.xml",
    "robots.txt",
    "favicon.ico",
  ];

  if (reservedPaths.includes(slug.toLowerCase())) {
    notFound();
  }

  const page = await getPublicPageBySlug(slug);

  if (!page || page.status === "DRAFT" || page.status === "ARCHIVED") {
    notFound();
  }

  // Schema.org WebPage JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.metaDescription || page.subtitle,
    url: `https://modularhome.com/${page.slug}`,
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
