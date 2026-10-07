import {
  MapPin,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  ShieldCheck,
  Building2,
  FileCheck2,
  Truck,
  Award,
  ArrowRight,
  Sparkles,
  Calculator,
  UploadCloud,
  Headphones,
  CheckCircle,
  Layers
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getPublicGlobalSettings } from "@/lib/settings";
import { getPublicPageBySlug } from "@/lib/pageDataServer";
import DynamicPageRenderer from "@/components/DynamicPageRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageBySlug("contact");
  if (page) {
    const title = page.seoTitle || "Contact ModularHome.com | Architectural Design & Factory Consultations";
    const description =
      page.metaDescription ||
      page.subtitle ||
      "Connect with ModularHome.com licensed structural engineers, project estimators, and designers. Request a custom quote or nationwide delivery consultation.";
    return {
      title,
      description,
      openGraph: {
        title: page.ogTitle || title,
        description: page.ogDescription || description,
        images: page.ogImage
          ? [{ url: page.ogImage }]
          : page.featuredImage
          ? [{ url: page.featuredImage }]
          : [{ url: "/newmodularlogo.png" }],
      },
      alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    };
  }

  return {
    title: "Contact ModularHome.com | Architectural Design & Factory Consultations",
    description:
      "Connect with ModularHome.com licensed structural engineers, project estimators, and designers. Request a custom quote or nationwide delivery consultation.",
  };
}

const REGIONAL_HUBS = [
  {
    city: "Midwest Main Factory",
    location: "Elkhart / Indianapolis, IN",
    type: "Primary Manufacturing Facility & Testing Labs",
    coverage: "Midwest, Great Lakes, & Northeast Corridor",
    phone: "+1 (812) 595-4033",
  },
  {
    city: "South / Central Distribution Hub",
    location: "Dallas / Fort Worth, TX",
    type: "Regional Flatbed Logistics & Modular Assembly",
    coverage: "Texas, Gulf Coast, & Plains States",
    phone: "+1 (812) 595-4033",
  },
  {
    city: "West Coast Logistics Depot",
    location: "Reno / Tahoe Corridor, NV",
    type: "High-Snow & Seismic Structural Staging",
    coverage: "California, Pacific Northwest, Mountain West",
    phone: "+1 (812) 595-4033",
  },
  {
    city: "Southeast Staging Facility",
    location: "Atlanta Metro, GA",
    type: "Hurricane-Rated & High-Wind Engineering Center",
    coverage: "Florida, Georgia, Carolinas, & Mid-Atlantic",
    phone: "+1 (812) 595-4033",
  },
];

const FAQS = [
  {
    q: "How fast will an estimator or engineer respond to my inquiry?",
    a: "Inquiries submitted during business hours (Monday – Friday, 7:00 AM – 6:00 PM EST) receive a direct response and preliminary feasibility assessment within 2 to 4 hours. Weekend inquiries are addressed on the next business morning.",
  },
  {
    q: "Are your blueprints stamped for my specific county and building department?",
    a: "Yes. Every ModularHome.com package includes state-specific and county-specific wet-stamped structural calculations engineered for your exact site coordinates, local wind velocity, snow load, and seismic category.",
  },
  {
    q: "What is the typical manufacturing and nationwide delivery timeline?",
    a: "Precision cold-formed steel frames and factory-built modular assemblies are manufactured in 3 to 5 weeks following signed architectural plan approval. Freight delivery is coordinated via dedicated flatbeds directly to your build site.",
  },
  {
    q: "Can I bring my own custom architectural sketch or CAD blueprint?",
    a: "Absolutely. Over 60% of our clients customize an existing plan or provide their own floor plan sketches. Our in-house engineering team translates your designs into high-precision, CNC-machined steel frame assemblies.",
  },
  {
    q: "What foundation types do your steel modular structures support?",
    a: "Our engineered floor joist and chassis designs can be mounted to engineered concrete slabs, raised crawlspace stem walls, helical screw piles, or full walkout basements depending on your topography.",
  },
  {
    q: "Do you offer turnkey installation or do I work with a local general contractor?",
    a: "We provide complete factory-built kits, modular pods, or turnkey shell structures with comprehensive assembly manuals. You can utilize your preferred local builder or tap into our nationwide network of certified modular installers.",
  },
];

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    getPublicGlobalSettings(),
    getPublicPageBySlug("contact"),
  ]);



  const phone = settings.phone || "+1 (812) 595-4033";
  const email = settings.email || "modularhome.admin@gmail.com";
  const address = settings.address || "Factory Headquarters, Indiana & Nationwide Staging Facilities";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ModularHome.com",
    image: "https://modularhome.com/newmodularlogo.png",
    "@id": "https://modularhome.com/#organization",
    url: "https://modularhome.com",
    telephone: phone,
    email: email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Industrial Parkway",
      addressLocality: "Indianapolis",
      addressRegion: "IN",
      postalCode: "46201",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#fafbfc] pt-24 pb-20 text-[#101114]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Hero Breadcrumb & Header */}
          <div className="mb-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcb907]/15 border border-[#fcb907]/30 text-xs font-black uppercase tracking-wider text-[#b45309] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#fcb907] animate-pulse"></span>
              <span>Factory Direct & Architectural Support</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#101114] tracking-tight uppercase leading-[0.98]">
              Connect With Our <span className="text-[#d97706]">Engineering</span> & Estimations Desk
            </h1>
            
            <p className="mt-4 text-sm sm:text-base text-[#4b5563] max-w-3xl leading-relaxed">
              Whether you are preparing to build a turnkey modular home, barndominium, luxury cabin, or custom steel frame kit, our licensed structural engineers and estimators are here to guide your project from blueprint to nationwide flatbed delivery.
            </p>

            {/* Live Status Pill Bar */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2.5 p-3 bg-white border border-[#e5e7eb] rounded-xl shadow-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <div className="text-xs">
                  <div className="font-bold text-[#101114]">Response SLA</div>
                  <div className="text-[#6b7280] text-[11px]">&lt; 2 Hours (Mon–Fri)</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white border border-[#e5e7eb] rounded-xl shadow-xs">
                <FileCheck2 className="w-4 h-4 text-[#d97706]" />
                <div className="text-xs">
                  <div className="font-bold text-[#101114]">Stamped Blueprints</div>
                  <div className="text-[#6b7280] text-[11px]">All 50 US States</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white border border-[#e5e7eb] rounded-xl shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div className="text-xs">
                  <div className="font-bold text-[#101114]">Factory Direct</div>
                  <div className="text-[#6b7280] text-[11px]">50-Yr Warranty Backing</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white border border-[#e5e7eb] rounded-xl shadow-xs">
                <Truck className="w-4 h-4 text-[#101114]" />
                <div className="text-xs">
                  <div className="font-bold text-[#101114]">Nationwide Delivery</div>
                  <div className="text-[#6b7280] text-[11px]">Dedicated Flatbed Fleet</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Section: Direct Contact Matrix + Interactive Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Direct Channels & Instant Tools (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Primary Direct Phone Card */}
              <div className="card p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-sm hover:border-[#fcb907] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#d97706] flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase text-[#6b7280] tracking-wider">
                        Toll-Free Phone Direct
                      </div>
                      <a
                        href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                        className="text-lg font-black text-[#101114] hover:text-[#d97706] transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live
                  </span>
                </div>
                <div className="text-xs text-[#6b7280] pt-2 border-t border-[#f3f4f6] flex items-center justify-between">
                  <span>Sales, Engineering & Logistics</span>
                  <span className="font-bold text-[#101114]">Ext: #1 Quotes</span>
                </div>
              </div>

              {/* Primary Direct Email Card */}
              <div className="card p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-sm hover:border-[#fcb907] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#d97706] flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase text-[#6b7280] tracking-wider">
                        Engineering Inquiries & Plans
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="text-base font-black text-[#101114] hover:text-[#d97706] transition-colors break-all"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-[#6b7280] pt-2 border-t border-[#f3f4f6]">
                  Submit blueprints, land plots, CAD files, or request factory specification packets.
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="card p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#101114] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase text-[#6b7280] tracking-wider">
                      Factory Consultation Hours
                    </div>
                    <div className="text-sm font-black text-[#101114]">
                      Monday – Friday: 7:00 AM – 6:00 PM EST
                    </div>
                  </div>
                </div>
                <div className="text-xs text-[#6b7280] pt-2 border-t border-[#f3f4f6] flex items-center justify-between">
                  <span>Saturday (Appointments Only)</span>
                  <span className="font-bold text-[#101114]">9:00 AM – 2:00 PM EST</span>
                </div>
              </div>

              {/* Fast-Track Quick Action Shortcuts */}
              <div className="p-5 bg-[#101114] text-white rounded-2xl shadow-lg space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#fcb907]">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Planning Tools</span>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/quote"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calculator className="w-4 h-4 text-[#fcb907]" />
                      <span>Interactive Quote Calculator</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#fcb907] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/upload-floor-plan"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <UploadCloud className="w-4 h-4 text-[#fcb907]" />
                      <span>Upload Custom CAD / PDF Blueprint</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#fcb907] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/models"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all text-xs font-bold text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-[#fcb907]" />
                      <span>Browse 50+ Prefab & Modular Models</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#fcb907] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Column: Full Professional Contact Form (7 Cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>

          {/* Regional Logistics & Manufacturing Hubs Section */}
          <div className="mt-16 pt-12 border-t border-[#e5e7eb]">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#d97706] mb-2">
                <Truck className="w-4 h-4 text-[#d97706]" />
                <span>Nationwide Staging & Logistics</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#101114] tracking-tight">
                Factory Facilities & Regional Distribution Hubs
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
                Our precision cold-formed steel manufacturing facilities and regional assembly depots enable rapid, flatbed logistics across all 50 states.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {REGIONAL_HUBS.map((hub, idx) => (
                <div
                  key={idx}
                  className="card p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-xs space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-amber-50 text-[#d97706]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#6b7280] bg-gray-100 px-2 py-0.5 rounded">
                      Hub #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#101114]">{hub.city}</h3>
                    <div className="text-xs font-bold text-[#d97706] mt-0.5">{hub.location}</div>
                  </div>
                  <div className="text-[11px] text-[#4b5563] leading-relaxed pt-2 border-t border-[#f3f4f6]">
                    <strong>Coverage:</strong> {hub.coverage}
                  </div>
                  <div className="text-[11px] text-[#6b7280]">
                    {hub.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Frequently Asked Questions */}
          <div className="mt-16 pt-12 border-t border-[#e5e7eb]" id="faq">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#d97706] mb-2">
                <HelpCircle className="w-4 h-4 text-[#d97706]" />
                <span>Expert Guidance</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#101114] tracking-tight">
                Frequently Asked Consultation Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
                Common questions about architectural customization, municipal permitting, delivery schedules, and foundation options.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="card p-6 bg-white border border-[#e5e7eb] rounded-2xl space-y-2.5 shadow-xs hover:border-[#fcb907] transition-all"
                >
                  <h3 className="text-sm sm:text-base font-black text-[#101114] flex items-start gap-2">
                    <span className="text-[#d97706] font-mono text-xs mt-0.5">0{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed pl-6 m-0">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Call-To-Action Banner */}
          <div className="mt-16 p-8 sm:p-12 bg-gradient-to-r from-[#101114] via-[#1a1c23] to-[#101114] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="text-xs font-black uppercase tracking-widest text-[#fcb907]">
                Ready to Start Your Build?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Calculate an Instant Itemized Factory Estimate
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Explore models, choose custom square footages, pick premium insulation packages, and get deterministic turnkey pricing in seconds.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/quote"
                className="px-6 py-3.5 bg-[#fcb907] hover:bg-[#e0a506] text-[#101114] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Launch Quote Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#fcb907]" />
                <span>Call {phone}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
