import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, BookOpen, Layers } from "lucide-react";
import { getPublicBlogs } from "@/lib/publicData";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = "Modular Home Blog, News & Construction Guides | ModularHome.com";
  const description =
    "Explore in-depth articles, buyer's guides, financing advice, permitting blueprints, and modular home engineering tours.";
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
    },
  };
}

export default async function BlogsIndexPage() {
  const articles = await getPublicBlogs();
  const canonical = getCanonicalUrl("/blogs");

  const blogCategories = [
    { name: "Modular Cabins", slug: "modular-cabins" },
    { name: "News & Industry Insights", slug: "news" },
    { name: "Building Guides", slug: "building-guides" },
    { name: "Financing & Permitting", slug: "financing" },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#101114]">
      <div className="wrap">
        {/* Header */}
        <div className="py-8 border-b border-[#e7e9ee] mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-2">
            <BookOpen className="w-4 h-4 text-[#fcb907]" />
            <span>ModularHome Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114]">
            Blogs & Educational Guides
          </h1>
          <p className="text-sm sm:text-base text-[#6b7280] max-w-2xl mt-2 leading-relaxed">
            Essential guides, cost breakdowns, factory tours, and permitting advice to help you build your dream home.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2.5 pb-8 mb-4 border-b border-[#e7e9ee]">
          <Link
            href="/blogs"
            className="px-4 py-2 bg-[#101114] text-[#fcb907] text-xs font-bold rounded-full"
          >
            All Articles ({articles.length})
          </Link>
          {blogCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blogs/${cat.slug}`}
              className="px-4 py-2 bg-[#f4f5f7] hover:bg-[#e7e9ee] text-[#101114] text-xs font-bold rounded-full transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const blogCategorySlug = (article.category || "news").toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={article.id}
                href={`/blogs/${blogCategorySlug}/${article.slug}`}
                className="group card overflow-hidden flex flex-col justify-between bg-white rounded-[18px] border border-[#e7e9ee] hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={article.image || "/newmodularlogo.png"}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#fcb907] text-[#101114] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#6b7280]">
                      <Clock className="w-3 h-3 text-[#d97706]" />
                      <span>{article.readTime}</span>
                    </div>

                    <h2 className="text-base font-black text-[#101114] group-hover:text-[#d97706] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-xs font-bold text-[#d97706] inline-flex items-center gap-1 group-hover:underline">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
