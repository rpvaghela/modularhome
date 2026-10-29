import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Play,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { getBombShelterVideoBySlug, getBombShelterVideos, VideoItem } from "@/lib/videosStore";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const vid = await getBombShelterVideoBySlug(params.slug);
  if (!vid) return { title: "Video Not Found | BombShelters.com" };

  return {
    title: `${vid.title} | BombShelters.com Video`,
    description: (vid.description || "").slice(0, 160),
    openGraph: {
      title: vid.title,
      description: (vid.description || "").slice(0, 160),
      images: vid.imageUrl ? [{ url: vid.imageUrl }] : [],
    },
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const vid = await getBombShelterVideoBySlug(params.slug);
  if (!vid) {
    notFound();
  }

  const allVideos = await getBombShelterVideos(6);
  const otherVideos = allVideos.filter((v: VideoItem) => v.slug !== vid.slug).slice(0, 3);

  return (
    <>
      <SubPageHeader
        badge={vid.category.toUpperCase()}
        title={vid.title.toUpperCase()}
        description={vid.description}
        breadcrumbs={[
          { label: "Videos", href: "/videos" },
          { label: vid.title },
        ]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container max-w-5xl">
          {/* Video Player Display Container */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black shadow-2xl mb-8 border border-gray-200">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${vid.youtubeId}?autoplay=0&rel=0`}
              title={vid.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Meta Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded bg-[#0a0a0a] text-white text-[10px] font-mono font-bold uppercase tracking-widest">
                  {vid.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{vid.duration}</span>
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase text-[#0a0a0a]">
                {vid.title}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button asLink href="/quote" size="md">
                <span>Request Custom Build</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Description & Technical Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-display font-bold text-lg uppercase text-[#0a0a0a]">
                Video Overview &amp; Specifications
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {vid.description}
              </p>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-display font-bold uppercase text-[#e11d1d]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ASTM Engineering Verified</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Every shelter shown in our video repository undergoes rigorous non-destructive ultrasonic weld inspection, hydrostatic pressure sealing checks, and third-party PE structural sign-offs before shipping.
                </p>
              </div>
            </div>

            {/* Sidebar Contact Desk */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-gray-950 text-white space-y-4">
                <h4 className="font-display font-bold text-base uppercase text-white">
                  Have Engineering Questions?
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Speak directly with a blast shelter engineer regarding soil survey requirements, delivery clearances, and local permitting.
                </p>
                <a
                  href="tel:812-595-4033"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call (812) 595-4033</span>
                </a>
              </div>
            </div>
          </div>

          {/* More Videos Grid */}
          {otherVideos.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-black text-xl uppercase text-[#0a0a0a]">
                  More Video Walkthroughs
                </h3>
                <Link
                  href="/videos"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#e11d1d] hover:underline"
                >
                  <span>View All Videos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherVideos.map((other: VideoItem) => (
                  <Link
                    key={other.slug}
                    href={`/videos/${other.slug}`}
                    className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                      <Image
                        src={other.imageUrl}
                        alt={other.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-[#e11d1d] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h4 className="font-display font-bold text-xs uppercase text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors line-clamp-2">
                        {other.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-2 block">{other.duration}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        title="Ready to Build Your Fortified Property?"
        subtitle="Our architectural engineers provide complete turnkey planning, soil surveys, and stamped blueprints."
        ctaText="Request Free Consultation"
        ctaHref="/contact"
      />
    </>
  );
}
