"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Building,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    projectType: "Bomb Shelters",
    timeline: "1-3 Months",
    budget: "$50k - $100k",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          projectType: formData.projectType,
          timeline: formData.timeline,
          budget: formData.budget,
          notes: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit consultation request");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubPageHeader
        badge="GET IN TOUCH"
        title="SPEAK WITH A STRUCTURAL"
        highlight="BLAST ADVISOR"
        description="Whether you have questions regarding subterranean excavation, NBC filtration requirements, or custom floor plans, our engineering team is here to assist."
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      <section className="bg-paper text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details & Info (Left 5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#0a0a0a]">
                  Direct Manufacturer Advisory
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Every inquiry is handled under strict privacy standards. We never share client property coordinates, soil reports, or build specifications.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:812-595-4033"
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#e11d1d] hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e11d1d]/10 text-[#e11d1d] flex items-center justify-center shrink-0 group-hover:bg-[#e11d1d] group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400">Direct Engineering Hotline</div>
                    <div className="text-lg font-display font-bold text-[#e11d1d] group-hover:underline">
                      812-595-4033
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Mon – Sat: 8:00 AM – 7:00 PM EST</div>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400">Confidential Email</div>
                    <div className="text-sm font-semibold text-[#0a0a0a]">info@bombshelters.com</div>
                    <div className="text-xs text-gray-500 mt-0.5">Encrypted responses within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400">Headquarters &amp; Logistics</div>
                    <div className="text-sm font-semibold text-[#0a0a0a]">
                      Manufacturing Facility &amp; Central Dispatch, IN
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Nationwide Freight &amp; Crane Delivery to all 50 States</div>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
                <div className="font-bold text-[#0a0a0a] flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#e11d1d]" />
                  <span>Discretion &amp; Confidentiality Guarantee</span>
                </div>
                We understand the sensitive nature of defense shelters. All customer records, floor plans, and delivery logs are encrypted and protected by strict internal privacy firewalls.
              </div>
            </div>

            {/* Inquiry Form (Right 7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white shadow-xl">
                <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight mb-2">
                  Request a Confidential Consultation
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Fill out the form below. An architectural defense specialist will review your project requirements and follow up promptly.
                </p>

                {success ? (
                  <div className="p-6 rounded-lg bg-green-50 border border-green-200 text-green-900 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-lg">Inquiry Successfully Received</h4>
                    <p className="text-xs sm:text-sm text-green-800 max-w-md mx-auto">
                      Thank you for contacting BombShelters.com. Your inquiry has been routed to our structural engineering department. An advisor will contact you shortly.
                    </p>
                    <Button
                      onClick={() => {
                        setSuccess(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          state: "",
                          projectType: "Bomb Shelters",
                          timeline: "1-3 Months",
                          budget: "$50k - $100k",
                          message: "",
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      Submit Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
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
                          placeholder="John Anderson"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d] focus:ring-1 focus:ring-[#e11d1d]"
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
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d] focus:ring-1 focus:ring-[#e11d1d]"
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
                          placeholder="john@example.com"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d] focus:ring-1 focus:ring-[#e11d1d]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Location / State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="e.g. Texas, Missouri, Ohio"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d] focus:ring-1 focus:ring-[#e11d1d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Shelter Type
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full text-xs sm:text-sm px-3 py-2.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#e11d1d]"
                        >
                          <option value="Bomb Shelters">Bomb Shelters</option>
                          <option value="Storm Shelters">Storm Shelters</option>
                          <option value="Safe Rooms">Safe Rooms</option>
                          <option value="Luxury Bunkers">Luxury Bunkers</option>
                          <option value="Steel Framed Homes">Steel Framed Homes</option>
                          <option value="Cabins">Off-Grid Cabins</option>
                          <option value="House Kits">House Kits</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full text-xs sm:text-sm px-3 py-2.5 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#e11d1d]"
                        >
                          <option value="Immediately">Immediately (Ready)</option>
                          <option value="1-3 Months">1 - 3 Months</option>
                          <option value="3-6 Months">3 - 6 Months</option>
                          <option value="Planning / Research">Planning / Research</option>
                        </select>
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
                        Site &amp; Project Details
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your property (acreage, soil conditions, subterranean vs above-ground, occupancy count)..."
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-[#e11d1d] focus:ring-1 focus:ring-[#e11d1d]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 rounded-[3px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-semibold uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-redGlow disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing to Engineering Dept...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Confidential Consultation</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
