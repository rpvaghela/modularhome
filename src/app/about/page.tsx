import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building,
  Award,
  Truck,
  Clock,
  Sparkles,
  Zap,
  Leaf,
  DollarSign,
  Layers,
  HelpCircle,
  Home,
  PhoneCall,
  ChevronDown,
  Wrench,
  FileCheck,
  Check,
  X
} from "lucide-react";
import StatsSection from "@/components/StatsSection";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("about");
  const title = page?.seoTitle || "About Modular Homes & ModularHome.com | Modern Prefab Guide";
  const description = page?.metaDescription || "Learn what modular homes are, how factory precision construction works, the key differences between modular, manufactured, and traditional site-built homes, and why ModularHome.com is America's leading modern housing marketplace.";
  const canonical = page?.canonicalUrl || getCanonicalUrl("/about");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: page?.featuredImage ? [{ url: page.featuredImage }] : [{ url: "/newmodularlogo.png" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: page?.featuredImage ? [page.featuredImage] : ["/newmodularlogo.png"],
    },
  };
}

export default async function AboutPage() {
  const page = await getPublicPageBySlug("about");

  // High-performance, comprehensive About Us & Modular Housing Knowledge Center
  const heroBadge = "ModularHome.com • The Modern Housing Marketplace";
  const heroTitle = "THE FUTURE OF HOME BUILDING IS MODULAR.";
  const heroSubtitle = "Factory precision engineering, modern architectural design, and 30–50% faster build times across America.";
  const heroImage = page?.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

  // FAQ structured data for search engine rich results
  const faqs = [
    {
      q: "What is a modular home?",
      a: "A modular home is a permanent, high-performance home constructed off-site in precision-engineered volumetric sections (modules) inside a climate-controlled factory. Once built, the modules are transported to the home site, lifted by a crane onto a permanent concrete foundation (basement, crawl space, or slab), and permanently assembled and finished. Modular homes are built to the exact same state and local residential building codes (IRC) as traditional stick-built homes."
    },
    {
      q: "Are modular homes considered 'real' houses?",
      a: "Yes, 100%. Modular homes are real residential real estate. Once installed on a permanent foundation, they are visually and structurally indistinguishable from traditional architect-built houses. They appreciate at the exact same rates as site-built homes, qualify for conventional 30-year mortgages, VA, and FHA loans, and conform strictly to all local zoning requirements."
    },
    {
      q: "What is the difference between a modular home and a manufactured (mobile) home?",
      a: "The primary difference is building codes and foundations. Modular homes are constructed to state, regional, and local residential building codes (IRC) and must be placed on permanent foundations. Manufactured homes are constructed to the federal HUD code and are typically built on permanent steel chassis. Modular homes appreciate like real estate, whereas manufactured homes are often classified as personal property."
    },
    {
      q: "How much faster is modular construction compared to traditional building?",
      a: "Modular construction is typically 30% to 50% faster than traditional on-site construction. Because factory fabrication occurs indoors simultaneously while your local contractor is excavating the site and pouring the foundation, weather delays are virtually eliminated. Most modular homes are manufactured in 4 to 8 weeks and set on the foundation in 1 to 2 days."
    },
    {
      q: "Can I customize a modular home floor plan?",
      a: "Absolutely. At ModularHome.com, almost every floor plan can be customized. You can reconfigure bedroom and bathroom layouts, adjust ceiling heights, add covered porches or attached garages, upgrade kitchen islands, choose custom siding and metal roofing, and select interior finishes to match your exact vision."
    },
    {
      q: "Do modular homes have superior energy efficiency?",
      a: "Yes. Because modular sections are built with computerized precision in an indoor factory, the structural joints are tighter and less prone to air infiltration. Continuous high-performance insulation, low-E argon-filled windows, and rigid framing result in lower heating and cooling bills and an eco-friendly living environment."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://modularhome.com/about#webpage",
        "url": "https://modularhome.com/about",
        "name": "About Modular Homes & ModularHome.com",
        "description": "Comprehensive guide to modular homes, factory precision construction methods, and modern prefabricated housing solutions.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://modularhome.com/#website",
          "name": "ModularHome.com",
          "url": "https://modularhome.com"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://modularhome.com/#organization",
        "name": "ModularHome.com",
        "url": "https://modularhome.com",
        "logo": "https://modularhome.com/newmodularlogo.png",
        "telephone": "+1-812-595-4033",
        "description": "America's premier marketplace for modular homes, prefab cabins, modern barndominiums, and engineered house kits."
      },
      {
        "@type": "FAQPage",
        "@id": "https://modularhome.com/about#faq",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white pt-0 pb-20 text-[#101114]">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-[#f6f7f9] via-white to-white border-b border-[#e7e9ee]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#fcb907] animate-pulse"></span>
                <span>{heroBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-2px] text-[#101114] leading-[0.95] font-display">
                {heroTitle}
              </h1>

              <p className="text-lg sm:text-xl text-[#101114] font-semibold leading-relaxed">
                {heroSubtitle}
              </p>

              <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed max-w-2xl font-body">
                ModularHome.com is the nation’s leading marketplace connecting homeowners, landowners, and commercial developers with certified modular manufacturers and turnkey builders. We replace the stress, weather delays, and unpredictability of traditional construction with climate-controlled indoor precision, guaranteed upfront pricing, and nationwide delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/buildings"
                  className="px-6 py-3.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 hover:scale-[1.02]"
                >
                  <span>Explore Modular Homes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="px-6 py-3.5 rounded-xl bg-[#101114] hover:bg-black text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm inline-flex items-center gap-2"
                >
                  <span>How Modular Works</span>
                </Link>

                <Link
                  href="/quote"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-[#d5d9e0] text-[#101114] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Get Instant Quote</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-[#e7e9ee] shadow-2xl">
                <Image
                  src={heroImage}
                  alt="Precision Engineered Modular Home by ModularHome.com"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-[#fcb907]">
                    Factory Built Precision
                  </div>
                  <div className="text-sm font-bold mt-0.5">
                    Constructed indoors with millimeter laser accuracy &amp; delivered nationwide.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS SECTION ── */}
      <StatsSection />

      {/* ── 3. WHAT IS A MODULAR HOME (DEEP DIVE) ── */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              The Modular Housing Revolution
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#101114] font-display">
              What Exactly Is A Modular Home?
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
              Understanding the science, engineering, and permanent building standards that make modular homes the superior choice for 21st-century homeowners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-7 rounded-[22px] bg-[#f8f9fa] border border-[#e7e9ee] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#b45309] flex items-center justify-center font-black">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#101114]">
                Constructed In Volumetric Sections
              </h3>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                A modular home is built in three-dimensional rooms and sections—complete with structural framing, electrical wiring, plumbing lines, insulation, drywall, and luxury cabinetry—inside a climate-controlled factory.
              </p>
            </div>

            <div className="p-7 rounded-[22px] bg-[#f8f9fa] border border-[#e7e9ee] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#101114]">
                Built To State &amp; Local Building Codes
              </h3>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                Unlike mobile homes, modular homes are held to the exact same (or higher) International Residential Code (IRC) and regional state building codes as conventional on-site houses. Local inspectors inspect and approve each stage.
              </p>
            </div>

            <div className="p-7 rounded-[22px] bg-[#f8f9fa] border border-[#e7e9ee] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#101114]">
                Installed On Permanent Foundations
              </h3>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                Upon delivery, a crane sets the modules onto an engineered permanent foundation—such as a full basement, crawlspace, or concrete slab. Once seamed, the home is a permanent fixture of your real estate property.
              </p>
            </div>

            <div className="p-7 rounded-[22px] bg-[#f8f9fa] border border-[#e7e9ee] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#101114]">
                Appreciates Like Traditional Real Estate
              </h3>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                Modular homes appreciate at the exact same rates as traditional stick-built homes. Because they are legally classified as real property, banks appraise and value them identically to conventional homes.
              </p>
            </div>

            <div className="p-7 rounded-[22px] bg-[#f8f9fa] border border-[#e7e9ee] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#101114]">
                Standard Mortgage &amp; Loan Eligibility
              </h3>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                Financing a modular home is seamless. Lenders provide standard conventional 30-year fixed mortgages, construction-to-permanent loans, VA loans, and FHA financing with competitive interest rates.
              </p>
            </div>

            <div className="p-7 rounded-[22px] bg-[#f8f9fa] border border-[#e7e9ee] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#101114]">
                Indistinguishable From Architect Builds
              </h3>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                From soaring 9-foot and vaulted ceilings to open-concept chef’s kitchens, quartz countertops, custom exterior cladding, and expansive wrap-around porches, modern modular homes define architectural elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. COMPARISON MATRIX: MODULAR VS MANUFACTURED VS TRADITIONAL ── */}
      <section className="py-20 bg-[#f8f9fa] border-y border-[#e7e9ee]">
        <div className="wrap">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Clear Distinction &amp; Building Standards
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#101114] font-display">
              Modular vs. Manufactured vs. Traditional
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
              See how modular construction compares directly against HUD manufactured housing and conventional on-site stick building.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px] bg-white rounded-3xl border border-[#e7e9ee] shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e7e9ee] bg-[#f1f3f7]">
                    <th className="py-4.5 px-6 text-xs font-black uppercase tracking-wider text-[#101114] w-1/4">
                      Feature / Standard
                    </th>
                    <th className="py-4.5 px-6 text-xs font-black uppercase tracking-wider text-[#b45309] bg-amber-50/70 border-x border-amber-200 w-1/3">
                      ⭐ Modular Homes (ModularHome.com)
                    </th>
                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-[#6b7280] w-1/5">
                      Manufactured (HUD / Mobile)
                    </th>
                    <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-[#6b7280] w-1/5">
                      Traditional Site-Built
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e9ee] text-xs sm:text-sm">
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Governing Building Code</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-[#101114]">
                      State &amp; Local Residential Codes (IRC)
                    </td>
                    <td className="py-4 px-6 text-[#4b5563]">Federal HUD Code (Uniform standard)</td>
                    <td className="py-4 px-6 text-[#4b5563]">State &amp; Local Residential Codes (IRC)</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Foundation Requirements</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-[#101114]">
                      Permanent Concrete Foundation (Basement, Crawl, Slab)
                    </td>
                    <td className="py-4 px-6 text-[#4b5563]">Often on steel chassis / piers; relocatable</td>
                    <td className="py-4 px-6 text-[#4b5563]">Permanent Concrete Foundation</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Construction Environment</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-emerald-700">
                      100% Climate-Controlled Indoor Factory
                    </td>
                    <td className="py-4 px-6 text-[#4b5563]">Indoor Factory</td>
                    <td className="py-4 px-6 text-rose-600">Outdoors (Exposed to rain, snow, mold)</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Average Build Timeline</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-[#101114]">
                      8 to 14 Weeks Total (30–50% Faster)
                    </td>
                    <td className="py-4 px-6 text-[#4b5563]">6 to 12 Weeks</td>
                    <td className="py-4 px-6 text-[#4b5563]">9 to 18+ Months</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Real Estate Appreciation</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-[#101114]">
                      Appreciates at standard market rates
                    </td>
                    <td className="py-4 px-6 text-rose-600">Often depreciates (unless permanently converted)</td>
                    <td className="py-4 px-6 text-[#4b5563]">Appreciates at standard market rates</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Mortgage &amp; Financing</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-[#101114]">
                      Conventional, FHA, VA, Construction-to-Perm
                    </td>
                    <td className="py-4 px-6 text-[#4b5563]">Chattel loans or specialized personal property financing</td>
                    <td className="py-4 px-6 text-[#4b5563]">Conventional, FHA, VA, Construction loans</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Framing &amp; Structural Strength</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-[#101114]">
                      20–30% More Lumber &amp; Strapping (To withstand transit)
                    </td>
                    <td className="py-4 px-6 text-[#4b5563]">Built to lightweight transport standards</td>
                    <td className="py-4 px-6 text-[#4b5563]">Standard minimum framing requirements</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101114]">Zoning &amp; HOA Acceptance</td>
                    <td className="py-4 px-6 bg-amber-50/30 border-x border-amber-200 font-bold text-[#101114]">
                      Treated as regular residential housing everywhere
                    </td>
                    <td className="py-4 px-6 text-rose-600">Frequently restricted by local zoning ordinances</td>
                    <td className="py-4 px-6 text-[#4b5563]">Allowed in all residential zones</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HOW MODULAR WORKS: THE 5-STEP LIFECYCLE ── */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              End-To-End Precision Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#101114] font-display">
              How Modular Construction Works
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
              Our streamlined 5-phase engineering methodology delivers unmatched quality control and timeline certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: "01",
                icon: FileCheck,
                title: "Design & Customization",
                desc: "Choose an architectural floor plan or submit custom plans. Select cabinetry, finishes, and siding with our advisors.",
              },
              {
                step: "02",
                icon: ShieldCheck,
                title: "Engineering & Permits",
                desc: "Our engineers stamp state-approved structural blueprints for fast local municipal permit approval and zoning compliance.",
              },
              {
                step: "03",
                icon: Wrench,
                title: "Simultaneous Build",
                desc: "While your foundation is excavated and poured on-site, modules are fabricated with laser precision inside the factory.",
              },
              {
                step: "04",
                icon: Truck,
                title: "Transit & Set Day",
                desc: "Weatherproof modules arrive on heavy-haul trailers. A commercial crane hoists and secures them onto the foundation in 24–48 hours.",
              },
              {
                step: "05",
                icon: Sparkles,
                title: "Turnkey Move-In",
                desc: "Plumbing and electrical connections are completed, roof ridges seamed, and local inspections finalized for your certificate of occupancy.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[20px] bg-[#f8f9fa] border border-[#e7e9ee] flex flex-col justify-between space-y-4 hover:border-[#fcb907] transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#fcb907] font-mono">{s.step}</span>
                    <s.icon className="w-5 h-5 text-[#6b7280] group-hover:text-[#fcb907] transition-colors" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-[#101114]">{s.title}</h3>
                  <p className="text-xs text-[#4b5563] leading-relaxed">{s.desc}</p>
                </div>
                <div className="pt-2 text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                  Phase {idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#101114] hover:text-[#d97706] transition-colors"
            >
              <span>Read Full Step-By-Step Engineering Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. THE 6 CORE ADVANTAGES OF CHOOSING MODULAR ── */}
      <section className="py-20 bg-[#101114] text-white">
        <div className="wrap">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fcb907]">
              Uncompromising Quality &amp; Efficiency
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
              Why Modular Is The Smarter Choice
            </h2>
            <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
              Traditional home building has barely evolved in a century. Here is why homeowners and builders are transitioning to factory modular construction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-[24px] bg-[#1a1e26] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fcb907]/20 text-[#fcb907] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Zero Weather Damage &amp; Mold Prevention
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Traditional frames stand exposed to rain, snow, and humidity for months, trapping moisture inside walls. Modular homes are built 100% indoors in dry, climate-controlled environments with moisture-tested lumber.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#1a1e26] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fcb907]/20 text-[#fcb907] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                30% to 50% Faster Timelines
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                By executing site excavation, concrete pouring, and factory framing simultaneously, projects finish in months rather than years. Move in sooner and drastically reduce interest costs on construction loans.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#1a1e26] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fcb907]/20 text-[#fcb907] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Superior Structural Rigidity
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Because modules must be transported at highway speeds and hoisted by cranes, they are engineered with 20% to 30% more framing lumber, structural screws, and steel bracing than required by ordinary building codes.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#1a1e26] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fcb907]/20 text-[#fcb907] flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Tighter Envelopes &amp; Energy Savings
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Precision automated jigs create square, gap-free corners and flawless continuous insulation barriers. Enjoy lower monthly HVAC utility bills, drafts-free living, and superior acoustic sound insulation.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#1a1e26] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fcb907]/20 text-[#fcb907] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Transparent Upfront Pricing
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Site-built homes regularly suffer from 15% to 30% cost overruns from unexpected contractor delays and material spikes. Modular manufacturing provides fixed, transparent itemized pricing before production begins.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#1a1e26] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fcb907]/20 text-[#fcb907] flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                90% Less Jobsite Construction Waste
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Computer-optimized cutting systems maximize lumber and drywall usage. Factory scraps are collected and recycled rather than dumped in overflowing jobsite dumpsters, minimizing environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. EXPLORE OUR MODULAR HOUSING CATEGORIES ── */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Modular Solutions For Every Lifestyle
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#101114] font-display">
              Explore Our Modular Portfolio
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
              From compact recreational cabins and modern accessory dwellings to multi-story luxury family estates and steel barndominiums.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Modular Homes",
                desc: "Ranches, cape cods, two-story colonials, and modern multi-bedroom family homes.",
                href: "/modular-homes",
                tag: "1 to 5+ Beds",
              },
              {
                title: "Prefab Cabins",
                desc: "Rustic handcrafted log and timber modular cabins for mountain and lake retreats.",
                href: "/modular-cabins",
                tag: "Turnkey & Kits",
              },
              {
                title: "Modern Barndominiums",
                desc: "Steel-frame open-concept floor plans with high ceilings, shop space, and modern luxury.",
                href: "/barndominiums",
                tag: "Steel & Wood Kits",
              },
              {
                title: "Tiny Homes & ADUs",
                desc: "Smart, space-efficient accessory dwelling units, granny pods, and rental investment units.",
                href: "/tiny-homes",
                tag: "Compact Living",
              },
              {
                title: "A-Frame Homes",
                desc: "Iconic triangular architectural retreats with floor-to-ceiling glass and panoramic views.",
                href: "/a-frame-homes",
                tag: "Architectural Icon",
              },
              {
                title: "House Kits",
                desc: "Pre-cut, panelized framing and shell packages for self-builders and certified contractors.",
                href: "/house-kits",
                tag: "DIY & Contractor",
              },
              {
                title: "Park Models",
                desc: "Luxury 400 sq. ft. certified recreational park models designed for resort communities.",
                href: "/park-models",
                tag: "Recreational Luxury",
              },
              {
                title: "Commercial Modular",
                desc: "Offices, healthcare facilities, daycare centers, multi-family units, and storage structures.",
                href: "/commercial-modular-buildings",
                tag: "Commercial Grade",
              },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="p-6 rounded-[20px] bg-[#f8f9fa] border border-[#e7e9ee] hover:border-[#fcb907] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d97706] block">
                    {cat.tag}
                  </span>
                  <h3 className="text-base font-black text-[#101114] group-hover:text-[#d97706] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#6b7280] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#101114] group-hover:text-[#fcb907] transition-colors">
                  <span>Browse Models</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FREQUENTLY ASKED QUESTIONS (ACCORDION) ── */}
      <section className="py-20 bg-[#f8f9fa] border-t border-[#e7e9ee]">
        <div className="wrap max-w-4xl">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              Buyer Knowledge &amp; Clarity
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#101114] font-display">
              Frequently Asked Questions About Modular Homes
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
              Clear answers to the most common questions about building, financing, and living in a modular home.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl border border-[#e7e9ee] p-5 sm:p-6 transition-all shadow-2xs open:border-[#fcb907] open:shadow-md"
              >
                <summary className="flex items-center justify-between font-black text-sm sm:text-base text-[#101114] cursor-pointer list-none select-none">
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-50 text-[#b45309] font-black text-xs flex items-center justify-center shrink-0">
                      ?
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#6b7280] transition-transform duration-200 group-open:rotate-180 shrink-0 ml-2" />
                </summary>
                <p className="mt-4 pt-4 border-t border-[#f1f3f7] text-xs sm:text-sm text-[#4b5563] leading-relaxed pl-10 font-body">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CALL TO ACTION BANNER ── */}
      <section className="py-16 sm:py-24 bg-[#101114] text-white">
        <div className="wrap text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#fcb907] text-xs font-black uppercase tracking-widest">
            <span>Ready To Start Your Modular Project?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-display">
            Build Your Dream Home With Confidence
          </h2>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-body max-w-2xl mx-auto">
            Explore hundreds of architect-designed modular plans, customize your finishes, and receive an upfront, itemized turnkey quotation. Our housing specialists are ready to guide you every step of the way.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/quote"
              className="px-8 py-4 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Get An Instant Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/floor-plans"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20"
            >
              <span>Browse Floor Plans</span>
            </Link>

            <a
              href="tel:8125954033"
              className="px-8 py-4 rounded-xl bg-transparent hover:bg-white/5 text-stone-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2"
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
