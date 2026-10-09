"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  DollarSign,
  Info,
} from "lucide-react";
import type { PricingRule, DeterministicQuotationResult } from "@/lib/pricingEngine";
import { useConfirm } from "@/context/ConfirmDialogContext";

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const confirm = useConfirm();

  // New Rule Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    code: "",
    category: "UPGRADE",
    label: "",
    base_rate: 0,
    multiplier: 0,
    description: "",
    is_active: true,
  });

  // Simulator Test Bench State
  const [simSqft, setSimSqft] = useState(1200);
  const [simModel, setSimModel] = useState("Modular Homes");
  const [simFinish, setSimFinish] = useState("STANDARD");
  const [simUpgrades, setSimUpgrades] = useState<string[]>(["SOLAR_PREP", "TRIPLE_PANE"]);
  const [simResult, setSimResult] = useState<DeterministicQuotationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      const json = await res.json();
      if (json.success) {
        setRules(json.data || []);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load pricing rules." });
    } finally {
      setIsLoading(false);
    }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CALCULATE_PREVIEW",
          input: {
            modelType: simModel,
            sqft: simSqft,
            finishLevel: simFinish,
            selectedUpgrades: simUpgrades,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSimResult(json.data);
      }
    } catch (e) {
      console.error("Simulation calculation failed:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    if (rules.length > 0) {
      runSimulation();
    }
  }, [simSqft, simModel, simFinish, simUpgrades, rules.length]);

  const handleUpdateRule = async (rule: PricingRule) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/pricing/${rule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: `Updated rule ${rule.label} successfully.` });
        fetchRules();
      } else {
        setMessage({ type: "error", text: json.error?.message || "Failed to update rule." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.code || !newRule.label) {
      setMessage({ type: "error", text: "Rule code and label are required." });
      return;
    }

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRule),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        setNewRule({
          code: "",
          category: "UPGRADE",
          label: "",
          base_rate: 0,
          multiplier: 0,
          description: "",
          is_active: true,
        });
        setMessage({ type: "success", text: "New pricing rule created successfully!" });
        fetchRules();
      } else {
        setMessage({ type: "error", text: json.error?.message || "Failed to create rule." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDeleteRule = async (id: string) => {
    const ok = await confirm({
      title: "Remove Pricing Rule?",
      message: "Are you sure you want to remove this pricing rule? It will immediately affect dynamic quote calculations.",
      confirmText: "Delete Rule",
      cancelText: "Cancel",
      type: "danger",
      icon: "trash",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Rule deleted successfully." });
        fetchRules();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const categories = ["MODEL_RATE", "BASE_MODEL", "SQFT_RATE", "UPGRADE", "FEE", "DISCOUNT", "EXCLUSION"];

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e9ee] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-[11px] font-black uppercase tracking-wider mb-2 font-mono">
            <Calculator className="w-3.5 h-3.5" />
            <span>Deterministic Pricing Engine (Rule Version v2026.1)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101114] font-serif">
            Quotation Rules & Rate Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1 font-medium">
            Configure base model rates, living area per-sqft multipliers, upgrades, and mandatory engineering fees. The AI chatbot & quote wizard compute exact itemized prices directly through this engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchRules}
            className="p-2.5 rounded-xl border border-[#d5d9e0] bg-white hover:bg-[#f6f7f9] text-[#101114] transition-all shadow-2xs cursor-pointer"
            title="Reload Rules"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pricing Rule</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Grid: Rules Manager (Left) + Interactive Simulator (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Categorized Rules Table */}
        <div className="xl:col-span-2 space-y-6">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#fcb907]" />
              <span>Loading Pricing Rule Matrix...</span>
            </div>
          ) : (
            categories.map((cat) => {
              const catRules = rules.filter((r) => r.category === cat);
              if (catRules.length === 0) return null;

              return (
                <div key={cat} className="bg-white rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] overflow-hidden">
                  <div className="p-4 bg-[#f8f9fa] border-b border-[#e7e9ee] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#101114] font-mono">
                      <Sliders className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>{cat.replace("_", " ")} RULES</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-200 text-[#101114] text-[10px]">
                        {catRules.length}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-[#f0f2f5]">
                    {catRules.map((rule) => (
                      <div key={rule.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 bg-gray-100 text-[#101114] rounded">
                              {rule.code}
                            </span>
                            <span className="font-bold text-xs text-[#101114] truncate">
                              {rule.label}
                            </span>
                            {!rule.is_active && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-200 text-gray-700">
                                INACTIVE
                              </span>
                            )}
                          </div>
                          {rule.description && (
                            <p className="text-[11px] text-[#6b7280] line-clamp-1">{rule.description}</p>
                          )}
                        </div>

                        {/* Inline Rates */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs font-mono font-black text-[#101114]">
                              {rule.base_rate > 0 && `$${rule.base_rate.toLocaleString()}`}
                              {rule.base_rate > 0 && rule.multiplier > 0 && " + "}
                              {rule.multiplier > 0 && `$${rule.multiplier}/sq ft`}
                              {rule.base_rate === 0 && rule.multiplier === 0 && "$0"}
                            </div>
                            <div className="text-[10px] text-[#6b7280]">
                              {rule.multiplier > 0 ? "Rate formula" : "Flat rate"}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 1 Col: Live Deterministic Calculation Test Bench */}
        <div className="bg-[#0f1218] text-white p-6 sm:p-7 rounded-[22px] shadow-2xl border border-[#1e2430] space-y-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#fcb907] uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Live Quote Simulator</span>
            </div>
            {isSimulating && <Loader2 className="w-4 h-4 animate-spin text-[#fcb907]" />}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] text-gray-300 font-bold mb-1">Building Category</label>
              <select
                value={simModel}
                onChange={(e) => setSimModel(e.target.value)}
                className="w-full bg-[#181d27] border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#fcb907]"
              >
                <option value="Modular Homes">Modular Homes</option>
                <option value="Barndominiums">Barndominiums</option>
                <option value="Cabins">Cabins & A-Frames</option>
                <option value="ADUs & Granny Pods">ADUs & Tiny Suites</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-gray-300 font-bold mb-1">
                <span>Floor Area: {simSqft.toLocaleString()} sq ft</span>
              </div>
              <input
                type="range"
                min="400"
                max="4000"
                step="50"
                value={simSqft}
                onChange={(e) => setSimSqft(Number(e.target.value))}
                className="w-full accent-[#fcb907] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-300 font-bold mb-1">Finish Level</label>
              <select
                value={simFinish}
                onChange={(e) => setSimFinish(e.target.value)}
                className="w-full bg-[#181d27] border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#fcb907]"
              >
                <option value="KIT_SHELL">Structural Framing Kit Only</option>
                <option value="STANDARD">Standard Drywall & Insulation</option>
                <option value="PREMIUM_TURNKEY">Premium Luxury Turnkey Finish</option>
              </select>
            </div>

            {/* Simulated Upgrades Toggles */}
            <div>
              <label className="block text-[11px] text-gray-300 font-bold mb-1.5">Optional Upgrades</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {rules
                  .filter((r) => r.category === "UPGRADE")
                  .map((up) => {
                    const checked = simUpgrades.includes(up.code);
                    return (
                      <label key={up.id} className="flex items-center gap-2 p-2 bg-[#181d27] hover:bg-[#202735] rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSimUpgrades([...simUpgrades, up.code]);
                            } else {
                              setSimUpgrades(simUpgrades.filter((c) => c !== up.code));
                            }
                          }}
                          className="rounded text-[#fcb907] focus:ring-0"
                        />
                        <span className="text-[11px] text-gray-200 truncate flex-1">{up.label}</span>
                        <span className="text-[10px] font-mono text-[#fcb907]">+${up.base_rate.toLocaleString()}</span>
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Itemized Calculation Summary Card */}
          {simResult && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                Deterministic Calculation Result
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Base Structure</span>
                  <span className="font-mono">${simResult.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Living Area Multiplier</span>
                  <span className="font-mono">${simResult.sqftRateAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Upgrades Total</span>
                  <span className="font-mono">${simResult.upgradesTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Mandatory Logistics & Fees</span>
                  <span className="font-mono">${simResult.feesTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono font-bold">Estimated Total</div>
                  <div className="text-2xl font-serif font-bold text-[#fcb907]">
                    ${simResult.estimatedTotal.toLocaleString()}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                  {simResult.pricingRuleVersion}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-serif font-bold text-[#101114]">Create New Pricing Rule</h2>
            <form onSubmit={handleCreateRule} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#101114] mb-1">Rule Code (Unique ID)</label>
                  <input
                    type="text"
                    value={newRule.code}
                    onChange={(e) => setNewRule({ ...newRule, code: e.target.value })}
                    placeholder="e.g. BALCONY_DECK"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101114] mb-1">Category</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  >
                    <option value="MODEL_RATE">MODEL_RATE</option>
                    <option value="BASE_MODEL">BASE_MODEL</option>
                    <option value="SQFT_RATE">SQFT_RATE</option>
                    <option value="UPGRADE">UPGRADE</option>
                    <option value="FEE">FEE</option>
                    <option value="DISCOUNT">DISCOUNT</option>
                    <option value="EXCLUSION">EXCLUSION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Rule Display Label</label>
                <input
                  type="text"
                  value={newRule.label}
                  onChange={(e) => setNewRule({ ...newRule, label: e.target.value })}
                  placeholder="e.g. Cantilevered Steel Balcony & Glass Railing Kit"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#101114] mb-1">Base Rate ($)</label>
                  <input
                    type="number"
                    value={newRule.base_rate}
                    onChange={(e) => setNewRule({ ...newRule, base_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101114] mb-1">Multiplier ($/SqFt)</label>
                  <input
                    type="number"
                    value={newRule.multiplier}
                    onChange={(e) => setNewRule({ ...newRule, multiplier: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Description / Inclusions</label>
                <textarea
                  rows={2}
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Details regarding engineering specs or package inclusions..."
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] text-xs focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e7e9ee]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#d5d9e0] text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
