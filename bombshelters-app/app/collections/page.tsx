import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FolderOpen, ArrowRight, ShieldCheck, Sparkles, Award } from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";
import { COLLECTIONS } from "@/data/collections";
import { getBombShelterCollections } from "@/lib/collectionsStore";

export const metadata: Metadata = {
  title: "Curated Shelter & Bunker Collections | BombShelters.com",
  description:
    "Browse hand-curated collections of underground bomb shelters, off-grid cabins, storm safe rooms, and high-security residences.",
};

export default async function CollectionsPage() {
  let collectionsToDisplay = COLLECTIONS;
  try {
    const dynamicList = await getBombShelterCollections();
    if (dynamicList && dynamicList.length > 0) {
      collectionsToDisplay = dynamicList;
    }
  } catch (err) {
    console.warn("CollectionsPage fallback:", err);
  }
  return (
    <>
      <SubPageHeader
        badge="CURATED SUITES"
        title="BOMBSHELTER CURATED"
        highlight="COLLECTIONS"
        description="Explore curated portfolios tailored to specific threat environments, family sizes, and off-grid budgets."
        breadcrumbs={[{ label: "Collections" }]}
      />

      <section className="bg-paper text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
              Handcrafted for Every Preparedness Level
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Browse our most sought-after categories grouped by operational readiness and architectural style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionsToDisplay.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-950">
                  <Image
                    src={col.imageUrl}
                    alt={col.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-white bg-[#e11d1d] px-2.5 py-1 rounded shadow">
                      {col.badge}
                    </span>
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-white bg-black/75 px-2 py-1 rounded backdrop-blur">
                      {col.modelCount}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors">
                      {col.name}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-[#e11d1d]">
                    <span>Explore Collection</span>
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

