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
import { VIDEOS } from "@/data/videos";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const vid = VIDEOS.find((v) => v.slug === params.slug);
  if (!vid) return { title: "Video Not Found | BombShelters.com" };

  return {
    title: `${vid.title} | BombShelters.com Video`,
    description: vid.description,
  };
}

export default function VideoDetailPage({ params }: PageProps) {
  const vid = VIDEOS.find((v) => v.slug === params.slug);
  if (!vid) {
    notFound();
  }

  const otherVideos = VIDEOS.filter((v) => v.slug !== vid.slug);

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
            <Image
              src={vid.imageUrl}
              alt={vid.title}
              fill
              priority
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#e11d1d] text-white flex items-center justify-center shadow-redGlow cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-8 h-8 ml-1 fill-white" />
              </div>
              <div className="mt-4 text-white font-display font-bold text-lg sm:text-xl max-w-lg">
                {vid.title}
              </div>
              <div className="text-xs text-gray-300 mt-1">Duration: {vid.duration}</div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 mb-12">
            <h3 className="font-display font-bold text-xl uppercase tracking-tight text-[#0a0a0a] mb-2">
              Engineering Notes &amp; Highlights
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {vid.description} This production showcases actual installations managed under licensed structural engineering stamps. All models featured are engineered with certified domestic steel and Swiss NBC air filtration systems.
            </p>
          </div>

          {/* More Videos */}
          <div className="pt-8 border-t border-gray-200">
            <h4 className="font-display font-extrabold text-xl uppercase tracking-tight mb-6">
              More Engineering Videos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherVideos.map((other) => (
                <Link
                  key={other.slug}
                  href={`/videos/${other.slug}`}
                  className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:border-[#e11d1d] hover:shadow-lg transition-all group"
                >
                  <div className="relative aspect-[16/10] w-full bg-gray-900">
                    <Image
                      src={other.imageUrl}
                      alt={other.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/80 px-2 py-0.5 rounded">
                      {other.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-display font-bold text-sm text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors line-clamp-2">
                      {other.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

