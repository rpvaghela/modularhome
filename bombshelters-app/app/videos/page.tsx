import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock, ArrowRight, ShieldCheck, Film } from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";
import { VIDEOS } from "@/data/videos";
import { getBombShelterVideos } from "@/lib/videosStore";

export const metadata: Metadata = {
  title: "Bomb Shelter Video Gallery & Factory Tours | BombShelters.com",
  description:
    "Watch video walk-throughs, subterranean crane installation timelapses, certified blast testing, and factory tours.",
};

export default async function VideosPage() {
  let videosToDisplay = VIDEOS;
  try {
    const dynamicList = await getBombShelterVideos();
    if (dynamicList && dynamicList.length > 0) {
      videosToDisplay = dynamicList;
    }
  } catch (err) {
    console.warn("VideosPage fallback:", err);
  }
  return (
    <>
      <SubPageHeader
        badge="MEDIA & DOCUMENTATION"
        title="VIDEO GALLERY &"
        highlight="FACTORY TOURS"
        description="Watch real-world subterranean installations, live blast testing documentation, and inside walk-throughs of our premier shelters."
        breadcrumbs={[{ label: "Video Gallery" }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
              See Our Engineering in Action
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Transparency from raw structural steel plates to final subterranean commissioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videosToDisplay.map((vid) => (
              <Link
                key={vid.slug}
                href={`/videos/${vid.slug}`}
                className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-950">
                  <Image
                    src={vid.imageUrl}
                    alt={vid.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#e11d1d] text-white flex items-center justify-center shadow-redGlow group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>

                  <span className="absolute bottom-3 right-3 text-[11px] font-bold text-white bg-black/80 px-2 py-0.5 rounded backdrop-blur">
                    {vid.duration}
                  </span>

                  <span className="absolute top-3 left-3 text-[10px] font-display font-bold uppercase tracking-wider text-white bg-[#0a0a0a]/90 px-2.5 py-1 rounded backdrop-blur">
                    {vid.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors line-clamp-2">
                      {vid.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-[#e11d1d]">
                    <span>Watch Walkthrough</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

