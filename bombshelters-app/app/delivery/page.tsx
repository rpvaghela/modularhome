import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  HardHat,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Anchor,
  FileCheck2,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Delivery & Subterranean Crane Setting | BombShelters.com",
  description:
    "Comprehensive guide to nationwide bunker delivery, excavation requirements, heavy crane rigging, backfill engineering, and cathodic corrosion protection.",
};

export default function DeliveryPage() {
  const steps = [
    {
      step: "01",
      title: "Soil & Water Table Assessment",
      desc: "Prior to delivery, our engineering team assists with geotechnical soil evaluations. We determine bedrock depth, soil expansive index, and seasonal water table levels to engineer correct ballast anchors.",
    },
    {
      step: "02",
      title: "Precision Excavation",
      desc: "The trench is excavated to the engineered depth with a minimum 6-inch compacted gravel or concrete ballast pad. Slope stability and trench shoring ensure complete installation safety.",
    },
    {
      step: "03",
      title: "Nationwide Heavy Freight Transit",
      desc: "Your shelter ships on specialized lowboy trailers with certified oversized transport permits. Direct factory dispatch reaches remote acreage and off-grid retreats in all 50 states.",
    },
    {
      step: "04",
      title: "Heavy Crane Rigging & Setting",
      desc: "A licensed crane team hoists the shelter using certified rigging points, gently seating it onto the prepared foundation pad. Laser leveling verifies grade tolerance within 1/8th of an inch.",
    },
    {
      step: "05",
      title: "Cathodic Protection & Weeping Drainage",
      desc: "Sacrificial magnesium/zinc anodes are welded to cathodic test stations, and perforated French drainage tiles are positioned around the perimeter to prevent hydrostatic groundwater pressure.",
    },
    {
      step: "06",
      title: "Engineered Backfill & Concealment",
      desc: "Soil is backfilled in 12-inch compacted lifts up to the engineered crown depth. Emergency escape hatches, air intake manifolds, and blast blast valves are calibrated and sealed.",
    },
  ];

  const siteChecklist = [
    "Minimum 12-foot wide ingress pathway for lowboy delivery trailer",
    "Overhead clearance clear of low power lines and overhanging tree limbs (14ft min)",
    "Excavation contractor lined up or contracted through our nationwide network",
    "Local 811 utility mark-outs completed prior to any excavation ground-break",
    "Crane staging pad leveled within 40 feet of the target excavation pit",
    "Ballast anchor gravel or poured concrete foundation slab cured and ready",
  ];

  return (
    <>
      <SubPageHeader
        badge="LOGISTICS & RIGGING"
        title="DELIVERY & SUBTERRANEAN"
        highlight="CRANE SETTING"
        description="From heavy-haul highway permits to precision underground placement and cathodic corrosion defense, our nationwide logistics network ensures seamless execution."
        breadcrumbs={[{ label: "Delivery & Crane Setting" }]}
      />

      <section className="bg-paper text-[#0a0a0a] py-16">
        <div className="site-container">
          {/* Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#e11d1d] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <span>SEAMLESS NATIONWIDE DEPLOYMENT</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
                Engineered for Direct Property Delivery Across America
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                Delivering and burying a 20,000 to 60,000-pound structural steel bunker requires military-grade planning and logistical coordination. BombShelters.com coordinates the complete lifecycle — freight transit, DOT oversized transport permits, certified crane staging, and on-site placement.
              </p>
              <p className="mt-3 text-gray-700 leading-relaxed text-sm sm:text-base">
                Whether you are installing on an urban residential lot, rural homestead, or isolated mountain ridge, our certified logistics network reaches all 50 states with zero guesswork.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button asLink href="/quote" size="md">
                  <span>Calculate Delivery Cost</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Button asLink href="/contact" variant="outline" size="md">
                  <span>Inquire About Your Site</span>
                </Button>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-[#0f1115] text-white border border-[#22252a] relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-[#e11d1d]/20 text-[#ff4d4d] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg uppercase tracking-wide">
                    Logistical Guarantee
                  </h3>
                  <div className="text-xs text-gray-400">Insured Heavy-Haul Transit</div>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                  <span>Full-value transit insurance on all shelter models from factory to hook-up.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                  <span>Factory-engineered lifting lugs rated to 4x working load limit (WLL).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                  <span>Complete installation binder provided with certified engineering stamps.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Step Sequence */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                6-Phase Subterranean Installation Process
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                How our vetted excavation and rigging crews ensure a lifetime of subterranean integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#e11d1d] hover:shadow-lg transition-all group"
                >
                  <div className="text-3xl font-display font-black text-[#e11d1d] mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-display font-bold text-base text-[#0a0a0a] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Site Readiness Checklist */}
          <div className="p-8 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight">
                  Property &amp; Site Readiness Checklist
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Ensure your property is prepped prior to delivery day arrival.
                </p>
              </div>
              <Button asLink href="/upload-floor-plan" size="sm">
                <span>Upload Site Map</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded bg-white border border-gray-200 text-xs sm:text-sm text-[#0a0a0a]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have Questions About Rigging on Your Property?"
        subtitle="Submit your parcel address or coordinates. Our dispatch specialists will verify route clearances, crane access radius, and local excavation partners."
        ctaText="Check Delivery to Your Site"
        ctaHref="/contact"
      />
    </>
  );
}
