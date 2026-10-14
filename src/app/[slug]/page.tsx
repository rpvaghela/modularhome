import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getPublicProducts, getPublicCollections, getPublicCollectionBySlug, getCategoryFallbackImage } from "@/lib/publicData";
import { CATEGORIES } from "@/data/models";
import { matchProductCategory } from "@/utils/categoryMatching";
import { isCategorySlug, getCategoryDisplayName, resolveSimilarCategoryPath } from "@/utils/productUrls";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";
import { parseLocationSlug } from "@/lib/locationData";

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
  "pricing",
  "financing",
  "how-it-works",
  "delivery",
  "faqs",
  "warranty",
  "privacy-policy",
  "terms-of-service",
  "refund-cancellation-policy",
  "shipping-delivery-policy",
  "accessibility",
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

  // 1. Check Category Collection First for category routes
  const allProducts = await getPublicProducts();
  const matched = allProducts.filter((p) => matchProductCategory(p, cleanSlug));

  if (isCategorySlug(cleanSlug) || matched.length > 0) {
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
      getCategoryFallbackImage(displayName, displayName, cleanSlug) ||
      matched[0]?.primaryImage ||
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

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

  // 2. Check Location Landing Pages (e.g. /modular-homes-in-texas, /barndominiums-in-florida)
  const locMatch = parseLocationSlug(cleanSlug);
  if (locMatch.isLocation && locMatch.location) {
    const loc = locMatch.location;
    const catSlug = locMatch.categorySlug || "modular-homes";
    const catDisplayName = getCategoryDisplayName(catSlug);
    const title = `${catDisplayName} in ${loc.state} | Floor Plans & Delivery`;
    const description = `Build energy-efficient steel-frame ${catDisplayName.toLowerCase()} in ${loc.state}. Serving ${loc.majorCities.slice(0, 4).join(", ")}. ${loc.windRating}. 50-year structural warranty.`;
    const canonical = getCanonicalUrl(`/${cleanSlug}`);
    const image = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${title} | ModularHome.com`,
        description,
        url: canonical,
        siteName: "ModularHome.com",
        images: [{ url: image, alt: `${catDisplayName} in ${loc.state}` }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ModularHome.com`,
        description,
        images: [image],
      },
    };
  }

  // 2. Check CMS Pages
  const page = await getPublicPageBySlug(cleanSlug);
  if (page && page.status !== "DRAFT" && page.status !== "ARCHIVED") {
    const title = page.seoTitle || page.title;
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

  // 4. If slug did not match category, location, or CMS page: 404 metadata
  return {
    title: "Page Not Found | ModularHome.com",
    robots: { index: false, follow: false },
  };
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;

  if (!slug || slug === "undefined" || slug === "null" || RESERVED_PATHS.has(slug.toLowerCase())) {
    notFound();
  }

  const cleanSlug = slug.toLowerCase().trim();

  // 1. Prioritize Category Collections (e.g., /prefab-homes, /barndominiums, /cabins, etc.)
  if (isCategorySlug(cleanSlug)) {
    const [allProducts, allCollections] = await Promise.all([
      getPublicProducts(),
      getPublicCollections(),
    ]);

    const matchedProducts = allProducts.filter((p) => matchProductCategory(p, cleanSlug));

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
    const image = catDef?.image || getCategoryFallbackImage(title, title, cleanSlug) || matchedProducts[0]?.primaryImage;

    return (
      <CategoryCollectionRenderer
        title={title}
        tagline={tagline}
        description={description}
        image={image}
        canonicalPath={`/${cleanSlug}`}
        products={matchedProducts}
        allProducts={allProducts}
        allCollections={allCollections}
        categoryKey={cleanSlug}
      />
    );
  }

  // 2. Check Location Landing Pages (Client Requirement #15)
  const locMatch = parseLocationSlug(cleanSlug);
  if (locMatch.isLocation && locMatch.location) {
    const loc = locMatch.location;
    const catSlug = locMatch.categorySlug || "modular-homes";
    const catDisplayName = getCategoryDisplayName(catSlug);

    const [allProducts, allCollections] = await Promise.all([
      getPublicProducts(),
      getPublicCollections(),
    ]);

    const matchedProducts = allProducts.filter((p) => matchProductCategory(p, catSlug));
    const title = `${catDisplayName} in ${loc.state}`;
    const tagline = `Precision Steel-Frame Modular Construction Across ${loc.state} (${loc.stateCode})`;
    const description = `${loc.intro} Full service coverage across ${loc.majorCities.join(", ")}, with ${loc.deliveryTimeWeeks}. ${loc.windRating} & ${loc.snowLoad}.`;
    const image = matchedProducts[0]?.primaryImage || "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": `Modular Home Construction in ${loc.state}`,
      "provider": {
        "@type": "Organization",
        "name": "ModularHome.com",
        "url": "https://modularhome.com",
      },
      "areaServed": {
        "@type": "State",
        "name": loc.state,
      },
      "description": description,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CategoryCollectionRenderer
          title={title}
          tagline={tagline}
          description={description}
          image={image}
          canonicalPath={`/${cleanSlug}`}
          products={matchedProducts}
          allProducts={allProducts}
          allCollections={allCollections}
          categoryKey={catSlug}
        />
      </>
    );
  }

  // 3. Try rendering published CMS Page
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

  // 3. Check if products match a dynamic category or collection
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  const matchedProducts = allProducts.filter((p) => matchProductCategory(p, cleanSlug));

  if (matchedProducts.length > 0) {
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
        allProducts={allProducts}
        allCollections={allCollections}
        categoryKey={cleanSlug}
      />
    );
  }

  // 4. Fallback: If not a category, location, CMS page, or matched products, return real 404
  notFound();
}
