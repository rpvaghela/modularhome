import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Layers,
  Users,
  Compass,
  ArrowRight,
  Download,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { getBombShelterFloorPlanBySlug, getBombShelterFloorPlans, FloorPlanItem } from "@/lib/floorPlansStore";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const plan = await getBombShelterFloorPlanBySlug(params.slug);
  if (!plan) return { title: "Floor Plan Not Found | BombShelters.com" };

  return {
    title: `${plan.name} Floor Plan & Blueprints | BombShelters.com`,
    description: plan.desc || `${plan.name} precision engineered floor plan. ${plan.sqft} SQ FT.`,
    openGraph: {
      title: plan.name,
      description: plan.desc || `${plan.name} floor plan.`,
      images: plan.imageUrl ? [{ url: plan.imageUrl }] : [],
    },
  };
}

export default async function FloorPlanDetailPage({ params }: PageProps) {
  const plan = await getBombShelterFloorPlanBySlug(params.slug);

  if (!plan) {
    notFound();
  }

  const allPlans = await getBombShelterFloorPlans(true);
  const otherPlans = allPlans.filter((p: FloorPlanItem) => p.id !== plan.id).slice(0, 3);

  return (
    <>
      <SubPageHeader
        badge={plan.category.toUpperCase()}
        title={plan.name.toUpperCase()}
        description={plan.desc || `${plan.name} architectural floor plan and technical layout.`}
        breadcrumbs={[
          { label: "Floor Plans", href: "/floor-plans" },
          { label: plan.name },
        ]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container max-w-5xl">
          {/* Main Blueprint Viewer Box */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 shadow-2xl mb-12 group">
            <Image
              src={plan.imageUrl}
              alt={plan.name}
              fill
              priority
              className="object-contain p-6 bg-white"
            />
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0a0a]/90 text-white text-xs font-mono font-bold tracking-wider border border-white/20">
              <Compass className="w-3.5 h-3.5 text-[#e11d1d]" />
              <span>CAD ARCHITECTURAL V4</span>
            </div>
          </div>

          {/* Quick Specs Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-200 mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500 block">Total Area</span>
              <span className="font-display font-black text-xl text-[#0a0a0a]">
                {plan.sqft} SQ FT
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500 block">Dimensions</span>
              <span className="font-display font-bold text-sm text-[#0a0a0a] truncate block">
                {plan.dimensions}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500 block">Capacity / Occupancy</span>
              <span className="font-display font-bold text-sm text-[#0a0a0a] truncate block">
                {plan.occupancy}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500 block">Category</span>
              <span className="font-display font-bold text-sm text-[#e11d1d] truncate block">
                {plan.category}
              </span>
            </div>
          </div>

          {/* Layout Breakdown & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-display font-black text-2xl uppercase text-[#0a0a0a]">
                Spatial Architecture &amp; Room Layout
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {plan.desc}
              </p>

              <div className="p-6 rounded-2xl border border-gray-200 bg-white space-y-4 shadow-sm">
                <h4 className="font-display font-bold text-sm uppercase text-[#0a0a0a] flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#e11d1d]" />
                  <span>Configured Layout Zones</span>
                </h4>
                <p className="text-xs text-gray-600 font-mono leading-relaxed">
                  {plan.rooms}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asLink href={`/quote?model=${plan.id}`} size="lg">
                  <span>Request Full Blueprint Package (PDF / CAD)</span>
                  <Download className="w-4 h-4 ml-2" />
                </Button>
                <Link
                  href="/upload-floor-plan"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-gray-300 hover:border-gray-900 bg-white text-xs font-display font-bold uppercase tracking-wider text-[#0a0a0a] transition-colors"
                >
                  <span>Upload Your Site Plan</span>
                </Link>
              </div>
            </div>

            {/* Support Desk */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-gray-950 text-white space-y-4">
              <h4 className="font-display font-bold text-base uppercase text-white">
                Customize This Layout
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Need an extra egress tunnel, enlarged battery cache, or alternate blast hatch location? Our architects modify layouts to your exact site requirements.
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

          {/* More Floor Plans */}
          {otherPlans.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-black text-2xl uppercase text-[#0a0a0a]">
                  Other Engineered Floor Plans
                </h3>
                <Link
                  href="/floor-plans"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#e11d1d] hover:underline"
                >
                  <span>View All Blueprints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherPlans.map((other: FloorPlanItem) => (
                  <Link
                    key={other.id}
                    href={`/floor-plans/${other.id}`}
                    className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-950">
                      <Image
                        src={other.imageUrl}
                        alt={other.name}
                        fill
                        className="object-contain p-2 bg-white group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{other.category}</span>
                        <h4 className="font-display font-bold text-xs uppercase text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors mt-1 line-clamp-1">
                          {other.name}
                        </h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                        <span>{other.sqft} SQ FT</span>
                        <span className="text-[#e11d1d] font-bold">View Layout →</span>
                      </div>
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
