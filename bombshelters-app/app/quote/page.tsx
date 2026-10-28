"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Users,
  Wrench,
  Zap,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Send,
  Phone,
  Calculator,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/ui/CtaBanner";

interface ModelChoice {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  sqft: number;
  capacity: string;
  desc: string;
}

const MODEL_CHOICES: ModelChoice[] = [
  {
    id: "storm-safe-1",
    name: "Residential EF5 Storm Shelter",
    category: "Storm Shelters",
    basePrice: 14900,
    sqft: 80,
    capacity: "4-6 Occupants",
    desc: "FEMA P-320 compliant above or below ground shelter.",
  },
  {
    id: "standard-bomb-1",
    name: "Standard Subterranean Bomb Shelter",
    category: "Bomb Shelters",
    basePrice: 49900,
    sqft: 200,
    capacity: "6-8 Occupants",
    desc: "ASTM A36 corrugated steel shell with Swiss NBC filtration.",
  },
  {
    id: "safe-room-1",
    name: "Interior Ballistic Safe Room",
    category: "Safe Rooms",
    basePrice: 24900,
    sqft: 120,
    capacity: "4-6 Occupants",
    desc: "Level 4 ballistic panic room with biometric lock.",
  },
  {
    id: "luxury-bunker-1",
    name: "Luxury Subterranean Estate",
    category: "Luxury Bunkers",
    basePrice: 199900,
    sqft: 1200,
    capacity: "8-16 Occupants",
    desc: "Autonomous multi-room bunker with kitchen & living suite.",
  },
  {
    id: "steel-cabin-1",
    name: "Resilient Modular Steel Cabin",
    category: "Cabins",
    basePrice: 89900,
    sqft: 650,
    capacity: "Family Living",
    desc: "Class-A fire-resistant steel exterior with solar microgrid.",
  },
  {
    id: "steel-barndo-1",
    name: "Hardened Steel Barndominium",
    category: "Barndominiums",
    basePrice: 129000,
    sqft: 1600,
    capacity: "Residential Estate",
    desc: "Engineered rigid steel framing with integrated safe bunker.",
  },
];

interface AddonOption {
  id: string;
  name: string;
  price: number;
  desc: string;
}

const ADDON_OPTIONS: AddonOption[] = [
  {
    id: "emp-shielding",
    name: "EMP Hardening (MIL-STD-188-125)",
    price: 6500,
    desc: "Shields internal inverters and battery electronics from electromagnetic pulses.",
  },
  {
    id: "solar-lifepo4",
    name: "Autonomous Solar & 15kWh LiFePO4 Array",
    price: 14500,
    desc: "Off-grid subterranean power autonomy with concealed surface collectors.",
  },
  {
    id: "decon-airlock",
    name: "Decontamination Airlock & Pressure Shower",
    price: 8500,
    desc: "Airtight airlock chamber for chemical and biological wash-down.",
  },
  {
    id: "escape-hatch",
    name: "Secondary Hydraulic Escape Hatch",
    price: 5200,
    desc: "Concealed 50-foot escape tunnel with disguised hydraulic surface exit.",
  },
  {
    id: "hydroponic-garden",
    name: "Automated Vertical Hydroponics Unit",
    price: 6800,
    desc: "Full-spectrum LED hydroponic rack for continuous fresh vegetables.",
  },
];

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<ModelChoice>(MODEL_CHOICES[1]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle addon
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Calculate live total
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDON_OPTIONS.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const totalEstimate = selectedModel.basePrice + addonsTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bombshelter/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          model_name: selectedModel.name,
          category: selectedModel.category,
          sq_ft: selectedModel.sqft,
          estimated_amount: totalEstimate,
          specifications: {
            modelId: selectedModel.id,
            capacity: selectedModel.capacity,
            addons: selectedAddons,
            location: formData.state,
          },
          notes: `${formData.notes ? `${formData.notes} | ` : ""}Selected Add-ons: ${
            selectedAddons.length > 0 ? selectedAddons.join(", ") : "None"
          } | State: ${formData.state}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to submit quotation");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to process quote request. Please call our hotline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubPageHeader
        badge="INTERACTIVE ESTIMATOR"
        title="BOMBSHELTER QUOTE"
        highlight="WIZARD"
        description="Configure your custom blast shelter, select autonomous life-support add-ons, and receive a transparent turnkey estimate."
        breadcrumbs={[{ label: "Quote Wizard" }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container">
          {/* Progress Indicator */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-gray-400">
              <span className={step >= 1 ? "text-[#e11d1d]" : ""}>1. Choose Model</span>
              <span className={step >= 2 ? "text-[#e11d1d]" : ""}>2. Add-Ons</span>
              <span className={step >= 3 ? "text-[#e11d1d]" : ""}>3. Review &amp; Submit</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#e11d1d] h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {success ? (
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-green-50 border border-green-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-green-950">
                Quotation Successfully Generated
              </h3>
              <p className="text-sm text-green-900 leading-relaxed max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. Your customized estimate for the{" "}
                <strong>{selectedModel.name}</strong> has been logged with our engineering department.
              </p>
              <div className="p-4 rounded-xl bg-white border border-green-200 inline-block text-left text-xs text-gray-700">
                <div><strong>Model:</strong> {selectedModel.name} ({selectedModel.sqft} sq ft)</div>
                <div><strong>Estimated Investment:</strong> ${totalEstimate.toLocaleString()}</div>
                <div><strong>Contact:</strong> {formData.email} | {formData.phone}</div>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setStep(1);
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Configure Another Shelter
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
              {/* Wizard Steps (Left 8 cols) */}
              <div className="lg:col-span-8">
                {/* STEP 1: Choose Model */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-xl uppercase tracking-tight">
                      Step 1: Select Your Shelter or Residence
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Choose the base design that best matches your family size and threat requirements.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {MODEL_CHOICES.map((choice) => {
                        const isSelected = selectedModel.id === choice.id;
                        return (
                          <div
                            key={choice.id}
                            onClick={() => setSelectedModel(choice)}
                            className={`p-5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#e11d1d] bg-[#e11d1d]/5 shadow-md ring-2 ring-[#e11d1d]"
                                : "border-gray-200 bg-white hover:border-gray-400"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#e11d1d] bg-[#e11d1d]/10 px-2 py-0.5 rounded">
                                {choice.category}
                              </span>
                              <span className="font-display font-bold text-sm text-[#0a0a0a]">
                                From ${choice.basePrice.toLocaleString()}
                              </span>
                            </div>
                            <h4 className="font-display font-bold text-base text-[#0a0a0a] mb-1">
                              {choice.name}
                            </h4>
                            <p className="text-xs text-gray-600 leading-snug mb-3">
                              {choice.desc}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500">
                              <span>{choice.sqft} Sq Ft</span>
                              <span>•</span>
                              <span>{choice.capacity}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 flex justify-end">
                      <Button onClick={() => setStep(2)} size="md">
                        <span>Continue to Add-Ons</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Choose Addons */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-xl uppercase tracking-tight">
                      Step 2: Autonomous Upgrades &amp; Systems
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Enhance your subterranean survivability with off-grid microgrids and defense modules.
                    </p>

                    <div className="space-y-3">
                      {ADDON_OPTIONS.map((addon) => {
                        const isSelected = selectedAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                              isSelected
                                ? "border-[#e11d1d] bg-[#e11d1d]/5 shadow-sm ring-1 ring-[#e11d1d]"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-1 h-4 w-4 text-[#e11d1d] rounded border-gray-300 focus:ring-[#e11d1d]"
                              />
                              <div>
                                <h4 className="font-display font-bold text-sm text-[#0a0a0a]">
                                  {addon.name}
                                </h4>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {addon.desc}
                                </p>
                              </div>
                            </div>
                            <span className="font-display font-bold text-sm text-[#e11d1d] shrink-0">
                              +${addon.price.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 flex justify-between items-center">
                      <Button onClick={() => setStep(1)} variant="outline" size="md">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back</span>
                      </Button>
                      <Button onClick={() => setStep(3)} size="md">
                        <span>Review &amp; Contact</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Contact & Submit */}
                {step === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-display font-bold text-xl uppercase tracking-tight">
                      Step 3: Where Should We Send Your Detailed Breakdown?
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Enter your contact information. An architectural defense estimator will review site logistics.
                    </p>

                    {error && (
                      <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Destination State / Zip *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="e.g. Texas, 75001"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Site Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Mention any property notes (e.g. high water table, rocky soil, wooded slope)..."
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                      />
                    </div>

                    <div className="pt-6 flex justify-between items-center">
                      <Button onClick={() => setStep(2)} variant="outline" size="md">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back</span>
                      </Button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="py-3 px-6 rounded-[3px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-redGlow disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Quote...</span>
                          </>
                        ) : (
                          <>
                            <span>Request Formal Blueprint &amp; Quote</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Live Estimate Summary (Right 4 cols) */}
              <div className="lg:col-span-4">
                <div className="p-6 rounded-2xl bg-[#0e1014] text-white border border-[#22252a] sticky top-28 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#22252a]">
                    <span className="text-xs uppercase tracking-wider font-bold text-gray-400">
                      Live Configuration
                    </span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  <div>
                    <div className="text-xs text-gray-400">Selected Model:</div>
                    <div className="font-display font-bold text-base text-white">
                      {selectedModel.name}
                    </div>
                    <div className="text-xs text-[#e11d1d] mt-0.5">
                      Base: ${selectedModel.basePrice.toLocaleString()}
                    </div>
                  </div>

                  {selectedAddons.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-[#22252a]">
                      <div className="text-xs text-gray-400">Selected Upgrades:</div>
                      {selectedAddons.map((id) => {
                        const addon = ADDON_OPTIONS.find((a) => a.id === id);
                        return (
                          <div key={id} className="flex justify-between text-xs text-gray-300">
                            <span className="truncate max-w-[150px]">{addon?.name}</span>
                            <span>+${addon?.price.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#22252a]">
                    <div className="text-xs uppercase tracking-wider font-bold text-gray-400">
                      Estimated Turnkey Amount:
                    </div>
                    <div className="text-3xl font-display font-black text-[#e11d1d] tracking-tight mt-1">
                      ${totalEstimate.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Includes structural shell, standard NBC package &amp; preliminary blueprints.
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#22252a] text-xs text-gray-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#e11d1d] shrink-0" />
                    <span>Fixed-price guarantee upon signed engineering review.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        title="Need Architectural Revisions?"
        subtitle="Our CAD drafting team can modify dimensions, room partitions, and emergency escape vectors for any property."
        ctaText="Speak With a CAD Engineer"
        ctaHref="/contact"
      />
    </>
  );
}
