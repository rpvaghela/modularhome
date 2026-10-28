import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Award,
  Share2,
  Tag,
  Phone,
} from "lucide-react";
import {
  getBombShelterBlogBySlug,
  getBombShelterBlogs,
  BombShelterBlogPost,
} from "@/lib/blogStore";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    blog: string;
    article: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBombShelterBlogBySlug(params.article);
  if (!post) {
    return { title: "Article Not Found | BombShelters.com" };
  }

  return {
    title: `${post.title} | BombShelters.com Technical Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBombShelterBlogBySlug(params.article);

  if (!post) {
    notFound();
  }

  const allPosts = await getBombShelterBlogs();
  const relatedPosts = allPosts.filter((p: BombShelterBlogPost) => p.id !== post.id).slice(0, 2);

  return (
    <>
      <SubPageHeader
        badge="TECHNICAL ANALYSIS"
        title={post.title.toUpperCase()}
        description={post.summary}
        breadcrumbs={[
          { label: "Blogs", href: "/blogs" },
          { label: post.title },
        ]}
      />

      <article className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-[#e11d1d]" />
                <span>
                  {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>6 min read</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Feature Image */}
          {post.image_url && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-950 mb-10 border border-gray-200 shadow-xl">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#e11d1d] prose-img:rounded-xl text-gray-800 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.body_html }}
          />

          {/* Author & Engineering Signoff */}
          <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#0e1014] text-white flex items-center justify-center font-display font-extrabold text-xl shrink-0 shadow">
              BS
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-xs uppercase font-bold text-[#e11d1d] tracking-wider">
                Reviewed by
              </div>
              <h4 className="font-display font-bold text-lg text-[#0a0a0a]">
                BombShelters.com Structural Engineering Board
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Authored by licensed civil and structural defense engineers with over 25 years of combined experience in subterranean blast mitigation, FEMA shelter codes, and NBC life-support design.
              </p>
            </div>
          </div>

          {/* Back to Blog & Next Posts */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-600 hover:text-[#e11d1d] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>

            <Link
              href="/quote"
              className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#e11d1d] hover:underline"
            >
              <span>Request Engineering Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>

      <CtaBanner />
    </>
  );
}
