import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Shield,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Award,
} from "lucide-react";
import { FEATURED_MODELS, ProductModel } from "@/data/products";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface CategoryPageTemplateProps {
  title: string;
  highlight?: string;
  badge: string;
  description: string;
  categoryKey: string;
  breadcrumbs: { label: string; href?: string }[];
  keyPoints?: { title: string; desc: string }[];
}

export function CategoryPageTemplate({
  title,
  highlight,
  badge,
  description,
  categoryKey,
  breadcrumbs,
  keyPoints,
}: CategoryPageTemplateProps) {
  // Filter models that match this category
  const matchingModels = FEATURED_MODELS.filter((m) => {
    const cat = m.category.toLowerCase();
    const key = categoryKey.toLowerCase();
    return cat.includes(key) || key.includes(cat);
  });

  // Fallback to related models if specific list is small
  const displayModels =
    matchingModels.length > 0 ? matchingModels : FEATURED_MODELS.slice(0, 4);

  return (
    <>
      <SubPageHeader
        badge={badge}
        title={title}
        highlight={highlight}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container">
          {/* Engineering Highlights */}
          {keyPoints && keyPoints.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-gray-200 bg-gray-50/70"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#e11d1d]/10 text-[#e11d1d] flex items-center justify-center font-display font-bold text-sm mb-3">
                    0{i + 1}
                  </div>
                  <h4 className="font-display font-bold text-sm uppercase text-[#0a0a0a] mb-1">
                    {pt.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Model Catalog Section */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#0a0a0a]">
                Available Models &amp; Floor Plans
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Showing <strong>{displayModels.length}</strong> factory-direct designs ready for fabrication.
              </p>
            </div>
            <Button asLink href="/quote" size="sm">
              <span>Get Custom Quote</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayModels.map((model) => (
              <div
                key={model.id}
                className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-950">
                  <Image
                    src={model.imageUrl}
                    alt={model.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-display font-bold uppercase tracking-wider text-white bg-[#e11d1d] px-2 py-0.5 rounded shadow">
                    {model.badge.text}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors line-clamp-2 min-h-[40px]">
                      {model.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {model.description}
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
        title={`Ready to Build Your ${title}?`}
        subtitle="Our architectural engineers provide complete turnkey planning, soil surveys, and stamped blueprints."
        ctaText="Request Free Consultation"
        ctaHref="/contact"
      />
    </>
  );
}

