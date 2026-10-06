import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import ModelDetailClient from "@/app/models/[slug]/ModelDetailClient";
import { getPublicProductBySlug, getPublicProducts } from "@/lib/publicData";
import { getPublicGlobalSettings } from "@/lib/settings";
import { truncateText } from "@/utils/text";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null") {
    return { title: "Product Not Found | ModularHome.com" };
  }

  const model = await getPublicProductBySlug(slug);
  if (!model) {
    return { title: "Product Not Found | ModularHome.com" };
  }

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = model.sqft > 0
    ? `${model.name} (${model.sqft} SQ FT) | ModularHome.com`
    : `${model.name} | ModularHome.com`;
  const description =
    truncateText(model.description, 160) ||
    `Explore the ${model.name} precision-engineered modular home model on ModularHome.com.`;

  const canonical = getCanonicalUrl(`/products/${model.slug}`);

  return {
    title,
    description,
    robots,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [
        {
          url: model.primaryImage || "/newmodularlogo.png",
          alt: model.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [model.primaryImage || "/newmodularlogo.png"],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null") {
    notFound();
  }

  const model = await getPublicProductBySlug(slug);

  if (!model) {
    notFound();
  }

  const [allProducts, settings] = await Promise.all([
    getPublicProducts(),
    getPublicGlobalSettings(),
  ]);

  const relatedModels = allProducts
    .filter(
      (m) => m.id !== model.id && (m.category === model.category || m.series === model.series)
    )
    .slice(0, 3);

  // Schema.org Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.name,
    description: truncateText(model.description, 200) || `Precision engineered ${model.name} modular home`,
    image: model.gallery && model.gallery.length > 0 ? model.gallery : [model.primaryImage],
    sku: model.slug,
    brand: {
      "@type": "Brand",
      name: settings.companyName || "ModularHome.com",
    },
    category: model.category || "Modular Homes",
    ...(model.startingPrice > 0 && {
      offers: {
        "@type": "Offer",
        price: model.startingPrice,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: getCanonicalUrl(`/products/${model.slug}`),
        priceValidUntil: "2027-12-31",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ModelDetailClient
        model={model}
        relatedModels={relatedModels}
        phone={settings.phone}
        companyName={settings.companyName}
      />
    </>
  );
}
