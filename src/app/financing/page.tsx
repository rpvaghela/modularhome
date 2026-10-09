import { Metadata } from "next";
import Link from "next/link";
import { 
  Landmark, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Percent, 
  BadgeDollarSign, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("financing");
  const title = page?.seoTitle || "Modular Home Financing & Loan Programs | ModularHome.com";
  const description = page?.metaDescription || "Explore flexible financing options for your modular home or prefab cabin. Construction-to-permanent loans, land-home packages, and FHA/VA options.";
  const canonical = getCanonicalUrl("/financing");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: "/newmodularlogo.png", alt: "Modular Home Financing" }],
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

const LOAN_TYPES = [
  {
    icon: Landmark,
    title: "Construction-to-Permanent Loan",
    tag: "Most Popular for New Builds",
    description: "A single-closing loan that funds both the factory modular construction and the final site assembly, automatically converting into a standard 30-year fixed mortgage once your certificate of occupancy is issued.",
    features: [
      "One single set of closing costs & fees",
      "Locks in your permanent mortgage interest rate upfront",
      "Interest-only payments during factory manufacturing",
      "Compatible with conventional 15 & 30-year terms",
    ],
  },
  {
    icon: BadgeDollarSign,
    title: "Land & Home Bundled Mortgages",
    tag: "Zero Land Equity Required",
    description: "Finance the purchase of your vacant land lot, site utility connections, and your chosen modular home all within one unified monthly mortgage payment.",
    features: [
      "Use existing land equity toward down payment requirements",
      "Includes excavation, septic, well, and foundation costs",
      "Down payments as low as 3.5% with FHA backing",
      "Ideal for rural, suburban, and mountain properties",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Government-Backed (FHA / VA / USDA)",
    tag: "Low Down Payment & Veterans",
    description: "Because our off-site modular homes are permanently affixed to code-compliant concrete foundations, they qualify 100% for standard FHA, VA (0% down for veterans), and USDA rural housing loans.",
    features: [
      "FHA down payment as low as 3.5%",
      "VA 0% down financing for eligible military members",
      "USDA 0% down for qualifying rural locations",
      "Lower credit score threshold requirements",
    ],
  },
  {
    icon: CreditCard,
    title: "ADU & Accessory Unit Financing",
    tag: "Home Equity & Personal Loans",
    description: "Looking to install a backyard granny pod, rental ADU, or guest cabin? Leverage HELOCs, cash-out refinances, or specialized unsecured home improvement loans.",
    features: [
      "No mortgage modification required for HELOC loans",
      "Fast approvals in 3 to 7 business days",
      "Projected rental income can offset debt-to-income limits",
      "Term lengths from 5 to 20 years",
    ],
  },
];

const FINANCING_STEPS = [
  {
    num: "01",
    title: "Prequalification & Budgeting",
    desc: "Speak with one of our approved modular lending partners to assess your buying power, determine your monthly comfort zone, and receive your prequalification letter.",
  },
  {
    num: "02",
    title: "Floor Plan & Site Estimate",
    desc: "Select your desired floor plan, finalize structural options, and combine the factory module cost with local site preparation (foundation, crane, utilities).",
  },
  {
    num: "03",
    title: "Loan Approval & Draw Schedule",
    desc: "Your lender approves the comprehensive project package and establishes factory milestone disbursements (draw schedule) directly with the manufacturing facility.",
  },
  {
    num: "04",
    title: "Occupancy & Conversion",
    desc: "Once your home is placed, utility connections are certified, and the city inspector issues your Certificate of Occupancy, the loan converts into your permanent mortgage.",
  },
];

const FAQS = [
  {
    q: "Do modular homes appraise and finance the same as traditional houses?",
    a: "Yes, 100%. Once placed on a permanent foundation, modular homes are legally classified as real property and are appraised using standard site-built comparable sales. They qualify for all conventional Fannie Mae, Freddie Mac, FHA, VA, and USDA mortgages.",
  },
  {
    q: "Can I use equity in my existing land toward my down payment?",
    a: "Absolutely. If you already own your building lot, lenders will factor the appraised market value of your land directly into your down payment equity requirement, often eliminating the need for cash out of pocket.",
  },
  {
    q: "How are factory payments disbursed during the build?",
    a: "Lenders operate on an escrow draw schedule: typical milestones include deposit for engineering and materials, completion of the factory module framing/enclosure, shipping/delivery to your site, and final foundation set and trim out.",
  },
];

export default async function FinancingPage() {
  const page = await getPublicPageBySlug("financing");

  if (page && ((page.sections && page.sections.length > 0) || (page.content && page.content.trim().length > 50))) {
    return <DynamicPageRenderer page={page} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Modular Home Financing",
    description: "Financing guides, loan structures, and construction-to-permanent mortgages for modular homes.",
    url: "https://modularhome.com/financing",
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      logo: "https://modularhome.com/newmodularlogo.png",
    },
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
          <span className="text-[#d97706] font-bold">Financing</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap max-w-4xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] mb-3 bg-[#fef3c7] px-3 py-1 rounded-full">
            <Percent className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Smart Home Lending</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
            Modular Home Financing & Loan Programs
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            Turn your dream home into an affordable reality. We partner with leading nationwide lenders who specialize in construction-to-permanent modular loans and land packages.
          </p>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-14 bg-white">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Flexible Loan Solutions Tailored to You
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Whether building a primary home, secondary cabin, or rental ADU, there is a loan program designed for your budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {LOAN_TYPES.map((loan, idx) => {
              const Icon = loan.icon;
              return (
                <div key={idx} className="bg-[#f8f9fa] border border-[#e7e9ee] p-6 sm:p-8 rounded-[18px] flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 text-[#d97706] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#e7e9ee] text-[#101114]">
                        {loan.tag}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#101114] mb-2">{loan.title}</h3>
                    <p className="text-xs text-[#6b7280] leading-relaxed mb-6">{loan.description}</p>
                    <div className="space-y-2.5">
                      {loan.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#374151]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
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

      {/* 4-Step Process */}
      <section className="py-14 bg-[#f8f9fa] border-y border-[#e7e9ee]">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              The 4-Step Financing Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              From initial pre-approval to final conversion, we streamline every milestone with your lender.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FINANCING_STEPS.map((step) => (
              <div key={step.num} className="bg-white p-6 rounded-[16px] border border-[#e7e9ee] relative">
                <div className="text-3xl font-black text-[#fcb907] mb-3">{step.num}</div>
                <h3 className="text-sm font-black text-[#101114] mb-2">{step.title}</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-white">
        <div className="wrap max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Financing Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 bg-[#f8f9fa] rounded-[14px] border border-[#e7e9ee]">
                <h3 className="font-bold text-sm text-[#101114] flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-[#6b7280] leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Get Connected with an Approved Modular Lender
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Our financing specialists can pair you with loan officers experienced in off-site modular home mortgages in your specific state.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all flex items-center gap-2"
            >
              <span>Request Pre-Approval Assistance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[10px] transition-all"
            >
              Speak with a Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
