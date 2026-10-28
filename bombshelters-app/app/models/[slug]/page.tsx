import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Award,
  Users,
  HardHat,
  CheckCircle2,
  ArrowRight,
  Phone,
  FileCheck2,
  Lock,
  Layers,
  Wrench,
  Clock,
  Compass,
} from "lucide-react";
import { FEATURED_MODELS, ProductModel } from "@/data/products";
import { getBombShelterProductById, getBombShelterProducts } from "@/lib/productStore";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const model =
    (await getBombShelterProductById(params.slug)) ||
    FEATURED_MODELS.find(
      (m) => m.id === params.slug || m.id.toLowerCase() === params.slug.toLowerCase()
    );

  if (!model) {
    return {
      title: "Model Not Found | BombShelters.com",
    };
  }

  return {
    title: `${model.name} | BombShelters.com`,
    description: `${model.description} Engineered with certified American structural steel and turnkey life support.`,
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const model =
    (await getBombShelterProductById(params.slug)) ||
    FEATURED_MODELS.find(
      (m) => m.id === params.slug || m.id.toLowerCase() === params.slug.toLowerCase()
    );

  if (!model) {
    notFound();
  }

  // Related models
  const allModels = await getBombShelterProducts(true);
  const pool = allModels.length > 0 ? allModels : FEATURED_MODELS;
  const relatedModels = pool.filter((m) => m.id !== model.id).slice(0, 3);

  return (
    <>
      <SubPageHeader
        badge={model.category.toUpperCase()}
        title={model.name.toUpperCase()}
        description={model.description}
        breadcrumbs={[
          { label: "Models", href: "/models" },
          { label: model.name },
        ]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Main Image Showcase */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 shadow-xl">
                <Image
                  src={model.imageUrl}
                  alt={model.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e11d1d] text-white text-xs font-display font-bold uppercase tracking-wider shadow">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{model.badge.text}</span>
                </div>
              </div>

              {/* Overview & Key Highlights */}
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#0a0a0a]">
                  Structural Specifications &amp; Defense Engineering
                </h2>
                <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                  {model.description} Every unit is fabricated using certified domestic ASTM structural steel plate with continuous sub-arc airtight weld seams, engineered to survive severe ground shockwaves and atmospheric overpressure spikes.
                </p>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <Users className="w-5 h-5 text-[#e11d1d] mx-auto mb-1.5" />
                    <div className="text-[11px] uppercase font-bold text-gray-400">Capacity</div>
                    <div className="font-display font-bold text-sm text-[#0a0a0a] mt-0.5">
                      {model.capacity}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <ShieldCheck className="w-5 h-5 text-[#e11d1d] mx-auto mb-1.5" />
                    <div className="text-[11px] uppercase font-bold text-gray-400">Standard Specs</div>
                    <div className="font-display font-bold text-sm text-[#0a0a0a] mt-0.5 truncate">
                      {model.specs}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <HardHat className="w-5 h-5 text-[#e11d1d] mx-auto mb-1.5" />
                    <div className="text-[11px] uppercase font-bold text-gray-400">Material</div>
                    <div className="font-display font-bold text-sm text-[#0a0a0a] mt-0.5">
                      ASTM A36 Steel
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <Award className="w-5 h-5 text-[#e11d1d] mx-auto mb-1.5" />
                    <div className="text-[11px] uppercase font-bold text-gray-400">Warranty</div>
                    <div className="font-display font-bold text-sm text-[#0a0a0a] mt-0.5">
                      Lifetime Structural
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features List */}
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-4">
                  Standard Factory Inclusions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {model.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                    <span>Commercial-grade 100-year subterranean coal tar epoxy coating</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                    <span>Zinc sacrificial anode pack for cathodic soil corrosion defense</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                    <span>Certified engineered CAD blueprints with state engineering stamps</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar CTA & Pricing (4 cols) */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1014] text-white border border-[#22252a] sticky top-28 space-y-6 shadow-2xl">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    Factory-Direct Pricing
                  </span>
                  <div className="text-4xl font-display font-black text-[#e11d1d] tracking-tight mt-1">
                    {model.price}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Turnkey structural shell &amp; standard equipment. Financing available from ~$380/mo.
                  </div>
                </div>

                <div className="pt-4 border-t border-[#22252a] space-y-3">
                  <Button
                    asLink
                    href={`/quote?model=${model.id}`}
                    size="lg"
                    className="w-full text-center"
                  >
                    <span>Request Custom Quote</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                  <Button
                    asLink
                    href="/upload-floor-plan"
                    variant="outline"
                    size="md"
                    className="w-full text-center"
                  >
                    <span>Upload Your Site Plan</span>
                  </Button>
                </div>

                <div className="pt-4 border-t border-[#22252a]">
                  <a
                    href="tel:812-595-4033"
                    className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#2a2d33] hover:border-white text-xs font-display font-bold uppercase tracking-wider text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#e11d1d]" />
                    <span>Call Hotline: 812-595-4033</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-[#22252a] text-xs text-gray-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#e11d1d]" />
                    <span>Discreet nationwide delivery &amp; crane setting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#e11d1d]" />
                    <span>Complete engineering packet included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Models */}
          <div className="mt-20 pt-16 border-t border-gray-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight">
                  Compare Related Models
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Explore other shelters and residences engineered for similar capacity.
                </p>
              </div>
              <Link
                href="/models"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#e11d1d] hover:underline"
              >
                <span>View All Models</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedModels.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/models/${rel.id}`}
                  className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:border-[#e11d1d] hover:shadow-lg transition-all group"
                >
                  <div className="relative aspect-[4/3] w-full bg-gray-900">
                    <Image
                      src={rel.imageUrl}
                      alt={rel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] font-bold uppercase text-gray-400">{rel.category}</div>
                    <div className="font-display font-bold text-sm text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors mt-0.5">
                      {rel.name}
                    </div>
                    <div className="font-display font-black text-base text-[#e11d1d] mt-2">
                      {rel.price}
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
