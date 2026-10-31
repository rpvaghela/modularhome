"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  TrendingUp,
  Search,
  MousePointerClick,
  Eye,
  Percent,
  Compass,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Loader2,
  Layers,
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";
import { SeoAnalyticsData } from "@/lib/seoAnalyticsStore";

export default function AdminSeoPage() {
  const [data, setData] = useState<SeoAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState("30d");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [querySearch, setQuerySearch] = useState("");
  const [pageSearch, setPageSearch] = useState("");

  const fetchSeoData = async () => {
    setIsLoading(true);
    try {
      let startDate = "";
      const now = new Date();
      if (range === "today") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      } else if (range === "7d") {
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (range === "30d") {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (range === "90d") {
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      }

      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (deviceFilter !== "all") params.set("device", deviceFilter);
      if (countryFilter !== "all") params.set("country", countryFilter);

      const res = await fetch(`/api/admin/seo?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load SEO analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, [range, deviceFilter, countryFilter]);

  if (isLoading && !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#fcb907]" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#101114]">
          Loading Search Console &amp; SEO Intelligence...
        </span>
      </div>
    );
  }

  const summary = data?.summary || {
    organicSessions: 0,
    organicUsers: 0,
    searchImpressions: 0,
    searchClicks: 0,
    averageCtr: 0,
    averagePosition: 0,
    organicLeads: 0,
    organicConversionRate: 0,
    indexedPagesCount: 0,
    lastSyncTimestamp: new Date().toISOString(),
    dataFreshness: "Cached" as const,
    apiStatus: { gscConnected: false, ga4Connected: false, supabaseConnected: true },
  };

  const filteredQueries = (data?.topQueries || []).filter((q) =>
    q.query.toLowerCase().includes(querySearch.toLowerCase())
  );

  const filteredPages = (data?.topLandingPages || []).filter(
    (p) =>
      p.path.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.title.toLowerCase().includes(pageSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#d97706]">
            <Globe className="w-4 h-4 text-[#fcb907]" />
            <span>Search Engine Optimization &amp; Google Console Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
            SEO &amp; Organic Performance
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time search impressions, organic clicks, SERP rankings, indexed pages, and verified lead conversion attribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Freshness Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{summary.dataFreshness} Sync</span>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center rounded-lg border border-[#e7e9ee] bg-white p-1 shadow-sm text-xs">
            {(["today", "7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  range === r
                    ? "bg-[#101114] text-white shadow"
                    : "text-gray-600 hover:text-[#101114]"
                }`}
              >
                {r === "today" ? "Today" : r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchSeoData}
            disabled={isLoading}
            className="p-2 border border-[#e7e9ee] rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* API Integration Health Status Bar */}
      <div className="bg-white border border-[#e7e9ee] rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] border border-[#e7e9ee]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                GSC
              </div>
              <div>
                <div className="text-xs font-bold text-[#101114]">Google Search Console</div>
                <div className="text-[10px] text-gray-500">Impressions &amp; Keyword SERP API</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] border border-[#e7e9ee]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                GA4
              </div>
              <div>
                <div className="text-xs font-bold text-[#101114]">Google Analytics 4</div>
                <div className="text-[10px] text-gray-500">Organic Sessions &amp; Conversions</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] border border-[#e7e9ee]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                DB
              </div>
              <div>
                <div className="text-xs font-bold text-[#101114]">Supabase Postgres</div>
                <div className="text-[10px] text-gray-500">Quotes &amp; Lead Conversion Sync</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          </div>
        </div>
      </div>

      {/* KPI Highlight Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Organic Sessions</span>
            <Users className="w-4 h-4 text-[#fcb907]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">
            {summary.organicSessions.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{summary.organicUsers.toLocaleString()} unique searchers</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Search Impressions</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">
            {summary.searchImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            {summary.searchClicks.toLocaleString()} organic clicks ({summary.averageCtr}% CTR)
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg SERP Position</span>
            <Compass className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#101114] font-display">
            #{summary.averagePosition}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            Top 15 national ranking
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Organic Inbound Leads</span>
            <Sparkles className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#d97706] font-display">
            {summary.organicLeads.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            {summary.organicConversionRate}% lead conversion rate
          </div>
        </div>
      </div>

      {/* Main Analysis: Top Queries & Top Landing Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Search Queries Table */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#101114]">Top Search Queries (GSC)</h2>
              <p className="text-xs text-gray-500">Keywords driving qualified search impressions</p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter keyword..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#e7e9ee] focus:outline-none focus:border-[#fcb907]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] text-gray-500 font-bold uppercase tracking-wider border-b border-[#e7e9ee]">
                <tr>
                  <th className="py-2.5 px-3">Keyword Query</th>
                  <th className="py-2.5 px-2 text-right">Clicks</th>
                  <th className="py-2.5 px-2 text-right">Impr</th>
                  <th className="py-2.5 px-2 text-right">CTR</th>
                  <th className="py-2.5 px-3 text-right">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredQueries.map((q, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#101114]">{q.query}</td>
                    <td className="py-2.5 px-2 text-right font-extrabold text-[#d97706]">{q.clicks}</td>
                    <td className="py-2.5 px-2 text-right text-gray-500">{q.impressions.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right text-gray-700 font-medium">{q.ctr}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      #{q.position}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Landing Pages Table */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#101114]">Top Landing Pages (GA4)</h2>
              <p className="text-xs text-gray-500">Pages capturing initial organic search traffic</p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter URL path..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#e7e9ee] focus:outline-none focus:border-[#fcb907]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] text-gray-500 font-bold uppercase tracking-wider border-b border-[#e7e9ee]">
                <tr>
                  <th className="py-2.5 px-3">Landing Page</th>
                  <th className="py-2.5 px-2 text-right">Sessions</th>
                  <th className="py-2.5 px-2 text-right">Leads</th>
                  <th className="py-2.5 px-3 text-right">Conv %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredPages.map((p, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <Link
                        href={p.path}
                        target="_blank"
                        className="font-bold text-[#101114] hover:text-[#d97706] inline-flex items-center gap-1"
                      >
                        <span>{p.path}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </Link>
                      <div className="text-[10px] text-gray-400 truncate max-w-xs">{p.title}</div>
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-gray-700">{p.sessions}</td>
                    <td className="py-2.5 px-2 text-right font-extrabold text-[#d97706]">{p.leads}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {p.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Device & Country Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Device Breakdown */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-[#101114]">Traffic by Device Category</h2>
          <div className="space-y-3 pt-2">
            {(data?.deviceBreakdown || []).map((dev, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#101114]">
                  <div className="flex items-center gap-2">
                    {dev.device === "Mobile" && <Smartphone className="w-4 h-4 text-[#d97706]" />}
                    {dev.device === "Desktop" && <Monitor className="w-4 h-4 text-blue-500" />}
                    {dev.device === "Tablet" && <Tablet className="w-4 h-4 text-indigo-500" />}
                    <span>{dev.device}</span>
                  </div>
                  <span>
                    {dev.sessions.toLocaleString()} sessions ({dev.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#f0f2f5] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-[#fcb907]"
                    style={{ width: `${dev.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="bg-white border border-[#e7e9ee] rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-[#101114]">Geographic Traffic Distribution</h2>
          <div className="space-y-3 pt-2">
            {(data?.countryBreakdown || []).map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#101114]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                      {c.countryCode}
                    </span>
                    <span>{c.country}</span>
                  </div>
                  <span>
                    {c.sessions.toLocaleString()} sessions ({c.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#f0f2f5] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${c.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GA4 Core Events Reference Card */}
      <div className="bg-[#101114] text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-mono font-bold tracking-widest text-[#fcb907]">
              Conversion Instrumentation
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              GA4 Verified Custom Event Architecture
            </h3>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-emerald-400 font-mono font-bold">
            10 Events Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { ev: "page_view", desc: "Route changes & landing" },
            { ev: "view_item", desc: "Model detail view" },
            { ev: "view_item_list", desc: "Catalog impressions" },
            { ev: "generate_lead", desc: "Verified quote conversion" },
            { ev: "form_start", desc: "Quote wizard begun" },
            { ev: "form_submit", desc: "Form transmission" },
            { ev: "click_phone", desc: "Inbound call dialer" },
            { ev: "click_email", desc: "Email inquiry click" },
            { ev: "upload_floor_plan", desc: "Blueprint submission" },
            { ev: "request_quote", desc: "Model quote request" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="font-mono text-xs font-bold text-[#fcb907]">{item.ev}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
