import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import FaqAccordion, { FaqItem } from "@/components/FaqAccordion";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("faqs");
  const title = page?.seoTitle || "Frequently Asked Questions (FAQs) | ModularHome.com";
  const description = page?.metaDescription || "Find clear answers to common questions regarding modular homes, factory construction, building permits, financing, delivery logistics, and warranties.";
  const canonical = getCanonicalUrl("/faqs");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Modular Home FAQs" }],
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

const MODULAR_FAQS: FaqItem[] = [
  // General & Distinction
  {
    category: "General",
    question: "What is the difference between a modular home and a manufactured (mobile) home?",
    answer: "Modular homes are built in factory modules to the exact same local state and municipal building codes (IRC / IBC) as traditional site-built homes. They are permanently attached to standard foundations (crawlspace, slab, or basement), appraise identically to stick-built homes, and appreciate in value over time. In contrast, manufactured homes are built to federal HUD code standards with permanent steel chassis.",
  },
  {
    category: "General",
    question: "How long does it take to build and move into a modular home?",
    answer: "A typical modular home project takes 8 to 16 weeks from initial permit approval to final move-in. Because site preparation and foundation work happen concurrently while the modules are built in our factory, build timelines are approximately 50% faster than traditional on-site construction.",
  },
  {
    category: "Permits & Codes",
    question: "Do modular homes meet my local city and state building codes?",
    answer: "Yes, 100%. Prior to fabrication, our engineers stamp architectural blueprints to comply with your state's specific International Residential Code (IRC), energy codes, snow load, seismic ratings, and high-wind hurricane zone requirements.",
  },
  {
    category: "Permits & Codes",
    question: "Who is responsible for securing the local building permits?",
    answer: "We supply you or your local licensed general contractor with fully engineered, state-stamped architectural plans and foundation drawings required by your municipal building department. Your local contractor typically submits the permit package to your local building department.",
  },
  // Customization & Floor Plans
  {
    category: "Customization",
    question: "Can I customize an existing floor plan or bring my own layout?",
    answer: "Yes! All of our floor plans can be customized. You can alter interior room layouts, add bedrooms, expand living areas, modify window and door placements, and select custom finishes. You can also upload your own architectural sketches through our Upload Floor Plan portal.",
  },
  {
    category: "Customization",
    question: "What finishes and appliances come pre-installed?",
    answer: "Our standard and architectural packages include pre-installed drywall, interior painting, electrical wiring, plumbing rough-ins and fixtures, kitchen cabinetry, countertops, and luxury vinyl or tile flooring. Upgrades such as quartz countertops, custom tile showers, and appliance packages are readily available.",
  },
  // Foundation & Construction
  {
    category: "Construction",
    question: "What type of foundation is required for a modular home?",
    answer: "Modular homes can be installed on poured concrete stem-wall crawlspaces, full basements (providing extra living space or storage), or engineered concrete slab foundations. Our engineering team provides foundation schematics customized to your chosen model.",
  },
  {
    category: "Construction",
    question: "Are modular homes more durable than stick-built homes?",
    answer: "Yes. Modular homes must be engineered to withstand high-speed highway transport and crane rigging, requiring 20%–30% more framing lumber, structural adhesive, and steel strapping than traditional site-built homes. Multiple FEMA studies have noted that modular homes withstand hurricane winds significantly better than standard site-built structures.",
  },
  // Financing & Pricing
  {
    category: "Financing",
    question: "How do I finance a modular home purchase?",
    answer: "Modular homes qualify for standard conventional 15 and 30-year mortgages, construction-to-permanent single-close loans, FHA loans (as low as 3.5% down), and VA loans (0% down for veterans). Lenders appraise modular homes using traditional site-built comparable sales.",
  },
  {
    category: "Financing",
    question: "Are there hidden costs in modular construction?",
    answer: "We believe in 100% pricing transparency. Your total project investment consists of: (1) The factory module contract price, (2) Freight transport and crane setting fees, (3) Site preparation & foundation (managed locally), and (4) Utility connection hookups. We provide itemized cost worksheets upfront.",
  },
  // Delivery & Setting
  {
    category: "Delivery",
    question: "How are the modules delivered and set on my property?",
    answer: "Modules are transported using specialized air-ride heavy carrier trucks and hoisted onto your foundation using a commercial hydraulic crane. Setting the modules and securing the roof weather-tight typically takes only 1 to 2 days.",
  },
  {
    category: "Delivery",
    question: "What are the site access requirements for delivery trucks?",
    answer: "Delivery trucks typically require a 12 to 14-foot wide road clearance with clear overhead room (no low-hanging tree limbs or low power lines). Our logistics team reviews satellite maps and site access videos before dispatching shipments.",
  },
];

export default async function FaqsPage() {
  const page = await getPublicPageBySlug("faqs");

  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    return <DynamicPageRenderer page={page} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MODULAR_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
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
          <span className="text-[#d97706] font-bold">Frequently Asked Questions</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Knowledge Base & Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about factory modular building, architectural customization, site engineering, permits, and financing.
          </p>
        </div>
      </section>

      {/* FAQ Search & Interactive Accordion */}
      <section className="py-14 bg-white">
        <div className="wrap">
          <FaqAccordion faqs={MODULAR_FAQS} />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-12 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center mx-auto font-black shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Still Have Questions About Your Build?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Our modular housing specialists are here to assist with zoning questions, preliminary floor plan recommendations, and ballpark cost estimates.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all flex items-center gap-2"
            >
              <span>Contact a Modular Specialist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quote"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
