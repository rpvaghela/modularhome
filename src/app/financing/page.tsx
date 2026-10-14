import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Landmark, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Percent, 
  BadgeDollarSign, 
  HelpCircle,
  PhoneCall,
  Home
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const ACCURATE_MODULAR_FINANCING_IMAGE = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("financing");
  const title = page?.seoTitle || "Modular Home Financing & Loan Programs | ModularHome.com";
  const description = page?.metaDescription || "Explore flexible financing options for your modular home or prefab cabin. Construction-to-permanent loans, land-home packages, and FHA/VA options.";
  const canonical = getCanonicalUrl("/financing");
  const metaImage = page?.featuredImage || ACCURATE_MODULAR_FINANCING_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: metaImage, alt: "Modular Home Financing & Loans" }],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Modular Home Financing",
    description: "Financing guides, loan structures, and construction-to-permanent mortgages for modular homes.",
    url: "https://modularhome.com/financing",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ACCURATE_MODULAR_FINANCING_IMAGE,
    },
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
          <span className="text-[#d97706] font-bold">Financing &amp; Loans</span>
        </div>
      </div>

      {/* Hero Section with Accurate Modular Home Picture */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#e7e9ee]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] bg-[#fef3c7] px-3.5 py-1.5 rounded-full">
                <Percent className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Smart Home Lending</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-1.5px] text-[#101114] leading-[1.05] font-display">
                Modular Home Financing &amp; Loan Programs
              </h1>

              <p className="text-base sm:text-lg text-[#4b5563] leading-relaxed font-body">
                Turn your dream home into an affordable reality. Because our homes are built to state residential building codes and installed on permanent concrete foundations, they qualify 100% for standard 30-year conventional, FHA, VA, and USDA mortgages.
              </p>

              {/* Value Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-[#e7e9ee] shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-display">3.5%</div>
                  <div className="text-[11px] font-semibold text-[#6b7280]">Down Payment (FHA)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#e7e9ee] shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-[#101114] font-display">0% Down</div>
                  <div className="text-[11px] font-semibold text-[#6b7280]">For Eligible VA &amp; USDA</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#e7e9ee] shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-[#d97706] font-display">1-Close</div>
                  <div className="text-[11px] font-semibold text-[#6b7280]">Construction-to-Perm</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/quote"
                  className="px-6 py-3.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Check Loan Pre-Approval</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-[#d5d9e0] text-[#101114] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>View Pricing &amp; Packages</span>
                </Link>
              </div>
            </div>

            {/* Right: Accurate Modular Home Picture */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden border border-[#e7e9ee] shadow-2xl group">
                <Image
                  src={ACCURATE_MODULAR_FINANCING_IMAGE}
                  alt="Precision Factory-Built Modular Residence with Permanent Foundation — ModularHome.com Financing"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                    Real Modular Home Model
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/75 backdrop-blur-md text-white border border-white/15">
                  <div className="text-xs uppercase font-extrabold tracking-wider text-[#fcb907]">
                    100% Mortgage Eligible
                  </div>
                  <div className="text-sm font-bold mt-0.5 text-white/95">
                    Permanent Foundation • Conventional, FHA, VA &amp; USDA Loans
                  </div>
                  <div className="text-[11px] text-white/70 mt-1">
                    Appraises Identically to Site-Built Real Estate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-16 bg-white">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Modular Mortgage Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101114] tracking-tight font-display mt-1">
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
                <div key={idx} className="bg-[#f8f9fa] border border-[#e7e9ee] p-6 sm:p-8 rounded-[20px] flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#fcb907]/20 text-[#d97706] flex items-center justify-center">
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
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#374151]">
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
      <section className="py-16 bg-[#f8f9fa] border-y border-[#e7e9ee]">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Clear Milestone Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101114] tracking-tight font-display mt-1">
              The 4-Step Financing Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              From initial pre-approval to final conversion, we streamline every milestone with your lender.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FINANCING_STEPS.map((step) => (
              <div key={step.num} className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] relative shadow-2xs hover:shadow-md transition-shadow">
                <div className="text-3xl font-black text-[#fcb907] mb-3 font-mono">{step.num}</div>
                <h3 className="text-sm font-black text-[#101114] mb-2">{step.title}</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="wrap max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Buyer Knowledge
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101114] tracking-tight font-display mt-1">
              Financing Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 bg-[#f8f9fa] rounded-[18px] border border-[#e7e9ee]">
                <h3 className="font-bold text-sm text-[#101114] flex items-center gap-2.5 mb-2">
                  <HelpCircle className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-[#4b5563] leading-relaxed pl-6.5 font-body">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#fcb907] text-xs font-black uppercase tracking-widest">
            <span>Approved Lending Network</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
            Get Connected with an Approved Modular Lender
          </h2>

          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Our financing specialists can pair you with loan officers experienced in off-site modular home mortgages in your specific state.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-4 px-7 rounded-[12px] transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <span>Request Pre-Approval Assistance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:8125954033"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-4 px-7 rounded-[12px] transition-all border border-white/20 inline-flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#fcb907]" />
              <span>Call 812-595-4033</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
