"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Building2,
  ArrowRight,
  Check,
  CheckCircle2,
  RotateCcw,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  FileText,
  Sparkles,
  Clock,
  Lock,
  ChevronDown,
  Layers,
  Award,
} from "lucide-react";
import { CATEGORIES, BuildingModel } from "@/data/models";
import { formatPrice } from "@/utils/currency";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

const DEFAULT_MODEL: BuildingModel = {
  id: "1-bed-1-bath-rooftop-deck",
  slug: "1-bed-1-bath-rooftop-deck",
  name: "1 Bed 1 Bath with Rooftop Deck Model",
  series: "Signature Modular Series",
  category: "Modular Homes",
  tagline: "620 Sq Ft • Panoramic Rooftop Deck • Turnkey Assembly",
  description: "Precision engineered steel-framed modular residence with private rooftop terrace and turnkey factory dry-in.",
  sqft: 620,
  bedrooms: 1,
  bathrooms: 1,
  stories: 1,
  startingPrice: 82500,
  price: 82500,
  dimensions: "16' x 40'",
  frameType: "ASTM Heavy Structural Plate & Cold-Formed Steel",
  roofPitch: "Flat Terrace (Rooftop Deck)",
  windRating: "150+ MPH High-Wind Engineered",
  snowLoad: "50+ PSF Heavy Snow Load",
  warranty: "50-Year Structural Steel Hull Guarantee",
  primaryImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  gallery: [],
  floorPlanImage: "",
  features: ["Factory-assembled structural steel hull", "Wet-stamped state engineering calculations"],
  specs: [{ label: "Frame", value: "ASTM Heavy Structural Plate & Gauge Steel" }],
  customizableOptions: [],
};

const AVAILABLE_OPTIONS = [
  { id: "opt-insul", name: "Extreme Climate R-38 Closed-Cell Insulation", price: 9200, desc: "Superior thermal break envelope & sound attenuation" },
  { id: "opt-solar", name: "Off-Grid Solar Array & 15kWh LiFePO4 Battery Storage", price: 16500, desc: "Autonomous auxiliary power autonomy with pure-sine inverter" },
  { id: "opt-porch", name: "Covered Timber Porch / Exterior Deck Extension", price: 14500, desc: "Solid 8x8 posts with black structural powder-coated hardware" },
  { id: "opt-kitchen-lux", name: "Gourmet Chef Kitchen Cabinetry & Quartz Island", price: 18500, desc: "Soft-close solid maple cabinetry with quartz counters" },
  { id: "opt-nbc-airlock", name: "Swiss NBC Gas-Tight Filtration & Decon Airlock", price: 12500, desc: "Nuclear, biological & chemical positive-pressure air filtration" },
  { id: "opt-emp", name: "EMP Hardening (MIL-STD-188-125)", price: 6500, desc: "Shields internal inverters and battery electronics from electromagnetic pulse" },
  { id: "opt-bath-spa", name: "Primary Spa Bathroom & Walk-in Tiled Shower", price: 11200, desc: "Frameless glass enclosure and modern floating vanity" },
  { id: "opt-garage", name: "Attached 2-Car Insulated Garage Bay", price: 21000, desc: "Includes high-lift 10ft insulated steel doors" },
];

export default function QuoteWizard() {
  const [allModels, setAllModels] = useState<BuildingModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<BuildingModel>(DEFAULT_MODEL);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [quoteReferenceId, setQuoteReferenceId] = useState<string>("");

  const { customer } = useCustomerAuth();

  // Contact Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    timeline: "Immediately (1-3 months)",
    propertyStatus: "Own Land with Utilities",
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || customer.name || "",
        email: prev.email || customer.email || "",
        phone: prev.phone || customer.phone || "",
        zip: prev.zip || customer.billing_address?.zip || "",
      }));
    }
  }, [customer]);

  // Load all catalog products & match ?model= parameter
  useEffect(() => {
    async function loadDynamicModels() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setAllModels(json.data);

            // Match model from URL search parameter
            if (typeof window !== "undefined") {
              const urlParams = new URLSearchParams(window.location.search);
              const requestedModel = (urlParams.get("model") || urlParams.get("slug") || "").toLowerCase().trim();

              if (requestedModel) {
                const normReq = requestedModel.replace(/^the-/, "");
                const matched = json.data.find((m: BuildingModel) => {
                  const mId = (m.id || "").toLowerCase();
                  const mSlug = (m.slug || "").toLowerCase();
                  const mName = (m.name || "").toLowerCase();
                  return (
                    mId === requestedModel ||
                    mSlug === requestedModel ||
                    mSlug.replace(/^the-/, "") === normReq ||
                    mName.includes(requestedModel) ||
                    mName.includes(normReq)
                  );
                });

                if (matched) {
                  setSelectedModel(matched);
                  if (matched.category) setSelectedCategory(matched.category);
                  return;
                }
              }
            }

            // Fallback to first available model if no URL match
            setSelectedModel(json.data[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load products for quote wizard", e);
      }
    }

    loadDynamicModels();
  }, []);

  // Filter models for dropdown
  const filteredModels = useMemo(() => {
    if (selectedCategory === "All") return allModels;
    return allModels.filter((m) => m.category === selectedCategory);
  }, [selectedCategory, allModels]);

  // Price calculations
  const basePrice = selectedModel.startingPrice || (typeof selectedModel.price === "number" ? selectedModel.price : 0) || 75000;
  const optionsTotal = selectedOptions.reduce((acc, optId) => {
    const opt = AVAILABLE_OPTIONS.find((o) => o.id === optId);
    return acc + (opt ? opt.price : 0);
  }, 0);
  const totalEstimate = basePrice + optionsTotal;

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleModelChange = (model: BuildingModel) => {
    setSelectedModel(model);
    if (model.category) setSelectedCategory(model.category);
    setModelDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const selectedOptionObjects = AVAILABLE_OPTIONS.filter((o) =>
        selectedOptions.includes(o.id)
      );

      const generatedRef = `MH-${Math.floor(100000 + Math.random() * 900000)}`;
      setQuoteReferenceId(generatedRef);

      const payload = {
        customerName: formData.name.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        customerZip: formData.zip.trim(),
        modelSlug: selectedModel?.slug || selectedModel?.id || "",
        modelName: selectedModel?.name || "Custom Configuration",
        sqft: selectedModel?.sqft || 0,
        dimensions: selectedModel?.dimensions || "",
        options: selectedOptionObjects,
        pricingInputs: {
          basePrice,
          optionsTotal,
          totalEstimate,
          propertyStatus: formData.propertyStatus,
        },
        estimatedAmount: totalEstimate,
        timeline: formData.timeline,
        requirements: `Property Status: ${formData.propertyStatus}. Upgrades: ${selectedOptionObjects.map(o => o.name).join(", ") || "None"}. Notes: ${formData.notes || "None"}`,
        source: "FAST_ONE_PAGE_QUOTE",
      };

      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorMsg =
          typeof data.error === "string"
            ? data.error
            : data.error?.message || data.message || "Failed to submit quote request. Please try again.";
        throw new Error(errorMsg);
      }

      setIsSubmitted(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#fcb907", "#0f1218", "#16a34a", "#dc2626"],
        });
      } catch {}
    } catch (err: any) {
      console.error("Quote submit error:", err);
      setSubmitError(err.message || "Failed to submit quote request. Please call our engineering desk directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isShelter =
    selectedModel.category === "Bomb Shelters" ||
    selectedModel.name.toLowerCase().includes("bunker") ||
    selectedModel.name.toLowerCase().includes("bombshelter") ||
    Boolean(selectedModel.primaryImage && selectedModel.primaryImage.includes("/shelter-plans/"));

  const rawImage = selectedModel.primaryImage || selectedModel.image;
  const imageSrc = (!rawImage || rawImage.includes("newmodularlogo"))
    ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    : rawImage;

  // ─────────────────────────────────────────────────────────────
  // SUCCESS SCREEN: Instant Confirmation with Reference Number
  // ─────────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider rounded-full mb-3">
          Quote Request Received
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
          Thank You, {formData.name || "Valued Client"}!
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
          Your itemized quotation request for{" "}
          <strong className="text-[#101114] font-bold">{selectedModel.name}</strong>{" "}
          has been delivered directly to our manufacturing & engineering desk.
        </p>

        {quoteReferenceId && (
          <div className="my-6 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-xs font-mono font-bold text-gray-800">
            <span>Reference ID:</span>
            <span className="text-[#d97706] font-black">{quoteReferenceId}</span>
          </div>
        )}

        <div className="bg-[#f6f7f9] border border-[#e7e9ee] rounded-xl p-5 my-6 text-left space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between pb-2 border-b border-gray-200 font-semibold">
            <span className="text-gray-500">Selected Model:</span>
            <span className="text-[#101114] font-bold">{selectedModel.name}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Estimated Turnkey Amount:</span>
            <span className="text-[#d97706] font-black text-base">{formatPrice(totalEstimate)}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Project Timeline:</span>
            <span className="text-[#101114]">{formData.timeline}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Contact Email:</span>
            <span className="text-[#101114] font-medium">{formData.email}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-8">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>A building specialist will review your specifications and contact you within 24 hours.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setSelectedOptions([]);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-[9px] bg-gray-100 hover:bg-gray-200 text-[#101114] text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Configure Another Quote</span>
          </button>

          <Link
            href="/buildings"
            className="w-full sm:w-auto px-6 py-3 rounded-[9px] bg-[#0f1218] hover:bg-[#fcb907] text-white hover:text-[#101114] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>Browse All Models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN ONE-PAGE QUOTE LAYOUT
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN (5 cols): Selected Model & Transparent Pricing ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selected Model Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d97706] block">
                  Selected Model
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#101114] mt-0.5 line-clamp-1">
                  {selectedModel.name}
                </h2>
              </div>

              {/* Model Switcher Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#101114] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Switch</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Model Selector Dropdown */}
                {modelDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 p-2 max-h-96 overflow-y-auto">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                      Choose Any Model
                    </div>
                    {allModels.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleModelChange(m)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          selectedModel.id === m.id
                            ? "bg-amber-50 text-[#d97706] font-black"
                            : "hover:bg-gray-50 text-gray-800 font-medium"
                        }`}
                      >
                        <div className="line-clamp-1 pr-2">
                          <div className="font-bold text-[#101114]">{m.name}</div>
                          <div className="text-[10px] text-gray-400">{m.category} • {m.sqft > 0 ? `${m.sqft} sqft` : m.dimensions}</div>
                        </div>
                        <span className="text-[11px] font-black shrink-0 text-[#d97706]">
                          {formatPrice(m.startingPrice || (typeof m.price === "number" ? m.price : 75000))}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Image Stage (Uncropped with object-contain for shelters) */}
            <div className={`relative aspect-[16/10] w-full overflow-hidden ${isShelter ? "bg-white p-3" : "bg-gray-100"}`}>
              <Image
                src={imageSrc}
                alt={selectedModel.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className={isShelter ? "object-contain p-2" : "object-cover"}
              />

              {isShelter && (
                <div className="absolute top-3 left-3 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Hardened Bunker</span>
                </div>
              )}
            </div>

            {/* Model Specs Quick Strip */}
            <div className="p-4 sm:p-5 bg-[#fafbfe] border-t border-gray-100 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white border border-gray-200/80 rounded-lg p-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Area</span>
                  <span className="font-black text-[#101114]">
                    {selectedModel.sqft > 0 ? `${selectedModel.sqft} sq ft` : selectedModel.dimensions || "Engineered"}
                  </span>
                </div>
                <div className="bg-white border border-gray-200/80 rounded-lg p-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Layout</span>
                  <span className="font-black text-[#101114]">
                    {selectedModel.bedrooms > 0 ? `${selectedModel.bedrooms} Bed` : "Open Module"}
                  </span>
                </div>
                <div className="bg-white border border-gray-200/80 rounded-lg p-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Baths</span>
                  <span className="font-black text-[#101114]">
                    {selectedModel.bathrooms > 0 ? `${selectedModel.bathrooms} Bath` : "1 Module"}
                  </span>
                </div>
              </div>

              {selectedModel.tagline && (
                <p className="text-xs text-gray-500 font-medium line-clamp-2">
                  {selectedModel.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Optional Upgrades Selection */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                <h3 className="text-sm font-black text-[#101114] uppercase tracking-wider">
                  Optional Upgrades
                </h3>
              </div>
              <span className="text-[10px] text-gray-400 font-bold">Click to toggle</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {AVAILABLE_OPTIONS.map((opt) => {
                const checked = selectedOptions.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? "bg-amber-50/70 border-[#fcb907] ring-1 ring-[#fcb907]"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        checked ? "bg-[#d97706] text-white" : "border border-gray-300 bg-white"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#101114]">{opt.name}</span>
                        <span className="font-black text-[#d97706] ml-2">+{formatPrice(opt.price)}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Summary Breakdown */}
          <div className="bg-[#0f1218] text-white rounded-2xl p-6 shadow-md space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#fcb907] block">
              Estimated Investment
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Base Model Turnkey:</span>
                <span className="font-bold text-white">{formatPrice(basePrice)}</span>
              </div>
              {optionsTotal > 0 && (
                <div className="flex justify-between text-[#fcb907]">
                  <span>Selected Upgrades ({selectedOptions.length}):</span>
                  <span className="font-bold">+{formatPrice(optionsTotal)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold">Estimated Total:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#fcb907]">
                  {formatPrice(totalEstimate)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Fixed turnkey pricing with no hidden broker markups. Stamped state blueprints included.</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (7 cols): The Simple Powerful 1-Page Contact Form ── */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-[#dc2626] uppercase tracking-wider block mb-1">
                Direct Engineering Review
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
                Request Your Custom Quote
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                Fill out this quick form and our structural building team will prepare your itemized build estimate, parcel delivery calculation, and stamped blueprints.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Miller"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium text-[#101114]"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium text-[#101114]"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Phone & Zip Code Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. (555) 123-4567"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium text-[#101114]"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Project Location / Zip Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="e.g. 78701 or Austin, TX"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium text-[#101114]"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Timeline Selection Pills */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Estimated Build Timeline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Immediately (1-3 mos)",
                    "3-6 Months",
                    "6-12 Months",
                    "Planning / Research",
                  ].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: t })}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        formData.timeline === t
                          ? "bg-[#0f1218] text-[#fcb907] border-[#0f1218] shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property & Land Status Pills */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Property & Land Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Own Land with Utilities",
                    "Raw Land (Need Prep)",
                    "Buying Land Soon",
                    "No Land Yet",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyStatus: p })}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        formData.propertyStatus === p
                          ? "bg-[#0f1218] text-[#fcb907] border-[#0f1218] shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requirements / Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Project Notes, Custom Requirements, or Soil/Site Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us about your property, foundation preference (slab, crawlspace, subterranean), off-grid requirements, or custom floor plan adjustments..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium text-[#101114]"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm sm:text-base font-black uppercase tracking-wider shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Specifications...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Itemized Quote & Blueprints</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Security & Privacy Badges */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-[11px] text-gray-400 gap-2">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>256-Bit SSL Encrypted • Zero Spam Guarantee</span>
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Licensed Structural Engineering Network</span>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
