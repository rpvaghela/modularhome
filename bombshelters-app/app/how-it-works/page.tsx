import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  FileCheck2,
  HardHat,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Layers,
  Wrench,
  Award,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works: 5-Step Subterranean Build Process | BombShelters.com",
  description:
    "Explore our complete 5-step process from architectural threat assessment and factory steel fabrication to crane setting and turnkey survival commissioning.",
};

export default function HowItWorksPage() {
  const processSteps = [
    {
      step: "01",
      title: "Threat Assessment & Architectural Blueprint",
      subtitle: "Tailored to your family size, soil geology, and threat profile.",
      desc: "We begin with a comprehensive site and threat matrix consultation. Our engineers evaluate soil permeability, seasonal water table depth, and target overpressure requirements (10 to 50+ PSI). We create certified architectural CAD blueprints specifying electrical conduits, plumbing loops, and emergency escape vectors.",
      deliverables: ["Engineered CAD blueprints", "Soil & water table evaluation", "Fixed turnkey price quote"],
    },
    {
      step: "02",
      title: "Precision Factory Steel Fabrication",
      subtitle: "Built in certified American manufacturing facilities.",
      desc: "Your shelter is constructed using certified domestic structural steel plate and heavy corrugated arcs. Certified AWS welders assemble continuous seal welds, blast door frames, and intake/exhaust manifolds. Unlike thin corrugated culverts, our structural shells are heavy-gauge pressure vessels designed for deep subterranean burial.",
      deliverables: ["ASTM A36 certified steel", "Continuous air-tight welds", "Certified lifting lugs rated 4x WLL"],
    },
    {
      step: "03",
      title: "Coating, Testing & Life-Support Integration",
      subtitle: "Impermeable multi-layer protection and Swiss NBC validation.",
      desc: "The structural shell receives a multi-coat commercial coal tar epoxy membrane (rated for 100+ years of soil immersion) and sacrificial magnesium/zinc anodes. We install Swiss military-grade NBC air filtration systems, blast overpressure valves, airtight marine hatches, and EMP-shielded electrical distributions.",
      deliverables: ["100-year anti-corrosion barrier", "Positive-pressure smoke & seal test", "NBC filtration validation"],
    },
    {
      step: "04",
      title: "Nationwide Delivery & Subterranean Rigging",
      subtitle: "Coordinated heavy crane placement in all 50 states.",
      desc: "Your shelter is transported via heavy lowboy carrier with complete oversized hauling permits. On-site, our certified crane and rigging team hoists and seats the shelter onto a compacted gravel ballast or poured concrete foundation pad. Laser levels confirm grade tolerances within 1/8th inch.",
      deliverables: ["Oversized highway transport", "Licensed crane hoist & set", "French perimeter drainage tile"],
    },
    {
      step: "05",
      title: "Backfill, Commissioning & Final Handover",
      subtitle: "Turnkey readiness with complete system orientation.",
      desc: "The excavation is backfilled in 12-inch compacted lifts. Utilities (water, power, septic) are connected, and life-support systems are live-tested. Our team conducts an extensive owner orientation covering manual NBC blower operation, emergency escape protocols, and maintenance schedules.",
      deliverables: ["Compacted structural backfill", "Full life-support training", "Warranty & certification binder"],
    },
  ];

  return (
    <>
      <SubPageHeader
        badge="ENGINEERING ROADMAP"
        title="THE 5-STEP FACTORY TO"
        highlight="MOVE-IN PROCESS"
        description="From preliminary threat assessment and custom CAD blueprints to precision American steel fabrication and nationwide subterranean crane setting."
        breadcrumbs={[{ label: "How It Works" }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[#e11d1d] text-xs font-display font-bold uppercase tracking-wider mb-2">
              <span>PROVEN MANUFACTURING LIFECYCLE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
              How Your Shelter Comes to Life
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              We eliminate the stress and guesswork from building an underground bunker or hardened cabin. Here is exactly what happens from your first phone call to final handover.
            </p>
          </div>

          {/* Timeline Sequence */}
          <div className="space-y-12 max-w-4xl mx-auto">
            {processSteps.map((step, idx) => (
              <div
                key={step.step}
                className="relative flex flex-col md:flex-row gap-8 p-6 sm:p-8 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-[#e11d1d] hover:shadow-xl transition-all"
              >
                {/* Step badge */}
                <div className="flex flex-col items-center md:items-start shrink-0">
                  <span className="text-4xl sm:text-5xl font-display font-black text-[#e11d1d]">
                    {step.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">
                    PHASE {idx + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-[#0a0a0a]">
                    {step.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-[#e11d1d] mt-0.5 mb-3">
                    {step.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {step.desc}
                  </p>

                  <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    {step.deliverables.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-semibold text-gray-700 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e11d1d]" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl bg-[#0f1115] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e11d1d]/20 text-[#ff4d4d] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg uppercase tracking-wide">
                  Guaranteed Structural Integrity
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Every shelter comes with a lifetime structural steel warranty and certified blast engineering stamps.
                </p>
              </div>
            </div>

            <Button asLink href="/quote" size="md" className="shrink-0">
              <span>Start Phase 01</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Begin Step 01 For Your Property?"
        subtitle="Schedule a free preliminary consultation with our lead structural engineers. We review parcel viability, floor plan layouts, and deliverable timelines."
        ctaText="Schedule Your Consultation"
        ctaHref="/contact"
      />
    </>
  );
}

