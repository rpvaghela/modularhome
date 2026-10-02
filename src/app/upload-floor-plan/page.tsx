import { FileCheck, Clock } from "lucide-react";
import { Metadata } from "next";
import FloorPlanUploader from "@/components/FloorPlanUploader";
import { getPublicPageBySlug } from "@/lib/pageDataServer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("upload-floor-plan");
  if (page) {
    const title = page.seoTitle || `${page.title} | ModularHome.com`;
    const description = page.metaDescription || page.subtitle || "Already have a blueprint or architectural drawing? Upload your plan for a complimentary modular home engineering breakdown and custom bid package.";
    return {
      title,
      description,
      openGraph: {
        title: page.ogTitle || title,
        description: page.ogDescription || description,
        images: page.ogImage ? [{ url: page.ogImage }] : (page.featuredImage ? [{ url: page.featuredImage }] : [{ url: "/finallogo.avif" }]),
      },
      alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    };
  }

  return {
    title: "Upload Your Floor Plan | ModularHome.com",
    description: "Already have a blueprint or architectural drawing? Upload your plan for a complimentary modular home engineering breakdown and custom bid package.",
  };
}

export default async function UploadFloorPlanPage() {
  const page = await getPublicPageBySlug("upload-floor-plan");

  const heroBadge = page?.subtitle ? "Custom Engineering Intake" : "Custom Engineering Intake";
  const heroTitle = page?.title || "HAVE A FLOOR PLAN?";
  const heroDesc = page?.content || "Upload your floor plan and let our team provide a detailed custom quote. We accept hand sketches, architect PDFs, and CAD files.";

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-[#101114]">
      <div className="wrap">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
            <span>{heroBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114]">
            {heroTitle}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6b7280] leading-relaxed">
            {heroDesc}
          </p>
        </div>

        {/* Uploader Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto items-start">
          {/* Main Uploader (8 cols) */}
          <div className="lg:col-span-8">
            <FloorPlanUploader />
          </div>

          {/* Right Sidebar: Engineering Assurance (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="card p-6 space-y-4 bg-white">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#101114] m-0">
                The Engineering Process
              </h3>

              <div className="space-y-3.5 text-xs text-[#6b7280]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#fcb907] text-[#101114] font-black flex items-center justify-center shrink-0 shadow-xs text-xs">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-[#101114] block">Intake & Load Audit</span>
                    <span>Our licensed engineers review span lengths, eave heights, and regional specs.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#fcb907] text-[#101114] font-black flex items-center justify-center shrink-0 shadow-xs text-xs">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-[#101114] block">Modular Conversion Modeling</span>
                    <span>We translate conventional plans into efficient factory-built modular sections.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#fcb907] text-[#101114] font-black flex items-center justify-center shrink-0 shadow-xs text-xs">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-[#101114] block">Stamped Bid Packet</span>
                    <span>You receive an itemized manufacturing bill of materials with certified price guarantee.</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e7e9ee] space-y-2 text-[11px] text-[#6b7280]">
                <div className="flex items-center gap-2 text-[#101114] font-semibold">
                  <FileCheck className="w-4 h-4 text-[#d97706]" />
                  <span>Accepted: PDF, PNG, JPG, DWG, DXF</span>
                </div>
                <div className="flex items-center gap-2 text-[#101114] font-semibold">
                  <Clock className="w-4 h-4 text-[#d97706]" />
                  <span>Turnaround: 24–48 Business Hours</span>
                </div>
              </div>
            </div>

            <div className="card p-5 text-xs text-[#6b7280] space-y-2 bg-[#f6f7f9]">
              <span className="font-bold text-[#101114] block">Need help drafting from scratch?</span>
              <p className="m-0 leading-relaxed">
                If you don&apos;t have drawings yet, you can also browse our{" "}
                <a href="/buildings" className="text-[#d97706] hover:underline font-bold">
                  pre-engineered architectural floor plans
                </a>{" "}
                which come complete with stamped structural calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
