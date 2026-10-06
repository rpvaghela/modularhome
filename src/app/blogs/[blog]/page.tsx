import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, BookOpen, Layers } from "lucide-react";
import { getPublicBlogs } from "@/lib/publicData";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface BlogCategoryPageProps {
  params: Promise<{ blog: string }>;
}

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { blog } = await params;
  const formattedTitle = blog.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = `${formattedTitle} | ModularHome.com Articles & Guides`;
  const description = `Read the latest articles, guides, and engineering insights in ${formattedTitle.toLowerCase()} from ModularHome.com.`;
  const canonical = getCanonicalUrl(`/blogs/${blog}`);

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

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { blog } = await params;
  if (!blog || blog === "undefined" || blog === "null") {
    notFound();
  }

  const allArticles = await getPublicBlogs();
  const formattedBlogName = blog.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Match articles in this category or blog handle
  const articles = allArticles.filter(
    (a) =>
      a.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === blog.toLowerCase() ||
      a.category.toLowerCase().includes(blog.toLowerCase().replace(/-/g, " ")) ||
      blog.toLowerCase().includes(a.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")) ||
      blog.toLowerCase() === "news" ||
      blog.toLowerCase() === "all"
  );

  const canonical = getCanonicalUrl(`/blogs/${blog}`);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#101114]">
      <div className="wrap">
        {/* Breadcrumb Navigation */}
        <div className="py-4 text-xs text-[#6b7280] flex items-center gap-2 border-b border-[#e7e9ee] mb-8">
          <Link href="/" className="hover:text-[#101114] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-[#101114] transition-colors">
            Blogs
          </Link>
          <span>/</span>
          <span className="text-[#d97706] font-bold capitalize">
            {formattedBlogName}
          </span>
        </div>

        {/* Header */}
        <div className="py-8 border-b border-[#e7e9ee] mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-2">
            <BookOpen className="w-4 h-4 text-[#fcb907]" />
            <span>Category Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-[-1.5px] text-[#101114]">
            {formattedBlogName}
          </h1>
          <p className="text-sm sm:text-base text-[#6b7280] max-w-2xl mt-2 leading-relaxed">
            Explore articles and in-depth construction guides in {formattedBlogName.toLowerCase()}.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${blog}/${article.slug}`}
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
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#f6f7f9] border border-[#e7e9ee] rounded-[18px] p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-[#6b7280] mx-auto" />
            <h3 className="text-lg font-black uppercase text-[#101114]">
              No Articles Found in This Category
            </h3>
            <p className="text-xs text-[#6b7280]">
              Browse our complete library of modular home and prefab construction guides.
            </p>
            <div className="pt-2">
              <Link
                href="/blogs"
                className="btn-primary py-2.5 px-6 text-xs font-bold rounded-[9px] inline-flex items-center gap-2"
              >
                <span>Browse All Blogs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
