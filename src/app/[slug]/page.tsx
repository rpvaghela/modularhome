import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getPublicProducts, getPublicCollections, getPublicCollectionBySlug } from "@/lib/publicData";
import { CATEGORIES } from "@/data/models";
import { matchProductCategory } from "@/utils/categoryMatching";
import { isCategorySlug, getCategoryDisplayName } from "@/utils/productUrls";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";

export const dynamic = "force-dynamic";

interface DynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

// Top-level reserved paths that have dedicated directory handlers
const RESERVED_PATHS = new Set([
  "api",
  "admin",
  "account",
  "auth",
  "blogs",
  "buildings",
  "checkout",
  "collections",
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
]);

export async function generateMetadata({
  params,
}: DynamicSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null" || RESERVED_PATHS.has(slug.toLowerCase())) {
    return { title: "Page Not Found | ModularHome.com" };
  }

  const cleanSlug = slug.toLowerCase().trim();

  // 1. Check CMS Pages
  const page = await getPublicPageBySlug(cleanSlug);
  if (page && page.status !== "DRAFT" && page.status !== "ARCHIVED") {
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

  // 2. Check Category Collection
  const allProducts = await getPublicProducts();
  const matched = allProducts.filter((p) => matchProductCategory(p, cleanSlug));

  if (matched.length > 0 || isCategorySlug(cleanSlug)) {
    const catDef = CATEGORIES.find(
      (c) =>
        c.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === cleanSlug ||
        c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === cleanSlug
    );

    const displayName = catDef?.title || getCategoryDisplayName(cleanSlug);
    const title = `${displayName} & Floor Plans`;
    const description =
      catDef?.description ||
      `Explore our complete collection of ${displayName.toLowerCase()} models and precision floor plans on ModularHome.com. Nationwide delivery.`;
    const canonical = getCanonicalUrl(`/${cleanSlug}`);
    const image =
      catDef?.image ||
      matched[0]?.primaryImage ||
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${displayName} | ModularHome.com`,
        description,
        url: canonical,
        siteName: "ModularHome.com",
        images: [{ url: image, alt: displayName }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${displayName} | ModularHome.com`,
        description,
        images: [image],
      },
    };
  }

  return { title: "Page Not Found | ModularHome.com" };
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;

  if (!slug || slug === "undefined" || slug === "null" || RESERVED_PATHS.has(slug.toLowerCase())) {
    notFound();
  }

  const cleanSlug = slug.toLowerCase().trim();

  // 1. Try rendering published CMS Page
  const page = await getPublicPageBySlug(cleanSlug);
  if (page && page.status !== "DRAFT" && page.status !== "ARCHIVED") {
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

  // 2. Try rendering Category Collection
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  const matchedProducts = allProducts.filter((p) => matchProductCategory(p, cleanSlug));

  if (matchedProducts.length > 0 || isCategorySlug(cleanSlug)) {
    const catDef = CATEGORIES.find(
      (c) =>
        c.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === cleanSlug ||
        c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === cleanSlug
    );

    const title = catDef?.title || getCategoryDisplayName(cleanSlug);
    const tagline = catDef?.tagline || `Engineered ${title}`;
    const description =
      catDef?.description ||
      `Explore our curated selection of high-performance ${title.toLowerCase()} models and precision floor plans. Built to rigorous architectural standards with nationwide delivery options.`;
    const image = catDef?.image || matchedProducts[0]?.primaryImage;

    return (
      <CategoryCollectionRenderer
        title={title}
        tagline={tagline}
        description={description}
        image={image}
        canonicalPath={`/${cleanSlug}`}
        products={matchedProducts}
        allCollections={allCollections}
        categoryKey={cleanSlug}
      />
    );
  }

  // 3. Fallback to 404
  notFound();
}
