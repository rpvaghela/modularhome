import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Users,
  Compass,
  ArrowRight,
  Download,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";
import { FLOOR_PLANS } from "@/data/floorPlans";
import { getBombShelterFloorPlans } from "@/lib/floorPlansStore";

export const metadata: Metadata = {
  title: "Hardened Shelter Floor Plans & Blueprints | BombShelters.com",
  description:
    "Browse engineered subterranean bunker floor plans, ballistic safe room layouts, and off-grid modular cabin blueprints.",
};

export default async function FloorPlansPage() {
  let plansToDisplay = FLOOR_PLANS;
  try {
    const dynamicPlans = await getBombShelterFloorPlans(true);
    if (dynamicPlans && dynamicPlans.length > 0) {
      plansToDisplay = dynamicPlans;
    }
  } catch (err) {
    console.warn("FloorPlansPage fallback:", err);
  }
  return (
    <>
      <SubPageHeader
        badge="ARCHITECTURAL BLUEPRINTS"
        title="HARDENED SHELTER &"
        highlight="CABIN FLOOR PLANS"
        description="Explore precision CAD floor plans engineered for subterranean survival, ballistic defense, and resilient off-grid living."
        breadcrumbs={[{ label: "Floor Plans" }]}
      />

      <section className="bg-paper text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
              Engineered Architectural Blueprints
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Each blueprint includes structural calculations, emergency escape vectors, NBC air duct manifolds, and plumbing rough-in schematics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plansToDisplay.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-[#e11d1d] transition-all group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-950">
                  <Image
                    src={plan.imageUrl}
                    alt={plan.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-display font-bold uppercase tracking-wider text-white bg-[#0a0a0a]/90 px-2.5 py-1 rounded backdrop-blur">
                    {plan.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#0a0a0a] group-hover:text-[#e11d1d] transition-colors">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      {plan.desc}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Area:</span>
                        <span className="font-bold text-[#0a0a0a]">{plan.sqft} Sq. Ft.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dimensions:</span>
                        <span className="font-semibold text-[#0a0a0a]">{plan.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Capacity:</span>
                        <span className="font-semibold text-[#0a0a0a]">{plan.occupancy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                    <Link
                      href={`/floor-plans/${plan.id}`}
                      className="flex-1 py-2.5 px-3 rounded bg-gray-100 hover:bg-[#0a0a0a] hover:text-white text-[#0a0a0a] font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors"
                    >
                      View Blueprint Specs
                    </Link>
                    <Link
                      href="/upload-floor-plan"
                      className="py-2.5 px-3 rounded bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-[11px] text-center transition-colors"
                    >
                      Customize
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have Your Own Sketch or Architectural Idea?"
        subtitle="Upload your custom CAD, PDF, or hand-drawn concept. Our structural blast engineers will turn your layout into certified stamped blueprints."
        ctaText="Upload Custom Sketch"
        ctaHref="/upload-floor-plan"
      />
    </>
  );
}

