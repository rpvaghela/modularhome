"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Home, 
  Calendar, 
  Clock, 
  Share2, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Sparkles,
  Layers,
  PhoneCall,
  Building,
  ImageIcon,
  Star
} from "lucide-react";
import { CmsPage, PageSection } from "@/lib/publicData";
import TrustBar from "@/components/TrustBar";
import CategoryGrid from "@/components/CategoryGrid";
import HowItWorks from "@/components/HowItWorks";
import FinancingSection from "@/components/FinancingSection";
import HomeVideosSection from "@/components/HomeVideosSection";
import HomeTestimonialsSection from "@/components/HomeTestimonialsSection";
import CTASection from "@/components/CTASection";

interface DynamicPageRendererProps {
  page: CmsPage;
}

interface ParsedContent {
  text: string;
  image?: string;
  imageAlt?: string;
  gallery?: string[];
  galleryImages?: Array<{ url: string; alt?: string; caption?: string }>;
  items?: any[];
  cards?: Array<{ title: string; description: string; image?: string; link?: string; alt?: string }>;
  steps?: Array<{ stepNumber: number | string; title: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  testimonials?: Array<{ name: string; location: string; rating: number; text: string; image?: string }>;
  videoUrl?: string;
  videoTitle?: string;
  category?: string;
  ctaLabel?: string;
  ctaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
}

function parseContentData(rawContent?: string): ParsedContent {
  if (!rawContent || !rawContent.trim()) {
    return { text: "" };
  }
  const trimmed = rawContent.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string") {
        return { text: parsed };
      }
      if (Array.isArray(parsed)) {
        return { text: "", items: parsed, cards: parsed };
      }
      return {
        text: parsed.rawText || parsed.text || parsed.content || parsed.description || parsed.html || "",
        image: parsed.image || parsed.imageUrl || parsed.featuredImage || parsed.src || undefined,
        imageAlt: parsed.imageAlt || parsed.alt || undefined,
        gallery: Array.isArray(parsed.gallery) ? parsed.gallery : (Array.isArray(parsed.images) ? parsed.images : undefined),
        galleryImages: Array.isArray(parsed.galleryImages) ? parsed.galleryImages : undefined,
        items: Array.isArray(parsed.items) ? parsed.items : undefined,
        cards: Array.isArray(parsed.cards) ? parsed.cards : undefined,
        steps: Array.isArray(parsed.steps) ? parsed.steps : undefined,
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : undefined,
        testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : undefined,
        videoUrl: parsed.videoUrl || parsed.youtube || parsed.src || undefined,
        videoTitle: parsed.videoTitle || parsed.title || undefined,
        category: parsed.category || undefined,
        ctaLabel: parsed.ctaLabel || parsed.buttonText || undefined,
        ctaLink: parsed.ctaLink || parsed.buttonLink || parsed.href || undefined,
        secondaryCtaLabel: parsed.secondaryCtaLabel || parsed.secondaryButtonText || undefined,
        secondaryCtaLink: parsed.secondaryCtaLink || parsed.secondaryButtonLink || undefined,
      };
    } catch {
      return { text: rawContent };
    }
  }
  return { text: rawContent };
}

// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube-nocookie.com/embed/${match[2]}` : url;
}

export default function DynamicPageRenderer({ page }: DynamicPageRendererProps) {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const sections = (page.sections || []).filter((s) => s.isVisible !== false);

  // Parse FAQ content helper
  const parseFaqItems = (contentStr?: string, parsedFaqs?: Array<{ question: string; answer: string }>): { q: string; a: string }[] => {
    if (parsedFaqs && parsedFaqs.length > 0) {
      return parsedFaqs.map((f) => ({ q: f.question, a: f.answer }));
    }
    if (!contentStr) return [];
    try {
      const parsed = JSON.parse(contentStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          q: String(item.q || item.question || item.title || ""),
          a: String(item.a || item.answer || item.content || ""),
        }));
      }
      if (parsed.faqs && Array.isArray(parsed.faqs)) {
        return parsed.faqs.map((item: any) => ({
          q: String(item.q || item.question || item.title || ""),
          a: String(item.a || item.answer || item.content || ""),
        }));
      }
      if (parsed.items && Array.isArray(parsed.items)) {
        return parsed.items.map((item: any) => ({
          q: String(item.q || item.question || item.title || ""),
          a: String(item.a || item.answer || item.content || ""),
        }));
      }
    } catch {
      // Fallback: parse markdown/text with Q: and A:
      const lines = contentStr.split("\n").filter((l) => l.trim());
      const items: { q: string; a: string }[] = [];
      let currentQ = "";
      let currentA = "";

      for (const line of lines) {
        if (line.startsWith("Q:") || line.startsWith("###") || line.startsWith("**Q")) {
          if (currentQ) {
            items.push({ q: currentQ, a: currentA.trim() });
            currentA = "";
          }
          currentQ = line.replace(/^(Q:|###|\*\*Q:?\*\*?)\s*/i, "").trim();
        } else if (line.startsWith("A:") || line.startsWith("**A")) {
          currentA += line.replace(/^(A:|\*\*A:?\*\*?)\s*/i, "").trim() + " ";
        } else {
          currentA += line + " ";
        }
      }
      if (currentQ) {
        items.push({ q: currentQ, a: currentA.trim() });
      }
      if (items.length > 0) return items;
    }

    return [
      {
        q: "What makes ModularHome.com steel structures superior?",
        a: "Our structures are built with cold-formed galvanized steel framing engineered for hurricane resistance (up to 150 MPH) and extreme longevity with a 50-year structural frame guarantee."
      },
      {
        q: "How long does the entire modular home process take?",
        a: "Factory assembly typically takes 4-8 weeks, followed by on-site delivery and crane installation on your foundation within 1-3 days."
      },
      {
        q: "Do you offer nationwide delivery across the United States?",
        a: "Yes! We coordinate regional transportation, permitting, and certified crane set services nationwide."
      }
    ];
  };

  // Render individual modular section block
  const renderSectionBlock = (section: PageSection, index: number) => {
    const data = parseContentData(section.content);

    switch (section.type) {
      case "HERO": {
        const bgImg = data.image || page.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1900&q=85";
        const primaryLabel = data.ctaLabel || "Get a Quote →";
        const primaryLink = data.ctaLink || "/quote";
        const secondaryLabel = data.secondaryCtaLabel || "Explore Models";
        const secondaryLink = data.secondaryCtaLink || "/buildings";

        return (
          <section
            key={section.id || index}
            className="relative min-h-[440px] sm:min-h-[500px] text-white flex items-center bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.2) 100%), url('${bgImg}')`,
            }}
          >
            <div className="wrap py-16 sm:py-20 relative z-10 w-full">
              <div className="max-w-2xl text-left space-y-4">
                {section.subtitle && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fcb907]/20 border border-[#fcb907]/40 text-[#fcb907] text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{section.subtitle}</span>
                  </div>
                )}
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  {section.title || page.title}
                </h2>
                {data.text && (
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                    {data.text}
                  </p>
                )}
                <div className="pt-3 flex flex-wrap gap-3">
                  <Link
                    href={primaryLink}
                    className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] py-3 px-6 text-sm font-black rounded-xl shadow-lg transition-all hover:shadow-xl"
                  >
                    {primaryLabel}
                  </Link>
                  {secondaryLabel && (
                    <Link
                      href={secondaryLink}
                      className="bg-white/95 hover:bg-white text-[#101114] py-3 px-6 text-sm font-extrabold rounded-xl transition-all"
                    >
                      {secondaryLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      }

      case "TRUST": {
        const hasCustomCards = data.cards && data.cards.length > 0;
        return (
          <div key={section.id || index} className="my-10">
            {section.title && (
              <div className="wrap text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-[#101114]">{section.title}</h3>
                {section.subtitle && <p className="text-xs sm:text-sm text-[#6b7280] mt-1">{section.subtitle}</p>}
              </div>
            )}
            {hasCustomCards ? (
              <div className="wrap">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.cards!.map((card, cIdx) => (
                    <div key={cIdx} className="p-6 rounded-2xl bg-white border border-[#e7e9ee] shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-[#101114]">{card.title}</h4>
                      <p className="text-xs sm:text-sm text-[#6b7280] mt-2 leading-relaxed">{card.description}</p>
                      {card.link && (
                        <Link href={card.link} className="inline-flex items-center gap-1 text-xs font-bold text-[#d97706] hover:underline mt-4">
                          <span>Learn more</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <TrustBar />
            )}
          </div>
        );
      }

      case "COLLECTION_GRID":
        return (
          <div key={section.id || index} className="py-12 bg-[#f8f9fa] border-y border-[#e7e9ee]">
            <div className="wrap">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                  {section.subtitle || "Browse By Architectural Style"}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mt-1">
                  {section.title || "Shop By Home Type"}
                </h2>
              </div>
              <CategoryGrid />
            </div>
          </div>
        );

      case "HOW_IT_WORKS": {
        const hasCustomSteps = data.steps && data.steps.length > 0;
        return (
          <div key={section.id || index}>
            {hasCustomSteps ? (
              <section className="py-16 bg-[#f8f9fa] border-y border-[#e7e9ee]">
                <div className="wrap">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    {section.subtitle && (
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                        {section.subtitle}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mt-1">
                      {section.title || "How It Works"}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.steps!.map((step, sIdx) => (
                      <div key={sIdx} className="bg-white p-6 rounded-2xl border border-[#e7e9ee] shadow-sm relative">
                        <span className="w-9 h-9 rounded-xl bg-[#fcb907] text-[#101114] font-black text-sm flex items-center justify-center mb-4">
                          {step.stepNumber || sIdx + 1}
                        </span>
                        <h3 className="text-base font-bold text-[#101114] mb-2">{step.title}</h3>
                        <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <HowItWorks />
            )}
          </div>
        );
      }

      case "FINANCING": {
        const hasCustomCta = Boolean(data.ctaLabel || data.ctaLink);
        return (
          <div key={section.id || index}>
            <FinancingSection />
            {hasCustomCta && (
              <div className="wrap text-center pb-8">
                <Link
                  href={data.ctaLink || "/quote"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-bold text-xs shadow-md"
                >
                  <span>{data.ctaLabel || "Apply for Financing"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        );
      }

      case "VIDEO": {
        const embedUrl = getYouTubeEmbedUrl(data.videoUrl);
        return (
          <div key={section.id || index}>
            {embedUrl ? (
              <section className="py-16 bg-[#101114] text-white">
                <div className="wrap max-w-4xl space-y-6 text-center">
                  {section.subtitle && (
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fcb907]">
                      {section.subtitle}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                    {section.title || "Featured Building Tour"}
                  </h2>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <iframe
                      src={embedUrl}
                      title={section.title || "Video Showcase"}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {data.ctaLabel && (
                    <div className="pt-2">
                      <Link
                        href={data.ctaLink || "/videos"}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-bold text-xs"
                      >
                        <span>{data.ctaLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <HomeVideosSection />
            )}
          </div>
        );
      }

      case "TESTIMONIALS": {
        const hasCustomTestimonials = data.testimonials && data.testimonials.length > 0;
        return (
          <div key={section.id || index}>
            {hasCustomTestimonials ? (
              <section className="py-16 bg-white border-y border-[#e7e9ee]">
                <div className="wrap">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    {section.subtitle && (
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                        {section.subtitle}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mt-1">
                      {section.title || "Homeowner Reviews"}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.testimonials!.map((t, tIdx) => (
                      <div key={tIdx} className="p-6 rounded-2xl bg-[#f8f9fa] border border-[#e7e9ee] space-y-3">
                        <div className="flex items-center gap-1 text-[#fcb907]">
                          {[...Array(t.rating || 5)].map((_, s) => (
                            <Star key={s} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-[#374151] italic leading-relaxed">
                          &ldquo;{t.text}&rdquo;
                        </p>
                        <div className="pt-2 border-t border-[#e7e9ee]">
                          <div className="font-bold text-xs text-[#101114]">{t.name}</div>
                          {t.location && <div className="text-[11px] text-[#6b7280]">{t.location}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <HomeTestimonialsSection />
            )}
          </div>
        );
      }

      case "GALLERY": {
        const galleryItems = data.galleryImages && data.galleryImages.length > 0
          ? data.galleryImages
          : (data.gallery && data.gallery.length > 0
              ? data.gallery.map((url) => ({ url, alt: section.title || "Gallery image", caption: "" }))
              : (data.image ? [{ url: data.image, alt: section.title || "Gallery image", caption: "" }] : []));

        return (
          <section key={section.id || index} className="py-12 sm:py-16 bg-[#f8f9fa] border-y border-[#e7e9ee]">
            <div className="wrap">
              {section.title && (
                <div className="text-center max-w-2xl mx-auto mb-8">
                  {section.subtitle && (
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                      {section.subtitle}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-black text-[#101114] mt-1">
                    {section.title}
                  </h2>
                </div>
              )}

              {galleryItems.length > 0 ? (
                <div className={`grid gap-4 ${
                  galleryItems.length === 1 
                    ? "max-w-3xl mx-auto" 
                    : galleryItems.length === 2 
                    ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto" 
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                }`}>
                  {galleryItems.map((item, gIdx) => (
                    <div
                      key={gIdx}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#e7e9ee] shadow-sm group bg-gray-100"
                    >
                      <Image
                        src={item.url}
                        alt={item.alt || `${section.title || "Gallery"} ${gIdx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.caption && (
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-medium">
                          {item.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">No images in gallery</div>
              )}

              {data.text && (
                <p className="text-center text-sm text-[#6b7280] mt-6 max-w-2xl mx-auto font-medium">
                  {data.text}
                </p>
              )}
            </div>
          </section>
        );
      }

      case "PRODUCT_GRID": {
        return (
          <section key={section.id || index} className="py-12 sm:py-16 bg-white border-y border-[#e7e9ee]">
            <div className="wrap space-y-8">
              {(section.title || section.subtitle) && (
                <div className="text-center max-w-2xl mx-auto">
                  {section.subtitle && (
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                      {section.subtitle}
                    </span>
                  )}
                  {section.title && (
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101114] mt-1">
                      {section.title}
                    </h2>
                  )}
                </div>
              )}

              {data.image && (
                <div className="relative aspect-[16/9] sm:aspect-[21/9] max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[#e7e9ee] shadow-md bg-gray-50">
                  <Image
                    src={data.image}
                    alt={data.imageAlt || section.title || "Featured Visual"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {data.text && (
                <div
                  className="prose prose-lg max-w-3xl mx-auto text-[#374151] leading-relaxed text-center"
                  dangerouslySetInnerHTML={{ __html: data.text }}
                />
              )}

              <CategoryGrid />
            </div>
          </section>
        );
      }

      case "FAQ": {
        const faqList = parseFaqItems(section.content, data.faqs);
        return (
          <section key={section.id || index} className="py-16 sm:py-20 bg-white border-t border-[#e7e9ee]">
            <div className="wrap max-w-4xl">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                  {section.subtitle || "Got Questions?"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#101114] mt-2">
                  {section.title || "Frequently Asked Questions"}
                </h2>
              </div>

              <div className="space-y-4">
                {faqList.map((item: { q: string; a: string }, fIdx: number) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-[#e7e9ee] rounded-[16px] overflow-hidden bg-[#f8f9fa] transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#101114] cursor-pointer hover:bg-[#f1f3f7] transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <HelpCircle className="w-5 h-5 text-[#fcb907] shrink-0" />
                          <span>{item.q}</span>
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[#6b7280] shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#6b7280] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#4b5563] leading-relaxed border-t border-[#e7e9ee]/60 bg-white">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      case "CTA": {
        const hasCustomCTA = Boolean(section.title || data.ctaLabel);
        return (
          <div key={section.id || index}>
            {hasCustomCTA ? (
              <section className="py-16 bg-[#101114] text-white">
                <div className="wrap max-w-3xl text-center space-y-4">
                  {section.subtitle && (
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fcb907]">
                      {section.subtitle}
                    </span>
                  )}
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {section.title || "Ready to Build Your Modular Home?"}
                  </h2>
                  {data.text && (
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                      {data.text}
                    </p>
                  )}
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <Link
                      href={data.ctaLink || "/quote"}
                      className="px-6 py-3 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-sm shadow-lg"
                    >
                      {data.ctaLabel || "Get Free Quote"}
                    </Link>
                    {data.secondaryCtaLabel && (
                      <Link
                        href={data.secondaryCtaLink || "/buildings"}
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm"
                      >
                        {data.secondaryCtaLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            ) : (
              <CTASection />
            )}
          </div>
        );
      }

      case "RICH_CONTENT":
      default: {
        return (
          <section key={section.id || index} className="py-12 sm:py-16 bg-white">
            <div className="wrap max-w-4xl space-y-6">
              {section.title && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#101114] font-serif">{section.title}</h2>
                  {section.subtitle && <p className="text-sm text-[#6b7280] mt-1 font-medium">{section.subtitle}</p>}
                </div>
              )}

              {/* Render Section Image if provided */}
              {data.image && (
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-[#e7e9ee] shadow-md bg-gray-50">
                  <Image
                    src={data.image}
                    alt={data.imageAlt || section.title || page.title || "Section Media"}
                    fill
                    className="object-cover hover:scale-102 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Render Section Gallery if multiple images */}
              {data.gallery && data.gallery.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {data.gallery.map((imgUrl, gIdx) => (
                    <div key={gIdx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#e7e9ee] shadow-xs">
                      <Image
                        src={imgUrl}
                        alt={`${section.title || "Gallery"} ${gIdx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Render Rich Text Content if present */}
              {data.text && (
                <div
                  className="prose prose-lg max-w-none text-[#374151] leading-relaxed prose-headings:font-black prose-headings:text-[#101114] prose-a:text-[#d97706] prose-a:underline hover:prose-a:text-[#b45309]"
                  dangerouslySetInnerHTML={{ __html: data.text }}
                />
              )}
            </div>
          </section>
        );
      }
    }
  };

  const parsedPageContent = parseContentData(page.content);

  return (
    <div className="min-h-screen bg-white text-[#101114] pt-24 pb-20">
      {/* 1. Header Banner / Hero */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#6b7280] mb-6 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#101114] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span className="text-[#101114] font-bold truncate max-w-xs sm:max-w-md">{page.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#fcb907] animate-pulse"></span>
                <span>ModularHome.com Official Page</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#101114] leading-[1.05] font-serif">
                {page.title}
              </h1>

              {page.subtitle && (
                <p className="text-base sm:text-xl text-[#4b5563] leading-relaxed font-medium">
                  {page.subtitle}
                </p>
              )}

              {/* Meta & Share bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#6b7280]">
                {page.updatedAt && (
                  <span className="flex items-center gap-1.5" suppressHydrationWarning>
                    <Calendar className="w-3.5 h-3.5 text-[#fcb907]" />
                    <span suppressHydrationWarning>
                      Updated {(() => {
                        try {
                          const d = new Date(page.updatedAt);
                          if (isNaN(d.getTime())) return "Recently";
                          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                          return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
                        } catch {
                          return "Recently";
                        }
                      })()}
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#fcb907]" />
                  <span>3 min read</span>
                </span>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d5d9e0] bg-white hover:bg-[#f8f9fa] text-[#101114] font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? "Link Copied!" : "Share Page"}</span>
                </button>
              </div>
            </div>

            {page.featuredImage && (
              <div className="lg:col-span-4">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-[20px] overflow-hidden border border-[#e7e9ee] shadow-lg">
                  <Image
                    src={page.featuredImage}
                    alt={page.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Body Content (Parsed Rich Text/HTML and inline media) */}
      {(parsedPageContent.text || (parsedPageContent.image && parsedPageContent.image !== page.featuredImage)) && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="wrap max-w-4xl space-y-6">
            {parsedPageContent.image && parsedPageContent.image !== page.featuredImage && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#e7e9ee] shadow-md bg-gray-50">
                <Image
                  src={parsedPageContent.image}
                  alt={page.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {parsedPageContent.text && (
              <div
                className="prose prose-lg max-w-none text-[#374151] leading-relaxed prose-headings:font-black prose-headings:text-[#101114] prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:border-b prose-h2:border-[#e7e9ee] prose-h2:pb-3 prose-h2:mt-10 prose-h3:text-xl prose-h3:mt-8 prose-p:text-[#4b5563] prose-p:leading-relaxed prose-li:text-[#4b5563] prose-strong:text-[#101114] prose-a:text-[#d97706] prose-a:underline hover:prose-a:text-[#b45309]"
                dangerouslySetInnerHTML={{ __html: parsedPageContent.text }}
              />
            )}
          </div>
        </section>
      )}

      {/* 3. Modular Sections (configured in admin/sections) */}
      {sections.length > 0 && (
        <div className="space-y-0">
          {sections.map((section, idx) => renderSectionBlock(section, idx))}
        </div>
      )}

      {/* 4. Default CTA Footer if no custom sections present */}
      {sections.length === 0 && !parsedPageContent.text && (
        <section className="py-20 text-center wrap max-w-2xl">
          <div className="p-8 bg-[#f8f9fa] rounded-[22px] border border-[#e7e9ee] space-y-4">
            <h2 className="text-xl font-black text-[#101114]">Page Content In Development</h2>
            <p className="text-xs sm:text-sm text-[#6b7280]">
              This page has been published. Add narrative content or configure modular blocks from your Admin Section Manager.
            </p>
            <div className="pt-2">
              <Link
                href="/buildings"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase rounded-xl"
              >
                <span>Browse Homes & Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
