import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Users,
  Shield,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
} from "lucide-react";
import { FEATURED_MODELS } from "@/data/products";
import { COLLECTIONS } from "@/data/collections";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const col = COLLECTIONS.find((c) => c.slug === params.slug);
  if (!col) return { title: "Collection Not Found | BombShelters.com" };

  return {
    title: `${col.name} Collection | BombShelters.com`,
    description: col.description,
  };
}

export default function CollectionDetailPage({ params }: PageProps) {
  const col = COLLECTIONS.find((c) => c.slug === params.slug);
  if (!col) {
    notFound();
  }

  // Filter models relevant to this collection
  const matchingModels = FEATURED_MODELS.filter((m) => {
    if (col.slug === "under-100k") return m.rawPrice < 100000;
    if (col.slug === "luxury-estates") return m.category.includes("Luxury") || m.rawPrice >= 149000;
    if (col.slug === "tornado-storm-shelters") return m.category.includes("Storm") || m.category.includes("Safe");
    if (col.slug === "off-grid-cabins") return m.category.includes("Cabin") || m.category.includes("A-Frame");
    if (col.slug === "ballistic-safe-rooms") return m.category.includes("Safe") || m.category.includes("ADU");
    return true;
  });

  return (
    <>
      <SubPageHeader
        badge={col.badge}
        title={col.name.toUpperCase()}
        description={col.description}
        breadcrumbs={[
          { label: "Collections", href: "/collections" },
          { label: col.name },
        ]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#0a0a0a]">
                Available Models in this Collection
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Showing <strong>{matchingModels.length}</strong> pre-engineered units ready for fabrication.
              </p>
            </div>
            <Button asLink href="/quote" size="sm">
              <span>Request Custom Quote</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingModels.map((model) => (
              <div
                key={model.id}
                className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-950">
                  <Image
                    src={model.imageUrl}
                    alt={model.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-display font-bold uppercase tracking-wider text-white bg-[#e11d1d] px-2.5 py-1 rounded shadow">
                    {model.badge.text}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      {model.category}
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors">
                      {model.name}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                      {model.description}
                    </p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-xs text-gray-400">Turnkey from</span>
                      <span className="font-display font-black text-2xl text-[#e11d1d]">
                        {model.price}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{model.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[120px]">{model.specs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <Link
                      href={`/models/${model.id}`}
                      className="flex-1 py-2.5 px-3 rounded bg-gray-100 hover:bg-[#0a0a0a] hover:text-white text-[#0a0a0a] font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors"
                    >
                      Specifications
                    </Link>
                    <Link
                      href={`/quote?model=${model.id}`}
                      className="py-2.5 px-3 rounded bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

