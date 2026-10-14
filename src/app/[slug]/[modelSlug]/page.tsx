import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import ModelDetailClient from "@/app/models/[slug]/ModelDetailClient";
import { getPublicProductBySlug, getPublicProducts } from "@/lib/publicData";
import { getPublicGlobalSettings } from "@/lib/settings";
import { truncateText } from "@/utils/text";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import {
  getProductCategorySlug,
  getProductUrl,
  getCategoryDisplayName,
  isCategorySlug,
  resolveSimilarCategoryPath,
} from "@/utils/productUrls";

export const dynamic = "force-dynamic";

interface CategoryProductPageProps {
  params: Promise<{ slug: string; modelSlug: string }>;
}

// Top-level reserved 2-segment folders in Next.js to prevent collisions
const RESERVED_FIRST_SEGMENTS = new Set([
  "api",
  "admin",
  "account",
  "auth",
  "blogs",
  "collections",
  "floor-plans",
  "login",
  "pages",
  "quote",
  "resources",
  "signup",
  "upload-floor-plan",
  "verify-email",
  "videos",
]);

export async function generateMetadata({
  params,
}: CategoryProductPageProps): Promise<Metadata> {
  const { slug: category, modelSlug } = await params;
  if (!modelSlug || !category || RESERVED_FIRST_SEGMENTS.has(category.toLowerCase())) {
    return { title: "Page Not Found | ModularHome.com" };
  }

  const model = await getPublicProductBySlug(modelSlug);
  if (!model) {
    return {
      title: "Product Not Found | ModularHome.com",
      robots: { index: false, follow: false },
    };
  }

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const canonicalCategory = getProductCategorySlug(model);
  const canonicalUrl = getCanonicalUrl(`/${canonicalCategory}/${model.slug}`);

  const title = model.sqft > 0
    ? `${model.name} (${model.sqft.toLocaleString()} SQ FT) | ModularHome.com`
    : `${model.name} | ModularHome.com`;
  const description =
    truncateText(model.description, 160) ||
    `Explore the ${model.name} precision-engineered model on ModularHome.com.`;

  const productImage = (!model.primaryImage || model.primaryImage.includes("newmodularlogo"))
    ? (model.image && !model.image.includes("newmodularlogo") ? model.image : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80")
    : model.primaryImage;

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ModularHome.com",
      images: [
        {
          url: productImage,
          alt: model.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [productImage],
    },
  };
}

export default async function CategoryProductPage({ params }: CategoryProductPageProps) {
  const { slug: category, modelSlug } = await params;

  if (!modelSlug || !category || RESERVED_FIRST_SEGMENTS.has(category.toLowerCase())) {
    notFound();
  }

  const model = await getPublicProductBySlug(modelSlug);
  if (!model) {
    notFound();
  }

  const cleanCat = category.toLowerCase().trim();
  const canonicalCatSlug = getProductCategorySlug(model);
  const effectiveCat = isCategorySlug(cleanCat) ? cleanCat : canonicalCatSlug;

  const [allProducts, settings] = await Promise.all([
    getPublicProducts(),
    getPublicGlobalSettings(),
  ]);

  const relatedModels = allProducts
    .filter(
      (m) => m.id !== model.id && (m.category === model.category || m.series === model.series)
    )
    .slice(0, 3);

  const categoryName = getCategoryDisplayName(effectiveCat);
  const canonicalUrl = getCanonicalUrl(`/${effectiveCat}/${model.slug}`);

  // Schema.org Product structured data
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.name,
    description: truncateText(model.description, 200) || `Precision engineered ${model.name} model`,
    image: model.gallery && model.gallery.length > 0 ? model.gallery : [model.primaryImage],
    sku: model.slug,
    brand: {
      "@type": "Brand",
      name: settings.companyName || "ModularHome.com",
    },
    category: model.category || categoryName,
    ...(model.startingPrice > 0 && {
      offers: {
        "@type": "Offer",
        price: model.startingPrice,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
        priceValidUntil: "2027-12-31",
      },
    }),
  };

  // Schema.org BreadcrumbList structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://modularhome.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `https://modularhome.com/${effectiveCat}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: model.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ModelDetailClient
        model={model}
        relatedModels={relatedModels}
        phone={settings.phone}
        companyName={settings.companyName}
        currentCategory={effectiveCat}
      />
    </>
  );
}
