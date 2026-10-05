import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, Layers, Play, Star, Sparkles, ShieldCheck } from "lucide-react";
import TrustBar from "@/components/TrustBar";
import HomeSearchBox from "@/components/HomeSearchBox";
import CategoryGrid from "@/components/CategoryGrid";
import HomeProductCard, { ProductItem } from "@/components/HomeProductCard";
import BudgetSection from "@/components/BudgetSection";
import NearMeSection from "@/components/NearMeSection";
import CustomizeAndPlansSection from "@/components/CustomizeAndPlansSection";
import QuoteAndStepsSection from "@/components/QuoteAndStepsSection";
import FinancingSection from "@/components/FinancingSection";
import HomeVideosSection from "@/components/HomeVideosSection";
import HomeTestimonialsSection from "@/components/HomeTestimonialsSection";
import HomeArticlesSection from "@/components/HomeArticlesSection";
import CTASection from "@/components/CTASection";
import { getPublicProducts, getPublicReviews, getPublicSettings, getPublicCollections, getHomeTypeCategories, getPublicBlogs } from "@/lib/publicData";
import { getPublicPageBySlug } from "@/lib/pageDataServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("home");
  if (page) {
    const title = page.seoTitle || "Modern Modular Homes & Turnkey Prefab Housing | ModularHome.com";
    const description = page.metaDescription || page.subtitle || "ModularHome.com offers precision engineered steel modular homes, customizable floor plans, and instant turnkey quotes nationwide.";
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
    title: "Modern Modular Homes & Turnkey Prefab Housing | ModularHome.com",
    description: "ModularHome.com offers precision engineered steel modular homes, customizable floor plans, and instant turnkey quotes nationwide.",
  };
}

export default async function HomePage() {
  const [products, reviews, settings, collections, homeCategories, blogs, homePage] = await Promise.all([
    getPublicProducts(),
    getPublicReviews(),
    getPublicSettings(),
    getPublicCollections(),
    getHomeTypeCategories(),
    getPublicBlogs(),
    getPublicPageBySlug("home"),
  ]);

  // Deduplicate products by root model name so the showcase displays distinct architectural models
  const seenModels = new Set<string>();
  const distinctProducts = (products || []).filter((p) => {
    const rootName = p.name
      .replace(/\s*-\s*\([A-Z\s]+\s*PRICING\)/i, "")
      .replace(/\s*-\s*[A-Za-z\s]+Pricing.*/i, "")
      .replace(/\s*\(Shipping.*/i, "")
      .trim();
    if (seenModels.has(rootName)) return false;
    seenModels.add(rootName);
    return true;
  });

  // Map dynamic products from database to ProductItem format (10 Homes Available Right Now: 2 rows of 5)
  const availableHomes: ProductItem[] = distinctProducts.slice(0, 10).map((p, idx) => {
    const cleanName = p.name
      .replace(/\s*-\s*\([A-Z\s]+\s*PRICING\)/i, "")
      .replace(/\s*-\s*[A-Za-z\s]+Pricing.*/i, "")
      .replace(/\s*\(Shipping.*/i, "")
      .trim();

    return {
      id: p.id || String(idx),
      slug: p.slug,
      name: cleanName,
      badge:
        idx === 0
          ? "Best Seller"
          : idx === 1
          ? "Quick Ship"
          : idx === 2
          ? "Popular"
          : idx === 5
          ? "Featured"
          : idx === 7
          ? "New Arrival"
          : idx === 9
          ? "Customer Favorite"
          : undefined,
      image: p.primaryImage || p.image || "/newmodularlogo.png",
      bedrooms: p.bedrooms || 3,
      bathrooms: p.bathrooms || 2,
      sqft: p.sqft || 1600,
      price: p.startingPrice || 189000,
    };
  });

  const trendingHomes: ProductItem[] = distinctProducts.slice(10, 20).map((p, idx) => {
    const cleanName = p.name
      .replace(/\s*-\s*\([A-Z\s]+\s*PRICING\)/i, "")
      .replace(/\s*-\s*[A-Za-z\s]+Pricing.*/i, "")
      .replace(/\s*\(Shipping.*/i, "")
      .trim();

    return {
      id: p.id || String(idx),
      slug: p.slug,
      name: cleanName,
      badge: idx === 0 ? "Trending" : idx === 3 ? "Staff Pick" : undefined,
      image: p.primaryImage || p.image || "/newmodularlogo.png",
      bedrooms: p.bedrooms || 3,
      bathrooms: p.bathrooms || 2,
      sqft: p.sqft || 1800,
      price: p.startingPrice || 195000,
    };
  });

  const heroHeading = homePage?.title || settings?.defaultSeoTitle || "Precision-Engineered Modular Homes";
  const heroTagline = homePage?.subtitle || "DIRECT FACTORY BUILDER • 2026 ARCHITECTURAL MODELS";
  const heroDesc = homePage?.content || "Explore precision commercial-grade steel modular residences, downloadable blueprint kits, and turnkey prefab homes designed for superior energy efficiency and fast nationwide delivery.";
  const heroBgImage = homePage?.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1900&q=85";
  const featuredHeroModel = availableHomes[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. PROFESSIONAL ARCHITECTURAL HERO SECTION */}
      <section 
        className="min-h-[580px] sm:min-h-[640px] lg:min-h-[690px] text-white flex items-center relative overflow-hidden bg-cover bg-center pb-8 sm:pb-12"
        style={{
          backgroundImage: `linear-gradient(105deg, rgba(11,15,23,0.93) 0%, rgba(11,15,23,0.80) 46%, rgba(11,15,23,0.38) 100%), url('${heroBgImage}')`
        }}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-24 left-10 w-96 h-96 bg-[#fcb907]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="wrap w-full py-12 sm:py-16 md:py-20 relative z-10">
          <div className="max-w-3xl text-left">
            {/* Luxury Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101114]/80 backdrop-blur-md border border-[#fcb907]/40 text-[#fcb907] text-[11px] sm:text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#fcb907] animate-pulse" />
              <span>{heroTagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-black tracking-[-1.5px] sm:tracking-[-2.2px] text-white leading-[1.08] sm:leading-[1.02] mb-4 sm:mb-5 drop-shadow-sm">
              {heroHeading}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-[17px] text-gray-200 leading-relaxed max-w-2xl mb-6 sm:mb-8 font-normal drop-shadow-xs">
              {heroDesc}
            </p>

            {/* Side-by-Side Interactive CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] py-3.5 px-6 sm:px-7 text-sm sm:text-base font-black rounded-xl shadow-lg hover:shadow-[0_10px_30px_rgba(252,185,7,0.35)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
              >
                <span>Get Instant Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </Link>

              <Link
                href="/buildings"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#101114] backdrop-blur-md border border-white/30 hover:border-white py-3.5 px-6 text-sm sm:text-base font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Browse 50+ Models</span>
                <Layers className="w-4 h-4" />
              </Link>

              <Link
                href="/videos"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-300 hover:text-[#fcb907] transition-colors py-2 px-1 group"
              >
                <span className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center group-hover:bg-[#fcb907] group-hover:text-[#101114] transition-colors shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>Watch Video Tours</span>
              </Link>
            </div>

            {/* Trust Proof Micro-Ribbon */}
            <div className="pt-4 border-t border-white/15 flex items-center gap-3.5 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center text-[#fcb907] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#fcb907]" />
                ))}
              </div>
              <div className="font-semibold text-gray-200">
                <span className="font-black text-white">4.9/5 Rating</span> • 1,200+ Delivered Residences Nationwide
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / BENEFITS (Floating Overlap Bar) */}
      <TrustBar />

      {/* 3. FIND YOUR PERFECT HOME (Search & Filter Section) */}
      <HomeSearchBox />

      {/* 4. SHOP BY HOME TYPE (10 Category 5-Column Grid) */}
      <CategoryGrid categories={homeCategories} collections={collections} />

      {/* 5. HOMES AVAILABLE RIGHT NOW (5-Column Product Grid) */}
      <section id="homes" className="py-12 sm:py-16 bg-white">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-[-1.3px] text-[#101114] m-0">
                Homes Available Right Now
              </h2>
              <p className="text-sm sm:text-base text-[#6b7280] mt-1.5 mb-0">
                Move-in ready and quick-ship modular homes.
              </p>
            </div>
            <Link
              href="/buildings"
              className="text-[#d97706] hover:text-[#b45309] font-extrabold text-sm sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto"
            >
              View All Homes →
            </Link>
          </div>

          {/* 5-Column Product Grid */}
          {availableHomes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-4.5">
              {availableHomes.map((home) => (
                <HomeProductCard key={home.id} product={home} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-[#f8f9fa] rounded-[14px] border border-[#e7e9ee] text-[#6b7280]">
              <p className="text-sm font-semibold text-[#101114]">No models currently listed.</p>
              <p className="text-xs mt-1">Contact our team to configure a custom modular plan for your site.</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. FIND A HOME IN YOUR BUDGET (4 Budget Cards) */}
      <BudgetSection products={products} />

      {/* 7. FIND HOMES NEAR YOU (ZIP Search + USA Map + Nationwide Delivery) */}
      <NearMeSection />

      {/* 8. TRENDING HOMES (5-Column Product Grid) */}
      <section className="py-12 sm:py-16 bg-[#f6f7f9]">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-[-1.3px] text-[#101114] m-0">
                Trending Homes
              </h2>
              <p className="text-sm sm:text-base text-[#6b7280] mt-1.5 mb-0">
                Popular modular homes customers are exploring now.
              </p>
            </div>
            <Link
              href="/buildings"
              className="text-[#d97706] hover:text-[#b45309] font-extrabold text-sm sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto"
            >
              View Trending Homes →
            </Link>
          </div>

          {/* 5-Column Trending Grid */}
          {trendingHomes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-4.5">
              {trendingHomes.map((home) => (
                <HomeProductCard key={home.id} product={home} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-white rounded-[14px] border border-[#e7e9ee] text-[#6b7280]">
              <p className="text-sm font-semibold text-[#101114]">No trending models available at this moment.</p>
              <p className="text-xs mt-1">Explore our custom blueprint and modular options.</p>
            </div>
          )}
        </div>
      </section>

      {/* 9. CUSTOMIZE YOUR DREAM HOME & FLOOR PLANS (Split Section) */}
      <CustomizeAndPlansSection />

      {/* 10. GET YOUR CUSTOM QUOTE & HOW IT WORKS (Split Section, #quote) */}
      <QuoteAndStepsSection />

      {/* 11. FINANCING & MORTGAGE CALCULATOR */}
      <FinancingSection />

      {/* 12. WATCH OUR HOME TOURS (Asymmetric 5-Video Showcase) */}
      <HomeVideosSection />

      {/* 13. WHAT OUR CUSTOMERS SAY (Live Testimonials) */}
      <HomeTestimonialsSection initialReviews={reviews} />

      {/* 14. LATEST NEWS & RESOURCES (Articles) */}
      <HomeArticlesSection articles={blogs} />

      {/* 15. READY TO BUILD YOUR DREAM HOME? (CTA Banner) */}
      <CTASection />
    </div>
  );
}
