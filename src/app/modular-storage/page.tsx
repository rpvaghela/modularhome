import { Metadata } from "next";
import Link from "next/link";
import { getPublicProducts } from "@/lib/publicData";
import { isStorageBuilding } from "@/utils/categoryMatching";
import CategoryCollectionRenderer from "@/components/CategoryCollectionRenderer";
import { getCanonicalUrl } from "@/lib/seo";
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Warehouse, 
  Wrench, 
  Tractor, 
  Boxes, 
  FileCheck2, 
  HelpCircle,
  HardHat
} from "lucide-react";

export const dynamic = "force-dynamic";

const TITLE = "Modular Storage Buildings & Steel Pole Barns | Heavy-Duty Utility Structures";
const DESCRIPTION =
  "Browse commercial-grade modular storage buildings, steel pole barns, equipment sheds, and multi-bay workshop structures. Engineered for 140+ MPH winds, heavy snow loads, and lifetime durability.";
const CANONICAL = getCanonicalUrl("/modular-storage");
const IMAGE =
  "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: "ModularHome.com",
    images: [{ url: IMAGE, alt: "Modular storage buildings and steel pole barns" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE],
  },
};

const STORAGE_FAQS = [
  {
    q: "What defines a modular storage building compared to a traditional pole barn?",
    a: "Unlike traditional timber pole barns where wood posts are buried directly in the soil and subject to subterranean rotting, our modular storage buildings utilize precision cold-formed galvanized commercial steel framing. Trusses and wall bents are pre-engineered in factory jigs, pre-punched for fast bolt-together assembly, and mounted onto engineered concrete slabs or perimeter footings with heavy-duty wedge anchors. This results in straight walls, non-combustible materials, and zero post rot over decades of severe service.",
  },
  {
    q: "What is the difference between 12-gauge and 14-gauge structural steel framing?",
    a: "Gauge refers to steel thickness—the lower the number, the thicker and stronger the steel. Standard utility storage buildings utilize 14-gauge steel (approx. 2.5\" x 2.5\" square tubing with 0.075\" wall thickness). For regions with extreme hurricane wind zones (130–150+ MPH) or heavy mountain snow loads (40–60+ PSF), we offer commercial 12-gauge steel (0.105\" wall thickness), which delivers approximately 30% higher tensile strength and a 20-year to 50-year rust-through warranty.",
  },
  {
    q: "What foundation is required for a commercial modular storage building?",
    a: "While smaller agricultural utility sheds and open pole barns can be anchored to level ground or gravel pads using 30-inch mobile home earth auger anchors, fully enclosed workshop garages and commercial storage buildings perform best on a continuous monolithic concrete slab. A standard 4-inch 3,500 PSI concrete slab with wire mesh is ideal for cars and light equipment, while 6-inch slabs reinforced with #4 rebar on 18-inch centers are recommended for heavy tractors, RVs, commercial machinery, and semi-truck parking.",
  },
  {
    q: "What overhead roll-up door sizes and clearances are available?",
    a: "Our modular storage structures support commercial roll-up and sectional overhead doors in standard dimensions including 8'x8', 10'x10', 12'x12', and oversized 14'x14' clearances suitable for Class-A motorhomes, fifth wheels, and combine harvesters. Clear-span sidewall eave heights range from 10 feet up to 20+ feet without requiring interior load-bearing columns.",
  },
  {
    q: "Do modular storage buildings qualify for agricultural tax exemptions?",
    a: "In many states and agricultural counties across Texas, Ohio, Indiana, Kentucky, Tennessee, and the Midwest, storage buildings used primarily for farming operations, livestock sheltering, tractor maintenance, or grain/hay storage qualify for state sales tax exemptions and reduced agricultural property tax assessments. We provide manufacturer spec sheets and engineered building plans to assist your local tax and agricultural filings.",
  },
  {
    q: "How are modular storage buildings insulated to prevent condensation?",
    a: "Uninsulated metal roofs can experience 'sweating' during rapid temperature shifts. We offer two proven thermal systems: (1) Factory-installed fiberglass vapor-barrier insulation (2\" R-7 or 3\" R-10 with vinyl backing) draped over framing prior to panel installation, and (2) Post-installation closed-cell spray foam insulation (1.5\" to 2.5\" R-14 to R-20), which forms an airtight thermal seal, eliminates moisture condensation, and adds significant shear rigidity to the steel structure.",
  },
  {
    q: "What wind and snow load certifications are provided with the buildings?",
    a: "Every building can be ordered with state-specific engineer-stamped architectural drawings certified to local International Building Code (IBC) requirements. Wind load ratings range from 115 MPH up to 150+ MPH for coastal exposure categories, and roof snow loads can be configured from 20 PSF up to 60+ PSF for extreme northern and high-elevation climates.",
  },
  {
    q: "How long does manufacturing and installation take for a storage structure?",
    a: "Standard pre-engineered storage packages are fabricated in 3 to 6 weeks. Once your foundation or site pad is ready, our certified installation crews erect the structural steel frame, install wall and roof panels, and mount all roll-up doors and walk-in entryways in just 1 to 3 days.",
  },
];

const STORAGE_SPECS = [
  {
    feature: "Structural Framing",
    standard: "14-Gauge Galvanized Tubing (2.5\" x 2.5\")",
    commercial: "12-Gauge Heavy Industrial Steel (2.25\" x 2.25\" / 2.5\" x 2.5\")",
    advantage: "30% higher tensile strength, high wind load rigidity",
  },
  {
    feature: "Exterior Metal Sheathing",
    standard: "29-Gauge Ribbed Steel Panels",
    commercial: "26-Gauge Standing Seam or Heavy R-Panel",
    advantage: "Higher hail resistance, commercial structural shear rating",
  },
  {
    feature: "Protective Coating",
    standard: "Baked-on Polyester Enamel Paint",
    commercial: "Galvalume (55% Al-Zn alloy) + Kynar 500 Finish",
    advantage: "Unmatched corrosion resistance against salt air & manure fumes",
  },
  {
    feature: "Certified Wind Rating",
    standard: "115 – 130 MPH Wind Certification",
    commercial: "140 – 160 MPH Coastal / Hurricane Rated",
    advantage: "Certified for severe coastal storm corridors & open plains",
  },
  {
    feature: "Roof Snow Load",
    standard: "20 – 30 PSF Ground Snow Load",
    commercial: "40 – 60+ PSF Mountain & Northern Load",
    advantage: "Reinforced truss webbing prevents roof sag under heavy snow packs",
  },
  {
    feature: "Clear-Span Capability",
    standard: "12' to 30' Interior Column-Free Width",
    commercial: "32' to 60'+ Clear-Span Interior Space",
    advantage: "Zero interior posts for unobstructed machinery maneuvering",
  },
];

export default async function ModularStoragePage() {
  const allProducts = await getPublicProducts();

  // Filter products strictly related to storage, pole barns, sheds, utility, and workshop structures
  const storageProducts = allProducts.filter((p) => isStorageBuilding(p));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modular Storage Buildings & Steel Sheds",
    description: DESCRIPTION,
    url: CANONICAL,
    numberOfItems: storageProducts.length,
    publisher: {
      "@type": "Organization",
      name: "ModularHome.com",
      url: "https://modularhome.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: storageProducts.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: getCanonicalUrl(`/buildings/${p.slug}`),
        name: p.name,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STORAGE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <CategoryCollectionRenderer
        title="Modular Storage Buildings"
        tagline="Commercial-Grade Steel Storage, Pole Barns & Workshops"
        description="Explore heavy-duty modular storage buildings, steel pole barns, multi-bay equipment workshops, and clear-span utility structures. Engineered with industrial-grade steel framing, certified wind ratings, and nationwide delivery."
        image={IMAGE}
        canonicalPath="/modular-storage"
        products={storageProducts}
        allProducts={storageProducts}
        allCollections={[]}
        categoryKey="modular-storage"
        lockPoolToInitial={true}
      >
        {/* COMPREHENSIVE COMMERCIAL & UTILITY STORAGE ENGINEERING GUIDE */}
        <section className="mt-16 pt-12 border-t border-[#e7e9ee] space-y-16">
          {/* Key Metric Highlights Bar */}
          <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Structural Gauge</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">12 & 14 GA</div>
                <div className="text-[11px] text-[#059669] font-medium">Galvanized Cold-Formed Steel</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Clear-Span Width</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">Up to 60&apos;+</div>
                <div className="text-[11px] text-[#6b7280]">100% Column-Free Interior</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Wind Certification</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">140+ MPH</div>
                <div className="text-[11px] text-[#6b7280]">Hurricane & High-Wind Rated</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-[#6b7280] font-bold">Rust Warranty</div>
                <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">Up to 50 Yrs</div>
                <div className="text-[11px] text-[#d97706] font-medium">Industrial Protective Finish</div>
              </div>
            </div>
          </div>

          {/* Editorial Section 1: Overview */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
              <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
              <span>Commercial Engineering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#101114] font-display">
              Why Cold-Formed Steel Outperforms Traditional Wood Pole Barns
            </h2>
            <div className="prose prose-neutral max-w-none text-[#4b5563] text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                For generations, rural landowners and agricultural operators relied on treated wood pole barns for storage. However, timber structures come with unavoidable long-term vulnerabilities: subterranean rot at the ground contact line, insect infestation, warp, seasonal shifting, and high vulnerability to fire and severe wind uplift.
              </p>
              <p>
                <strong>Modern modular steel storage buildings eliminate these structural weaknesses completely.</strong> Built with high-tensile galvanized commercial steel tubing, precision laser-cut gussets, and heavy industrial fasteners, our buildings provide a non-combustible, rot-proof, and termite-proof envelope that withstands the most demanding environmental conditions. Whether you need a secure agricultural machinery shed, a multi-bay commercial mechanic workshop, an RV and boat storage facility, or a heavy-duty industrial warehouse, modular steel construction delivers faster assembly, lower lifetime maintenance, and superior insurance ratings.
              </p>
            </div>
          </div>

          {/* Editorial Section 2: Four Core Storage Building Archetypes */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Applications & Use Cases</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Engineered Storage Building Types for Agriculture, Industry & Residential Utility
              </h2>
              <p className="text-sm text-[#6b7280]">
                Tailor-made structural configurations engineered for specific equipment, security, and clearance requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <Tractor className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  1. Agricultural Steel Pole Barns & Equipment Shelters ($20,900 – $99,900)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  Designed for heavy farm equipment, combines, tractors, hay storage, and livestock run-ins. Models like the Amish Built Metal Pole Barn Kits ($20,900) offer wide open bays, clear vertical eave heights from 12 to 16 feet, and heavy roof overhangs that shield valuable agricultural assets from intense UV radiation, driving rain, and winter hail.
                </p>
              </div>

              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  2. Workshop Barndominiums & Commercial Garages ($59,900 – $272,550)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  Hybrid workshop structures like The Workshop Barndominium Kit ($272,550), Iron Horse Barndo ($99,900), and The Ridgeline Garage Haven ($64,900) combine multi-car mechanics bays and industrial shop space with optional finished living quarters, offices, or breakrooms. Engineered with heavy concrete anchor tie-downs for commercial vehicle hoists.
                </p>
              </div>

              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <Warehouse className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  3. Clear-Span Commercial Warehouses & Inventory Storage
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  Featuring 100% column-free interior floor plans up to 60 feet wide, clear-span buildings maximize interior cubic volume for pallet racking, forklift maneuvering, and bulk inventory staging. Equipped with oversized commercial roll-up doors, ridge ventilation systems, and vapor-barrier thermal insulation packages.
                </p>
              </div>

              <div className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#101114] font-display">
                  4. Secure Utility Sheds & Carport Haven Structures ($49,900 – $79,900)
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  Ideal for suburban properties, small acreages, and contractor equipment storage. Units like the Sunset Ridge Garage Haven ($79,900) and Blue Ridge Carport Ranch ($74,900) provide enclosed secure lockup alongside covered vehicle parking for utility trailers, ATVs, mowers, and power tools.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Section 3: Technical Specifications Comparison Table */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Engineering Standards</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Standard Utility vs. Commercial Heavy-Industrial Steel Specifications
              </h2>
              <p className="text-sm text-[#6b7280]">
                Compare structural framing gauges, sheeting profiles, and environmental load certifications.
              </p>
            </div>

            <div className="overflow-x-auto border border-[#e7e9ee] rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#f8f9fa] border-b border-[#e7e9ee] text-[#101114] font-bold">
                  <tr>
                    <th className="p-4 font-bold">Structural Parameter</th>
                    <th className="p-4 font-bold">Standard Utility Package</th>
                    <th className="p-4 font-bold text-[#d97706]">Commercial Heavy-Gauge</th>
                    <th className="p-4 font-bold">Engineering Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e9ee] text-[#4b5563]">
                  {STORAGE_SPECS.map((spec, sIdx) => (
                    <tr key={sIdx} className="hover:bg-[#f8f9fa]/50 transition-colors">
                      <td className="p-4 font-bold text-[#101114]">{spec.feature}</td>
                      <td className="p-4">{spec.standard}</td>
                      <td className="p-4 font-semibold text-[#101114] bg-[#fcb907]/5">{spec.commercial}</td>
                      <td className="p-4 text-xs text-[#059669] font-medium">{spec.advantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Editorial Section 4: Foundation & Anchoring Guidelines */}
          <div className="bg-white border border-[#e7e9ee] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Site Engineering</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Foundation Engineering: Choosing the Right Slab & Anchoring Method
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280]">
                A steel building is only as strong as its foundation connection. Select the optimal base for your machinery load.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl space-y-2">
                <div className="text-xs font-bold uppercase text-[#d97706] tracking-wider">Level 1: Ground / Gravel</div>
                <h3 className="text-base font-bold text-[#101114]">Earth Auger Mobile Anchors</h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  Best for open-air agricultural loafing sheds and equipment carports on rural land. 30-inch helical auger anchors drive deep into compacted clay or gravel, providing certified resistance against lateral wind shear without the cost of poured concrete.
                </p>
              </div>

              <div className="p-5 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl space-y-2">
                <div className="text-xs font-bold uppercase text-[#d97706] tracking-wider">Level 2: Standard Concrete</div>
                <h3 className="text-base font-bold text-[#101114]">4&quot; Monolithic Slab (3,500 PSI)</h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  The standard choice for personal hobby workshops, classic car storage, and dry inventory. Poured over a 4-inch compacted gravel base with welded wire mesh reinforcement and a 12-inch perimeter thickened footer for base rail anchor bolts.
                </p>
              </div>

              <div className="p-5 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl space-y-2">
                <div className="text-xs font-bold uppercase text-[#d97706] tracking-wider">Level 3: Heavy Industrial</div>
                <h3 className="text-base font-bold text-[#101114]">6&quot; Rebar-Reinforced Slab (4,000 PSI)</h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  Required for commercial automotive repair bays, semi-truck parking, combine harvesters, and multi-ton forklift operations. Reinforced with #4 steel rebar on 18-inch grids and heavy 5/8-inch Hilti concrete wedge anchors.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Section 5: Frequently Asked Questions */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Storage & Pole Barn FAQs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] font-display">
                Answers to Common Questions About Modular Storage Buildings
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280]">
                Everything you need to know about engineering, clearances, insulation, agricultural exemptions, and installation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STORAGE_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-[#e7e9ee] rounded-xl space-y-2 hover:border-[#fcb907] transition-colors"
                >
                  <h3 className="text-sm font-bold text-[#101114] leading-snug flex items-start gap-2">
                    <span className="text-[#d97706] font-mono text-xs mt-0.5">Q{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-[#4b5563] leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Call to Action Box */}
          <div className="bg-gradient-to-r from-[#101114] to-[#1f2937] text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcb907]/20 border border-[#fcb907]/40 text-[#fcb907] text-xs font-bold uppercase tracking-wider">
              <span>Protect Your Equipment & Assets</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-display max-w-2xl mx-auto">
              Get an Engineer-Stamped Steel Building Quote & Slab Layout
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] max-w-xl mx-auto leading-relaxed">
              Speak with our commercial building specialists for custom bay dimensions, roll-up door clearances, engineer-certified wind load ratings, and factory delivery scheduling.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/quote"
                className="px-6 py-3 bg-[#fcb907] hover:bg-[#d97706] text-[#101114] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <span>Request Custom Storage Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/buildings"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20"
              >
                Explore Full Steel Catalog
              </Link>
            </div>
          </div>
        </section>
      </CategoryCollectionRenderer>
    </>
  );
}
