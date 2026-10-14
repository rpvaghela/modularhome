"use client";

import { useState } from "react";
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
  Sparkles,
  Download
} from "lucide-react";
import { BuildingModel, BuildingModelVariant } from "@/data/models";
import BuildingCard from "@/components/BuildingCard";
import VideoModal from "@/components/VideoModal";
import ShareButton from "@/components/ShareButton";
import { VideoItem } from "@/data/videos";
import { formatPrice } from "@/utils/currency";
import RichHtmlContent from "@/components/RichHtmlContent";
import { getCategoryFallbackImage } from "@/lib/publicData";
import { getProductCategorySlug, getCategoryDisplayName } from "@/utils/productUrls";

interface ModelDetailClientProps {
  model: BuildingModel;
  relatedModels: BuildingModel[];
  phone?: string;
  companyName?: string;
  currentCategory?: string;
}

export default function ModelDetailClient({
  model,
  relatedModels = [],
  phone = "+1 (812) 595-4033",
  currentCategory,
}: ModelDetailClientProps) {
  const fallbackImg = getCategoryFallbackImage(model?.category || model?.series, model?.name, model?.slug);
  const rawPrimary = model?.primaryImage || model?.image || (model?.gallery && model.gallery[0]) || "";
  const primaryImg = (!rawPrimary || rawPrimary.includes("newmodularlogo") || rawPrimary.includes("finallogo"))
    ? fallbackImg
    : rawPrimary;
  
  const [activeImage, setActiveImage] = useState<string>(primaryImg);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [floorPlanExpanded, setFloorPlanExpanded] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

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
  const variants: BuildingModelVariant[] = Array.isArray(model?.variants) ? model.variants : [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants.length > 0 ? variants[0].id : ""
  );

  const activeVariant = variants.find((v) => v.id === selectedVariantId) || (variants.length > 0 ? variants[0] : null);

  const rawGallery = Array.isArray(model?.gallery) && model.gallery.length > 0 ? model.gallery : [primaryImg];
  const filteredGallery = rawGallery.filter((g) => g && !g.includes("newmodularlogo") && !g.includes("finallogo"));
  const galleryList = Array.from(new Set([primaryImg, ...filteredGallery].filter(Boolean)));

  const featuresList = Array.isArray(model?.features) ? model.features : [];
  const specsList = Array.isArray(model?.specs) ? model.specs : [];
  const optionsList = Array.isArray(model?.customizableOptions) ? model.customizableOptions : [];
  
  const rawFloorPlan = (model?.floorPlanImage || model?.floorPlan || "").trim();
  
  const isBlueprintKeyword = (url?: string | null) => {
    if (!url) return false;
    const l = url.toLowerCase();
    return (
      l.includes("floor-plan") ||
      l.includes("floorplan") ||
      l.includes("blueprint") ||
      l.includes("schematic") ||
      l.includes("cad") ||
      l.includes("layout") ||
      l.includes("drawing") ||
      l.includes("dimension")
    );
  };

  // Real floor plan detection: must not be a placeholder, gallery photo, or exterior photo
  const hasRealFloorPlan = Boolean(
    rawFloorPlan &&
    !rawFloorPlan.includes("newmodularlogo") && 
    !rawFloorPlan.includes("finallogo") &&
    rawFloorPlan !== rawPrimary &&
    rawFloorPlan !== primaryImg &&
    !galleryList.includes(rawFloorPlan) &&
    isBlueprintKeyword(rawFloorPlan)
  );

  const floorPlanImg = hasRealFloorPlan ? rawFloorPlan : "";

  // Base price dynamically derives from selected variant or startingPrice
  const baseStartingPrice = Number(model?.startingPrice) || 0;
  const currentBasePrice = activeVariant ? (Number(activeVariant.price) || baseStartingPrice) : baseStartingPrice;

  const formattedBasePrice = currentBasePrice > 0 ? formatPrice(currentBasePrice) : "Custom Quote";

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

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          zip: quoteForm.zip,
          projectType: model?.series || model?.category || "Modular Home",
          interest: model?.name,
          source: "MODEL_DETAIL_QUOTE_MODAL",
          budget: totalCalculatedPrice > 0 ? formatPrice(totalCalculatedPrice) : formattedBasePrice,
          message: `Inquiry for ${model.name} (${activeVariant ? activeVariant.title : "Standard"}). Estimated: ${formatPrice(totalCalculatedPrice)}. Selected Upgrades: ${selectedOptionNames || "None"}. Timeline: ${quoteForm.timeline}. Notes: ${quoteForm.notes || "None"}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message || "Failed to submit quote request.");
      }

      setQuoteSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again or call us.";
      setQuoteError(msg);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleOpenVideo = () => {
    const vidUrl = model?.videoUrl || "https://www.youtube-nocookie.com/embed/MHWHDE87Pp4";
    setActiveVideo({
      id: `vid-${model?.id || "preview"}`,
      youtubeVideoId: "MHWHDE87Pp4",
      slug: model?.slug ? `${model.slug}-video-tour` : "modular-cabin-tour",
      title: model?.videoTitle || `${model?.name || "Model"} Architectural Walkthrough`,
      category: "Building Tours",
      duration: model?.videoDuration || "4:30 min",
      description: `Official walkthrough of the ${model?.name || "Model"}. Discover the rigid frame engineering, high vaulted ceilings, and custom interior finishes.`,
      thumbnail: primaryImg,
      views: "142K views",
      date: "Recent Tour",
      videoUrl: vidUrl,
      embedUrl: vidUrl,
    });
  };

  const canonicalCat = getProductCategorySlug(model);
  const effectiveCat = currentCategory && currentCategory !== "models" && currentCategory !== "buildings"
    ? currentCategory.toLowerCase().trim()
    : canonicalCat;
  const categoryDisplay = getCategoryDisplayName(effectiveCat);
  const canonicalProductUrl = `/${effectiveCat}/${model?.slug}`;

  const modelShareData = {
    title: model?.name || "Modular Building Model",
    url: canonicalProductUrl,
    description: `${model?.name} - ${model?.tagline || ""}. ${model?.sqft ? `${model.sqft} SQ FT` : ""} precision modular home. Starting at ${formattedBasePrice}.`,
    image: primaryImg,
    category: model?.series || model?.category,
    price: totalCalculatedPrice > 0 ? formatPrice(totalCalculatedPrice) : formattedBasePrice,
  };

  // Dimensions & Stories fallback calculation
  const formattedDimensions = model?.dimensions || (model?.sqft ? `Approx. ${Math.round(Math.sqrt(model.sqft * 1.4))}' × ${Math.round(model.sqft / Math.sqrt(model.sqft * 1.4))}'` : "Custom Dimensions Available");
  const formattedStories = model?.stories ? `${model.stories} ${model.stories === 1 ? "Story" : "Stories"}` : "1 Story";

  return (
    <div className="min-h-screen bg-white pt-3 pb-24 text-[#101114]">
      {/* Top Breadcrumb & Share Actions */}
      <div className="wrap py-2.5 text-xs text-[#6b7280]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link href="/" className="hover:text-[#101114] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${effectiveCat}`} className="hover:text-[#101114] transition-colors">
              {categoryDisplay}
            </Link>
            <span>/</span>
            <span className="text-[#d97706] font-bold uppercase truncate">{model?.name}</span>
          </div>

          <ShareButton
            variant="button"
            label="Share Model"
            item={modelShareData}
            buttonTitle={`Share ${model?.name}`}
          />
        </div>
      </div>

      <div className="wrap">
        {/* HERO SECTION: Gallery + Core Specs Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Gallery Viewport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] w-full rounded-[14px] overflow-hidden bg-[#f6f7f9] border border-[#e7e9ee] shadow-sm">
              <Image
                src={activeImage || primaryImg}
                alt={model?.name || "Building Model"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Share Icon Top-Right */}
              <div className="absolute top-4 right-4 z-10">
                <ShareButton
                  variant="icon"
                  item={modelShareData}
                  buttonTitle={`Share ${model?.name}`}
                />
              </div>

              {/* Video Tour Quick Trigger Badge */}
              <button
                onClick={handleOpenVideo}
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-[9px] bg-[#0f1218]/90 hover:bg-[#fcb907] text-white hover:text-[#101114] border border-[#fcb907]/30 text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all shadow-md cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#fcb907] group-hover:fill-[#101114]" />
                <span>Watch Video Tour ({model?.videoDuration || "Tour"})</span>
              </button>
            </div>

            {/* Thumbnail Navigation Bar */}
            {galleryList.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {galleryList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[16/10] rounded-[9px] overflow-hidden border transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-[#fcb907] ring-2 ring-[#fcb907]/40 scale-[1.02]"
                        : "border-[#e7e9ee] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${model?.name || "Model"} angle ${idx + 1}`}
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
            <div className="p-6 sm:p-7 bg-[#f6f7f9] border border-[#e7e9ee] rounded-[18px] shadow-sm space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d97706]">
                  {model.series} • {model.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#101114] mt-1">
                  {model.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#6b7280] mt-1.5 leading-relaxed">
                  {model.tagline}
                </p>
              </div>

              {/* Multi-tier Variant Selector (if available) */}
              {variants.length > 1 && (
                <div className="space-y-2 pt-1 border-t border-[#e7e9ee]">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#101114] flex items-center justify-between">
                    <span>Select Build Package / Size</span>
                    <span className="text-[#d97706] font-semibold lowercase">
                      {variants.length} options available
                    </span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {variants.map((v) => {
                      const isSelected = v.id === (activeVariant?.id || "");
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`flex items-center justify-between p-3 rounded-[10px] border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white border-[#d97706] ring-2 ring-[#d97706]/20 shadow-xs"
                              : "bg-white/60 border-[#e7e9ee] hover:bg-white hover:border-[#cbd5e1]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-[#d97706] bg-[#d97706]"
                                  : "border-[#9ca3af]"
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-bold text-[#101114]">{v.title}</span>
                          </div>
                          <span className="text-xs font-extrabold text-[#d97706]">
                            {formatPrice(v.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Core Specs Grid (4 Badges) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white border border-[#e7e9ee] rounded-[11px] text-center">
                <div className="flex flex-col items-center">
                  <Maximize2 className="w-4 h-4 text-[#d97706] mb-1" />
                  <span className="text-[10px] uppercase text-[#6b7280] font-bold">Area</span>
                  <span className="font-bold text-xs text-[#101114]">
                    {model.sqft > 0 ? `${model.sqft.toLocaleString()} SQ FT` : (model.dimensions || "Custom Size")}
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-[#e7e9ee]">
                  <Bed className="w-4 h-4 text-[#d97706] mb-1" />
                  <span className="text-[10px] uppercase text-[#6b7280] font-bold">Bedrooms</span>
                  <span className="font-bold text-xs text-[#101114]">
                    {model.bedrooms > 0 ? `${model.bedrooms} Bed` : (model.sqft > 0 ? "Studio / Open" : "Open Layout")}
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-[#e7e9ee]">
                  <Bath className="w-4 h-4 text-[#d97706] mb-1" />
                  <span className="text-[10px] uppercase text-[#6b7280] font-bold">Bathrooms</span>
                  <span className="font-bold text-xs text-[#101114]">
                    {model.bathrooms > 0 ? `${model.bathrooms} Bath` : (model.bedrooms > 0 ? "1 Bath" : "Shell / Open")}
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-[#e7e9ee]">
                  <Layers className="w-4 h-4 text-[#d97706] mb-1" />
                  <span className="text-[10px] uppercase text-[#6b7280] font-bold">Stories</span>
                  <span className="font-bold text-xs text-[#101114]">
                    {formattedStories}
                  </span>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="pt-2 border-t border-[#e7e9ee] flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">
                    {activeVariant ? `${activeVariant.title} Price` : "Starting Price"}
                  </div>
                  <div className="text-3xl font-black text-[#d97706]">
                    {totalCalculatedPrice > 0 ? formatPrice(totalCalculatedPrice) : "Custom Quote"}
                  </div>
                </div>
                {selectedOptions.length > 0 && optionsTotal > 0 && (
                  <div className="text-right">
                    <span className="text-[11px] text-[#d97706] font-bold">
                      +{formatPrice(optionsTotal)} in Options
                    </span>
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
                  className="btn-primary w-full py-3.5 text-xs sm:text-sm font-extrabold rounded-[11px] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Customize Plan Button (Opens Customizer Modal) */}
                <button
                  type="button"
                  id="customize-plan-button"
                  onClick={() => setCustomizeModalOpen(true)}
                  className="w-full py-3 text-xs sm:text-sm font-extrabold rounded-[11px] border-2 border-[#d97706] bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  <span>Customize Plan</span>
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="btn-outline py-2.5 text-xs font-bold rounded-[9px] flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Call Us</span>
                  </a>

                  <Link
                    href={`/upload-floor-plan?model=${encodeURIComponent(model.slug)}`}
                    className="btn-outline py-2.5 text-xs font-bold rounded-[9px] flex items-center justify-center gap-1.5"
                  >
                    <span>Upload Plan</span>
                  </Link>
                </div>

                {/* Link to Full Multi-Step Wizard */}
                <div className="text-center pt-1">
                  <Link
                    href={`/quote?model=${encodeURIComponent(model.slug)}${activeVariant ? `&variant=${encodeURIComponent(activeVariant.id)}` : ""}`}
                    className="text-[11px] text-[#6b7280] hover:text-[#d97706] font-semibold underline underline-offset-4"
                  >
                    Or open full 3D quote configuration wizard →
                  </Link>
                </div>

                {/* Share Model Full Width Action */}
                <ShareButton
                  variant="outline"
                  label="Share This Model"
                  className="w-full"
                  item={modelShareData}
                  buttonTitle={`Share ${model?.name}`}
                />
              </div>

              {/* Engineering highlights badge */}
              <div className="p-3 bg-white border border-[#e7e9ee] rounded-[9px] flex items-center gap-2.5 text-xs text-[#6b7280]">
                <ShieldCheck className="w-4 h-4 text-[#fcb907] shrink-0" />
                <span>{model.warranty || "50-Year Structural"} • IBC & IRC Engineered</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED CONTENT SECTIONS */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Main Information Columns (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                Design & Architecture
              </div>
              <div className="pt-1">
                <RichHtmlContent
                  content={
                    model.description && model.description.trim()
                      ? model.description
                      : `<p>The <strong>${model.name}</strong> is an engineered architectural model designed for superior structural durability, energy efficiency, and modern living. Built to residential building codes with high-performance framing and premium insulation, this versatile design offers customizable finishes, factory-direct quality, and flexible layout options.</p>`
                  }
                />
              </div>
            </section>

            {/* Floor Plan Section */}
            <section className="space-y-5 pt-8 border-t border-[#e7e9ee]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                    Layout & Dimensions
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114]">
                    Architectural Floor Plan
                  </h2>
                </div>
                {hasRealFloorPlan && (
                  <button
                    onClick={() => setFloorPlanExpanded(true)}
                    className="btn-outline py-1.5 px-3 text-xs font-bold rounded-[9px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Enlarge Blueprint</span>
                  </button>
                )}
              </div>

              {/* Floor Plan Viewer Box or Verified Architectural Schematic Fallback */}
              {hasRealFloorPlan ? (
                <div
                  onClick={() => setFloorPlanExpanded(true)}
                  className="cursor-pointer relative aspect-[16/9] w-full rounded-[14px] overflow-hidden bg-[#f6f7f9] border border-[#e7e9ee] group shadow-sm"
                >
                  <Image
                    src={floorPlanImg}
                    alt={`${model?.name || "Model"} Floor Plan Schematic`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 bg-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold">{formattedDimensions}</span>
                    <span className="text-[#fcb907] font-bold">Click to view full layout →</span>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-[16px] overflow-hidden bg-[#0f1218] border border-[#262b36] p-7 sm:p-9 text-white shadow-md">
                  {/* Grid background effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#fcb907_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[12px] bg-[#fcb907]/10 border border-[#fcb907]/30 flex items-center justify-center shrink-0">
                          <Compass className="w-6 h-6 text-[#fcb907]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fcb907]">
                            Engineered Blueprint Schematic
                          </span>
                          <h3 className="text-xl font-black text-white">
                            {model.name} — Architectural Layout
                          </h3>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-200 border border-white/15 w-fit">
                        <FileCheck className="w-3.5 h-3.5 text-[#fcb907]" />
                        <span>CAD & PDF Available</span>
                      </span>
                    </div>

                    {/* Dimensions & Spatial Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3.5 rounded-[10px] bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Footprint</span>
                        <span className="text-sm font-black text-white">
                          {formattedDimensions}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[10px] bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Living Area</span>
                        <span className="text-sm font-black text-white">
                          {model.sqft > 0 ? `${model.sqft} SQ FT` : "Flexible Layout"}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[10px] bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Bedrooms / Baths</span>
                        <span className="text-sm font-black text-white">
                          {model.bedrooms > 0 ? `${model.bedrooms}B / ${model.bathrooms}BA` : "Studio / Open Layout"}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[10px] bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Framing</span>
                        <span className="text-sm font-black text-[#fcb907]">
                          {model.frameType || "Precision Steel / Timber"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                      Architectural blueprints and engineering CAD schematics for the <strong className="text-white">{model.name}</strong> are generated per project to match local building codes, snow loads, and wind ratings. Full electrical schematics, plumbing rough-ins, and wall stud elevations are included.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setQuoteSuccess(false);
                          setQuoteModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[9px] bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Request Official Floor Plan CAD & PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomizeModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[9px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                      >
                        <span>Submit Custom Layout Modification</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Technical Specifications Table */}
            <section className="space-y-5 pt-8 border-t border-[#e7e9ee]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                  Structural Tolerances
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114]">
                  Technical Specifications
                </h2>
              </div>

              <div className="card overflow-hidden">
                <div className="divide-y divide-[#e7e9ee]">
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-[#6b7280] uppercase font-bold">Standard Dimensions</span>
                    <span className="text-[#101114] font-semibold">{formattedDimensions}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs bg-[#f6f7f9]">
                    <span className="text-[#6b7280] uppercase font-bold">Stories / Levels</span>
                    <span className="text-[#101114] font-semibold">{formattedStories}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-[#6b7280] uppercase font-bold">Framing System</span>
                    <span className="text-[#101114] font-semibold">{model?.frameType || "Light Gauge Steel / Amish Timber"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs bg-[#f6f7f9]">
                    <span className="text-[#6b7280] uppercase font-bold">Roof Pitch & Profile</span>
                    <span className="text-[#101114] font-semibold">{model?.roofPitch || "4:12 Standing Seam"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-[#6b7280] uppercase font-bold">Wind Speed Rating</span>
                    <span className="text-[#101114] font-semibold">{model?.windRating || "150 MPH Rated"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs bg-[#f6f7f9]">
                    <span className="text-[#6b7280] uppercase font-bold">Ground Snow Load</span>
                    <span className="text-[#101114] font-semibold">{model?.snowLoad || "50 PSF Rated"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="text-[#6b7280] uppercase font-bold">Structural Warranty</span>
                    <span className="text-[#d97706] font-bold">{model?.warranty || "50-Year Structural"}</span>
                  </div>

                  {specsList.map((spec, idx) => (
                    <div key={idx} className={`grid grid-cols-2 p-3.5 text-xs ${idx % 2 === 1 ? "bg-[#f6f7f9]" : ""}`}>
                      <span className="text-[#6b7280] uppercase font-bold">{spec.label}</span>
                      <span className="text-[#101114] font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Included Architectural Features */}
            <section className="space-y-5 pt-8 border-t border-[#e7e9ee]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                  Standard Package
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114]">
                  Engineered Features
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuresList.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[11px] bg-[#f6f7f9] border border-[#e7e9ee] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-[#101114] leading-relaxed font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Customization Options & Configurator (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f6f7f9] border border-[#e7e9ee] rounded-[18px] p-6 space-y-5 sticky top-28 shadow-sm">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                  Factory Add-ons
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-[#101114] mt-1">
                  Available Upgrades
                </h3>
                <p className="text-xs text-[#6b7280] mt-1">
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
                      className={`cursor-pointer p-3.5 rounded-[11px] border transition-all ${
                        isChecked
                          ? "bg-white border-[#fcb907] shadow-xs ring-1 ring-[#fcb907]"
                          : "bg-white/80 border-[#e7e9ee] hover:border-[#fcb907]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-[4px] border mt-0.5 flex items-center justify-center shrink-0 ${
                              isChecked
                                ? "border-[#fcb907] bg-[#fcb907] text-[#101114]"
                                : "border-[#6b7280]"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase text-[#101114]">
                              {option.name}
                            </div>
                            <div className="text-[11px] text-[#6b7280] mt-0.5">
                              {option.description}
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#d97706] shrink-0">
                          +{formatPrice(option.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-[#e7e9ee] space-y-2.5">
                <div className="flex justify-between text-xs text-[#6b7280]">
                  <span>{activeVariant ? activeVariant.title : "Base Model"}:</span>
                  <span className="text-[#101114] font-semibold">{formattedBasePrice}</span>
                </div>
                {selectedOptions.length > 0 && optionsTotal > 0 && (
                  <div className="flex justify-between text-xs text-[#6b7280]">
                    <span>Selected Upgrades:</span>
                    <span className="text-[#d97706] font-bold">+{formatPrice(optionsTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#101114] pt-2 border-t border-[#e7e9ee]">
                  <span>Updated Estimate:</span>
                  <span className="text-[#d97706] text-xl font-black">
                    {formatPrice(totalCalculatedPrice)}
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
                    className="btn-primary w-full py-3.5 text-xs font-extrabold rounded-[11px] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Request a Detailed Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomizeModalOpen(true)}
                    className="w-full py-2.5 text-xs font-extrabold rounded-[11px] border border-[#d97706] bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Customize Plan & Layout</span>
                  </button>

                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="btn-outline w-full py-2.5 text-xs font-bold rounded-[11px] flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Call {phone}</span>
                  </a>

                  <ShareButton
                    variant="outline"
                    label="Share Configured Estimate"
                    className="w-full"
                    item={{
                      ...modelShareData,
                      price: totalCalculatedPrice > 0 ? formatPrice(totalCalculatedPrice) : formattedBasePrice,
                    }}
                    buttonTitle={`Share ${model?.name}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED MODELS SECTION */}
        {relatedModels.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#e7e9ee]">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                Similar Footprints
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101114] mt-1">
                Related Building Models
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedModels.map((m) => (
                <BuildingCard key={m.id} model={m} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* REQUEST QUOTE MODAL (DEF-05) */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white border border-[#e7e9ee] rounded-[20px] p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e7e9ee]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d97706]">Official Pricing Request</span>
                <h3 className="text-lg sm:text-xl font-black text-[#101114]">{model?.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="p-1.5 text-[#6b7280] hover:text-[#101114] rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-[#101114]">Quote Request Received!</h4>
                <p className="text-xs text-[#6b7280] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{quoteForm.name || "Customer"}</strong>. An engineering advisor is preparing your itemized build estimate for the <strong>{model.name}</strong> and will reach out to you within 24 hours.
                </p>
                <div className="p-3 bg-[#f6f7f9] rounded-[11px] text-xs font-bold text-[#101114]">
                  Estimated Build: <span className="text-[#d97706]">{formatPrice(totalCalculatedPrice)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="btn-primary w-full py-3 text-xs font-bold rounded-[10px]"
                >
                  Close & Continue Browsing
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-4">
                <div className="p-3 bg-[#f6f7f9] rounded-[11px] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#6b7280] block text-[10px] uppercase font-bold">Configured Model</span>
                    <span className="font-bold text-[#101114]">{activeVariant ? `${model.name} (${activeVariant.title})` : model.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#6b7280] block text-[10px] uppercase font-bold">Estimated Total</span>
                    <span className="font-black text-[#d97706] text-sm">{formatPrice(totalCalculatedPrice)}</span>
                  </div>
                </div>

                {quoteError && (
                  <div className="p-3 rounded-[9px] bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {quoteError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#101114] uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      placeholder="e.g. John Miller"
                      className="w-full px-3 py-2 text-xs rounded-[8px] border border-[#e7e9ee] focus:border-[#fcb907] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#101114] uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full px-3 py-2 text-xs rounded-[8px] border border-[#e7e9ee] focus:border-[#fcb907] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#101114] uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      placeholder="e.g. (812) 555-0199"
                      className="w-full px-3 py-2 text-xs rounded-[8px] border border-[#e7e9ee] focus:border-[#fcb907] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#101114] uppercase mb-1">Delivery ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.zip}
                      onChange={(e) => setQuoteForm({ ...quoteForm, zip: e.target.value })}
                      placeholder="e.g. 47401"
                      className="w-full px-3 py-2 text-xs rounded-[8px] border border-[#e7e9ee] focus:border-[#fcb907] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#101114] uppercase mb-1">Building Timeline</label>
                  <select
                    value={quoteForm.timeline}
                    onChange={(e) => setQuoteForm({ ...quoteForm, timeline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-[8px] border border-[#e7e9ee] focus:border-[#fcb907] focus:outline-none bg-white"
                  >
                    <option value="Immediately (1-3 months)">Immediately (1-3 months)</option>
                    <option value="Planning for 3-6 months">Planning for 3-6 months</option>
                    <option value="Exploring for next year">Exploring for next year</option>
                    <option value="Builder / Developer Inquiry">Builder / Developer Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#101114] uppercase mb-1">Notes / Custom Modifications</label>
                  <textarea
                    rows={2}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    placeholder="Specific foundation, porch extensions, or layout alterations..."
                    className="w-full px-3 py-2 text-xs rounded-[8px] border border-[#e7e9ee] focus:border-[#fcb907] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="btn-primary w-full py-3 text-xs font-extrabold rounded-[10px] shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {quoteSubmitting ? "Generating Quote Package..." : "Submit Quote Request"}
                  {!quoteSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMIZE PLAN MODAL (DEF-05) */}
      {customizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-white border border-[#e7e9ee] rounded-[20px] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e7e9ee]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d97706]">Plan Customizer</span>
                <h3 className="text-xl font-black text-[#101114]">Customize {model?.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomizeModalOpen(false)}
                className="p-1.5 text-[#6b7280] hover:text-[#101114] rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mt-4">
              {/* Build Variant Picker */}
              {variants.length > 1 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#101114] uppercase">1. Select Package / Size Variant</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {variants.map((v) => {
                      const isSelected = v.id === (activeVariant?.id || "");
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-3 rounded-[10px] border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-50/50 border-[#d97706] ring-1 ring-[#d97706]"
                              : "bg-white border-[#e7e9ee] hover:border-[#cbd5e1]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#101114]">{v.title}</span>
                            <span className="text-xs font-extrabold text-[#d97706]">{formatPrice(v.price)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upgrades Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#101114] uppercase">2. Select Custom Add-ons & Finishes</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {optionsList.map((opt) => {
                    const isChecked = selectedOptions.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(opt.id)}
                        className={`p-3 rounded-[10px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? "bg-amber-50/50 border-[#fcb907] ring-1 ring-[#fcb907]"
                            : "bg-white border-[#e7e9ee] hover:border-[#fcb907]"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-[#101114] block">{opt.name}</span>
                          <span className="text-[10px] text-[#6b7280]">{opt.description}</span>
                        </div>
                        <span className="text-xs font-bold text-[#d97706] shrink-0 ml-2">+{formatPrice(opt.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Price Summary & Action Buttons */}
              <div className="p-4 bg-[#f6f7f9] rounded-[14px] border border-[#e7e9ee] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6b7280] block">Current Custom Configuration</span>
                    <span className="text-2xl font-black text-[#d97706]">{formatPrice(totalCalculatedPrice)}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#6b7280]">
                    {selectedOptions.length} upgrades selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomizeModalOpen(false);
                      setQuoteSuccess(false);
                      setQuoteModalOpen(true);
                    }}
                    className="btn-primary py-3 text-xs font-bold rounded-[10px] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Request Quote with Custom Specs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/quote?model=${encodeURIComponent(model.slug)}${activeVariant ? `&variant=${encodeURIComponent(activeVariant.id)}` : ""}`}
                    className="btn-outline py-3 text-xs font-bold rounded-[10px] flex items-center justify-center gap-2 text-center"
                  >
                    <span>Full 3D Visual Configurator →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floor Plan Fullscreen Modal */}
      {floorPlanExpanded && hasRealFloorPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-white border border-[#e7e9ee] rounded-[18px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#e7e9ee]">
              <h3 className="text-base sm:text-lg font-black text-[#101114]">
                {model?.name} — Detailed Floor Plan ({formattedDimensions})
              </h3>
              <button
                onClick={() => setFloorPlanExpanded(false)}
                className="p-1.5 text-[#6b7280] hover:text-[#d97706] rounded-md cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full mt-4 bg-[#f6f7f9] rounded-[11px] overflow-hidden">
              <Image
                src={floorPlanImg}
                alt={`${model?.name || "Model"} Full Blueprint`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
