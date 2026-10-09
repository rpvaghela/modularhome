import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Tag, 
  Sparkles, 
  Building2, 
  Home, 
  Bed, 
  Bath, 
  Maximize2, 
  DollarSign, 
  ShieldCheck, 
  Play, 
  Share2, 
  Compass, 
  Phone, 
  FileText,
  UserCheck,
  Quote,
  Layers,
  Printer,
  Bookmark,
  Check
} from "lucide-react";
import { getPublicBlogBySlug, getPublicBlogs } from "@/lib/publicData";
import { resolveVideoEmbedUrl } from "@/lib/videoUtils";
import RichHtmlContent from "@/components/RichHtmlContent";
import ShareButton from "@/components/ShareButton";
import ArticleReadingBar from "@/components/ArticleReadingBar";
import ArticleTableOfContents from "@/components/ArticleTableOfContents";
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
    .slice(0, 3);

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
  const specs = extractArticleSpecs(article.title, rawBodyContent);

  // Clean HTML body (strip duplicated first iframe if we render dedicated theater player)
  const cleanedHtml = cleanBlogHtml(rawBodyContent, Boolean(videoEmbed));

  const canonicalCategory = (article.category || blog || "modular-construction")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const canonical = getCanonicalUrl(`/blogs/${canonicalCategory}/${article.slug}`);

  // Schema.org Article + Breadcrumb JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: displayTitle,
      description: article.metaDescription || article.excerpt,
      image: [article.image || "https://modularhome.com/newmodularlogo.png"],
      datePublished: article.published_at || article.date,
      dateModified: article.published_at || article.date,
      author: {
        "@type": "Person",
        name: article.author || "ModularHome Engineering Team",
      },
      publisher: {
        "@type": "Organization",
        name: "ModularHome.com",
        logo: {
          "@type": "ImageObject",
          url: "https://modularhome.com/newmodularlogo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://modularhome.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: "https://modularhome.com/blogs",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.category || blog,
          item: `https://modularhome.com/blogs/${canonicalCategory}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: displayTitle,
          item: canonical,
        },
      ],
    },
  ];

  const formattedBlogName = (article.category || blog).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const hasKeySpecs = Boolean(specs.price || specs.bedrooms || specs.bathrooms || specs.sqft || specs.buildingType);

  const tocItems = [
    { id: "overview", text: "1. Architectural Overview" },
    ...(hasKeySpecs ? [{ id: "specs", text: "2. Floor Plan Specifications" }] : []),
    ...(videoEmbed ? [{ id: "video-tour", text: "3. Factory Video Walkthrough" }] : []),
    { id: "interior-details", text: "4. Interior Design & Features" },
    { id: "pricing-quote", text: "5. Pricing, Permits & Customization" },
  ];

  return (
    <div className="min-h-screen bg-white pt-2 pb-24 text-[#101114]">
      {/* Scroll Reading Progress Bar */}
      <ArticleReadingBar />

      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap max-w-6xl">
        {/* Top Breadcrumb Navigation */}
        <div className="py-2.5 text-xs text-[#6b7280] flex items-center justify-between border-b border-[#e7e9ee] mb-6 gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Link href="/" className="hover:text-[#101114] transition-colors shrink-0">
              Home
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-[#101114] transition-colors shrink-0">
              Blogs
            </Link>
            <span>/</span>
            <Link href={`/blogs/${canonicalCategory}`} className="hover:text-[#101114] transition-colors shrink-0 text-[#d97706] font-bold">
              {formattedBlogName}
            </Link>
            <span>/</span>
            <span className="text-[#8c94a0] truncate font-medium">
              {displayTitle}
            </span>
          </div>

          <ShareButton
            variant="badge"
            label="Share Article"
            item={{
              title: displayTitle,
              url: canonical,
              description: article.excerpt,
              image: article.image,
              category: formattedBlogName,
            }}
            buttonTitle={`Share ${displayTitle}`}
          />
        </div>

        {/* Magazine Editorial Header Section */}
        <header className="space-y-4 max-w-4xl mb-8">
          {/* Category Kicker */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.15em] bg-[#fcb907] text-[#101114] rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 text-[#101114]" />
              <span>{formattedBlogName}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] bg-[#f8f9fa] border border-[#e7e9ee] px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#d97706]" />
              <span>{article.readTime || "4 min read"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] bg-[#f8f9fa] border border-[#e7e9ee] px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-[#d97706]" />
              <span>{article.date}</span>
            </span>
          </div>

          {/* Clean Magazine Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-[-1.5px] text-[#101114] leading-[1.12] font-display">
            {displayTitle}
          </h1>

          {/* Editorial Deck / Standfirst Subtitle */}
          {article.excerpt && (
            <p className="text-base sm:text-lg md:text-xl text-[#4b5563] leading-relaxed font-normal pt-1 border-l-3 border-[#fcb907] pl-4 italic bg-[#fffdfa] py-2 rounded-r-xl">
              &ldquo;{article.excerpt}&rdquo;
            </p>
          )}

          {/* Author Byline Bar & Action Tools */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 pb-3 border-b border-[#e7e9ee]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#101114] text-[#fcb907] font-black text-sm flex items-center justify-center shadow-sm shrink-0 ring-2 ring-[#fcb907]/30">
                {article.author ? article.author[0].toUpperCase() : "M"}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#101114]">
                  <span>By {article.author || "ModularHome Engineering Team"}</span>
                  <span title="Verified Author" className="inline-flex">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                  </span>
                </div>
                <div className="text-[11px] text-[#6b7280]">
                  Architectural Contributor &amp; Modular Housing Specialist
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/quote"
                className="text-xs font-black uppercase tracking-wider bg-[#101114] text-white hover:bg-[#fcb907] hover:text-[#101114] px-4 py-2 rounded-[10px] transition-colors shadow-xs"
              >
                Price This Model
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Architectural Image with Caption */}
        {article.image && (
          <div className="mb-10 space-y-2.5">
            <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full rounded-[22px] overflow-hidden bg-gray-100 shadow-md border border-[#e7e9ee] group">
              <Image
                src={article.image}
                alt={displayTitle}
                fill
                priority
                sizes="100vw"
                className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="bg-[#101114]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold border border-white/20">
                  {specs.buildingType || "Featured Architectural Tour"}
                </span>
                {specs.price && (
                  <span className="bg-[#fcb907] text-[#101114] px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                    Starting at {specs.price}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6b7280] px-1 italic">
              <span>Figure 1: Architectural elevation and layout preview of {displayTitle}.</span>
              <span className="text-[#9ca3af]">Photo courtesy of ModularHome.com Manufacturing</span>
            </div>
          </div>
        )}

        {/* Quick Model Specs Pullout Bar (If parsed from article data) */}
        {hasKeySpecs && (
          <div id="specs" className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12 p-4 sm:p-5 bg-[#f8f9fa] border border-[#e7e9ee] rounded-[20px] shadow-xs">
            {specs.price && (
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-[14px] border border-[#e7e9ee] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Est. Base Price</div>
                  <div className="text-sm sm:text-base font-black text-[#101114]">{specs.price}</div>
                </div>
              </div>
            )}

            {specs.bedrooms && (
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-[14px] border border-[#e7e9ee] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Bedrooms</div>
                  <div className="text-sm sm:text-base font-black text-[#101114]">
                    {specs.bedrooms} {specs.hasLoft ? "+ Loft" : ""}
                  </div>
                </div>
              </div>
            )}

            {specs.bathrooms && (
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-[14px] border border-[#e7e9ee] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Bathrooms</div>
                  <div className="text-sm sm:text-base font-black text-[#101114]">{specs.bathrooms}</div>
                </div>
              </div>
            )}

            {specs.sqft && (
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-[14px] border border-[#e7e9ee] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Living Area</div>
                  <div className="text-sm sm:text-base font-black text-[#101114]">{specs.sqft}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2-Column Editorial Grid: Article Content (8 cols) & Sticky Right Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <main className="lg:col-span-8 space-y-10">
            
            {/* Executive Takeaways / Key Notes Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <section id="overview" className="p-6 sm:p-7 bg-[#fdfbf7] border-l-4 border-[#fcb907] border-y border-r border-[#fef3c7] rounded-r-[20px] rounded-l-[4px] shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#101114]">
                  <CheckCircle2 className="w-4 h-4 text-[#d97706]" />
                  <span>Key Architectural Takeaways &amp; Executive Summary</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#374151] leading-relaxed">
                  {article.keyTakeaways.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#d97706] mt-1.5 shrink-0 shadow-xs"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Embedded Video Player (Theater Box) */}
            {videoEmbed && (
              <section id="video-tour" className="space-y-3 p-5 sm:p-6 bg-[#101114] text-white rounded-[22px] shadow-xl border border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center font-bold shadow-sm">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                        Official Factory Tour Walkthrough
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {specs.tourDuration || "High-Definition Video Tour"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#fcb907] px-3 py-1 rounded-full border border-white/10">
                    HD Video
                  </span>
                </div>

                <div className="relative aspect-video w-full rounded-[16px] overflow-hidden bg-black shadow-inner border border-white/10">
                  <iframe
                    src={videoEmbed}
                    title={displayTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </section>
            )}

            {/* Formatted Article Body */}
            <section id="interior-details" className="space-y-6 pt-1">
              <RichHtmlContent content={cleanedHtml} />
            </section>

            {/* Pull Quote Callout Box */}
            <div className="p-6 sm:p-8 bg-[#fffdfa] rounded-[20px] border border-[#fef3c7] relative overflow-hidden my-8">
              <Quote className="w-12 h-12 text-[#fcb907]/25 absolute -right-2 -bottom-2 pointer-events-none" />
              <div className="space-y-2 relative z-10">
                <p className="text-base sm:text-lg font-bold text-[#101114] italic leading-relaxed">
                  &ldquo;Factory-engineered modular construction allows luxury residences like this model to be built indoors with zero weather exposure, strict code compliance, and up to 50% faster build timelines.&rdquo;
                </p>
                <div className="text-xs font-black uppercase tracking-wider text-[#d97706]">
                  — ModularHome Engineering &amp; Design Standards
                </div>
              </div>
            </div>

            {/* Interactive Blueprint & Estimate In-Article Card */}
            <section id="pricing-quote" className="p-6 sm:p-8 bg-gradient-to-br from-[#101114] to-[#1c1f26] text-white rounded-[22px] shadow-xl space-y-4 border border-[#fcb907]/30">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#fcb907]">
                <ShieldCheck className="w-4 h-4" />
                <span>Precision Factory Engineering &amp; Nationwide Delivery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                Love This Floor Plan &amp; Want Itemized Pricing?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                Get an instant estimate for this exact model or customize room dimensions, finish tiers, and foundation schematics with our licensed engineering team. We deliver nationwide with full structural engineering stamps and permit support.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/quote"
                  className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Request Custom Build Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/floor-plans"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all"
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
                  <span>Tagged:</span>
                </span>
                {article.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 bg-[#f4f5f7] hover:bg-[#e7e9ee] text-[#101114] text-xs font-semibold rounded-full transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Profile Footer Box */}
            <div className="p-6 sm:p-7 bg-[#f8f9fa] border border-[#e7e9ee] rounded-[22px] flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-[#101114] text-[#fcb907] font-black text-2xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-[#fcb907]/40">
                {article.author ? article.author[0].toUpperCase() : "M"}
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#d97706] uppercase tracking-wider">
                  Published By
                </div>
                <div className="text-base font-black text-[#101114]">
                  {article.author || "ModularHome Editorial & Engineering Board"}
                </div>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Specializing in precision light-gauge steel framing, turnkey Amish log cabins, modern prefab residences, and residential energy efficiency standards.
                </p>
              </div>
            </div>

            {/* Back to Blog Listing */}
            <div className="pt-2">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#d97706] hover:text-[#b45309] transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to All Modular Home Articles</span>
              </Link>
            </div>
          </main>

          {/* Sticky Right Editorial Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Table of Contents Widget */}
            <ArticleTableOfContents defaultItems={tocItems} />

            {/* Planning Your Build Widget */}
            <div className="bg-[#101114] text-white p-6 sm:p-7 rounded-[22px] shadow-xl space-y-4 border border-white/10">
              <div className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-[#fcb907] text-[#101114] rounded-full shadow-xs">
                Turnkey Prefab Models
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-display text-white">
                Planning Your Build?
              </h3>
              <p className="text-xs text-white/75 leading-relaxed">
                Explore our full catalog of 50+ modular residences, barndominiums, and cabin floor plans with transparent factory pricing.
              </p>
              <div className="space-y-2.5 pt-2">
                <Link
                  href="/buildings"
                  className="w-full py-3.5 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Browse Home Models</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-[12px] transition-all flex items-center justify-center gap-2"
                >
                  <span>View Pricing &amp; Packages</span>
                </Link>
              </div>
            </div>

            {/* Speak With An Engineer */}
            <div className="p-6 bg-[#f8f9fa] border border-[#e7e9ee] rounded-[20px] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#101114]">
                <Phone className="w-4 h-4 text-[#d97706]" />
                <span>Speak With An Engineer</span>
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Have specific questions about zoning, foundation types, snow loads, or crane delivery for your building site?
              </p>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="w-full py-2.5 bg-white hover:bg-gray-50 text-[#101114] border border-[#e7e9ee] text-xs font-bold rounded-[10px] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Request Free Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d97706]" />
                </Link>
              </div>
            </div>

            {/* Explore Popular Categories */}
            <div className="p-6 bg-white border border-[#e7e9ee] rounded-[20px] space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#101114]">
                Architectural Categories
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Modular Homes", href: "/modular-homes" },
                  { name: "Cabins", href: "/cabins" },
                  { name: "Barndominiums", href: "/barndominiums" },
                  { name: "Tiny Homes", href: "/tiny-homes" },
                  { name: "ADUs", href: "/adus" },
                  { name: "House Kits", href: "/house-kits" },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="text-[11px] font-semibold px-3 py-1.5 bg-[#f8f9fa] hover:bg-[#fcb907]/20 border border-[#e7e9ee] rounded-lg text-[#374151] hover:text-[#101114] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Curated Related Architectural Guides Grid */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#e7e9ee]">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#101114] font-display m-0">
                  Related Architectural Guides &amp; Tours
                </h3>
                <p className="text-xs sm:text-sm text-[#6b7280] mt-1 m-0">
                  Continue exploring our comprehensive library of modular home guides.
                </p>
              </div>
              <Link
                href="/blogs"
                className="text-xs font-bold uppercase tracking-wider text-[#d97706] hover:underline"
              >
                Browse All Guides →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((rel: any) => {
                const relCat = (
                  rel.category_slug ||
                  (rel.category || "modular-construction").toLowerCase().replace(/[^a-z0-9]+/g, "-")
                ).replace(/^blogs-/, "");

                const relCleanTitle = formatEditorialTitle(rel.title);

                return (
                  <Link
                    key={rel.id || rel.slug}
                    href={`/blogs/${relCat}/${rel.slug}`}
                    className="card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between bg-white rounded-[18px] border border-[#e7e9ee] shadow-2xs hover:shadow-md"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                        <Image
                          src={rel.image || "/newmodularlogo.png"}
                          alt={relCleanTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#fcb907] text-[#101114] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
                          {rel.category || "Guide"}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-[#6b7280]">
                          <Clock className="w-3 h-3 text-[#d97706]" />
                          <span>{rel.readTime || "4 min read"}</span>
                        </div>

                        <h4 className="text-sm font-black text-[#101114] group-hover:text-[#d97706] transition-colors leading-snug line-clamp-2 font-display">
                          {relCleanTitle}
                        </h4>

                        <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed font-body">
                          {rel.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <span className="text-xs font-bold text-[#d97706] inline-flex items-center gap-1 group-hover:underline">
                        <span>Read Architectural Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
