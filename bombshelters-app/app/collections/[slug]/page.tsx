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
import { getBombShelterCollectionBySlug } from "@/lib/collectionsStore";
import { getBombShelterProducts, ExtendedProductModel } from "@/lib/productStore";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const col = await getBombShelterCollectionBySlug(params.slug);
  if (!col) return { title: "Collection Not Found | BombShelters.com" };

  return {
    title: `${col.name} Collection | BombShelters.com`,
    description: (col.description || "").slice(0, 160),
    openGraph: {
      title: col.name,
      description: col.description,
      images: col.imageUrl ? [{ url: col.imageUrl }] : [],
    },
  };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const col = await getBombShelterCollectionBySlug(params.slug);
  if (!col) {
    notFound();
  }

  const allProducts = await getBombShelterProducts(true);

  // Match products relevant to this collection
  const matchingModels = allProducts.filter((m: ExtendedProductModel) => {
    const slug = col.slug.toLowerCase();
    const cat = (m.category || "").toLowerCase();
    const name = (m.name || "").toLowerCase();
    if (slug === "under-100k") return m.rawPrice < 100000;
    if (slug === "luxury-estates" || slug.includes("luxury")) return cat.includes("luxury") || m.rawPrice >= 149000;
    if (slug.includes("storm") || slug.includes("tornado")) return cat.includes("storm") || cat.includes("safe");
    if (slug.includes("cabin")) return cat.includes("cabin") || cat.includes("a-frame") || name.includes("cabin");
    if (slug.includes("safe-room")) return cat.includes("safe") || cat.includes("adu");
    if (slug.includes("barndo")) return cat.includes("barndo") || name.includes("barndo");
    if (slug.includes("house-kit") || slug.includes("kit")) return cat.includes("kit") || name.includes("kit");
    if (slug.includes("tiny")) return cat.includes("tiny") || name.includes("tiny");
    if (slug.includes("adu")) return cat.includes("adu") || name.includes("adu");
    return cat.includes(slug) || slug.includes(cat) || name.includes(slug);
  });

  const displayModels = matchingModels.length > 0 ? matchingModels : allProducts.slice(0, 12);

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

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 pb-4 border-b border-gray-200">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#e11d1d] block">
                {col.name}
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#0a0a0a] mt-0.5">
                Curated Models ({displayModels.length})
              </h2>
            </div>
            <Button asLink href="/quote" size="sm">
              <span>Get Custom Quote</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayModels.map((model: ExtendedProductModel) => (
              <div
                key={model.id}
                className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-950">
                  <Image
                    src={model.primaryImageUrl || model.imageUrl}
                    alt={model.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0a0a0a]/80 backdrop-blur text-[10px] font-display font-bold uppercase tracking-wider text-white border border-white/20">
                      <ShieldCheck className="w-3 h-3 text-[#e11d1d]" />
                      <span>{model.badge?.text || "SHELTER"}</span>
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-5">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                      {model.category}
                    </div>
                    <h3 className="font-display font-bold text-base text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors mt-0.5 line-clamp-1">
                      {model.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {(model.description || "").replace(/<[^>]*>/g, "")}
                    </p>

                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-xs text-gray-400">Turnkey from</span>
                      <span className="font-display font-black text-xl text-[#e11d1d]">
                        {model.price}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{model.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[100px]">{model.specs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <Link
                      href={`/models/${model.id}`}
                      className="flex-1 py-2 px-3 rounded bg-gray-100 hover:bg-[#0a0a0a] hover:text-white text-[#0a0a0a] font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors"
                    >
                      Specifications
                    </Link>
                    <Link
                      href={`/quote?model=${model.id}`}
                      className="py-2 px-3 rounded bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors"
                    >
                      Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
