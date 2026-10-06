import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { getPublicCollections, getHomeTypeCategories } from "@/lib/publicData";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";

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
  };
}

export default async function CollectionsIndexPage() {
  const [collections, homeTypes] = await Promise.all([
    getPublicCollections(),
    getHomeTypeCategories(),
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
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#101114]">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap">
        {/* Header */}
        <div className="py-8 border-b border-[#e7e9ee] mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-2">
            <Layers className="w-4 h-4 text-[#fcb907]" />
            <span>Curated Architectural Series</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114]">
            Home Collections
          </h1>
          <p className="text-sm sm:text-base text-[#6b7280] max-w-2xl mt-2 leading-relaxed">
            Browse our pre-engineered collections designed for every lifestyle, lot requirement, and architectural preference.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* All Models Card */}
          <Link
            href="/collections/all"
            className="group card overflow-hidden flex flex-col justify-between bg-white rounded-[18px] border border-[#e7e9ee] hover:-translate-y-1 transition-all"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="All Modular Home Models"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#fcb907] text-[#101114] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Full Catalog
              </div>
            </div>
            <div className="p-5 space-y-2">
              <h2 className="text-lg font-black text-[#101114] group-hover:text-[#d97706] transition-colors">
                All Modular Home Models
              </h2>
              <p className="text-xs text-[#6b7280] leading-relaxed line-clamp-2">
                Browse our entire portfolio of precision steel modular homes, turnkey prefab models, and custom house kits.
              </p>
              <div className="pt-2 text-xs font-bold text-[#d97706] inline-flex items-center gap-1 group-hover:underline">
                <span>Explore Full Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Dynamic / Migrated Collections */}
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group card overflow-hidden flex flex-col justify-between bg-white rounded-[18px] border border-[#e7e9ee] hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                  src={col.image || col.bannerImage || "/newmodularlogo.png"}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#101114] text-[#fcb907] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                  {col.productCount || 0} Models
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-black text-[#101114] group-hover:text-[#d97706] transition-colors">
                  {col.name}
                </h2>
                <p className="text-xs text-[#6b7280] leading-relaxed line-clamp-2">
                  {col.tagline || col.description?.replace(/<[^>]*>?/gm, "").slice(0, 100) || `High-performance ${col.name} designs.`}
                </p>
                <div className="pt-2 text-xs font-bold text-[#d97706] inline-flex items-center gap-1 group-hover:underline">
                  <span>View Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
