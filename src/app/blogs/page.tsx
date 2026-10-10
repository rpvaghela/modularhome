import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getPublicBlogs } from "@/lib/publicData";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import BlogsCatalog from "@/components/BlogsCatalog";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const robots = getRobotsMetadata();

  const title = "Modular Home Blog, News & Construction Guides | ModularHome.com";
  const description =
    "Explore comprehensive modular home building guides, cost breakdowns, factory tours, permitting advice, and architectural floor plan comparisons.";
  const canonical = getCanonicalUrl("/blogs");

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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/newmodularlogo.png"],
    },
  };
}

export default async function BlogsIndexPage() {
  const articles = await getPublicBlogs();
  const canonical = getCanonicalUrl("/blogs");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ModularHome Blog & Educational Guides",
    "description": "Comprehensive educational guides on modular home construction, pricing, financing, land preparation, delivery, and custom floor plans.",
    "url": canonical,
    "publisher": {
      "@type": "Organization",
      "name": "ModularHome.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://modularhome.com/newmodularlogo.png",
      },
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.slice(0, 50).map((art, idx) => {
        const catSlug = (art.category_slug || (art.category || "modular-construction").toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^blogs-/, "");
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "name": art.title,
          "url": `https://modularhome.com/blogs/${catSlug}/${art.slug}`,
        };
      }),
    },
  };

  return (
    <div className="min-h-screen bg-white pt-4 pb-20 text-[#101114]">
      {/* Schema.org CollectionPage Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap">
        {/* Header */}
        <div className="py-6 border-b border-[#e7e9ee] mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-2">
            <BookOpen className="w-4 h-4 text-[#fcb907]" />
            <span>ModularHome Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114]">
            All Blogs &amp; Construction Guides
          </h1>
          <p className="text-sm sm:text-base text-[#6b7280] max-w-2xl mt-2 leading-relaxed">
            Browse all {articles.length} comprehensive guides, cost breakdowns, factory tours, and permitting advice to help you build your dream home.
          </p>
        </div>

        {/* All Blogs Single Unified Catalog */}
        <BlogsCatalog initialArticles={articles} />
      </div>
    </div>
  );
}

