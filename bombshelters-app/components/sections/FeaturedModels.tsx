import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Shield, ArrowRight, Award, Crown, Flame, Sparkles, TrendingUp } from "lucide-react";
import { FEATURED_MODELS } from "@/data/products";
import { getBombShelterProducts } from "@/lib/productStore";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function FeaturedModels() {
  let modelsToDisplay = FEATURED_MODELS;
  try {
    const dynamicProducts = await getBombShelterProducts(true);
    if (dynamicProducts && dynamicProducts.length > 0) {
      modelsToDisplay = dynamicProducts;
    }
  } catch (err) {
    console.warn("FeaturedModels fallback to static:", err);
  }
  const badgeStyles: Record<string, { className: string; icon: React.ReactNode }> = {
    green: { className: "bg-[#16a34a]", icon: <Award className="w-3 h-3" /> },
    gold: { className: "bg-[#d97706]", icon: <Crown className="w-3 h-3" /> },
    blue: { className: "bg-[#2563eb]", icon: <Flame className="w-3 h-3" /> },
    red: { className: "bg-[#e11d1d]", icon: <Sparkles className="w-3 h-3" /> },
    purple: { className: "bg-[#7c3aed]", icon: <TrendingUp className="w-3 h-3" /> },
  };

  return (
    <section id="featured-models" className="bg-white text-[#0a0a0a] pb-14 lg:pb-16">
      <div className="site-container">
        <SectionHeading
          title="Featured"
          highlight="Models"
          subtitle="Our most popular bunkers, steel framed homes, cabins and house kits."
          linkLabel="View All Models"
          linkHref="/models"
        />

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {modelsToDisplay.slice(0, 6).map((model) => {
            const badge = badgeStyles[model.badge.color] || badgeStyles.red;
            return (
              <div
                key={model.id}
                className="min-w-[230px] sm:min-w-0 flex flex-col rounded-[4px] overflow-hidden border border-[#e2e8f0] bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d]/60 transition-all duration-300 snap-start group"
              >
                {/* Image & Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111214]">
                  <Image
                    src={model.imageUrl}
                    alt={model.name}
                    fill
                    sizes="(max-width: 640px) 230px, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 210px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-display font-bold tracking-wider uppercase text-white px-2 py-1 rounded-[3px] shadow ${badge.className}`}
                  >
                    {badge.icon}
                    {model.badge.text}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-[15px] leading-snug text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors line-clamp-2 min-h-[40px]">
                      <Link href={`/models/${model.id}`}>
                        {model.name}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-[12px] text-[#4a5568]">
                      From{" "}
                      <span className="font-display font-bold text-lg text-[#e11d1d] tracking-tight">
                        {model.price}
                      </span>
                    </p>

                    <div className="mt-2 space-y-1 text-[12px] text-[#334155]">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                        <span>{model.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                        <span>{model.specs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href={`/models/${model.id}`}
                      className="flex-1 inline-flex items-center justify-center py-2 px-2.5 rounded-[3px] bg-gray-100 hover:bg-[#0a0a0a] hover:text-white text-[#0a0a0a] font-display font-semibold uppercase tracking-wider text-[11px] transition-colors"
                    >
                      <span>Specs</span>
                    </Link>
                    <Link
                      href={`/quote?model=${model.id}`}
                      className="inline-flex items-center justify-center py-2 px-3 rounded-[3px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-[11px] transition-colors gap-1"
                    >
                      <span>Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
