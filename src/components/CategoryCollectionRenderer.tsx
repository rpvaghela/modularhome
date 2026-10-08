import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Home
} from "lucide-react";
import BuildingCard from "@/components/BuildingCard";
import ShareButton from "@/components/ShareButton";
import CategoryFilteredCatalog from "@/components/CategoryFilteredCatalog";
import { BuildingModel } from "@/data/models";
import { PublicCollection } from "@/lib/publicData";
import { getCanonicalUrl } from "@/lib/seo";

interface CategoryCollectionRendererProps {
  title: string;
  tagline?: string;
  description?: string;
  image?: string;
  canonicalPath: string;
  products: BuildingModel[];
  allProducts?: BuildingModel[];
  allCollections?: PublicCollection[];
  categoryKey?: string;
}

export default function CategoryCollectionRenderer({
  title,
  tagline,
  description,
  image,
  canonicalPath,
  products,
  allProducts = [],
  allCollections = [],
  categoryKey,
}: CategoryCollectionRendererProps) {
  const canonical = getCanonicalUrl(canonicalPath);
  const heroImage =
    image ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

  const defaultTagline = tagline || `Precision-Engineered ${title}`;
  const defaultDescription =
    description ||
    `Explore our signature collection of ${title.toLowerCase()} floor plans and factory-crafted architectural models with nationwide delivery.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: defaultDescription.replace(/<[^>]*>?/gm, ""),
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: getCanonicalUrl(`${canonicalPath}/${p.slug}`),
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
            <Link href="/" className="hover:text-[#101114] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#101114] transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-[#d97706] font-bold truncate">{title}</span>
          </div>

          <ShareButton
            variant="button"
            label="Share Collection"
            item={{
              title: `${title} - ModularHome.com`,
              url: canonicalPath,
              description: defaultTagline,
              image: heroImage,
              category: "Collection",
            }}
            buttonTitle={`Share ${title}`}
          />
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-[24px] overflow-hidden bg-[#101114] text-white mb-12 shadow-xl border border-white/10">
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src={heroImage}
              alt={title}
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
              <span>{defaultTagline}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] leading-tight font-display text-white">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-body">
              {defaultDescription.replace(/<[^>]*>?/gm, "")}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#fcb907]" />
                <span>{products.length} Available Models</span>
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

        {/* Filter Bar & Models Grid */}
        <CategoryFilteredCatalog
          initialProducts={products}
          allProducts={allProducts.length > 0 ? allProducts : products}
          categoryName={title}
          categoryKey={categoryKey}
        />

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
              {allCollections
                .filter((c) => c.slug !== categoryKey && c.slug !== canonicalPath.replace(/^\//, ""))
                .slice(0, 6)
                .map((col) => (
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
