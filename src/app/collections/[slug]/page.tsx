import { notFound, permanentRedirect } from "next/navigation";
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
  Compass
} from "lucide-react";
import BuildingCard from "@/components/BuildingCard";
import ShareButton from "@/components/ShareButton";
import CategoryFilteredCatalog from "@/components/CategoryFilteredCatalog";
import { getPublicCollections, getPublicProducts } from "@/lib/publicData";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null") {
    return { title: "Collection Not Found | ModularHome.com" };
  }

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  if (slug === "all") {
    const title = "All Modular Home Models & Floor Plans | ModularHome.com";
    const description = "Browse our complete catalog of precision-engineered modular homes, prefab houses, barndominiums, cabins, and turnkey ADUs.";
    const canonical = getCanonicalUrl("/collections/all");
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

  const canonical = getCanonicalUrl(`/${slug}`);
  return {
    alternates: { canonical },
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null") {
    notFound();
  }

  // 301 Permanent Redirect specific collection URLs to top-level canonical category URLs
  if (slug !== "all") {
    permanentRedirect(`/${slug}`);
  }

  const allProducts = await getPublicProducts();
  const allCollections = await getPublicCollections();

  const collectionTitle = "All Modular Home Models";
  const collectionTagline = "Complete Architectural Catalog";
  const collectionDescription =
    "Explore our comprehensive selection of precision light-gauge steel modular homes, turnkey prefab residences, rustic solid log cabins, energy-efficient SIP panel kits, and accessory dwelling units (ADUs). Every model is engineered for rapid assembly and lifetime structural performance.";
  const collectionImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";
  const matchedProducts = allProducts;

  // Schema.org CollectionPage and ItemList JSON-LD
  const canonical = getCanonicalUrl("/collections/all");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collectionTitle,
    description: collectionDescription,
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: matchedProducts.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: getCanonicalUrl(`/${p.category || "modular-homes"}/${p.slug}`),
        name: p.name,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#101114]">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap">
        {/* Breadcrumb Navigation & Share */}
        <div className="py-4 text-xs text-[#6b7280] flex items-center justify-between border-b border-[#e7e9ee] mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Link href="/" className="hover:text-[#101114] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#101114] transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-[#d97706] font-bold truncate">
              All Models
            </span>
          </div>

          <ShareButton
            variant="button"
            label="Share Collection"
            item={{
              title: `${collectionTitle} - Modular Home Collection`,
              url: "/collections/all",
              description: collectionTagline,
              image: collectionImage,
              category: "Collection",
            }}
            buttonTitle={`Share ${collectionTitle}`}
          />
        </div>

        {/* Collection Hero Banner */}
        <div className="relative rounded-[24px] overflow-hidden bg-[#101114] text-white mb-12 shadow-xl border border-white/10">
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src={collectionImage}
              alt={collectionTitle}
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
              <span>{collectionTagline}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] leading-tight font-display text-white">
              {collectionTitle}
            </h1>

            {collectionDescription && (
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-body">
                {collectionDescription.replace(/<[^>]*>?/gm, "")}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#fcb907]" />
                <span>{matchedProducts.length} Available Models</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#fcb907]" />
                <span>Engineered Code-Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#fcb907]" />
                <span>Nationwide Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar & Models Grid */}
        <CategoryFilteredCatalog
          initialProducts={matchedProducts}
          allProducts={allProducts}
          categoryName="All"
          categoryKey="all"
        />

        {/* Related Collections Section */}
        {allCollections.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#e7e9ee]">
            <h3 className="text-xl sm:text-2xl font-black text-[#101114] font-display mb-6">
              Explore Architectural Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {allCollections.slice(0, 6).map((col) => (
                <Link
                  key={col.id}
                  href={`/${col.slug}`}
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
