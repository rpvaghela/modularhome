import { Metadata } from "next";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Wrench, 
  FileCheck, 
  KeyRound,
  Play
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("how-it-works");
  const title = page?.seoTitle || "How Modular Construction Works | Step-by-Step Guide";
  const description = page?.metaDescription || "Learn the 5-step precision modular home building process from custom floor plan engineering to factory fabrication, crane setting, and turnkey move-in.";
  const canonical = getCanonicalUrl("/how-it-works");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "How Modular Construction Works" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/newmodularlogo.png"],
    },
  };
}

const PROCESS_STEPS = [
  {
    step: "01",
    icon: FileCheck,
    title: "Floor Plan Selection & Customization",
    subtitle: "Weeks 1 – 2",
    description: "Choose from our extensive catalog of architect-designed modular floor plans, barndominiums, and cabin kits, or upload your own architectural sketches. Customize room dimensions, window placements, electrical layouts, and interior fixtures with our design consultants.",
    highlights: [
      "Extensive library of 1 to 5+ bedroom models",
      "Flexible architectural customization options",
      "Real-time itemized price estimates and material selection",
    ],
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "State-Stamped Engineering & Permitting",
    subtitle: "Weeks 3 – 5",
    description: "Our licensed engineering team drafts complete state-approved structural blueprints, wind/snow load calculations, thermal compliance calculations, and foundation specifications designed for your specific building site and municipal requirements.",
    highlights: [
      "State-specific engineering seals & calculations",
      "Standardized plans accelerate local permit approval",
      "Coordination with local general contractors or self-builders",
    ],
  },
  {
    step: "03",
    icon: Wrench,
    title: "Concurrent Factory Fabrication & Site Prep",
    subtitle: "Weeks 6 – 10",
    description: "While your local contractor excavates your site and pours your concrete foundation, your home is constructed inside our climate-controlled factory. Drywall, electrical wiring, plumbing rough-ins, cabinetry, insulation, and windows are installed with laser-guided precision.",
    highlights: [
      "Zero exposure to rain, snow, mold, or moisture damage",
      "Concurrent workflow cuts overall construction time in half",
      "Multi-point quality control inspections at every station",
    ],
  },
  {
    step: "04",
    icon: Truck,
    title: "Transportation & Crane Setting Day",
    subtitle: "Week 11",
    description: "Your finished modular sections are wrapped in heavy-duty weatherproof barriers, transported via carrier trucks to your property, and hoisted onto your prepared foundation using a commercial crane. The structural modules are securely locked together and made completely weather-tight within 24–48 hours.",
    highlights: [
      "Structure is 85%–90% complete upon arrival",
      "Rapid crane setting prevents on-site weather delays",
      "Heavy-duty steel strapping and tie-down anchor bolts",
    ],
  },
  {
    step: "05",
    icon: KeyRound,
    title: "Interior Stitching, Utilities & Move-In",
    subtitle: "Weeks 12 – 14",
    description: "The finish crew connects plumbing lines, finalizes electrical panel connections, joins the roof ridgeline, patches marriage-line drywall, and installs any porch or exterior siding transitions. Once the local municipal building inspector conducts the final inspection, you receive your keys!",
    highlights: [
      "Final utility hookups to electric, water, and septic/sewer",
      "Full clean-up, touch-up painting, and quality walkthrough",
      "Handover of keys and 10-year structural warranty certificate",
    ],
  },
];

export default async function HowItWorksPage() {
  const page = await getPublicPageBySlug("how-it-works");

  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    return <DynamicPageRenderer page={page} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Modular Home Construction Works",
    description: "A complete step-by-step guide explaining modular home fabrication, shipping, crane setting, and turnkey move-in.",
    step: PROCESS_STEPS.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#101114]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#e7e9ee] bg-[#fbfbfc]">
        <div className="wrap py-3 text-xs text-[#6b7280] flex items-center gap-2">
          <Link href="/" className="hover:text-[#101114] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#d97706] font-bold">How It Works</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Faster, Smarter, Stronger</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
            How Modular Construction Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            Discover the streamlined, factory-controlled building method that delivers superior structural strength in half the time of traditional stick-built construction.
          </p>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="py-16 bg-white">
        <div className="wrap max-w-5xl">
          <div className="space-y-12">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="flex flex-col md:flex-row items-start gap-6 sm:gap-10 p-6 sm:p-8 rounded-[20px] bg-[#f8f9fa] border border-[#e7e9ee] hover:border-[#fcb907] transition-all"
                >
                  <div className="shrink-0 flex md:flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#101114] text-[#fcb907] flex items-center justify-center font-black text-xl shadow-md">
                      {step.step}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] bg-[#fef3c7] px-2.5 py-1 rounded-md">
                      {step.subtitle}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-5 h-5 text-[#d97706]" />
                      <h2 className="text-xl sm:text-2xl font-black text-[#101114] tracking-tight">
                        {step.title}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                      {step.description}
                    </p>
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-[#374151]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Banner Callout */}
      <section className="py-14 bg-[#f8f9fa] border-t border-[#e7e9ee]">
        <div className="wrap max-w-4xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#101114] text-[#fcb907] flex items-center justify-center mx-auto shadow-lg">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
            Watch a Real Crane Setting Day in Action
          </h2>
          <p className="text-xs sm:text-sm text-[#6b7280] max-w-xl mx-auto">
            Experience the precision engineering of our factory modules arriving on site and locking together in real time.
          </p>
          <div className="pt-2">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 bg-[#101114] hover:bg-[#262830] text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-[10px] transition-all"
            >
              <span>Explore Home Tours & Video Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-12 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Start Your Modular Journey Today
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Browse our floor plans or submit your custom layout to get an itemized pricing proposal.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/floor-plans"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all flex items-center gap-2"
            >
              <span>Browse Modular Floor Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/upload-floor-plan"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all"
            >
              Upload Custom Plan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
