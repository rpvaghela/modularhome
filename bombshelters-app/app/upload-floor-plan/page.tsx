"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  ShieldCheck,
  HardHat,
  ArrowRight,
  Phone,
  FileCheck,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

export default function UploadFloorPlanPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    shelterType: "Bomb Shelters",
    estimatedSqFt: "",
    budget: "$50k - $100k",
    notes: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit. Please upload a smaller blueprint or sketch.");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.state,
          projectType: `${formData.shelterType} (Floor Plan Review)`,
          budget: formData.budget,
          notes: `${formData.notes ? `${formData.notes} | ` : ""}Uploaded Blueprint: ${
            selectedFile ? selectedFile.name : "None attached"
          }${formData.estimatedSqFt ? ` | Target Size: ${formData.estimatedSqFt} sq ft` : ""}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit floor plan for engineering review");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit plan. Please contact our drafting department directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubPageHeader
        badge="BLUEPRINT & CAD REVIEW"
        title="UPLOAD YOUR SITE PLAN"
        highlight="OR BLUEPRINT"
        description="Have a hand sketch, architect CAD file, or property survey? Upload it directly to our structural blast engineering team for a feasibility assessment."
        breadcrumbs={[{ label: "Upload Floor Plan" }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl">
          {success ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-green-50 border border-green-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-green-950">
                Floor Plan Received For Engineering Review
              </h3>
              <p className="text-sm text-green-900 leading-relaxed max-w-lg mx-auto">
                Thank you, <strong>{formData.name}</strong>. Your plan ({selectedFile ? selectedFile.name : "custom specs"}) has been assigned to a senior defense architect. We will review structural feasibility and prepare a preliminary CAD evaluation within 1-2 business days.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setSelectedFile(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      state: "",
                      shelterType: "Bomb Shelters",
                      estimatedSqFt: "",
                      budget: "$50k - $100k",
                      notes: "",
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Upload Another File
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-10 rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="mb-8">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                  Submit Your Design for a Free Structural Evaluation
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  We review hand sketches, architectural PDF blueprints, parcel topography maps, and DWG/CAD files. Our licensed engineers will calculate overpressure viability and estimate turnkey fabrication costs.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                    Upload Blueprint, Site Plan or Sketch (PDF, PNG, JPG, DWG up to 25MB)
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#e11d1d] hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#e11d1d]/10 text-[#e11d1d] flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      {selectedFile ? (
                        <div>
                          <div className="font-display font-bold text-sm text-[#0a0a0a] flex items-center justify-center gap-1.5">
                            <FileText className="w-4 h-4 text-[#e11d1d]" />
                            <span>{selectedFile.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Click to replace
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-display font-bold text-sm text-[#0a0a0a]">
                            Drag &amp; drop file here, or click to browse
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, DWG, DXF, PNG, or high-res JPG
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Fields */}
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
                      placeholder="Jane Doe"
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
                      placeholder="(555) 234-5678"
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
                      placeholder="jane@example.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Installation State / Parcel Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Montana, Idaho, Florida"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Structure Type
                    </label>
                    <select
                      value={formData.shelterType}
                      onChange={(e) => setFormData({ ...formData, shelterType: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#e11d1d]"
                    >
                      <option value="Bomb Shelters">Bomb Shelter</option>
                      <option value="Storm Shelters">Tornado Storm Shelter</option>
                      <option value="Safe Rooms">Ballistic Safe Room</option>
                      <option value="Luxury Bunkers">Luxury Underground Bunker</option>
                      <option value="Steel Framed Homes">Steel Framed Home</option>
                      <option value="Cabins">Off-Grid Cabin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Target Sq Footage (Approx)
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedSqFt}
                      onChange={(e) => setFormData({ ...formData, estimatedSqFt: e.target.value })}
                      placeholder="e.g. 500 sq ft"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Target Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#e11d1d]"
                    >
                      <option value="Under $50k">Under $50k</option>
                      <option value="$50k - $100k">$50k - $100k</option>
                      <option value="$100k - $250k">$100k - $250k</option>
                      <option value="$250k+">$250k+ (Luxury)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Special Engineering Instructions or Questions
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about special requests (e.g. tunnel connection to primary home basement, generator vault, hydroponic room)..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-[3px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-redGlow disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Blueprint to Drafting Dept...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Blueprint for Engineering Review</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
