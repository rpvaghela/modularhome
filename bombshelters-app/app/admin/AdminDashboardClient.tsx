"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  FolderOpen,
  FileText,
  BookOpen,
  Users,
  FileSpreadsheet,
  Plus,
  Layers,
  Video,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Mail,
  Phone,
  ArrowRight,
  TrendingUp,
  Shield,
  Activity,
  KeyRound,
  ShieldAlert,
  Globe,
  ArrowUpRight,
  Download,
} from "lucide-react";

export default function AdminDashboardClient() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch(`/api/bombshelter/admin/dashboard/stats?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (e) {
      console.warn("Failed to load dashboard stats:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-[#6b7280] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#e11d1d]" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#101114]">
          Loading Management Console...
        </span>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalProducts: 12,
    totalCollections: 6,
    totalFloorPlans: 6,
    totalPages: 8,
    publishedBlogs: 6,
    totalLeads: 0,
    newLeads: 0,
    totalQuotations: 0,
    pendingQuotations: 0,
  };

  const statCards = [
    {
      label: "Shelter Models",
      value: metrics.totalProducts,
      subtext: "Published defense catalog models",
      href: "/admin/products",
      icon: Home,
      accentBorder: "hover:border-[#e11d1d]",
      iconBg: "bg-red-50 text-[#e11d1d] border-red-200",
    },
    {
      label: "Collections & Series",
      value: metrics.totalCollections,
      subtext: "Architectural shelter suites",
      href: "/admin/collections",
      icon: FolderOpen,
      accentBorder: "hover:border-[#101114]",
      iconBg: "bg-slate-100 text-[#101114] border-slate-200",
    },
    {
      label: "Floor Plan Kits",
      value: metrics.totalFloorPlans,
      subtext: "Downloadable architectural CAD sets",
      href: "/admin/floor-plans",
      icon: Download,
      accentBorder: "hover:border-[#e11d1d]",
      iconBg: "bg-red-50 text-[#e11d1d] border-red-200",
    },
    {
      label: "Inbound Leads",
      value: metrics.totalLeads,
      subtext: `${metrics.newLeads || 0} unread customer inquiries`,
      href: "/admin/leads",
      icon: Users,
      accentBorder: "hover:border-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Quote Submissions",
      value: metrics.totalQuotations,
      subtext: `${metrics.pendingQuotations || 0} pending cost review`,
      href: "/admin/quotations",
      icon: FileSpreadsheet,
      accentBorder: "hover:border-[#e11d1d]",
      iconBg: "bg-red-50 text-[#e11d1d] border-red-200",
    },
    {
      label: "Blogs & Guides",
      value: metrics.publishedBlogs,
      subtext: "Published defense briefings",
      href: "/admin/blogs",
      icon: BookOpen,
      accentBorder: "hover:border-[#101114]",
      iconBg: "bg-slate-100 text-[#101114] border-slate-200",
    },
  ];

  const quickActions = [
    {
      title: "New Shelter Model",
      desc: "Add 3D model & specs to catalog",
      href: "/admin/products/new",
      icon: Home,
      highlight: true,
    },
    {
      title: "New Floor Plan Kit",
      desc: "Upload blueprint CAD/PDF package",
      href: "/admin/floor-plans",
      icon: Download,
      highlight: false,
    },
    {
      title: "Sync YouTube Videos",
      desc: "Sync factory tests & video tours",
      href: "/admin/videos",
      icon: Video,
      highlight: false,
    },
    {
      title: "Store & Shopify Sync",
      desc: "Execute data & equipment migration",
      href: "/admin/shopify",
      icon: RefreshCw,
      highlight: false,
    },
    {
      title: "Page Blocks CMS",
      desc: "Customize homepage & sections",
      href: "/admin/sections",
      icon: Layers,
      highlight: false,
    },
    {
      title: "Global Site Settings",
      desc: "Branding, hotline 812-595-4033 & banners",
      href: "/admin/settings",
      icon: Globe,
      highlight: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Command Banner (Black with Red Accents) */}
      <div className="bg-[#0b0d11] rounded-[22px] p-6 sm:p-8 lg:p-10 text-white shadow-[0_20px_45px_rgba(11,13,17,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10 relative overflow-hidden">
        {/* Subtle radial red glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#e11d1d]/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-red-950/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="space-y-2.5 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#e11d1d] text-[11px] font-mono font-bold uppercase tracking-widest backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>BombShelters CMS • Executive Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-serif">
            Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed font-sans">
            Manage your catalogue of hardened subterranean bomb shelters, digital architectural blueprints, turnkey customer quote calculations, and live content syndication.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 transition-all cursor-pointer backdrop-blur-xs disabled:opacity-50"
            title="Refresh dashboard stats now"
          >
            <RefreshCw className={`w-4 h-4 text-[#e11d1d] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#e11d1d] hover:bg-[#c81919] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Model</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider border border-white/15 transition-all backdrop-blur-xs"
          >
            <Globe className="w-4 h-4 text-white" />
            <span>Site Settings</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid (White Cards with Black Values & Red Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`bg-white p-6 rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] hover:shadow-[0_18px_45px_rgba(16,24,40,0.08)] transition-all duration-200 group relative overflow-hidden ${card.accentBorder}`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3.5 rounded-2xl border ${card.iconBg} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="p-1 text-[#6b7280] group-hover:text-[#e11d1d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-5">
                <div className="text-3xl sm:text-4xl font-black text-[#101114] tracking-tight font-serif">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-[#101114] mt-1.5 uppercase tracking-wider font-sans">
                  {card.label}
                </div>
                <div className="text-[11px] text-[#6b7280] mt-0.5 font-medium">
                  {card.subtext}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. Quick Action Launchpad (White Container with Black & Red Hover) */}
      <div className="bg-white p-6 sm:p-7 rounded-[22px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3.5">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#101114] font-serif">
              Quick Management Shortcuts
            </h2>
            <p className="text-xs text-[#6b7280] font-medium">Direct launchpad for common administrative operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.title}
                href={act.href}
                className="p-4 rounded-2xl bg-[#f8f9fa] hover:bg-red-50/40 border border-[#e7e9ee] hover:border-[#e11d1d] transition-all flex items-start gap-3.5 group shadow-2xs"
              >
                <div className="p-2.5 rounded-xl bg-white border border-[#e7e9ee] text-[#101114] group-hover:bg-[#e11d1d] group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#101114] group-hover:text-[#e11d1d] transition-colors flex items-center justify-between">
                    <span>{act.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5 line-clamp-1 font-medium">
                    {act.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Activity: Inbound Leads & Quotation Wizard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inbound Inquiries */}
        <div className="bg-white p-6 rounded-[22px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3.5">
            <div>
              <h3 className="text-base font-bold tracking-tight text-[#101114] font-serif">
                Recent Inbound Inquiries
              </h3>
              <p className="text-xs text-[#6b7280] font-medium">Direct leads from contact forms &amp; consultation modal</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-[#e11d1d] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentInquiries?.length > 0 ? (
              data.recentInquiries.slice(0, 4).map((lead: any) => {
                const leadName = lead.name || "Prospect";
                const enquiry = lead.notes || lead.message || lead.enquiry_details || "";
                return (
                  <div
                    key={lead.id}
                    className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e7e9ee] hover:border-[#d5d9e0] flex items-start justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-[#e11d1d] border border-red-200 font-bold flex items-center justify-center shrink-0 text-xs">
                        {leadName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#101114] truncate font-sans">{leadName}</div>
                        <div className="text-[#6b7280] text-[11px] font-medium truncate flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-[#6b7280]" />
                          <span>{lead.email}</span>
                          {lead.phone && <span>• {lead.phone}</span>}
                        </div>
                        {enquiry && (
                          <div className="text-[#101114] text-[11px] mt-1.5 line-clamp-1 italic font-serif">
                            &ldquo;{enquiry}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-[#e11d1d] border border-red-200 shrink-0 font-mono">
                      {lead.status || "NEW"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-[#6b7280] text-center py-8 font-medium">No leads recorded yet.</div>
            )}
          </div>
        </div>

        {/* Recent Quote Wizard Submissions */}
        <div className="bg-white p-6 rounded-[22px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3.5">
            <div>
              <h3 className="text-base font-bold tracking-tight text-[#101114] font-serif">
                Recent Quote Wizard Submissions
              </h3>
              <p className="text-xs text-[#6b7280] font-medium">Real-time estimations from interactive Quote Wizard</p>
            </div>
            <Link
              href="/admin/quotations"
              className="text-xs font-bold text-[#e11d1d] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentQuotations?.length > 0 ? (
              data.recentQuotations.slice(0, 4).map((quote: any) => {
                const clientName = quote.customer_name || quote.name || "Custom Shelter Quote";
                const total = quote.estimated_total || quote.total;
                return (
                  <div
                    key={quote.id}
                    className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e7e9ee] hover:border-[#d5d9e0] flex items-start justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#101114] border border-slate-200 font-bold flex items-center justify-center shrink-0 text-xs">
                        <FileSpreadsheet className="w-4 h-4 text-[#e11d1d]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#101114] truncate font-sans">{clientName}</div>
                        <div className="text-[#6b7280] text-[11px] font-medium truncate flex items-center gap-1.5 mt-0.5">
                          <span>{quote.shelter_type || quote.modelType || "Underground Shelter"}</span>
                          {quote.sqft && <span>• {quote.sqft} SQ FT</span>}
                        </div>
                        {total && (
                          <div className="text-[#101114] font-bold text-xs mt-1">
                            Est: ${Number(total).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-[#e11d1d] border border-red-200 shrink-0 font-mono">
                      {quote.status || "PENDING"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-[#6b7280] text-center py-8 font-medium">No quotations recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
