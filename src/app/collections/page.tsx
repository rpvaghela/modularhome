import { Metadata } from "next";
import { headers } from "next/headers";
import { Layers } from "lucide-react";
import { getPublicCollections, getHomeTypeCategories } from "@/lib/publicData";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import CollectionsCatalogClient from "./CollectionsCatalogClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = "Modular & Prefab Home Collections | ModularHome.com";
  const description =
    "Explore our complete curated collections of modular homes, prefab houses, log cabins, barndominiums, ADUs, and house kits.";
  const canonical = getCanonicalUrl("/collections");

  return {
    title,
    description,
    robots,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/newmodularlogo.png"],
    },
  };
}

export default async function CollectionsIndexPage() {
  const [collections] = await Promise.all([
    getPublicCollections(),
  ]);

  const canonical = getCanonicalUrl("/collections");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modular Home Architectural Collections",
    description: "Curated collections of modular homes, log cabins, barndominiums, and prefab floor plans.",
    url: canonical,
  };

  return (
    <div className="min-h-screen bg-white pt-4 pb-20 text-[#101114]">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap">
        {/* Header */}
        <div className="py-4 border-b border-[#e7e9ee] mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-2">
            <Layers className="w-4 h-4 text-[#fcb907]" />
            <span>Curated Architectural Series</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114]">
            Home Collections ({collections.length})
          </h1>
          <p className="text-sm sm:text-base text-[#6b7280] max-w-2xl mt-2 leading-relaxed">
            Browse our pre-engineered collections designed for every lifestyle, lot requirement, and architectural preference. Filter by style, bedroom count, or state builders.
          </p>
        </div>

        {/* Interactive Filterable Catalog */}
        <CollectionsCatalogClient initialCollections={collections} />
      </div>
    </div>
  );
}
