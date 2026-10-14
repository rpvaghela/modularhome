import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Compass, 
  HelpCircle,
  Building,
  Calendar,
  Clock,
  PhoneCall,
  Shield,
  Layers,
  Wrench,
  DollarSign
} from "lucide-react";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import { getCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const ACCURATE_DELIVERY_HERO_IMAGE = "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("delivery");
  const title = page?.seoTitle || "Nationwide Delivery & Crane Installation | ModularHome.com";
  const description = page?.metaDescription || "Learn about our nationwide modular home delivery network, oversized transport logistics, site access requirements, and precision crane installation procedures.";
  const canonical = getCanonicalUrl("/delivery");
  const metaImage = page?.featuredImage || ACCURATE_DELIVERY_HERO_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [{ url: metaImage, alt: "Modular Home Delivery & Crane Installation" }],
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

const LOGISTICS_PILLARS = [
  {
    icon: Truck,
    step: "Stage 01",
    title: "Protective Wrap & Heavy Transit",
    desc: "Every modular unit is sealed inside industrial weather-resistant shrink-wrap at the factory and transported on specialized air-ride trailers. Certified lead and chase escort vehicles accompany oversized loads with valid state DOT transportation permits.",
  },
  {
    icon: Compass,
    step: "Stage 02",
    title: "Route Survey & Feasibility",
    desc: "Our freight team analyzes satellite maps, road grades, bridge weight capacities, overhead tree limbs, and power line clearances. A route verification plan ensures transports arrive safely without unexpected road delays.",
  },
  {
    icon: Building,
    step: "Stage 03",
    title: "Hydraulic Crane Setting",
    desc: "A commercial hydraulic crane lifts each pre-finished volumetric module directly off the delivery carrier and places it onto your permanent concrete foundation. Anchor bolts and heavy steel tie plates lock the building down with millimeter precision.",
  },
  {
    icon: ShieldCheck,
    step: "Stage 04",
    title: "Rapid Weather-Tight Dry-In",
    desc: "Within 24 to 48 hours of crane arrival, the roof ridgeline is mechanically erected and sealed, structural marriage walls are bolted, and the building envelope is 100% weather-tight and secured from the elements.",
  },
];

const SITE_CHECKLIST = [
  {
    title: "14-Foot Vertical & Roadway Clearance",
    details: "Delivery carriers require an all-weather access road or driveway at least 14 feet wide with trimmed overhead branches and utility lines cleared to 14 feet high.",
  },
  {
    title: "Firm Level Crane Staging Pad (30' x 40')",
    details: "Compacted gravel or firm soil pad positioned adjacent to the foundation to support the commercial mobile crane outriggers and stabilizers safely.",
  },
  {
    title: "Permanent Foundation Cured 14+ Days",
    details: "Engineered concrete crawlspace, basement, or slab built strictly to our stamped structural schematics, inspected, and cured for a minimum of 14 days prior to delivery day.",
  },
  {
    title: "Utility Stubs Flagged & Ready",
    details: "Water service, sewer or septic drain lines, and electrical conduits stubbed into the foundation cavity according to the factory mechanical rough-in layout.",
  },
  {
    title: "Municipal Road Staging Permits",
    details: "Temporary parking or street-closure permits acquired from your local municipal engineering or police department if delivery trailers must stage along a public street.",
  },
  {
    title: "Licensed Set Crew & Project Manager",
    details: "A certified set crew and general contractor or owner-builder on-site to conduct the arrival inventory, inspect carrier bills of lading, and supervise the crane lift.",
  },
];

const SET_DAY_TIMELINE = [
  {
    time: "07:00 AM",
    title: "Carrier Arrival & Staging",
    desc: "Delivery trucks arrive at the staging zone. Escort teams verify perimeter safety, and transport covers are inspected.",
  },
  {
    time: "08:30 AM",
    title: "Crane Outrigger Deployment",
    desc: "The mobile crane positions on the staging pad, deploys outriggers, and attaches engineered spreader bars and rigging straps.",
  },
  {
    time: "09:30 AM",
    title: "Module 1 Foundation Lift",
    desc: "The first volumetric module is lifted off the chassis and lowered onto foundation sill plates. Set crew aligns anchor bolts.",
  },
  {
    time: "01:00 PM",
    title: "Second Module & Roof Raising",
    desc: "Subsequent modules are hoisted, marriage walls are bolted together, and hinged factory roof rafters are raised into position.",
  },
  {
    time: "05:00 PM",
    title: "100% Weather-Tight Dry-In",
    desc: "Ridge caps are secured, exterior seam membranes applied, and exterior doors locked. Your home is under roof in a single day!",
  },
];

const DELIVERY_FAQS = [
  {
    q: "How far nationwide does ModularHome deliver?",
    a: "We ship nationwide across all 48 contiguous United States. Modules are dispatched from regional climate-controlled manufacturing hubs to keep transit mileage and shipping costs as economical as possible.",
  },
  {
    q: "What happens if severe weather occurs on crane set day?",
    a: "Safety and structural integrity are paramount. If high winds (exceeding 25–30 MPH) or severe torrential rain are forecasted, crane setting is held until weather clears. Modules remain completely protected under industrial weather-tight factory membranes.",
  },
  {
    q: "Who provides the crane and setting crew?",
    a: "Our logistics coordinators can book and manage the certified mobile crane and professional set crew through our turnkey installation service, or collaborate directly with your local licensed general contractor.",
  },
  {
    q: "How much does modular delivery and crane setting cost?",
    a: "Delivery freight generally ranges from $8 to $14 per highway mile per carrier module. Crane rental typically costs between $2,500 and $6,500 for set day depending on crane tonnage and property reach. We provide a guaranteed line-item freight quote upfront.",
  },
];

export default async function DeliveryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Modular Home Delivery & Crane Installation",
    description: "Nationwide freight logistics, crane placement, and site access requirements for modular homes.",
    url: "https://modularhome.com/delivery",
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
          <span className="text-[#d97706] font-bold">Delivery & Crane Installation</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8f9fa] via-white to-white border-b border-[#e7e9ee]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Messaging */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706] bg-[#fef3c7] px-3.5 py-1.5 rounded-full">
                <Truck className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Nationwide Freight & Crane Logistics</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-1.5px] text-[#101114] leading-[1.05]">
                Precision Factory Delivery & Crane Setting
              </h1>
              <p className="text-base sm:text-lg text-[#4b5563] leading-relaxed">
                The fastest, cleanest installation day in American homebuilding. Your custom modules arrive protected by industrial weather membranes and are crane-lifted onto your permanent foundation in as little as 24 to 48 hours.
              </p>

              {/* Core Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">48 Contiguous States Transit</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <Clock className="w-5 h-5 text-[#d97706] shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">24–48 Hour Complete Dry-In</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <Building className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">Hydraulic Crane Setting</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#e7e9ee]">
                  <Shield className="w-5 h-5 text-purple-600 shrink-0" />
                  <span className="text-xs font-bold text-[#101114]">DOT Escorts & Permits Handled</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-3">
                <Link
                  href="/quote"
                  className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>Get Freight & Crane Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-[#101114] font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all"
                >
                  Speak with Logistics Advisor
                </Link>
              </div>
            </div>

            {/* Right Column: Authentic Modular Residence Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100 group">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={ACCURATE_DELIVERY_HERO_IMAGE}
                    alt="Precision Modular Residence Set on Foundation"
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
                  <span>100% Permanent Foundation Installation</span>
                </div>

                {/* Bottom Caption Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-white/60">
                  <div className="text-xs font-black text-[#101114]">
                    The Modern Craftsman Modular Residence
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5 flex items-center justify-between">
                    <span>Delivered & Crane-Set on Crawlspace Foundation</span>
                    <span className="font-bold text-[#d97706]">Turnkey Dry-In</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Logistics Pillars: The 4-Stage Turnkey Process */}
      <section className="py-16 bg-white">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#d97706] mb-2">
              <span>Step-by-Step Logistics</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#101114] tracking-tight">
              Our Turnkey Transport & Setting Process
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2 leading-relaxed">
              Every detail is engineered to ensure a safe, on-schedule delivery day with zero weather contamination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {LOGISTICS_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#f8f9fa] border border-[#e7e9ee] p-6 sm:p-8 rounded-[20px] hover:shadow-lg hover:border-[#fcb907]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#fcb907]/20 text-[#d97706] flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#8c94a0] bg-white px-2.5 py-1 rounded-md border border-[#e7e9ee]">
                        {pillar.step}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#101114] mb-2">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Set Day Hour-by-Hour Timeline */}
      <section className="py-16 bg-[#101114] text-white">
        <div className="wrap max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#fcb907] mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>The Big Day</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Hour-by-Hour: What Happens on Set Day
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Watch an entire multi-story residence come together in hours rather than months of chaotic framing.
            </p>
          </div>

          <div className="space-y-4">
            {SET_DAY_TIMELINE.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 hover:border-[#fcb907]/50 rounded-2xl p-5 sm:p-6 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
              >
                <div className="px-3.5 py-1.5 rounded-lg bg-[#fcb907] text-[#101114] text-xs font-black shrink-0 tracking-wider">
                  {item.time}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Site Readiness Checklist */}
      <section className="py-16 bg-[#f8f9fa] border-b border-[#e7e9ee]">
        <div className="wrap max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#d97706] mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Property Readiness</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#101114] tracking-tight">
              Site & Foundation Readiness Checklist
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              Verify your parcel is prepped for delivery transports, crane outriggers, and utility tie-ins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SITE_CHECKLIST.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-[#e7e9ee] shadow-sm hover:border-[#fcb907] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs mb-3">
                    ✓
                  </div>
                  <h3 className="font-bold text-sm text-[#101114] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#6b7280] leading-relaxed">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Pricing Guidance Table */}
      <section className="py-16 bg-white">
        <div className="wrap max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Transparent Freight & Installation Pricing
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
              No hidden broker markups. We provide exact line-item logistics calculations on your proposal.
            </p>
          </div>

          <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e7e9ee]">
              <div className="p-6 text-center space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-gray-500">Highway Freight</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114]">$8 – $14</div>
                <div className="text-xs text-gray-500">per highway mile per carrier</div>
                <p className="text-[11px] text-gray-400 mt-2">Includes air-ride tractor, protective shrink wrap, and cargo insurance.</p>
              </div>
              <div className="p-6 text-center space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-gray-500">Crane Setting Day</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114]">$2,500 – $6,500</div>
                <div className="text-xs text-gray-500">per setting day (turnkey)</div>
                <p className="text-[11px] text-gray-400 mt-2">Certified crane operator, mobile rig, rigging spreader bar, and insurance.</p>
              </div>
              <div className="p-6 text-center space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-gray-500">DOT Oversize Permits</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114]">$600 – $1,200</div>
                <div className="text-xs text-gray-500">per state route clearance</div>
                <p className="text-[11px] text-gray-400 mt-2">State highway permits, lead escort cars, and bridge authority fees.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery FAQs */}
      <section className="py-14 bg-[#f8f9fa] border-t border-[#e7e9ee]">
        <div className="wrap max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              Delivery Logistics FAQs
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-1">
              Common questions answered by our nationwide freight dispatch team.
            </p>
          </div>

          <div className="space-y-4">
            {DELIVERY_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e7e9ee] shadow-sm">
                <h3 className="text-sm sm:text-base font-bold text-[#101114] mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final High-Converting CTA Box */}
      <section className="py-14 bg-[#101114] text-white">
        <div className="wrap max-w-4xl text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center mx-auto font-black shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Check Delivery Feasibility for Your Property
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Provide your parcel address or ZIP code, and our logistics department will verify route clearance, crane accessibility, and provide an exact delivery cost estimate.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs uppercase tracking-wider py-3.5 px-7 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Get Delivery & Model Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all border border-white/20"
            >
              Call Logistics: (812) 595-4033
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
