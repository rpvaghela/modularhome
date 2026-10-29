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
import { ProductModel } from "@/data/products";
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
  products?: ProductModel[];
}

export function CategoryPageTemplate({
  title,
  highlight,
  badge,
  description,
  categoryKey,
  breadcrumbs,
  keyPoints,
  products,
}: CategoryPageTemplateProps) {
  // Use strictly actual products from database
  const displayModels = products || [];

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

          {displayModels.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <Shield className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-gray-800 uppercase">Custom Designs in Fabrication</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto leading-relaxed">
                We are actively engineering new blueprints for this category. Browse our full catalog or contact our structural engineers for custom floor plans and quotes.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Button asLink href="/models" size="sm">
                  <span>Browse All Models</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button asLink href="/contact" variant="outline" size="sm" className="text-[#0a0a0a] border-gray-300 hover:bg-gray-100">
                  <span>Custom Engineering</span>
                </Button>
              </div>
            </div>
          ) : (
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
          )}
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
