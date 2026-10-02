import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building,
  Award,
  Truck
} from "lucide-react";
import StatsSection from "@/components/StatsSection";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("about");
  if (page) {
    const title = page.seoTitle || `${page.title} | ModularHome.com`;
    const description = page.metaDescription || page.subtitle || "Learn about ModularHome.com's manufacturing network, customizable floor plans, quality standards, and factory-built housing solutions.";
    return {
      title,
      description,
      openGraph: {
        title: page.ogTitle || title,
        description: page.ogDescription || description,
        images: page.ogImage ? [{ url: page.ogImage }] : (page.featuredImage ? [{ url: page.featuredImage }] : [{ url: "/newmodularlogo.png" }]),
      },
      alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    };
  }

  return {
    title: "About ModularHome.com | Modern Modular Housing Marketplace",
    description: "Learn about ModularHome.com's manufacturing network, customizable floor plans, quality standards, and factory-built housing solutions.",
  };
}

export default async function AboutPage() {
  const page = await getPublicPageBySlug("about");

  // If CMS has custom sections or body content, render via DynamicPageRenderer
  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title || "About ModularHome.com",
      description: page.metaDescription || page.subtitle,
      url: "https://modularhome.com/about",
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

  // High-performance fallback standard About layout
  const heroBadge = "ModularHome.com • About Our Company";
  const heroTitle = page?.title || "Building A Better Way To Live.";
  const heroSubtitle = page?.subtitle || "Discover, Compare & Customize Your Modular Home.";
  const heroDesc = page?.content || "ModularHome.com is a leading marketplace for modular and prefabricated housing solutions, combining factory precision engineering with modern architectural design and transparent pricing.";
  const heroImage = page?.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#101114]">
      {/* 1. HERO */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-b from-[#f6f7f9] to-white">
        <div className="wrap">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
              <span>{heroBadge}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-[-2px] text-[#101114] leading-[0.95]">
              {heroTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#101114] font-semibold italic">
              &ldquo;{heroSubtitle}&rdquo;
            </p>
            <p className="mt-4 text-sm sm:text-base text-[#6b7280] leading-relaxed max-w-2xl">
              {heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatsSection />

      {/* 3. COMPANY STORY */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span>Our Heritage & Innovation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#101114]">
                Traditional Craftsmanship Meets Modern Modular Innovation
              </h2>
              <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
                Headquartered in the USA, <strong className="text-[#101114]">ModularHome.com</strong> works with certified modular builders and manufacturing facilities to provide premium, customizable housing solutions to customers nationwide.
              </p>
              <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
                We specialize in handcrafted cabins, modular homes, prefab homes, tiny homes, barndominiums, panelized house kits, and custom residential structures. By combining time-tested carpentry with efficient climate-controlled construction methods, we deliver durable, energy-efficient homes faster and at honest, transparent prices.
              </p>

              {/* Core Focus Badges */}
              <div className="pt-2">
                <div className="text-xs uppercase font-bold text-[#101114] tracking-wider mb-3">Our Core Company Focus:</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#101114]">
                  {[
                    "Quality Craftsmanship",
                    "Customizable Designs",
                    "Transparent Pricing",
                    "Customer Support",
                    "Modular Construction",
                    "Nationwide Delivery",
                    "Installation Support",
                    "Turnkey Solutions",
                  ].map((item, idx) => (
                    <span key={idx} className="flex items-center gap-2 p-2.5 bg-[#f6f7f9] rounded-[9px] border border-[#e7e9ee]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden border border-[#e7e9ee] shadow-lg">
                <Image
                  src={heroImage}
                  alt={page?.imageAlt || "Modern Modular Factory Build"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US 3 PILLARS */}
      <section className="py-20 bg-[#f6f7f9] border-t border-[#e7e9ee]">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Why Choose ModularHome.com
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#101114] mt-2">
              Engineered For Modern Living
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card p-6 bg-white space-y-3">
              <div className="w-12 h-12 rounded-[11px] bg-[#fcb907]/15 text-[#d97706] flex items-center justify-center font-bold text-xl">
                ⌂
              </div>
              <h3 className="text-lg font-black text-[#101114]">
                Factory Precision
              </h3>
              <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                Built indoors protected from rain, moisture, and weather delays. Our precision manufacturing ensures square angles, tight thermal envelopes, and consistent quality.
              </p>
            </div>

            <div className="card p-6 bg-white space-y-3">
              <div className="w-12 h-12 rounded-[11px] bg-[#fcb907]/15 text-[#d97706] flex items-center justify-center font-bold text-xl">
                $
              </div>
              <h3 className="text-lg font-black text-[#101114]">
                Transparent Pricing
              </h3>
              <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                No hidden costs or contractor markups. We provide upfront pricing, clear itemized options, and flexible financing partners to fit your budget.
              </p>
            </div>

            <div className="card p-6 bg-white space-y-3">
              <div className="w-12 h-12 rounded-[11px] bg-[#fcb907]/15 text-[#d97706] flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <h3 className="text-lg font-black text-[#101114]">
                Nationwide Support
              </h3>
              <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                From initial site evaluation and architectural permitting to modular factory production and crane assembly on your foundation.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/buildings"
              className="btn-primary py-3.5 px-8 text-sm font-extrabold rounded-[11px] shadow-sm"
            >
              <span>Explore All Modular Homes</span>
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
