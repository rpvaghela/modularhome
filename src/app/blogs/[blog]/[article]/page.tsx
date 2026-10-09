import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { 
  Clock, 
  Calendar, 
  Tag, 
  MessageSquare, 
  Home, 
  Bed, 
  Bath, 
  Layers, 
  Wrench, 
  Truck, 
  ArrowRight, 
  FileText, 
  Download, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  TreePine, 
  Sparkles, 
  Leaf, 
  Settings, 
  Maximize2,
  DollarSign,
  Quote
} from "lucide-react";
import { getPublicBlogBySlug, getPublicBlogs } from "@/lib/publicData";
import { resolveVideoEmbedUrl } from "@/lib/videoUtils";
import RichHtmlContent from "@/components/RichHtmlContent";
import BlogTableOfContents from "@/components/BlogTableOfContents";
import ArticleReadingBar from "@/components/ArticleReadingBar";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import { formatEditorialTitle, extractArticleSpecs, cleanBlogHtml } from "@/utils/text";

export const dynamic = "force-dynamic";

interface BlogArticlePageProps {
  params: Promise<{ blog: string; article: string }>;
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { blog, article: articleSlug } = await params;
  if (!articleSlug || articleSlug === "undefined" || articleSlug === "null") {
    return { title: "Article Not Found | ModularHome.com" };
  }

  const article = await getPublicBlogBySlug(articleSlug);
  if (!article) {
    return { title: "Article Not Found | ModularHome.com" };
  }

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const cleanTitle = formatEditorialTitle(article.title);
  const title = article.seoTitle || `${cleanTitle} | ModularHome.com`;
  const description =
    article.metaDescription ||
    article.excerpt ||
    `Read complete architectural guide on ${cleanTitle} by ModularHome.com.`;

  const canonicalCategory = (article.category || blog || "modular-construction")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const canonical = getCanonicalUrl(`/blogs/${canonicalCategory}/${article.slug}`);

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
      images: [{ url: article.image || "/newmodularlogo.png", alt: cleanTitle }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.image || "/newmodularlogo.png"],
    },
  };
}

function getHeroBackground(category?: string, title?: string): string {
  const text = `${category || ""} ${title || ""}`.toLowerCase();
  if (text.includes("cabin") || text.includes("lodge") || text.includes("timber") || text.includes("gatlinburg") || text.includes("appalachian") || text.includes("mountain") || text.includes("amish")) {
    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90";
  }
  if (text.includes("barndo") || text.includes("barndominium") || text.includes("farmhouse") || text.includes("ranch")) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=90";
  }
  if (text.includes("tiny") || text.includes("adu") || text.includes("pod") || text.includes("backyard")) {
    return "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=90";
  }
  return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=90";
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { blog, article: articleSlug } = await params;
  if (!articleSlug || articleSlug === "undefined" || articleSlug === "null") {
    notFound();
  }

  const article = await getPublicBlogBySlug(articleSlug);

  if (!article) {
    notFound();
  }

  const allArticles = await getPublicBlogs();
  const relatedArticles = allArticles
    .filter((a: any) => a.slug !== article.slug && a.id !== article.id)
    .slice(0, 4);

  // Extract raw body content string
  const rawBodyContent = Array.isArray(article.content)
    ? article.content.join("\n")
    : (article.content || "");

  // Resolve embedded video URL from article field or inside content
  let videoEmbed = article.embeddedVideoUrl
    ? resolveVideoEmbedUrl({ embedUrl: article.embeddedVideoUrl, videoUrl: article.embeddedVideoUrl })
    : null;

  if (!videoEmbed) {
    const iframeMatch = rawBodyContent.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (iframeMatch) {
      videoEmbed = iframeMatch[1];
    }
  }

  // Format clean editorial title and extract specs
  const displayTitle = formatEditorialTitle(article.title);
  const extractedSpecs = extractArticleSpecs(article.title, rawBodyContent);

  const hasLoftVal = article.hasLoft !== undefined
    ? (typeof article.hasLoft === "string" ? article.hasLoft.toLowerCase().includes("true") || article.hasLoft.toLowerCase().includes("loft") : Boolean(article.hasLoft))
    : extractedSpecs.hasLoft;

  const specs = {
    sqft: article.sqft || extractedSpecs.sqft,
    bedrooms: article.bedrooms || extractedSpecs.bedrooms,
    bathrooms: article.bathrooms || extractedSpecs.bathrooms,
    hasLoft: hasLoftVal,
    stories: article.stories || (hasLoftVal ? "1 + Loft" : "1 Story"),
    buildingType: article.buildingStyle || extractedSpecs.buildingType || "Modular / Prefab",
    buildType: article.buildType || "Modular / Prefab",
    price: article.price || article.startingPrice || extractedSpecs.price || "$265,000",
    qualityBadge: article.qualityBadge || "Amish-Built Quality",
  };

  // Clean HTML body (strip duplicated first iframe if we render dedicated theater player)
  const cleanedHtml = cleanBlogHtml(rawBodyContent, Boolean(videoEmbed));

  const canonicalCategory = (article.category || blog || "modular-construction")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const canonical = getCanonicalUrl(`/blogs/${canonicalCategory}/${article.slug}`);

  const formattedBlogName = (article.category || blog).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const heroImage = article.heroBackground || article.image || getHeroBackground(article.category || blog, article.title);

  const pullQuoteText = article.pullQuote || "A spacious, stylish, and affordable modular cabin — perfect for your forever home, vacation retreat, or rental property.";
  const pullQuoteAttribution = article.pullQuoteAuthor || "ModularHome.com Architectural Review";

  // Default Key Features list adapted to model specs, or customFeatures if provided
  const keyFeaturesList = article.customFeatures && article.customFeatures.length > 0
    ? article.customFeatures.map((f, idx) => {
        const icons = [Home, Bed, Bath, Layers, Leaf, Settings, TreePine, Zap];
        return {
          icon: icons[idx % icons.length] || Sparkles,
          title: f.title,
          desc: f.desc,
        };
      })
    : [
        {
          icon: Home,
          title: specs.sqft || "1,750 Sq Ft",
          desc: "Spacious layout with open-concept design and high volume ceilings.",
        },
        {
          icon: Bed,
          title: specs.bedrooms || "3 Bed",
          desc: "Comfortable bedrooms designed for family living, guests, or home office.",
        },
        {
          icon: Bath,
          title: specs.bathrooms || "2 Bath",
          desc: "Modern and functional bathrooms with premium pre-installed fixtures.",
        },
        {
          icon: Layers,
          title: specs.hasLoft ? "Loft Included" : "Expansive Living Area",
          desc: "Extra elevated living space for guests, home office, or entertainment lounge.",
        },
        {
          icon: Leaf,
          title: specs.qualityBadge || "Amish Built Quality",
          desc: "Crafted with premium structural materials and superior precision workmanship.",
        },
        {
          icon: Settings,
          title: specs.buildType || "Modular & Prefab Built",
          desc: "Built indoors in climate control for 50% faster build times and cost efficiency.",
        },
        {
          icon: TreePine,
          title: "Rustic Modern Design",
          desc: "Timeless architectural aesthetic with expansive floor-to-ceiling windows.",
        },
        {
          icon: Zap,
          title: "Energy Efficient",
          desc: "Engineered thermal envelope built for year-round comfort and lower utility bills.",
        },
      ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#101114]">
      {/* Scroll Reading Progress Bar */}
      <ArticleReadingBar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Full-Width Cinematic Background Image with Gradient)     */}
      {/* ========================================================================= */}
      <section className="relative min-h-[460px] lg:min-h-[520px] flex items-center bg-[#0c0d10] text-white overflow-hidden py-10 lg:py-16 border-b border-[#1c1f26]">
        {/* Full-bleed article background image */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src={heroImage}
            alt={displayTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-right"
          />
          {/* Subtle gradient overlay to keep text ultra-readable while keeping image crisp and visible */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c0d10] via-[#0c0d10]/85 to-black/25 lg:to-transparent" />
          <div className="absolute inset-0 bg-black/40 lg:bg-transparent" />
        </div>
        
        <div className="wrap relative z-10 w-full">
          {/* Breadcrumb Navigation inside Hero */}
          <nav className="flex items-center gap-2 text-xs text-[#9ca3af] mb-5 sm:mb-6 overflow-hidden truncate">
            <Link href="/" className="hover:text-white transition-colors shrink-0">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/blogs" className="hover:text-white transition-colors shrink-0">
              Blogs
            </Link>
            <span>&gt;</span>
            <Link href={`/blogs/${canonicalCategory}`} className="hover:text-[#fcb907] transition-colors shrink-0 text-[#d1d5db]">
              {formattedBlogName}
            </Link>
            <span>&gt;</span>
            <span className="text-[#9ca3af] truncate">
              {displayTitle}
            </span>
          </nav>

          {/* Left Content Column */}
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            {/* Gold Category Pill */}
            <div>
              <span className="inline-block bg-[#fcb907] text-[#101114] text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-[4px] shadow-md">
                {formattedBlogName}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.18] tracking-tight font-display drop-shadow-md">
              {displayTitle}
            </h1>

            {/* Subtitle / Excerpt */}
            {article.excerpt && (
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#e5e7eb] leading-relaxed max-w-2xl drop-shadow-sm">
                {article.excerpt}
              </p>
            )}

            {/* Meta Bar with 4 Icons */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-white/20 text-xs text-[#d1d5db] max-w-xl">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#fcb907] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">{article.date}</div>
                  <div className="text-[10px] text-[#9ca3af]">Updated</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#fcb907] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">{article.readTime || "8 min read"}</div>
                  <div className="text-[10px] text-[#9ca3af]">Reading Time</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#fcb907] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">{formattedBlogName}</div>
                  <div className="text-[10px] text-[#9ca3af]">Category</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#fcb907] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">0</div>
                  <div className="text-[10px] text-[#9ca3af]">Comments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HORIZONTAL QUICK SPEC RIBBON BAR                                       */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-[#e7e9ee] py-3.5 shadow-xs sticky top-0 z-30">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Quick Specs Icons */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-[#374151]">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#d97706]" />
                <div>
                  <span className="font-extrabold text-[#101114]">{specs.sqft || "1,856"}</span>
                  <span className="text-[11px] text-[#6b7280] ml-1">Sq Ft</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#d97706]" />
                <div>
                  <span className="font-extrabold text-[#101114]">{specs.bedrooms?.replace(/bed/i, "").trim() || "3"}</span>
                  <span className="text-[11px] text-[#6b7280] ml-1">Bedrooms</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-[#d97706]" />
                <div>
                  <span className="font-extrabold text-[#101114]">{specs.bathrooms?.replace(/bath/i, "").trim() || "2"}</span>
                  <span className="text-[11px] text-[#6b7280] ml-1">Bathrooms</span>
                </div>
              </div>

              <div className="flex items-center gap-2 hidden md:flex">
                <Layers className="w-4 h-4 text-[#d97706]" />
                <div>
                  <span className="font-extrabold text-[#101114]">Loft</span>
                  <span className="text-[11px] text-[#6b7280] ml-1">{specs.hasLoft ? "Included" : "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 hidden lg:flex">
                <Wrench className="w-4 h-4 text-[#d97706]" />
                <div>
                  <span className="font-extrabold text-[#101114]">{specs.qualityBadge || "Amish Built"}</span>
                  <span className="text-[11px] text-[#6b7280] ml-1">Quality</span>
                </div>
              </div>

              <div className="flex items-center gap-2 hidden xl:flex">
                <Truck className="w-4 h-4 text-[#d97706]" />
                <div>
                  <span className="font-extrabold text-[#101114]">{specs.buildType || "Modular & Prefab"}</span>
                  <span className="text-[11px] text-[#6b7280] ml-1">Built</span>
                </div>
              </div>
            </div>

            {/* Right Quote CTA Button */}
            <Link
              href="/quote"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-[10px] transition-all flex items-center gap-1.5 shadow-xs ml-auto shrink-0"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN 2-COLUMN EDITORIAL CONTENT (Left 8 cols, Right Sidebar 4 cols)    */}
      {/* ========================================================================= */}
      <div className="wrap pt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: Main Article Body                                        */}
          {/* ===================================================================== */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Table of Contents Box */}
            <BlogTableOfContents />

            {/* Section 1: Introduction */}
            <section id="introduction" className="space-y-4">
              <div className="border-l-4 border-[#fcb907] pl-3">
                <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
                  Introduction
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                The {displayTitle} is one of the most popular designs for families, vacation rentals, and full-time living. With {specs.bedrooms || "3 Bed"}, {specs.bathrooms || "2 Bath"}, and {specs.hasLoft ? "a spacious loft" : "an expansive floor plan"}, this {specs.sqft || "1,750 Sq Ft"} modular cabin offers the perfect combination of rustic elegance and modern functionality.
              </p>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                Amish-built with high-quality materials and expert craftsmanship, the {displayTitle} delivers timeless design, energy efficiency, and a comfortable open-concept layout — all at an incredible starting price of <strong className="text-[#101114]">only {specs.price || "$265,000"}</strong>.
              </p>
            </section>

            {/* Section: Video Walkthrough */}
            {videoEmbed && (
              <section id="video-tour" className="relative aspect-video w-full rounded-[18px] overflow-hidden bg-black shadow-lg border border-[#e7e9ee] my-6">
                <iframe
                  src={videoEmbed}
                  title={displayTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </section>
            )}

            {/* Editorial Pull Quote Box */}
            <div className="p-6 bg-[#fdfbf7] rounded-[18px] border border-[#fef3c7] relative overflow-hidden my-6">
              <Quote className="w-10 h-10 text-[#fcb907]/20 absolute -right-1 -bottom-1 pointer-events-none" />
              <p className="text-sm sm:text-base font-bold text-[#101114] italic leading-relaxed">
                &ldquo;{pullQuoteText}&rdquo;
              </p>
              <div className="text-xs font-bold text-[#d97706] mt-2">
                — {pullQuoteAttribution}
              </div>
            </div>

            {/* Section 2: Key Features Grid */}
            <section id="key-features" className="space-y-4 pt-2">
              <div className="border-l-4 border-[#fcb907] pl-3">
                <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
                  Key Features
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {keyFeaturesList.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-[14px] border border-[#e7e9ee] shadow-2xs flex items-start gap-3.5 hover:border-[#fcb907] transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0 shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-xs sm:text-sm font-black text-[#101114]">
                          {feature.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#6b7280] leading-snug">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Rich Article Content */}
            <section id="floor-plan-specs" className="space-y-6 pt-4">
              <RichHtmlContent content={cleanedHtml} />
            </section>

            {/* In-Article Blueprint & Estimate Card */}
            <section id="pricing-customization" className="p-6 sm:p-8 bg-gradient-to-br from-[#101114] to-[#1c1f26] text-white rounded-[20px] shadow-xl space-y-4 border border-[#fcb907]/30">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#fcb907]">
                <ShieldCheck className="w-4 h-4" />
                <span>Precision Factory Engineering &amp; Nationwide Delivery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                Ready to Price or Customize This Plan?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                Get an instant estimate for this exact model or customize room dimensions, finish tiers, and foundation schematics with our licensed engineering team.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/quote"
                  className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3 px-5 rounded-[10px] transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Request Custom Build Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/floor-plans"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-[10px] transition-all"
                >
                  Browse Similar Floor Plans
                </Link>
              </div>
            </section>

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-[#e7e9ee] flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#6b7280] flex items-center gap-1 mr-2">
                  <Tag className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Tags:</span>
                </span>
                {article.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white hover:bg-[#e7e9ee] border border-[#e7e9ee] text-[#101114] text-xs font-semibold rounded-full transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </main>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: Sidebar                                                 */}
          {/* ===================================================================== */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Card 1: Get a Personalized Quote */}
            <div className="bg-white border border-[#e7e9ee] rounded-[20px] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#101114] leading-tight">
                    Get a Personalized Quote
                  </h3>
                  <p className="text-[11px] text-[#6b7280] mt-0.5">
                    Fast turnkey estimates
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Interested in the {displayTitle} or a custom design? Our team can help you plan and price your build.
              </p>
              <div className="space-y-2 pt-1">
                <Link
                  href="/quote"
                  className="w-full py-3 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-[10px] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/floor-plans"
                  className="w-full py-2.5 bg-white hover:bg-gray-50 text-[#101114] border border-[#e7e9ee] text-xs font-bold rounded-[10px] transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#6b7280]" />
                  <span>Download Brochure</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Key Specs Table */}
            <div className="bg-white border border-[#e7e9ee] rounded-[20px] p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-[#101114] uppercase tracking-wider border-b border-[#f1f3f7] pb-2.5">
                Key Specs
              </h3>
              <div className="divide-y divide-[#f1f3f7] text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-[#6b7280]">Square Footage</span>
                  <span className="font-bold text-[#101114]">{specs.sqft || "1,856 sq ft"}</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-[#6b7280]">Bedrooms</span>
                  <span className="font-bold text-[#101114]">{specs.bedrooms?.replace(/bed/i, "").trim() || "3"}</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-[#6b7280]">Bathrooms</span>
                  <span className="font-bold text-[#101114]">{specs.bathrooms?.replace(/bath/i, "").trim() || "2"}</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-[#6b7280]">Stories</span>
                  <span className="font-bold text-[#101114]">{specs.hasLoft ? "1 + Loft" : "1 Story"}</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-[#6b7280]">Style</span>
                  <span className="font-bold text-[#101114]">{specs.buildingType || "Cabin / Lodge"}</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-[#6b7280]">Build Type</span>
                  <span className="font-bold text-[#101114]">Modular / Prefab</span>
                </div>
                <div className="py-2.5 flex items-center justify-between font-black text-sm">
                  <span className="text-[#101114]">Starting Price</span>
                  <span className="text-[#d97706] text-base">{specs.price || "$285,000"}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white border border-[#e7e9ee] rounded-[20px] p-6 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#f1f3f7] pb-2.5">
                  <h3 className="text-sm font-black text-[#101114] uppercase tracking-wider">
                    Related Articles
                  </h3>
                  <Link href="/blogs" className="text-[11px] font-bold text-[#d97706] hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {relatedArticles.map((rel: any) => {
                    const relCat = (
                      rel.category_slug ||
                      (rel.category || "modular-construction").toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    ).replace(/^blogs-/, "");
                    const relTitle = formatEditorialTitle(rel.title);

                    return (
                      <Link
                        key={rel.id || rel.slug}
                        href={`/blogs/${relCat}/${rel.slug}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f8f9fa] transition-all group"
                      >
                        <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-[#e7e9ee]">
                          <Image
                            src={rel.image || "/newmodularlogo.png"}
                            alt={relTitle}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-[#101114] group-hover:text-[#d97706] transition-colors leading-snug line-clamp-2">
                            {relTitle}
                          </h4>
                          <div className="text-[10px] text-[#6b7280] mt-0.5">
                            {rel.date} • {rel.readTime || "5 min read"}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#d97706] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card 4: Planning Your Dream Cabin? */}
            <div className="bg-[#101114] text-white p-6 sm:p-7 rounded-[22px] shadow-xl space-y-4 border border-white/10 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 text-[#fcb907] flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-snug">
                  Planning Your Dream Cabin?
                </h3>
                <p className="text-xs text-white/75 mt-1.5 leading-relaxed">
                  Get expert guidance, customization options, and a detailed quote from our team.
                </p>
              </div>
              <Link
                href="/contact"
                className="w-full py-3 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-[10px] transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Speak with Our Experts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
