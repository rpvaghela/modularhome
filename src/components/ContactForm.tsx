"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  Home,
  FileSpreadsheet,
  Building2,
  Warehouse,
  Flame,
  Check,
  PhoneCall,
  Send,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

type FormIntent = "CONSULTATION" | "GENERAL_SUPPORT" | "CUSTOM_PLAN";

const BUILDING_TYPES = [
  { id: "Modular Homes", label: "Modular Home", icon: Home, desc: "Factory turnkey modules" },
  { id: "Barndominiums", label: "Barndominium", icon: Warehouse, desc: "Steel truss open spans" },
  { id: "Cabins", label: "Cabin / Retreat", icon: Flame, desc: "Timber & steel framing" },
  { id: "ADUs & Granny Pods", label: "ADU / Tiny Suite", icon: Building2, desc: "Secondary backyard units" },
  { id: "House Kits", label: "Cold-Formed Steel Kit", icon: FileSpreadsheet, desc: "Flat-pack bolt-together frame" },
  { id: "Custom Architecture", label: "Custom Blueprint", icon: Sparkles, desc: "Bespoke engineered layout" },
];

const BUDGET_RANGES = [
  "Under $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "$500,000+",
  "Financing / Seeking Estimate"
];

const TIMELINES = [
  "Immediate (1–3 Months)",
  "Ready in 3–6 Months",
  "Planning for 6–12 Months",
  "Researching / Budgeting Phase"
];

export default function ContactForm() {
  const { customer, isAuthenticated } = useCustomerAuth();
  const [intent, setIntent] = useState<FormIntent>("CONSULTATION");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    city: "",
    buildingType: "Modular Homes",
    approxSqft: "1,200 – 2,500 sq ft",
    budget: "$100,000 – $250,000",
    timeline: "Ready in 3–6 Months",
    subject: "New Modular Project Consultation",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string>("");

  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || customer.name || "",
        email: prev.email || customer.email || "",
        phone: prev.phone || customer.phone || "",
        zip: prev.zip || customer.billing_address?.zip || "",
        city: prev.city || customer.billing_address?.city || "",
      }));
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const isConsultation = intent === "CONSULTATION";
      const fullDetails = [
        `[Form Intent: ${intent}]`,
        `[Building Type: ${form.buildingType}]`,
        `[Target Size: ${form.approxSqft}]`,
        `[Budget Range: ${form.budget}]`,
        `[Timeline: ${form.timeline}]`,
        form.city ? `[City/State: ${form.city}]` : "",
        `\nCustomer Message:\n${form.message || "Customer requested direct project consultation and pricing follow-up."}`,
      ]
        .filter(Boolean)
        .join("\n");

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        zip: form.zip.trim() || null,
        city: form.city.trim() || null,
        location: form.city ? `${form.city} (ZIP: ${form.zip})` : form.zip ? `ZIP: ${form.zip}` : null,
        projectType: form.buildingType,
        interest: form.buildingType,
        budget: form.budget,
        enquiryDetails: fullDetails,
        source: intent === "GENERAL_SUPPORT" ? "CONTACT_SUPPORT" : "CONTACT_FORM",
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to transmit message. Please try again.");
      }

      setConfirmationId(data.data?.id || `MH-${Date.now().toString().slice(-6)}`);
      setIsSubmitted(true);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#fcb907", "#d97706", "#101114", "#10b981"],
        });
      } catch {}
    } catch (err: any) {
      console.error("Contact submit error:", err);
      setSubmitError(err.message || "An unexpected error occurred while transmitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setForm({
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      zip: customer?.billing_address?.zip || "",
      city: customer?.billing_address?.city || "",
      buildingType: "Modular Homes",
      approxSqft: "1,200 – 2,500 sq ft",
      budget: "$100,000 – $250,000",
      timeline: "Ready in 3–6 Months",
      subject: "New Modular Project Consultation",
      message: "",
    });
  };

  if (isSubmitted) {
    return (
      <div className="card p-8 sm:p-12 text-center space-y-6 bg-white border border-[#e5e7eb] shadow-xl rounded-2xl animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
            <span>✓ Transmitted to Factory Desk</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
            Consultation Request Received
          </h3>
          <p className="text-sm text-[#4b5563] max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-[#101114]">{form.name}</strong>. Your project inquiry has been queued for a licensed modular engineer and architectural estimator.
          </p>
        </div>

        {/* Confirmation Summary Card */}
        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-[#e5e7eb] pb-2.5">
            <span className="text-[#6b7280] font-semibold">Reference Ticket:</span>
            <span className="font-mono font-bold text-[#101114]">{confirmationId}</span>
          </div>
          <div className="flex items-center justify-between text-xs border-b border-[#e5e7eb] pb-2.5">
            <span className="text-[#6b7280] font-semibold">Inquiry Type:</span>
            <span className="font-bold text-[#d97706]">{form.buildingType}</span>
          </div>
          <div className="flex items-center justify-between text-xs border-b border-[#e5e7eb] pb-2.5">
            <span className="text-[#6b7280] font-semibold">Contact Email:</span>
            <span className="font-bold text-[#101114] truncate max-w-[200px]">{form.email}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6b7280] font-semibold">Expected Response:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Within 2–4 Business Hours
            </span>
          </div>
        </div>

        {/* Next Steps Guide */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-left max-w-md mx-auto">
          <div className="text-xs font-black uppercase text-amber-900 tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>What happens next?</span>
          </div>
          <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>An architectural advisor reviews your site location and zoning constraints.</li>
            <li>We prepare preliminary factory pricing and stamped engineering options.</li>
            <li>You receive a personalized consultation email and optional phone walkthrough.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/models"
            className="w-full sm:w-auto px-6 py-3 bg-[#101114] text-white hover:bg-[#252830] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Explore 50+ Floor Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-3 border border-[#d1d5db] hover:border-[#101114] text-[#101114] text-xs font-bold rounded-xl transition-all bg-white"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-9 bg-white border border-[#e5e7eb] rounded-2xl shadow-xl space-y-6 text-[#101114]">
      {/* Form Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcb907]/20 text-[#b45309] text-[11px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fcb907] animate-pulse"></span>
            Direct Factory Desk
          </span>
          <span className="text-[11px] text-[#6b7280] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero Spam • SSL Encrypted
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
          Request Project Consultation & Pricing
        </h2>
        <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
          Provide your build preferences below. Our structural engineers and factory estimators will prepare a comprehensive preliminary plan review.
        </p>
      </div>

      {/* Mode / Intent Selector */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-[#f3f4f6] rounded-xl">
        <button
          type="button"
          onClick={() => setIntent("CONSULTATION")}
          className={`py-2 px-3 text-xs font-extrabold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            intent === "CONSULTATION"
              ? "bg-white text-[#101114] shadow-xs"
              : "text-[#6b7280] hover:text-[#101114]"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Project</span> Quote
        </button>
        <button
          type="button"
          onClick={() => setIntent("CUSTOM_PLAN")}
          className={`py-2 px-3 text-xs font-extrabold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            intent === "CUSTOM_PLAN"
              ? "bg-white text-[#101114] shadow-xs"
              : "text-[#6b7280] hover:text-[#101114]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Custom</span> Blueprint
        </button>
        <button
          type="button"
          onClick={() => setIntent("GENERAL_SUPPORT")}
          className={`py-2 px-3 text-xs font-extrabold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            intent === "GENERAL_SUPPORT"
              ? "bg-white text-[#101114] shadow-xs"
              : "text-[#6b7280] hover:text-[#101114]"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          General Q&A
        </button>
      </div>

      {/* Authenticated Customer Banner */}
      {isAuthenticated && customer && (
        <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-center justify-between text-xs text-[#101114]">
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-6 h-6 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center text-xs font-black shrink-0">
              {customer.name ? customer.name.charAt(0).toUpperCase() : "U"}
            </span>
            <div className="truncate">
              <span className="font-bold text-[#101114]">{customer.name}</span>
              <span className="text-[#6b7280] ml-1">({customer.email})</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
            ✓ Verified Account
          </span>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Submission Notice</div>
            <div>{submitError}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Information Fields */}
        <div className="space-y-3">
          <div className="text-[11px] font-black uppercase text-[#6b7280] tracking-wider">
            1. Your Contact Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1">
                Full Name <span className="text-amber-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Eleanor Vance"
                className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] focus:bg-white px-3.5 py-2.5 text-xs text-[#101114] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#fcb907]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1">
                Email Address <span className="text-amber-600">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="eleanor@example.com"
                className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] focus:bg-white px-3.5 py-2.5 text-xs text-[#101114] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#fcb907]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1">
                Phone Number <span className="text-amber-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (812) 595-4033"
                className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] focus:bg-white px-3.5 py-2.5 text-xs text-[#101114] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#fcb907]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">
                  Build Site ZIP <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  placeholder="e.g. 78701"
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] focus:bg-white px-3 py-2.5 text-xs text-[#101114] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#fcb907]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Austin, TX"
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] focus:bg-white px-3 py-2.5 text-xs text-[#101114] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#fcb907]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Specifications */}
        {intent !== "GENERAL_SUPPORT" ? (
          <div className="space-y-3.5 pt-2 border-t border-[#e5e7eb]">
            <div className="text-[11px] font-black uppercase text-[#6b7280] tracking-wider">
              2. Building & Project Preferences
            </div>

            {/* Building Type Pill Grid */}
            <div>
              <label className="block text-xs font-bold text-[#101114] mb-2">
                Select Architectural Model or Structure Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUILDING_TYPES.map((bt) => {
                  const Icon = bt.icon;
                  const isSelected = form.buildingType === bt.id;
                  return (
                    <button
                      type="button"
                      key={bt.id}
                      onClick={() => setForm({ ...form, buildingType: bt.id })}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#101114] border-[#101114] text-white shadow-md ring-2 ring-[#fcb907]"
                          : "bg-[#f9fafb] border-[#e5e7eb] text-[#101114] hover:border-[#9ca3af] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#fcb907]" : "text-[#d97706]"}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#fcb907]" />}
                      </div>
                      <div className="text-xs font-black">{bt.label}</div>
                      <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? "text-gray-300" : "text-[#6b7280]"}`}>
                        {bt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size & Budget & Timeline Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">
                  Estimated Floor Area
                </label>
                <select
                  value={form.approxSqft}
                  onChange={(e) => setForm({ ...form, approxSqft: e.target.value })}
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] px-3 py-2.5 text-xs text-[#101114] rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="Under 600 sq ft">Compact (&lt; 600 SQ FT)</option>
                  <option value="600 – 1,200 sq ft">Medium (600–1,200 SQ FT)</option>
                  <option value="1,200 – 2,500 sq ft">Spacious (1,200–2,500 SQ FT)</option>
                  <option value="2,500 – 4,500 sq ft">Estate (2,500–4,500 SQ FT)</option>
                  <option value="4,500+ sq ft">Commercial / Multi-Unit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">
                  Target Budget
                </label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] px-3 py-2.5 text-xs text-[#101114] rounded-xl focus:outline-none cursor-pointer"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">
                  Desired Timeline
                </label>
                <select
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] px-3 py-2.5 text-xs text-[#101114] rounded-xl focus:outline-none cursor-pointer"
                >
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t border-[#e5e7eb]">
            <div className="text-[11px] font-black uppercase text-[#6b7280] tracking-wider">
              2. Support Department & Topic
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1">
                Inquiry Topic
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] px-3 py-2.5 text-xs text-[#101114] rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="Building Code & Permit Feasibility">Building Code & Permit Feasibility</option>
                <option value="Existing Order / Blueprint Delivery">Existing Order / Blueprint Delivery</option>
                <option value="Manufacturing & Freight Scheduling">Manufacturing & Freight Scheduling</option>
                <option value="Architectural Customization">Architectural Customization</option>
                <option value="Contractor / Dealer Partnership">Contractor / Dealer Partnership</option>
                <option value="Other Inquiries">Other Inquiries</option>
              </select>
            </div>
          </div>
        )}

        {/* Message & Requirements */}
        <div className="space-y-2 pt-2 border-t border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#101114]">
              {intent === "CUSTOM_PLAN"
                ? "Describe Your Custom Architectural Concept & Dimensions *"
                : intent === "GENERAL_SUPPORT"
                ? "Your Question or Message *"
                : "Project Notes, Foundation Type, or Questions *"}
            </label>
            {intent === "CUSTOM_PLAN" && (
              <Link
                href="/upload-floor-plan"
                className="text-[11px] font-bold text-[#d97706] hover:underline flex items-center gap-1"
              >
                Have CAD/PDF files? Upload blueprint directly →
              </Link>
            )}
          </div>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={
              intent === "CUSTOM_PLAN"
                ? "Describe room layouts, preferred exterior cladding, roof pitch, porch extensions, or link to your CAD blueprint..."
                : "Include any details about your land (flat vs sloped, grid-tied vs off-grid), preferred floor plan model, or financing questions..."
            }
            className="w-full bg-[#f9fafb] border border-[#d1d5db] focus:border-[#fcb907] focus:bg-white p-3.5 text-xs text-[#101114] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#fcb907]/20 leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#101114] hover:bg-[#252830] text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Transmitting to Factory Engineering...
              </span>
            ) : (
              <>
                <span>Submit Consultation Request</span>
                <ArrowRight className="w-4 h-4 text-[#fcb907] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Privacy & Guarantee Trust Bar */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6b7280] gap-2 border-t border-[#f3f4f6]">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#fcb907]" />
            Strict Privacy: Never sold to third-party lead brokers.
          </span>
          <span className="font-semibold text-[#101114]">
            Direct Manufacturer Pricing • 50-Yr Steel Warranty
          </span>
        </div>
      </form>
    </div>
  );
}
