"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Phone,
  Mail,
  FileText,
  Download,
  Settings,
  LogOut,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HardHat,
  MapPin,
  ExternalLink,
  ChevronRight,
  Compass,
  PhoneCall,
  PlusCircle,
  HelpCircle,
  Lock,
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function CustomerAccountDashboard() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading, logout, refreshUser } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "blueprints" | "quotes" | "profile">("overview");

  // Profile Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync customer details to form
  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setPhone(customer.phone || "");
      if (customer.billing_address) {
        setStreet(customer.billing_address.street || "");
        setCity(customer.billing_address.city || "");
        setState(customer.billing_address.state || "");
        setZip(customer.billing_address.zip || "");
      }
    }
  }, [customer]);

  // Auth Protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !customer) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin text-[#e11d1d] mb-4" />
        <p className="text-sm font-semibold text-gray-600">Verifying customer session...</p>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/customer/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          billing_address: {
            street,
            city,
            state,
            zip,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      await refreshUser();
      setProfileMsg({ type: "success", text: "Profile details updated successfully." });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "An error occurred while saving." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const sampleBlueprints = [
    {
      id: "bp-apex-20",
      title: "Apex-20 Underground Bunker",
      category: "Nuclear, Biological & Chemical (NBC) Shelter",
      specs: "20' x 40' • 800 sq ft • 10-15 Occupants",
      dateSaved: "Oct 24, 2026",
      status: "Engineering Approved",
      href: "/models/apex-20",
    },
    {
      id: "bp-steel-cabin",
      title: "Steel Fortified Cabin Shelter",
      category: "Above-Ground Storm & Ballistic Safe House",
      specs: "24' x 36' • 864 sq ft • 6-8 Occupants",
      dateSaved: "Oct 19, 2026",
      status: "Design Active",
      href: "/models/steel-fortified-cabin",
    },
  ];

  const sampleQuotations = [
    {
      id: "QUO-88219",
      projectName: "Custom Sub-Grade Bunker Installation",
      location: "Indiana, USA",
      submittedDate: "Oct 26, 2026",
      status: "Under Engineering Review",
      estimatedLeadTime: "6-8 Weeks",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top Customer Hero Banner ── */}
      <section className="bg-[#111214] text-white border-b border-gray-800">
        <div className="site-container py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#e11d1d] flex items-center justify-center text-white font-display font-black text-2xl shadow-lg shrink-0">
                {customer.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                    {customer.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold tracking-wider uppercase">
                    Active Client
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    {customer.email}
                  </span>
                  {customer.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      {customer.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions / Sign Out */}
            <div className="flex items-center gap-3">
              <Link
                href="/upload-floor-plan"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/10"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#e11d1d]" />
                <span>Upload Plan</span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="px-4 py-2.5 rounded-xl bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto border-t border-gray-800/80 pt-4 scrollbar-none">
            {[
              { id: "overview", label: "Dashboard Overview", icon: Layers },
              { id: "blueprints", label: "Saved Blueprints", icon: FileText },
              { id: "quotes", label: "Quotations & Inquiries", icon: HardHat },
              { id: "profile", label: "Account Profile", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#111214] shadow-md"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#e11d1d]" : "text-gray-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tab Content Area ── */}
      <main className="site-container py-8 sm:py-12">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e11d1d] flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black font-display text-gray-900">2</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Saved Blueprints</div>
                <button
                  onClick={() => setActiveTab("blueprints")}
                  className="mt-3 text-xs font-bold text-[#e11d1d] hover:underline flex items-center gap-1"
                >
                  View blueprints &rarr;
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <HardHat className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black font-display text-gray-900">1</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Active Inquiries</div>
                <button
                  onClick={() => setActiveTab("quotes")}
                  className="mt-3 text-xs font-bold text-[#e11d1d] hover:underline flex items-center gap-1"
                >
                  Track progress &rarr;
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black font-display text-gray-900">Active</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Security Clearance</div>
                <span className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Client Verified
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black font-display text-gray-900">Priority</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Engineering Hotline</div>
                <a
                  href="tel:+18125954033"
                  className="mt-3 text-xs font-bold text-[#e11d1d] hover:underline flex items-center gap-1"
                >
                  Call +1 (812) 595-4033
                </a>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-black font-display text-gray-900 tracking-tight mb-4">
                QUICK DEFENSE ACTIONS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/upload-floor-plan"
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#e11d1d] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-[#e11d1d] text-sm">
                      Upload Custom Floor Plan
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload PDF/CAD plans for free engineering structural assessment.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#e11d1d]">
                    <span>Upload Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/quote"
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#e11d1d] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-[#e11d1d] text-sm">
                      Request Bunker Quote
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Get itemized specs, blast ratings, and delivery timelines for your location.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#e11d1d]">
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/models"
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#e11d1d] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-[#e11d1d] text-sm">
                      Explore Shelter Catalog
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Browse certified underground, storm, and blast-resistant models.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#e11d1d]">
                    <span>Browse Models</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED BLUEPRINTS */}
        {activeTab === "blueprints" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black font-display text-gray-900 tracking-tight">
                  SAVED SHELTER BLUEPRINTS
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Access technical layouts, architectural dimensions, and air filtration specs.
                </p>
              </div>
              <Link
                href="/models"
                className="px-4 py-2 rounded-xl bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Browse More Models</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleBlueprints.map((bp) => (
                <div
                  key={bp.id}
                  className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#e11d1d] uppercase tracking-wider block">
                        {bp.category}
                      </span>
                      <h3 className="text-base font-extrabold text-gray-900 mt-0.5">{bp.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{bp.specs}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0">
                      {bp.status}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Saved on {bp.dateSaved}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={bp.href}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors"
                      >
                        View Model
                      </Link>
                      <Link
                        href="/quote"
                        className="px-3 py-1.5 rounded-lg bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-bold text-xs transition-colors"
                      >
                        Request Pricing
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUOTES & INQUIRIES */}
        {activeTab === "quotes" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black font-display text-gray-900 tracking-tight">
                  QUOTATIONS &amp; INQUIRIES
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Track the status of your defense shelter bids, custom engineering, and fabrication quotes.
                </p>
              </div>
              <Link
                href="/quote"
                className="px-4 py-2 rounded-xl bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Quotation Request</span>
              </Link>
            </div>

            <div className="space-y-3">
              {sampleQuotations.map((quo) => (
                <div
                  key={quo.id}
                  className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#e11d1d]">{quo.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {quo.status}
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900">{quo.projectName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span>Submitted: {quo.submittedDate}</span>
                      <span>•</span>
                      <span>Location: {quo.location}</span>
                      <span>•</span>
                      <span>Est. Lead Time: {quo.estimatedLeadTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/contact"
                      className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                    >
                      Contact Engineer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black font-display text-gray-900 tracking-tight">
                ACCOUNT &amp; DELIVERY SETTINGS
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Update your contact information and site delivery location.
              </p>
            </div>

            {profileMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-start gap-2.5 ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 block">Email Address (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={customer.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 block">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (812) 595-4033"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                  Installation / Site Delivery Address
                </span>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-600 block">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Defense Way"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 block">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Indianapolis"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 block">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="IN"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 block">ZIP Code</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="46201"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-bold text-xs tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

