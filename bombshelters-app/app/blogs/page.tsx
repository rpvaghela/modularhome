import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  ChevronRight,
} from "lucide-react";
import { getBombShelterBlogs, BombShelterBlogPost } from "@/lib/blogStore";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BombShelters.com Engineering & Survival Blog | Articles & Guides",
  description:
    "Expert articles on subterranean blast engineering, Swiss NBC air filtration, FEMA storm standards, and off-grid survival homesteading.",
};

export default async function BlogsPage() {
  const posts = await getBombShelterBlogs();

  const categories = [
    { name: "All Articles", slug: "all", count: posts.length },
    { name: "NBC & Life Support", slug: "nbc-filtration", count: 4 },
    { name: "Storm & Tornado Defense", slug: "storm-shelters", count: 3 },
    { name: "Off-Grid Solar & Power", slug: "off-grid-power", count: 2 },
    { name: "Structural Engineering", slug: "engineering", count: 5 },
  ];

  return (
    <>
      <SubPageHeader
        badge="EDUCATIONAL JOURNAL"
        title="BOMBSHELTER ENGINEERING &"
        highlight="SURVIVAL BLOG"
        description="Educational guides, technical engineering breakdowns, and preparedness insights authored by certified structural defense engineers."
        breadcrumbs={[{ label: "Blogs" }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container">
          {/* Header Description */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 pb-6 border-b border-gray-200">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#0a0a0a]">
                Latest Technical Articles &amp; Build Guides
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Deep dives into blast physics, soil hydrology, EMP protection, and subterranean survival.
              </p>
            </div>
          </div>

          {/* Featured Article Hero (First Post) */}
          {posts.length > 0 && (
            <div className="mb-16 rounded-2xl overflow-hidden border border-gray-200 bg-[#0e1014] text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 group">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden bg-gray-900 min-h-[280px]">
                <Image
                  src={posts[0].image_url || "/images/hillside-bunker.png"}
                  alt={posts[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-white bg-[#e11d1d] px-2.5 py-0.5 rounded">
                      Featured Guide
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(posts[0].published_at || posts[0].created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-white group-hover:text-[#ff4d4d] transition-colors leading-snug">
                    <Link href={`/blogs/bombshelters/${posts[0].handle}`}>
                      {posts[0].title}
                    </Link>
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-3">
                    {posts[0].summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {posts[0].tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-bold text-gray-300 bg-white/10 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    href={`/blogs/bombshelters/${posts[0].handle}`}
                    className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#ff4d4d] hover:text-white transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: BombShelterBlogPost) => (
              <article
                key={post.id}
                className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                  <Image
                    src={post.image_url || "/images/cat-bomb-shelters.png"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((t: string) => (
                      <span
                        key={t}
                        className="text-[9px] font-display font-bold uppercase tracking-wider text-white bg-black/80 backdrop-blur px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base sm:text-lg text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors line-clamp-2">
                      <Link href={`/blogs/bombshelters/${post.handle}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/blogs/bombshelters/${post.handle}`}
                      className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-[#e11d1d] group-hover:underline"
                    >
                      <span>Read Guide</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>5 min read</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Looking for Specific Engineering Documentation?"
        subtitle="Our technical library includes structural blast calculations, soil compaction guides, and Swiss NBC maintenance manuals."
        ctaText="Consult an Engineer"
        ctaHref="/contact"
      />
    </>
  );
}
