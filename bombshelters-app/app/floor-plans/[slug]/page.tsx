import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Layers,
  Users,
  Compass,
  ArrowRight,
  Download,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

const FLOOR_PLANS = [
  {
    id: "defiance-bunker-plan",
    name: "The Defiance 10x40 Subterranean Floor Plan",
    category: "Bomb Shelters",
    sqft: 400,
    dimensions: '10\' W x 40\' L x 8\' H',
    occupancy: "6-10 People",
    rooms: "Master Bunkroom, Galley, NBC Vault, Chemical Head",
    imageUrl: "/images/hillside-bunker.png",
    desc: "Single-tube corrugated structural steel shelter with pressurized airlock and concealed secondary escape tunnel.",
  },
  {
    id: "bastion-luxury-estate-plan",
    name: "The Bastion 2,400 Sq Ft Subterranean Complex",
    category: "Luxury Bunkers",
    sqft: 2400,
    dimensions: 'Multi-Module Interlocking Arcs',
    occupancy: "12-24 People",
    rooms: "3 Private Suites, Commercial Kitchen, Hydroponic Greenhouse, Comms Center",
    imageUrl: "/images/cat-luxury-bunkers.png",
    desc: "High-capacity subterranean multi-module estate engineered for independent multi-year off-grid survival.",
  },
  {
    id: "sentinel-safe-room-plan",
    name: "The Sentinel 8x12 Interior Panic Room Layout",
    category: "Safe Rooms",
    sqft: 96,
    dimensions: '8\' W x 12\' L x 9\' H',
    occupancy: "4-6 People",
    rooms: "Ballistic Sanctuary, Secure Weapons Vault, Emergency Oxygen Bay",
    imageUrl: "/images/cat-safe-rooms.png",
    desc: "Reinforced residential interior ballistic panic room with emergency egress and hidden biometric vault door.",
  },
  {
    id: "appalachian-steel-home-plan",
    name: "The Appalachian 1,200 Sq Ft Steel Home Layout",
    category: "Steel Framed Homes",
    sqft: 1200,
    dimensions: '30\' W x 40\' L x 16\' Ridge',
    occupancy: "Family Living (2 Bed | 2 Bath)",
    rooms: "Open Living/Dining, Primary Suite, Guest Room, Fortified Utility Room",
    imageUrl: "/images/cat-steel-framed-homes.png",
    desc: "Indestructible cold-formed steel architectural home engineered against severe wind, wildfire, and seismic loads.",
  },
  {
    id: "iron-ridge-barndo-plan",
    name: "The Iron Ridge 40x50 Steel Barndominium Plan",
    category: "Barndominiums",
    sqft: 2000,
    dimensions: '40\' W x 50\' L x 18\' Eave',
    occupancy: "Estate (3 Bed | 2.5 Bath + Shop)",
    rooms: "Great Room, 2-Story Loft, Master Wing, Integrated In-Slab Tornado Vault",
    imageUrl: "/images/cat-steel-framed-homes.png",
    desc: "Rigid commercial steel framing with massive open floor space and integrated below-ground storm shelter.",
  },
  {
    id: "gatlinburg-cabin-plan",
    name: "The Gatlinburg 1,715 Sq Ft Hybrid Cabin Plan",
    category: "Cabins",
    sqft: 1715,
    dimensions: '34\' W x 42\' L + Wrap Porch',
    occupancy: "Homestead / Vacation",
    rooms: "Vaulted Great Room, Chef Kitchen, 2 Suites, Sleeping Loft",
    imageUrl: "/images/cat-cabins.png",
    desc: "Rustic timber exterior cladding over a heavy-gauge structural steel skeleton for supreme longevity.",
  },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const plan = FLOOR_PLANS.find((p) => p.id === params.slug);
  if (!plan) return { title: "Floor Plan Not Found | BombShelters.com" };

  return {
    title: `${plan.name} | Blueprint & Layout Specs`,
    description: plan.desc,
  };
}

export default function FloorPlanDetailPage({ params }: PageProps) {
  const plan = FLOOR_PLANS.find((p) => p.id === params.slug);
  if (!plan) {
    notFound();
  }

  return (
    <>
      <SubPageHeader
        badge={plan.category.toUpperCase()}
        title={plan.name.toUpperCase()}
        description={plan.desc}
        breadcrumbs={[
          { label: "Floor Plans", href: "/floor-plans" },
          { label: plan.name },
        ]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Blueprint Display (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 shadow-xl">
                <Image
                  src={plan.imageUrl}
                  alt={plan.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#0a0a0a]">
                  Architectural Specifications &amp; Layout
                </h2>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {plan.desc} Engineered to international standards with certified structural stamps available for all 50 states.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[11px] uppercase font-bold text-gray-400">Total Square Footage</div>
                    <div className="font-display font-bold text-lg text-[#0a0a0a] mt-0.5">
                      {plan.sqft} Sq. Ft.
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[11px] uppercase font-bold text-gray-400">Dimensions</div>
                    <div className="font-display font-bold text-lg text-[#0a0a0a] mt-0.5">
                      {plan.dimensions}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[11px] uppercase font-bold text-gray-400">Capacity</div>
                    <div className="font-display font-bold text-lg text-[#0a0a0a] mt-0.5">
                      {plan.occupancy}
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-gray-50 border border-gray-200">
                  <h3 className="font-display font-bold text-base uppercase tracking-tight mb-2">
                    Room Allocations &amp; Sub-Systems
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">{plan.rooms}</p>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e11d1d]" />
                      <span>Pre-drilled mechanical penetrations for Swiss NBC air intakes and exhaust vents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e11d1d]" />
                      <span>Concealed secondary hydraulic escape tunnel vector with sealed blast hatch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e11d1d]" />
                      <span>Under-floor greywater retention tank and greywater lift pump sleeve</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1014] text-white border border-[#22252a] sticky top-28 space-y-6 shadow-2xl">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400">
                    Plan Inquiry &amp; Customization
                  </span>
                  <div className="text-2xl font-display font-black text-white mt-1">
                    Download CAD Study
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Request full PDF study prints with dimensional details and turnkey manufacturing quotes.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#22252a] space-y-3">
                  <Button asLink href="/quote" size="lg" className="w-full text-center">
                    <span>Get Turnkey Estimate</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                  <Button
                    asLink
                    href="/upload-floor-plan"
                    variant="outline"
                    size="md"
                    className="w-full text-center"
                  >
                    <span>Request CAD Modifications</span>
                  </Button>
                </div>

                <div className="pt-4 border-t border-[#22252a] text-xs text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#e11d1d]" />
                  <span>Engineering Desk: 812-595-4033</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
