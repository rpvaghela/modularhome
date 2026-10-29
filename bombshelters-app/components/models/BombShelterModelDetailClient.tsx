"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Check,
  Maximize2,
  Play,
  Bed,
  Bath,
  CheckCircle2,
  X,
  Compass,
  FileCheck,
  Layers,
  Sliders,
  Download,
  Upload,
  Lock,
  CalendarCheck,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { ExtendedProductModel, ProductVariant, CustomizableOption } from "@/lib/productStore";
import { ShareButton } from "@/components/ui/ShareButton";
import { RichHtmlContent } from "@/components/ui/RichHtmlContent";

interface BombShelterModelDetailClientProps {
  model: ExtendedProductModel;
  relatedModels: ExtendedProductModel[];
  phone?: string;
  companyName?: string;
  currentCategory?: string;
}

export function BombShelterModelDetailClient({
  model,
  relatedModels = [],
  phone = "+1 (812) 595-4033",
  currentCategory,
}: BombShelterModelDetailClientProps) {
  // Gallery setup
  const rawPrimary = model.primaryImageUrl || model.imageUrl || "/images/hillside-bunker.png";
  const rawGallery = Array.isArray(model.gallery) && model.gallery.length > 0 ? model.gallery : [rawPrimary];
  const galleryList = Array.from(new Set([rawPrimary, ...rawGallery].filter(Boolean)));

  const [activeImage, setActiveImage] = useState<string>(rawPrimary);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [floorPlanExpanded, setFloorPlanExpanded] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Quote & Customize Modals
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    timeline: "Immediately (1-3 months)",
    notes: "",
  });

  // Multi-tier variants handling
  const variants: ProductVariant[] = Array.isArray(model.variants) && model.variants.length > 0
    ? model.variants
    : [
        { id: `${model.id}-std`, title: "Standard Hardened Shell", price: model.rawPrice, sku: "STD-SHELL" },
        { id: `${model.id}-fortified`, title: "Fortified Package (Electrical & HVAC)", price: Math.round(model.rawPrice * 1.18), sku: "FORT-HVAC" },
        { id: `${model.id}-turnkey`, title: "Turnkey Luxury Life Support (NBC + Solar)", price: Math.round(model.rawPrice * 1.35), sku: "TURN-NBC" },
      ];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || "");
  const activeVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  const featuresList = Array.isArray(model.features) && model.features.length > 0
    ? model.features
    : [
        "A36 High-Strength Structural Carbon Steel Shell",
        "Dual Airtight Compression Blast Doors",
        "Swiss Lunor NBC Air Filtration Integration",
        "Secondary Emergency Escape Tunnel with Counter-weighted Hatch",
        "FEMA 361 & ICC-500 Severe Storm and Missile Impact Tested",
        "Cathodic Anti-Corrosion Coal Tar Epoxy Exterior Coating",
        "Pre-plumbed Waste Sump and In-ground Greywater Redirection",
        "Off-Grid Electrical Interface & Generator Ready Transfer Switch",
      ];

  const specsList = Array.isArray(model.specsList) && model.specsList.length > 0
    ? model.specsList
    : [
        { label: "Structural Shell", value: "A36 Cold-Formed Structural Carbon Steel" },
        { label: "Blast Overpressure", value: "10 - 25 PSI Blast Certified (FEMA 361 Standard)" },
        { label: "Wind Load Tolerance", value: "250+ MPH EF5 Tornado Rated" },
        { label: "Burial Depth Rating", value: "Up to 12 Feet Soil Cover Depth" },
        { label: "Protective Coating", value: "Polyurethane Coal Tar Epoxy / Marine Zinc Primer" },
        { label: "Life Support Compatibility", value: "Positive Pressure NBC Air Matrix Ready" },
        { label: "Foundation Standard", value: "Sub-surface Monolithic Concrete Slab" },
      ];

  const optionsList: CustomizableOption[] = Array.isArray(model.customizableOptions) && model.customizableOptions.length > 0
    ? model.customizableOptions
    : [
        {
          id: "opt-nbc-air",
          name: "Swiss Lunor NBC Air Filtration Matrix",
          price: 8500,
          description: "99.99% particulate & gas scrubbing with manual hand-crank failover and positive pressure overpressure valve.",
        },
        {
          id: "opt-blast-door",
          name: "10-PSI Sub-Surface Blast Door & Compression Hatch",
          price: 6400,
          description: "Military-grade 3/8-inch solid steel with airtight multi-point compression dogging latches and gas seal.",
        },
        {
          id: "opt-solar-emp",
          name: "Off-Grid Solar + LiFePO4 Battery & EMP Shield",
          price: 14900,
          description: "10kWh shielded lithium storage, dual MPPT inverters, and MIL-STD-188-125 EMP protective Faraday enclosure.",
        },
        {
          id: "opt-escape-tunnel",
          name: "Secondary Concealed Escape Tunnel (30ft)",
          price: 4900,
          description: "Corrugated steel crawlway with quick-exit counterweighted surface hatch and interior cam-lock.",
        },
        {
          id: "opt-water-filtration",
          name: "500-Gal Subterranean Potable Water Tank & Reverse Osmosis",
          price: 3800,
          description: "Heavy-duty food-grade poly tank with 12V pressure pump and multi-stage ultraviolet filtration.",
        },
        {
          id: "opt-decon-shower",
          name: "Airlock Decontamination Mist Station & Sump",
          price: 2900,
          description: "Entryway containment airlock shower with chemical neutralizing washdown and dedicated graywater sump.",
        },
      ];

  // Base price dynamically derives from selected variant or rawPrice
  const baseStartingPrice = Number(model.rawPrice) || 49900;
  const currentBasePrice = activeVariant ? Number(activeVariant.price) : baseStartingPrice;

  const optionsTotal = selectedOptions.reduce((acc, optId) => {
    const opt = optionsList.find((o) => o.id === optId);
    return acc + (opt ? opt.price : 0);
  }, 0);

  const totalCalculatedPrice = currentBasePrice + optionsTotal;

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    setQuoteError("");
    try {
      const selectedOptionNames = selectedOptions
        .map((id) => optionsList.find((o) => o.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      const res = await fetch("/api/bombshelter/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          zip: quoteForm.zip,
          project_type: model.category || "Bomb Shelters",
          budget: `$${totalCalculatedPrice.toLocaleString()}`,
          notes: `Model: ${model.name} (${activeVariant ? activeVariant.title : "Standard"}). Estimated Total: $${totalCalculatedPrice.toLocaleString()}. Selected Upgrades: ${selectedOptionNames || "None"}. Timeline: ${quoteForm.timeline}. Notes: ${quoteForm.notes || "None"}`,
          enquiry_details: `Inquiry for ${model.name}. Model ID: ${model.id}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to submit quote request.");
      }

      setQuoteSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please call us directly.";
      setQuoteError(msg);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const formattedDimensions = model.dimensions || (model.sqft ? `Approx. ${Math.round(Math.sqrt(model.sqft * 1.5))}' × ${Math.round(model.sqft / Math.sqrt(model.sqft * 1.5))}' Sub-Surface` : "Custom Dimensions Available");
  const formattedStories = model.stories ? `${model.stories} ${model.stories === 1 ? "Level" : "Levels"}` : "Sub-Surface Single Level";

  const modelShareData = {
    title: `${model.name} | BombShelters.com`,
    url: `/models/${model.id}`,
    description: `${model.name} - ${model.specs}. ${model.sqft ? `${model.sqft} SQ FT` : ""} hardened structural steel shelter. Starting at $${totalCalculatedPrice.toLocaleString()}.`,
    image: rawPrimary,
    category: model.category,
    price: `$${totalCalculatedPrice.toLocaleString()}`,
  };

  return (
    <div className="min-h-screen bg-[#ffffff] pt-4 pb-20 text-[#0a0a0a]">
      {/* ── Breadcrumb & Top Bar ───────────────────────────────── */}
      <div className="site-container py-3 text-xs text-gray-500 border-b border-gray-100 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link href="/" className="hover:text-[#0a0a0a] transition-colors font-medium">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link href="/models" className="hover:text-[#0a0a0a] transition-colors font-medium">
              Models Catalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-[#e11d1d] font-bold uppercase truncate">{model.name}</span>
          </div>

          <ShareButton
            variant="button"
            label="Share Model"
            item={modelShareData}
            buttonTitle={`Share ${model.name}`}
          />
        </div>
      </div>

      <div className="site-container">
        {/* ── HERO SECTION: 16:10 Gallery + Sticky Pricing Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Gallery Viewport (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#0a0a0a] border border-gray-200 shadow-md group">
              <Image
                src={activeImage || rawPrimary}
                alt={model.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge Top-Left */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#e11d1d] text-white text-[11px] font-display font-bold uppercase tracking-wider shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{model.badge?.text || "CERTIFIED SHELTER"}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-black/80 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest border border-white/20">
                  FEMA 361 RATED
                </span>
              </div>

              {/* Floating Share Icon Top-Right */}
              <div className="absolute top-4 right-4 z-10">
                <ShareButton
                  variant="icon"
                  item={modelShareData}
                  buttonTitle={`Share ${model.name}`}
                />
              </div>

              {/* Bottom Action Triggers */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[4px] bg-[#0a0a0a]/90 hover:bg-[#e11d1d] text-white border border-white/20 text-xs font-display font-bold uppercase tracking-wider backdrop-blur-md transition-all shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#e11d1d] group-hover:fill-white text-[#e11d1d]" />
                  <span>Watch Defense Tour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] bg-white/90 hover:bg-white text-[#0a0a0a] text-xs font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Enlarge View</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {galleryList.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {galleryList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-[#e11d1d] ring-2 ring-[#e11d1d]/40 scale-[1.02]"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${model.name} photo ${idx + 1}`}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Model Information & Sticky Pricing Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl shadow-xs space-y-5">
              <div>
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-[#e11d1d] block">
                  BOMBSHELTERS.COM • {model.category?.toUpperCase()}
                </span>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0a0a0a] tracking-tight uppercase mt-1 leading-tight">
                  {model.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {model.specs || "Turnkey Engineered Underground Shelter System"}
                </p>
              </div>

              {/* Multi-tier Build Package Selector */}
              {variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-[11px] font-display font-bold uppercase tracking-wider text-[#0a0a0a]">
                    <span>1. Select Defense Package Tier</span>
                    <span className="text-[#e11d1d] font-semibold lowercase">
                      {variants.length} packages
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {variants.map((v) => {
                      const isSelected = v.id === activeVariant.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white border-[#e11d1d] ring-2 ring-[#e11d1d]/20 shadow-xs"
                              : "bg-white/70 border-gray-200 hover:bg-white hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-[#e11d1d] bg-[#e11d1d]"
                                  : "border-gray-400"
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-bold text-[#0a0a0a]">{v.title}</span>
                          </div>
                          <span className="text-xs font-display font-bold text-[#e11d1d]">
                            ${Number(v.price).toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Core Specs Grid (4 Badges) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white border border-gray-200 rounded-lg text-center">
                <div className="flex flex-col items-center">
                  <Maximize2 className="w-4 h-4 text-[#e11d1d] mb-1" />
                  <span className="text-[10px] uppercase text-gray-500 font-bold">Living Area</span>
                  <span className="font-bold text-xs text-[#0a0a0a]">
                    {model.sqft && model.sqft > 0 ? `${model.sqft} SQ FT` : (model.capacity || "Custom Size")}
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-gray-200">
                  <Bed className="w-4 h-4 text-[#e11d1d] mb-1" />
                  <span className="text-[10px] uppercase text-gray-500 font-bold">Sleeping</span>
                  <span className="font-bold text-xs text-[#0a0a0a]">
                    {model.bedrooms && model.bedrooms > 0 ? `${model.bedrooms} Bunks` : (model.capacity || "4-8 Persons")}
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-gray-200">
                  <Bath className="w-4 h-4 text-[#e11d1d] mb-1" />
                  <span className="text-[10px] uppercase text-gray-500 font-bold">Sanitation</span>
                  <span className="font-bold text-xs text-[#0a0a0a]">
                    {model.bathrooms && model.bathrooms > 0 ? `${model.bathrooms} Bath` : "Decon Airlock"}
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-gray-200">
                  <Layers className="w-4 h-4 text-[#e11d1d] mb-1" />
                  <span className="text-[10px] uppercase text-gray-500 font-bold">Sub-Surface</span>
                  <span className="font-bold text-xs text-[#0a0a0a]">
                    {formattedStories}
                  </span>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="pt-2 border-t border-gray-200 flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    {activeVariant ? `${activeVariant.title} Price` : "Starting Base Price"}
                  </div>
                  <div className="font-display font-bold text-3xl sm:text-4xl text-[#e11d1d] tracking-tight">
                    ${totalCalculatedPrice.toLocaleString()}
                  </div>
                </div>
                {selectedOptions.length > 0 && optionsTotal > 0 && (
                  <div className="text-right">
                    <span className="text-xs text-[#e11d1d] font-bold block">
                      +${optionsTotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">in Options</span>
                  </div>
                )}
              </div>

              {/* Primary Call-to-action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Request Quote Button (Opens Modal) */}
                <button
                  type="button"
                  id="request-quote-button"
                  onClick={() => {
                    setQuoteSuccess(false);
                    setQuoteModalOpen(true);
                  }}
                  className="w-full py-3.5 px-6 rounded-[4px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-display font-bold uppercase tracking-wider text-sm shadow-[0_6px_20px_rgba(225,29,29,0.28)] hover:shadow-[0_8px_24px_rgba(225,29,29,0.38)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Request an Itemized Quote</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Customize Plan Button (Opens Customizer Modal) */}
                <button
                  type="button"
                  id="customize-plan-button"
                  onClick={() => setCustomizeModalOpen(true)}
                  className="w-full py-3 px-5 rounded-[4px] border-2 border-[#0a0a0a] bg-white hover:bg-gray-100 text-[#0a0a0a] font-display font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Sliders className="w-4 h-4 text-[#e11d1d]" />
                  <span>Customize Shelter Upgrades ({selectedOptions.length} Selected)</span>
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[4px] border border-gray-300 hover:border-gray-800 bg-white text-xs font-bold text-[#0a0a0a] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#e11d1d]" />
                    <span>Call Defense Team</span>
                  </a>

                  <Link
                    href={`/upload-floor-plan?model=${encodeURIComponent(model.id)}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[4px] border border-gray-300 hover:border-gray-800 bg-white text-xs font-bold text-[#0a0a0a] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#e11d1d]" />
                    <span>Upload Site Plan</span>
                  </Link>
                </div>

                {/* Link to Full Multi-Step Wizard */}
                <div className="text-center pt-1">
                  <Link
                    href={`/quote?model=${encodeURIComponent(model.id)}${activeVariant ? `&variant=${encodeURIComponent(activeVariant.id)}` : ""}`}
                    className="text-[11px] text-gray-500 hover:text-[#e11d1d] font-semibold underline underline-offset-4"
                  >
                    Or open full 3D quote configuration wizard →
                  </Link>
                </div>

                {/* Share Model Full Width Action */}
                <ShareButton
                  variant="outline"
                  label="Share This Shelter Package"
                  className="w-full"
                  item={modelShareData}
                  buttonTitle={`Share ${model.name}`}
                />
              </div>

              {/* Engineering highlights badge */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-2.5 text-xs text-gray-600">
                <ShieldCheck className="w-4 h-4 text-[#e11d1d] shrink-0 stroke-[2.5]" />
                <span className="font-medium">
                  {model.warranty || "50-Year Structural Steel Guarantee"} • ASTM &amp; FEMA 361 Certified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── DETAILED CONTENT SECTIONS ─────────────────────────── */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Main Information Columns (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section className="space-y-3">
              <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-[#e11d1d]">
                Defense &amp; Survivability Architecture
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase text-[#0a0a0a] tracking-tight">
                Engineering Overview
              </h2>
              <div className="pt-2">
                <RichHtmlContent
                  content={
                    model.description && model.description.trim()
                      ? model.description
                      : `<p>The <strong>${model.name}</strong> is an engineered subterranean shelter manufactured from heavy cold-formed structural steel, built to withstand catastrophic overpressures, seismic shocks, and prolonged CBRN fallout. Built to exacting defense specifications with positive-pressure airtight seams, heavy plate blast doors, and secondary subterranean emergency egress, this shelter provides an uncompromised tactical retreat for families and security personnel.</p>`
                  }
                />
              </div>
            </section>

            {/* Architectural Floor Plan / Blueprint Section */}
            <section className="space-y-5 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-[#e11d1d]">
                    Layout &amp; Dimensions
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase text-[#0a0a0a] tracking-tight">
                    Architectural Floor Plan
                  </h2>
                </div>
                {model.floorPlanImage && (
                  <button
                    type="button"
                    onClick={() => setFloorPlanExpanded(true)}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-[4px] border border-gray-300 hover:border-gray-800 text-xs font-bold text-[#0a0a0a] cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Enlarge Blueprint</span>
                  </button>
                )}
              </div>

              {/* Real Floor Plan Image or Verified Schematic Display */}
              {model.floorPlanImage ? (
                <div
                  onClick={() => setFloorPlanExpanded(true)}
                  className="cursor-pointer relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200 group shadow-xs"
                >
                  <Image
                    src={model.floorPlanImage}
                    alt={`${model.name} Floor Plan Schematic`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-contain p-4 group-hover:scale-102 transition-transform duration-500 bg-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold">{formattedDimensions}</span>
                    <span className="text-[#e11d1d] font-bold">Click to view full layout →</span>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#262b36] p-7 sm:p-9 text-white shadow-lg">
                  {/* Grid background effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e11d1d_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#e11d1d]/10 border border-[#e11d1d]/30 flex items-center justify-center shrink-0">
                          <Compass className="w-6 h-6 text-[#e11d1d]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-[#e11d1d] block">
                            Engineered Blueprint Schematic
                          </span>
                          <h3 className="font-display font-bold text-xl uppercase text-white">
                            {model.name} — Subterranean Layout
                          </h3>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-200 border border-white/15 w-fit">
                        <FileCheck className="w-3.5 h-3.5 text-[#e11d1d]" />
                        <span>CAD &amp; PDF Available</span>
                      </span>
                    </div>

                    {/* Dimensions & Spatial Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Footprint</span>
                        <span className="text-sm font-display font-bold text-white">
                          {formattedDimensions}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Protected Living</span>
                        <span className="text-sm font-display font-bold text-white">
                          {model.sqft && model.sqft > 0 ? `${model.sqft} SQ FT` : "Flexible Layout"}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Sleeping Bunks</span>
                        <span className="text-sm font-display font-bold text-white">
                          {model.bedrooms && model.bedrooms > 0 ? `${model.bedrooms} Bunks` : (model.capacity || "4-8 Persons")}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Structural Steel</span>
                        <span className="text-sm font-display font-bold text-[#e11d1d]">
                          {model.frameType || "A36 Cold-Formed Steel"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                      Architectural blueprints, site excavation diagrams, and engineering CAD schematics for the <strong className="text-white">{model.name}</strong> are custom prepared per project to match local seismic ratings, soil load capacities, and water table constraints. Complete positive-pressure ventilation conduits, graywater runs, and emergency escape elevations are included.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setQuoteSuccess(false);
                          setQuoteModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#e11d1d] hover:bg-[#c81414] text-white text-xs font-display font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Request Official Floor Plan CAD &amp; PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomizeModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                      >
                        <span>Submit Custom Layout Modification</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Technical Specifications Table */}
            <section className="space-y-5 pt-8 border-t border-gray-200">
              <div>
                <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-[#e11d1d]">
                  Structural Tolerances
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase text-[#0a0a0a] tracking-tight">
                  Technical Specifications
                </h2>
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-xl">
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-gray-500 uppercase font-bold">Standard Dimensions</span>
                    <span className="text-[#0a0a0a] font-semibold">{formattedDimensions}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs bg-[#f8fafc]">
                    <span className="text-gray-500 uppercase font-bold">Sub-Surface Levels</span>
                    <span className="text-[#0a0a0a] font-semibold">{formattedStories}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-gray-500 uppercase font-bold">Structural Shell</span>
                    <span className="text-[#0a0a0a] font-semibold">{model.frameType || "A36 Cold-Formed Structural Steel"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs bg-[#f8fafc]">
                    <span className="text-gray-500 uppercase font-bold">Overpressure Resistance</span>
                    <span className="text-[#e11d1d] font-bold">{model.blastRating || "10 - 25 PSI Blast Rated (FEMA 361 Standard)"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-gray-500 uppercase font-bold">Wind Speed Rating</span>
                    <span className="text-[#0a0a0a] font-semibold">{model.windRating || "250+ MPH EF5 Tornado Rated"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs bg-[#f8fafc]">
                    <span className="text-gray-500 uppercase font-bold">Ground Snow / Earth Load</span>
                    <span className="text-[#0a0a0a] font-semibold">{model.snowLoad || "75 PSF / 12ft Earth Cover"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-gray-500 uppercase font-bold">Structural Warranty</span>
                    <span className="text-[#e11d1d] font-bold">{model.warranty || "50-Year Structural Steel Integrity Guarantee"}</span>
                  </div>

                  {specsList.map((spec, idx) => (
                    <div key={idx} className={`grid grid-cols-2 p-3.5 text-xs ${idx % 2 === 1 ? "bg-[#f8fafc]" : ""}`}>
                      <span className="text-gray-500 uppercase font-bold">{spec.label}</span>
                      <span className="text-[#0a0a0a] font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Standard Factory Inclusions */}
            <section className="space-y-5 pt-8 border-t border-gray-200">
              <div>
                <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-[#e11d1d]">
                  Standard Package
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase text-[#0a0a0a] tracking-tight">
                  Engineered Defense Features
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuresList.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#f8fafc] border border-gray-200 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#e11d1d] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="text-xs text-[#0a0a0a] leading-relaxed font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Customization Options & Configurator (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-6 space-y-5 sticky top-28 shadow-xs">
              <div>
                <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-[#e11d1d]">
                  Life Support &amp; Armor
                </div>
                <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a] mt-1">
                  Available Upgrades
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Click to add options directly to your estimated pricing summary.
                </p>
              </div>

              <div className="space-y-2.5">
                {optionsList.map((option) => {
                  const isChecked = selectedOptions.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`cursor-pointer p-3.5 rounded-lg border transition-all ${
                        isChecked
                          ? "bg-white border-[#e11d1d] shadow-xs ring-1 ring-[#e11d1d]"
                          : "bg-white/80 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-[3px] border mt-0.5 flex items-center justify-center shrink-0 ${
                              isChecked
                                ? "border-[#e11d1d] bg-[#e11d1d] text-white"
                                : "border-gray-400"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0a0a0a]">
                              {option.name}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                              {option.description}
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-display font-bold text-[#e11d1d] shrink-0">
                          +${option.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-gray-200 space-y-2.5">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{activeVariant ? activeVariant.title : "Base Model"}:</span>
                  <span className="text-[#0a0a0a] font-semibold">${currentBasePrice.toLocaleString()}</span>
                </div>
                {selectedOptions.length > 0 && optionsTotal > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Selected Upgrades:</span>
                    <span className="text-[#e11d1d] font-bold">+${optionsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#0a0a0a] pt-2 border-t border-gray-200">
                  <span>Updated Estimate:</span>
                  <span className="font-display font-bold text-[#e11d1d] text-xl">
                    ${totalCalculatedPrice.toLocaleString()}
                  </span>
                </div>

                {/* Main Action CTAs in Sidebar */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuoteSuccess(false);
                      setQuoteModalOpen(true);
                    }}
                    className="w-full py-3.5 px-4 rounded-[4px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-display font-bold uppercase tracking-wider text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Request a Detailed Quote</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomizeModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-[4px] border border-gray-300 hover:border-gray-800 bg-white text-[#0a0a0a] font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#e11d1d]" />
                    <span>Customize Plan &amp; Layout</span>
                  </button>

                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="w-full py-2.5 px-4 rounded-[4px] border border-gray-300 hover:border-gray-800 bg-white text-[#0a0a0a] font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#e11d1d]" />
                    <span>Call {phone}</span>
                  </a>

                  <ShareButton
                    variant="outline"
                    label="Share Configured Estimate"
                    className="w-full"
                    item={{
                      ...modelShareData,
                      price: `$${totalCalculatedPrice.toLocaleString()}`,
                    }}
                    buttonTitle={`Share ${model.name}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED MODELS SECTION ────────────────────────────── */}
        {relatedModels.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="mb-8">
              <div className="text-xs font-display font-bold uppercase tracking-[0.2em] text-[#e11d1d]">
                Similar Footprints
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase text-[#0a0a0a] mt-1 tracking-tight">
                Related Shelters &amp; Bunkers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedModels.map((m) => (
                <Link
                  key={m.id}
                  href={`/models/${m.id}`}
                  className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-[#e11d1d] hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={m.primaryImageUrl || m.imageUrl}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] bg-[#e11d1d] text-white text-[10px] font-display font-bold uppercase tracking-wider shadow">
                        {m.badge?.text || "CERTIFIED"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#e11d1d] block">
                        {m.category}
                      </span>
                      <h3 className="font-display font-bold text-lg uppercase text-[#0a0a0a] mt-1 group-hover:text-[#e11d1d] transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {m.specs || "Turnkey Sub-Surface Shelter"}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting at</span>
                        <span className="font-display font-bold text-xl text-[#0a0a0a] group-hover:text-[#e11d1d]">
                          {m.price}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#e11d1d] group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── REQUEST QUOTE MODAL ───────────────────────────────── */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white border border-gray-200 rounded-xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#e11d1d] block">
                  Official Pricing Request
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl uppercase text-[#0a0a0a]">{model.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-[#0a0a0a] rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">Quote Request Received!</h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{quoteForm.name || "Valued Client"}</strong>. An engineering advisor is preparing your itemized build estimate for the <strong>{model.name}</strong> and will reach out to you within 24 hours.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg text-xs font-bold text-[#0a0a0a] border border-gray-200">
                  Estimated Build: <span className="text-[#e11d1d] font-display font-bold text-base">${totalCalculatedPrice.toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="w-full py-3 px-4 rounded-[4px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-display font-bold uppercase tracking-wider text-xs"
                >
                  Close &amp; Continue Browsing
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs border border-gray-200">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Configured Model</span>
                    <span className="font-bold text-[#0a0a0a]">{activeVariant ? `${model.name} (${activeVariant.title})` : model.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Estimated Total</span>
                    <span className="font-display font-bold text-[#e11d1d] text-base">${totalCalculatedPrice.toLocaleString()}</span>
                  </div>
                </div>

                {quoteError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {quoteError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0a0a0a] uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      placeholder="e.g. John Miller"
                      className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:border-[#e11d1d] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0a0a0a] uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:border-[#e11d1d] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0a0a0a] uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      placeholder="e.g. (812) 555-0199"
                      className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:border-[#e11d1d] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0a0a0a] uppercase mb-1">Delivery ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.zip}
                      onChange={(e) => setQuoteForm({ ...quoteForm, zip: e.target.value })}
                      placeholder="e.g. 47401"
                      className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:border-[#e11d1d] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0a0a0a] uppercase mb-1">Deployment Timeline</label>
                  <select
                    value={quoteForm.timeline}
                    onChange={(e) => setQuoteForm({ ...quoteForm, timeline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:border-[#e11d1d] focus:outline-hidden bg-white"
                  >
                    <option value="Immediately (1-3 months)">Immediately (1-3 months)</option>
                    <option value="Planning for 3-6 months">Planning for 3-6 months</option>
                    <option value="Exploring for next year">Exploring for next year</option>
                    <option value="Commercial / Government Inquiry">Commercial / Government Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0a0a0a] uppercase mb-1">Notes / Custom Defense Specs</label>
                  <textarea
                    rows={2}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    placeholder="Specific burial depth, escape tunnel length, or airlock modifications..."
                    className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:border-[#e11d1d] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="w-full py-3 px-4 rounded-[4px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-display font-bold uppercase tracking-wider text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {quoteSubmitting ? "Generating Quote Package..." : "Submit Quote Request"}
                  {!quoteSubmitting && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── CUSTOMIZE PLAN MODAL ──────────────────────────────── */}
      {customizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#e11d1d] block">
                  Shelter Customizer
                </span>
                <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">Configure {model.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomizeModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-[#0a0a0a] rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mt-4">
              {/* Build Variant Picker */}
              {variants.length > 1 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0a0a0a] uppercase">1. Select Package / Size Variant</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {variants.map((v) => {
                      const isSelected = v.id === activeVariant.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-50/50 border-[#e11d1d] ring-1 ring-[#e11d1d]"
                              : "bg-white border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0a0a0a]">{v.title}</span>
                            <span className="text-xs font-display font-bold text-[#e11d1d]">${Number(v.price).toLocaleString()}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upgrades Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0a0a0a] uppercase">2. Select Life Support &amp; Armor Add-ons</label>
                <div className="space-y-2">
                  {optionsList.map((opt) => {
                    const isChecked = selectedOptions.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        className={`cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? "bg-red-50/40 border-[#e11d1d] ring-1 ring-[#e11d1d]"
                            : "bg-white border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 ${
                              isChecked
                                ? "border-[#e11d1d] bg-[#e11d1d] text-white"
                                : "border-gray-400"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0a0a0a] block">{opt.name}</span>
                            <span className="text-[11px] text-gray-500 block leading-tight">{opt.description}</span>
                          </div>
                        </div>
                        <span className="text-xs font-display font-bold text-[#e11d1d] shrink-0">
                          +${opt.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Summary Footer */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Configured Estimate</span>
                  <span className="font-display font-bold text-2xl text-[#e11d1d]">
                    ${totalCalculatedPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCustomizeModalOpen(false);
                    setQuoteSuccess(false);
                    setQuoteModalOpen(true);
                  }}
                  className="py-3 px-6 rounded-[4px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-display font-bold uppercase tracking-wider text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Proceed with Customization</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ENLARGE IMAGE / BLUEPRINT MODAL ───────────────────── */}
      {(imageModalOpen || floorPlanExpanded) && (
        <div
          onClick={() => {
            setImageModalOpen(false);
            setFloorPlanExpanded(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-5xl w-full h-[85vh] bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
            <button
              type="button"
              onClick={() => {
                setImageModalOpen(false);
                setFloorPlanExpanded(false);
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-[#e11d1d] text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={floorPlanExpanded && model.floorPlanImage ? model.floorPlanImage : (activeImage || rawPrimary)}
                alt={model.name}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO TOUR MODAL ──────────────────────────────────── */}
      {videoModalOpen && (
        <div
          onClick={() => setVideoModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full aspect-[16/9] bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-[#e11d1d] text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={model.videoUrl || "https://www.youtube-nocookie.com/embed/MHWHDE87Pp4?autoplay=1"}
              title={`${model.name} Walkthrough`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

