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
  Compass,
  Truck,
  FileCheck,
  PhoneCall,
  Home,
  Layers,
  MapPin
} from "lucide-react";
import BuildingCard from "@/components/BuildingCard";
import ShareButton from "@/components/ShareButton";
import CategoryFilteredCatalog from "@/components/CategoryFilteredCatalog";
import { getPublicCollections, getPublicProducts, getCategoryFallbackImage, getPublicCollectionBySlug } from "@/lib/publicData";
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

  const collection = await getPublicCollectionBySlug(slug);

  if (collection) {
    const title = collection.seoTitle || `${collection.name} | ModularHome.com`;
    const description = collection.metaDescription || collection.tagline || `Explore our ${collection.name} architectural collection engineered for lifetime durability.`;
    const canonical = collection.canonicalUrl || getCanonicalUrl(`/collections/${slug}`);
    const imgUrl = collection.image || collection.bannerImage || "/newmodularlogo.png";

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
        images: [{ url: imgUrl, alt: collection.name }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imgUrl],
      },
    };
  }

  // Fallback metadata
  const canonical = getCanonicalUrl(`/collections/${slug}`);
  const formattedName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formattedName} | ModularHome.com`,
    description: `Explore the ${formattedName} collection of modular homes, cabins, and turnkey building kits on ModularHome.com.`,
    alternates: { canonical },
    robots,
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  if (!slug || slug === "undefined" || slug === "null") {
    permanentRedirect("/collections");
  }

  const allProducts = await getPublicProducts();
  const allCollections = await getPublicCollections();

  const isAll = slug === "all";
  const collection = isAll ? null : await getPublicCollectionBySlug(slug);

  if (!isAll && !collection) {
    permanentRedirect("/collections");
  }

  const collectionTitle = isAll ? "All Modular Home Models" : collection!.name;
  const collectionTagline = isAll ? "Complete Architectural Catalog" : (collection!.tagline || "Curated Architectural Series");
  const collectionDescriptionHtml = isAll 
    ? "<p>Explore our comprehensive selection of precision light-gauge steel modular homes, turnkey prefab residences, rustic solid log cabins, energy-efficient SIP panel kits, and accessory dwelling units (ADUs). Every model is engineered for rapid assembly and lifetime structural performance.</p>"
    : (collection!.description || "");
  const collectionPlainDescription = collectionDescriptionHtml.replace(/<[^>]*>?/gm, "").trim();

  const collectionImage = isAll 
    ? getCategoryFallbackImage(collectionTitle, collectionTitle, slug)
    : (collection!.bannerImage || collection!.image || getCategoryFallbackImage(collectionTitle, collectionTitle, slug));

  const matchedProducts = isAll 
    ? allProducts 
    : (collection!.products && collection!.products.length > 0 ? collection!.products : allProducts.slice(0, 12));

  // Determine if this is a state builder / regional collection
  const isStateCollection = !isAll && (slug.includes("-in-") || slug.includes("builder"));
  const stateNameMatch = slug.match(/-in-([a-z-]+)$/);
  const stateName = stateNameMatch ? stateNameMatch[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

  // Schema.org CollectionPage and ItemList JSON-LD
  const canonical = isAll ? getCanonicalUrl("/collections/all") : (collection?.canonicalUrl || getCanonicalUrl(`/collections/${slug}`));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collectionTitle,
    description: collectionPlainDescription,
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

  // Find other collections in the same architectural group or related
  const relatedCollections = allCollections
    .filter((c) => c.slug !== slug && c.slug !== "all")
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white pt-3 pb-20 text-[#101114]">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap">
        {/* Breadcrumb Navigation & Share */}
        <div className="py-2.5 text-xs text-[#6b7280] flex items-center justify-between border-b border-[#e7e9ee] mb-6 gap-4">
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
            <span className="text-[#d97706] font-bold truncate">
              {collectionTitle}
            </span>
          </div>

          <ShareButton
            variant="button"
            label="Share Collection"
            item={{
              title: `${collectionTitle} - Modular Home Collection`,
              url: `/collections/${slug}`,
              description: collectionTagline,
              image: collectionImage,
              category: "Collection",
            }}
            buttonTitle={`Share ${collectionTitle}`}
          />
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-br from-[#101114] to-[#1e232d] text-white p-6 sm:p-10 md:p-12 mb-8 border border-gray-800 shadow-xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image
              src={collectionImage}
              alt={collectionTitle}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#101114] via-[#101114]/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcb907]/20 border border-[#fcb907]/30 text-[#fcb907] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{collectionTagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[-1px] text-white leading-tight font-display">
              {collectionTitle}
            </h1>

            {collectionDescriptionHtml ? (
              <div 
                className="text-sm sm:text-base text-gray-300 leading-relaxed space-y-2 [&>p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: collectionDescriptionHtml }}
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Explore our precision light-gauge steel modular residences, handcrafted cabins, and high-performance turnkey floor plans engineered for rapid assembly and lifetime durability.
              </p>
            )}

            {/* Quick Highlights Pills */}
            <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-4 text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#fcb907]" />
                <span>40-Yr Metal Roof Warranty</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/10">
                <Truck className="w-4 h-4 text-[#fcb907]" />
                <span>Nationwide Direct Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/10">
                <FileCheck className="w-4 h-4 text-[#fcb907]" />
                <span>Stamped Engineered Drawings</span>
              </div>
            </div>
          </div>
        </div>

        {/* State / Regional Localized Notice (If applicable) */}
        {isStateCollection && (
          <div className="mb-8 p-4 sm:p-5 bg-[#fef9c3] border border-[#fde047] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#713f12]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#fcb907] rounded-lg text-[#101114] mt-0.5 sm:mt-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#101114]">
                  Delivering Across {stateName || "Your Region"}
                </h3>
                <p className="text-xs sm:text-sm text-[#854d0e] mt-0.5">
                  All models in this series are engineered to meet or exceed {stateName || "local"} county building codes, seismic/wind standards, and snow loads. Stamped architectural plans included.
                </p>
              </div>
            </div>
            <Link
              href={`/quote?collection=${slug}&state=${encodeURIComponent(stateName)}`}
              className="whitespace-nowrap px-4 py-2 bg-[#101114] hover:bg-[#252830] text-[#fcb907] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Get State Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Catalog Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e7e9ee] pb-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#d97706] mb-1">
              Available Models ({matchedProducts.length})
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114]">
              Explore Floor Plans in this Collection
            </h2>
          </div>
          <div className="text-xs text-[#6b7280]">
            Factory-Direct Pricing • Fast Turnaround
          </div>
        </div>

        {/* Filter Bar & Models Grid */}
        <CategoryFilteredCatalog
          initialProducts={matchedProducts}
          allProducts={allProducts}
          categoryName={collectionTitle}
          categoryKey={slug}
        />

        {/* Custom Quote & Consultation Banner */}
        <section className="mt-16 bg-[#f8f9fa] border border-[#e7e9ee] rounded-[20px] p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcb907]/20 text-[#d97706] text-xs font-bold uppercase">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Direct Builder Consultation</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#101114]">
              Looking to Customize {collectionTitle}?
            </h3>
            <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
              We customize layouts, dimensions, door and window placements, siding materials, and insulation packages for your land requirements. Speak with an expert modular home engineer today.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href={`/quote?collection=${slug}&title=${encodeURIComponent(collectionTitle)}`}
                className="px-6 py-3 bg-[#fcb907] hover:bg-[#e0a406] text-[#101114] font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Request Custom Quote & Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/upload-floor-plan"
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-[#e7e9ee] text-[#101114] font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <span>Upload Your Custom Plan</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Related Collections Section */}
        {relatedCollections.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#e7e9ee]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#101114] font-display">
                Related Architectural Collections
              </h3>
              <Link
                href="/collections"
                className="text-xs font-bold text-[#d97706] hover:underline flex items-center gap-1"
              >
                <span>View All Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {relatedCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="p-4 bg-white hover:bg-[#fcb907]/10 border border-[#e7e9ee] rounded-[14px] transition-all group flex flex-col justify-between text-left space-y-2 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="text-xs font-black text-[#101114] group-hover:text-[#d97706] transition-colors line-clamp-2 leading-snug">
                      {col.name}
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-[#d97706]">
                    {col.productCount || 0} Models →
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
