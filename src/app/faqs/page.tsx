import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  Building,
  PhoneCall,
  Clock
} from "lucide-react";
import FaqAccordion, { FaqItem } from "@/components/FaqAccordion";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const ACCURATE_FAQS_HERO_IMAGE = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("faqs");
  const title = page?.seoTitle || "Frequently Asked Questions (FAQs) | ModularHome.com";
  const description = page?.metaDescription || "Find clear answers to common questions regarding modular homes, factory construction, building permits, financing, delivery logistics, and warranties.";
  const canonical = getCanonicalUrl("/faqs");
  const metaImage = page?.featuredImage || ACCURATE_FAQS_HERO_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: metaImage, alt: "Modular Home FAQs" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [metaImage],
    },
  };
}

const MODULAR_FAQS: FaqItem[] = [
  // General & Distinction
  {
    category: "General & Distinction",
    question: "What is the critical difference between a modular home and a manufactured (mobile) home?",
    answer: "Modular homes are built in climate-controlled factory modules to the exact same local state and municipal building codes (IRC / IBC) as custom site-built homes. They are permanently attached to standard foundations (crawlspace, slab, or basement), appraise identically to stick-built homes, and appreciate in value over time. In contrast, manufactured homes are built to federal HUD code on non-removable steel chassis and often depreciate.",
  },
  {
    category: "General & Distinction",
    question: "How long does the entire modular building process take from contract to move-in?",
    answer: "A typical modular home project takes 8 to 16 weeks from permit issuance to key handover. Because site excavation and foundation work happen concurrently while your modules are engineered in our factory, overall construction timelines are 50% faster than traditional on-site stick building.",
  },
  {
    category: "General & Distinction",
    question: "Do modular homes appraise and appreciate like traditional stick-built houses?",
    answer: "Yes, 100%. Once set on a permanent foundation, real estate appraisers evaluate modular homes using identical site-built comparable sales. Modular homes appreciate in market value alongside standard neighbourhood homes and qualify for the exact same resale mortgages.",
  },

  // Costs & Pricing
  {
    category: "Costs & Pricing",
    question: "What is the average cost per square foot for a modular home?",
    answer: "Factory-built modular structures typically cost between $110 to $195 per square foot for standard and architectural signature models, and $210 to $290+ per square foot for ultra-luxury bespoke models. Turnkey site work (excavation, foundation, and utility hookups) varies by property and municipality.",
  },
  {
    category: "Costs & Pricing",
    question: "Are there hidden costs in modular construction?",
    answer: "We guarantee complete line-item transparency. Your total project investment consists of: (1) The factory module contract price, (2) Freight transport and crane setting fees, (3) Local site preparation & foundation, and (4) Utility hookups and finish button-up. We provide itemized cost worksheets upfront so there are zero surprises.",
  },
  {
    category: "Costs & Pricing",
    question: "How much money do I save compared to hiring an on-site custom builder?",
    answer: "Homeowners typically save 15% to 25% overall. Savings stem from bulk factory material purchasing, zero weather-related damage, precision automated framing, and drastically reduced construction loan interest payments due to 50% shorter build timelines.",
  },

  // Financing & Mortgages
  {
    category: "Financing & Mortgages",
    question: "How do I finance a modular home purchase?",
    answer: "Modular homes qualify for standard conventional 15- and 30-year mortgages, single-close construction-to-permanent loans, FHA loans (3.5% down), and VA loans (0% down for veterans). Lenders disburse funds in milestone draws directly to the factory and foundation contractor.",
  },
  {
    category: "Financing & Mortgages",
    question: "Can I use the equity in my land as the down payment?",
    answer: "Yes! If you already own your building parcel free-and-clear or have significant equity, most construction-to-permanent lenders permit you to use your land value toward the loan's required down payment.",
  },
  {
    category: "Financing & Mortgages",
    question: "Does ModularHome work with approved construction lenders?",
    answer: "Yes. We partner with national and regional mortgage lenders who specialize in factory modular single-close financing. We provide all required factory draw schedules, builder risk insurance, and architectural specifications directly to your loan officer.",
  },

  // Permits & IRC Codes
  {
    category: "Permits & IRC Codes",
    question: "Do modular homes meet my local city and state building codes?",
    answer: "Yes, 100%. Prior to fabrication, our licensed engineers stamp architectural blueprints to comply strictly with your state's International Residential Code (IRC), International Building Code (IBC), local energy efficiency codes, and regional seismic or high-wind requirements.",
  },
  {
    category: "Permits & IRC Codes",
    question: "Who is responsible for securing local building permits?",
    answer: "We supply you or your licensed general contractor with complete, state-stamped architectural drawings, structural engineering calculations, and foundation anchor plans. Your local general contractor or our turnkey project partner submits this package to your county or municipal building department.",
  },
  {
    category: "Permits & IRC Codes",
    question: "Will HOA (Homeowners Association) bylaws permit a modular home?",
    answer: "Because modular homes meet standard IRC residential codes and are indistinguishable from site-built homes once installed, virtually all HOA bylaws allow modular homes. In contrast, HOAs frequently restrict HUD-code mobile homes.",
  },

  // Engineering & Durability
  {
    category: "Engineering & Durability",
    question: "Are modular homes structurally stronger than stick-built homes?",
    answer: "Yes. Modular homes must be engineered to withstand 65 MPH highway transit vibrations and crane hoisting. They utilize 20% to 30% more structural framing lumber, heavy steel tie plates, and industrial framing adhesives. Independent FEMA assessments after major hurricanes noted that modular homes survived storm forces significantly better than on-site stick-built houses.",
  },
  {
    category: "Engineering & Durability",
    question: "What wind and snow loads are your modular homes rated for?",
    answer: "Our cold-formed steel and heavy timber modular homes are engineered to withstand wind speeds up to 150+ MPH (Category 4/5 hurricane zones) and heavy snow loads up to 50–70 PSF in alpine mountain territories.",
  },
  {
    category: "Engineering & Durability",
    question: "What warranty coverage is included with my home?",
    answer: "Every home includes a comprehensive 10-Year Major Structural Defect Warranty, a 2-Year Mechanical/Electrical/Plumbing System Warranty, a 1-Year Workmanship Warranty, plus individual manufacturer warranties on roofing (up to 40 years) and appliances.",
  },

  // Delivery & Crane Setting
  {
    category: "Delivery & Crane Setting",
    question: "How are the modules delivered and set on my property?",
    answer: "Modules are transported using heavy-duty air-ride carrier trailers accompanied by certified DOT escorts. On set day, a commercial hydraulic crane lifts each module onto the cured foundation where our set crew bolts them to engineered anchor plates and secures the roof weather-tight within 24 to 48 hours.",
  },
  {
    category: "Delivery & Crane Setting",
    question: "What are the site access requirements for delivery trucks and the crane?",
    answer: "Trailers require a minimum 14-foot wide road or driveway with cleared overhead limbs and power lines up to 14 feet. A compacted, level 30' x 40' pad adjacent to the foundation is required for crane outrigger stabilization.",
  },
  {
    category: "Delivery & Crane Setting",
    question: "Can modular homes be delivered to steep or remote mountain sites?",
    answer: "Yes! Our logistics team conducts pre-shipment satellite route feasibility and road surveys. In tight or steep terrain, specialized steerable dollies or crawler transporters can navigate winding private roads.",
  },

  // Floor Plans & Customization
  {
    category: "Floor Plans & Customization",
    question: "Can I customize an existing floor plan or bring my own layout?",
    answer: "Absolutely. You can alter interior room layouts, expand living areas, add bedrooms, adjust window configurations, and select custom finishes. You can also upload your own architectural sketch or CAD file to our engineering team for custom pricing.",
  },
  {
    category: "Floor Plans & Customization",
    question: "What finishes, fixtures, and appliances come pre-installed?",
    answer: "Modules arrive from the factory with drywall finished, interior walls primed and painted, luxury vinyl or tile flooring installed, kitchen cabinetry hung, solid-surface countertops mounted, and plumbing/electrical fixtures in place. Final seam carpet or trim connections are completed on-site.",
  },
];

export default async function FaqsPage() {
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

      {/* Hero Section with Authentic Modular Home Photo */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] via-white to-white border-b border-[#e7e9ee]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Messaging */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] bg-[#fef3c7] px-3.5 py-1.5 rounded-full">
                <HelpCircle className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Knowledge Base & Buyer Guide</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
                Modular Home Questions, Answered Transparently
              </h1>
              <p className="text-base sm:text-lg text-[#4b5563] leading-relaxed">
                Clear, factual answers on building codes, turnkey costs, construction-to-permanent mortgages, factory engineering standards, and crane delivery day.
              </p>

              {/* Core Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">100% IRC / IBC Code Compliant</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">FHA, VA & Conventional Loans</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <Clock className="w-5 h-5 text-[#d97706] shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">50% Faster Build Timelines</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">10-Year Structural Warranty</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Modular Residence Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100 group">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={ACCURATE_FAQS_HERO_IMAGE}
                    alt="Authentic Precision Modular Residence"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50 text-[11px] font-black text-[#101114] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real Factory Modular Construction</span>
                </div>

                {/* Bottom Caption Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-white/60">
                  <div className="text-xs font-black text-[#101114]">
                    The Modern Craftsman Modular Residence
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5 flex items-center justify-between">
                    <span>Precision Factory Framing • Permanent Foundation</span>
                    <span className="font-bold text-[#d97706]">IRC Certified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Search & Interactive Accordion */}
      <section className="py-16 bg-white">
        <div className="wrap max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Explore Questions by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Filter by topic or type a specific keyword into the search bar below.
            </p>
          </div>

          <FaqAccordion faqs={MODULAR_FAQS} />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-14 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center mx-auto font-black shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Still Have Questions About Your Build?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Our modular housing advisors are ready to walk through your local zoning, review preliminary site feasibility, and provide ballpark cost estimates.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Speak with a Modular Specialist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quote"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all border border-white/20"
            >
              Request Custom Project Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
