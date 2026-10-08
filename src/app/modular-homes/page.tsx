import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Home,
  Layers
} from "lucide-react";
import BuildingCard from "@/components/BuildingCard";
import ShareButton from "@/components/ShareButton";
import { getPublicProducts, getPublicCollections, getPublicCollectionBySlug } from "@/lib/publicData";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import { matchProductCategory } from "@/utils/categoryMatching";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = "Modular Homes & Prefab Models";
  const description =
    "Explore our full catalog of precision-engineered modular homes and turnkey prefab residences. Customizable floor plans, modern energy efficiency, and nationwide delivery.";
  const canonical = getCanonicalUrl("/modular-homes");

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
      images: [
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
          alt: "Modular Homes Collection",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"],
    },
  };
}

export default async function ModularHomesPage() {
  const [allProducts, allCollections] = await Promise.all([
    getPublicProducts(),
    getPublicCollections(),
  ]);

  // Find products matching modular homes
  const modularProducts = allProducts.filter(
    (p) =>
      matchProductCategory(p, "modular-homes") ||
      matchProductCategory(p, "modular") ||
      (p.category && p.category.toLowerCase().includes("modular")) ||
      (p.series && p.series.toLowerCase().includes("modular")) ||
      ((p as any).product_type && String((p as any).product_type).toLowerCase().includes("modular"))
  );

  const displayProducts = modularProducts.length > 0 ? modularProducts : allProducts;

  const canonical = getCanonicalUrl("/modular-homes");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modular Homes & Prefab Residences",
    description:
      "Explore our precision-engineered modular homes and turnkey prefab house plans with nationwide delivery.",
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: displayProducts.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: getCanonicalUrl(`/modular-homes/${p.slug}`),
        name: p.name,
      })),
    },
  };

  const heroImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#101114]">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap">
        {/* Breadcrumb Navigation & Share */}
        <div className="py-4 text-xs text-[#6b7280] flex items-center justify-between border-b border-[#e7e9ee] mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Link href="/" className="hover:text-[#101114] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#101114] transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-[#d97706] font-bold truncate">Modular Homes</span>
          </div>

          <ShareButton
            variant="button"
            label="Share Collection"
            item={{
              title: "Modular Homes & Prefab Models | ModularHome.com",
              url: "/modular-homes",
              description: "Browse precision modular homes and prefab residences on ModularHome.com",
              image: heroImage,
              category: "Collection",
            }}
            buttonTitle="Share Modular Homes"
          />
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-[24px] overflow-hidden bg-[#101114] text-white mb-12 shadow-xl border border-white/10">
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src={heroImage}
              alt="Modular Homes Collection"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fcb907] text-[#101114] rounded-full text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Precision-Engineered Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] leading-tight font-display text-white">
              Modular Homes
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-body">
              Discover our signature lineup of factory-crafted modular homes and modern prefab floor plans.
              Built in climate-controlled facilities using high-strength materials, our residences deliver superior energy efficiency, faster build timelines, and turnkey structural reliability.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#fcb907]" />
                <span>{displayProducts.length} Available Models</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#fcb907]" />
                <span>Code-Compliant & Turnkey</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#fcb907]" />
                <span>Nationwide Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#101114] font-display">
                Featured Modular Home Models
              </h2>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Showing {displayProducts.length} precision floor plans
              </p>
            </div>
            <Link
              href="/buildings"
              className="text-xs font-bold text-[#d97706] hover:underline flex items-center gap-1"
            >
              <span>Explore All Floor Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
              {displayProducts.map((model) => (
                <BuildingCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#f6f7f9] border border-[#e7e9ee] rounded-[18px] p-8 space-y-3">
              <Building2 className="w-12 h-12 text-[#6b7280] mx-auto" />
              <h3 className="text-lg font-black uppercase text-[#101114]">
                No Models Currently In This Collection
              </h3>
              <p className="text-xs text-[#6b7280] max-w-md mx-auto">
                Explore our main floor plans catalog to view all available modular and prefab home designs.
              </p>
              <div className="pt-2">
                <Link
                  href="/buildings"
                  className="btn-primary py-2.5 px-6 text-xs font-bold rounded-[9px] inline-flex items-center gap-2"
                >
                  <span>Browse Full Home Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Related Collections Section */}
        {allCollections.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#e7e9ee]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#101114] font-display">
                Explore Other Building Series
              </h3>
              <Link
                href="/collections"
                className="text-xs font-bold text-[#d97706] hover:underline flex items-center gap-1"
              >
                <span>All Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {allCollections.slice(0, 6).map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="p-4 bg-[#f8f9fa] hover:bg-[#fcb907]/15 border border-[#e7e9ee] rounded-[14px] transition-all group text-center space-y-2"
                >
                  <div className="text-xs font-black text-[#101114] group-hover:text-[#d97706] transition-colors leading-snug">
                    {col.name}
                  </div>
                  <div className="text-[11px] text-[#6b7280]">
                    {col.productCount || 0} Models
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
