import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { FEATURED_MODELS } from "@/data/products";
import { getBombShelterProductById, getBombShelterProducts } from "@/lib/productStore";
import { BombShelterModelDetailClient } from "@/components/models/BombShelterModelDetailClient";
import { CtaBanner } from "@/components/ui/CtaBanner";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const model =
    (await getBombShelterProductById(params.slug)) ||
    FEATURED_MODELS.find(
      (m) => m.id === params.slug || m.id.toLowerCase() === params.slug.toLowerCase()
    );

  if (!model) {
    return {
      title: "Model Not Found | BombShelters.com",
    };
  }

  const cleanDescription = (model.description || "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 160) || "Engineered subterranean bomb shelter with certified structural steel and NBC life support.";

  const imgUrl = ("primaryImageUrl" in model && model.primaryImageUrl) ? String(model.primaryImageUrl) : model.imageUrl;

  return {
    title: `${model.name} | BombShelters.com`,
    description: cleanDescription,
    alternates: {
      canonical: `https://bombshelters.com/models/${model.id}`,
    },
    openGraph: {
      title: `${model.name} | BombShelters.com`,
      description: cleanDescription,
      url: `https://bombshelters.com/models/${model.id}`,
      type: "website",
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 630,
          alt: model.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${model.name} | BombShelters.com`,
      description: cleanDescription,
      images: [imgUrl],
    },
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const model =
    (await getBombShelterProductById(params.slug)) ||
    FEATURED_MODELS.find(
      (m) => m.id === params.slug || m.id.toLowerCase() === params.slug.toLowerCase()
    );

  if (!model) {
    notFound();
  }

  // Related models from database
  const allModels = await getBombShelterProducts(true);
  const pool = allModels.length > 0 ? allModels : FEATURED_MODELS;
  const relatedModels = pool.filter((m) => m.id !== model.id).slice(0, 3);

  // Schema.org Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": model.name,
    "description": (model.description || "").replace(/<[^>]*>/g, "").slice(0, 250),
    "image": ("primaryImageUrl" in model && model.primaryImageUrl) ? String(model.primaryImageUrl) : model.imageUrl,
    "brand": {
      "@type": "Brand",
      "name": "BombShelters.com"
    },
    "category": model.category,
    "offers": {
      "@type": "Offer",
      "price": model.rawPrice || 49900,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `https://bombshelters.com/models/${model.id}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BombShelterModelDetailClient
        model={model}
        relatedModels={relatedModels}
        phone="+1 (812) 595-4033"
        companyName="BombShelters.com"
      />

      <CtaBanner
        title="READY TO FORTIFY YOUR PROPERTY?"
        subtitle="Speak with our structural blast engineers today. We coordinate factory fabrication, precision rigging, and nationwide turnkey installation."
        ctaText="Request Itemized Quote"
        ctaHref="/quote"
      />
    </>
  );
}
