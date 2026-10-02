"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2, Globe, Layout, ExternalLink } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminHeaderSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings(json.data);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load header settings." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Header settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: json.error?.message || "Failed to save header settings." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500 text-xs flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#fcb907]" />
        <span>Loading Header configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e9ee] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="p-2.5 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f6f7f9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#101114] tracking-tight">
              Header & Top Bar Settings
            </h1>
            <p className="text-xs text-[#6b7280] mt-0.5 font-medium">
              Configure brand logo, header CTA button, announcement banner, and contact triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f6f7f9] text-xs font-bold transition-all shadow-2xs"
          >
            <ExternalLink className="w-4 h-4 text-[#d97706]" />
            <span>View Public Site</span>
          </a>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Header</span>
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

      {/* Tabs bar */}
      <div className="flex items-center gap-2 border-b border-[#e7e9ee] pb-3 text-xs font-bold font-mono">
        <Link href="/admin/settings" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">All Settings</Link>
        <Link href="/admin/settings/header" className="px-3 py-1.5 rounded-lg bg-[#101114] text-white">Header</Link>
        <Link href="/admin/settings/navigation" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">Navigation</Link>
        <Link href="/admin/settings/footer" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">Footer</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Logo & Branding */}
        <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
            Branding & Logo
          </h2>

          <ImageUpload
            label="Header Brand Logo"
            value={settings?.logoUrl || "/newmodularlogo.png"}
            onChange={(url) => setSettings({ ...settings, logoUrl: url })}
            folder="branding"
            aspectRatio="logo"
            helperText="Brand logo displayed in navbar header. Transparent background recommended."
          />

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1.5">Company Display Name</label>
            <input
              type="text"
              value={settings?.companyName || ""}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
            />
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
            <h2 className="text-sm font-serif font-bold text-[#101114]">
              Announcement Bar
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="annEnabled"
                checked={settings?.announcementEnabled !== false}
                onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                className="rounded text-[#fcb907] focus:ring-[#fcb907] cursor-pointer"
              />
              <label htmlFor="annEnabled" className="text-xs font-bold text-[#101114] cursor-pointer">
                Enabled
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1.5">Banner Announcement Text</label>
            <input
              type="text"
              value={settings?.announcementText || ""}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              placeholder="e.g. Factory-Direct Precision Modular Homes • 2026 Models Available"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1.5">Banner Target URL / Action</label>
            <input
              type="text"
              value={settings?.announcementLink || ""}
              onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
              placeholder="e.g. /buildings"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
            />
          </div>
        </div>

        {/* Header CTA & Contact Info */}
        <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4 lg:col-span-2">
          <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
            Header Actions & Quick Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Header CTA Button Label</label>
              <input
                type="text"
                value={settings?.ctaLabel || ""}
                onChange={(e) => setSettings({ ...settings, ctaLabel: e.target.value })}
                placeholder="e.g. Get a Free Quote"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Header CTA Button URL</label>
              <input
                type="text"
                value={settings?.ctaLink || ""}
                onChange={(e) => setSettings({ ...settings, ctaLink: e.target.value })}
                placeholder="e.g. /quote"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Direct Phone Hotline</label>
              <input
                type="text"
                value={settings?.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+1 (812) 595-4033"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Support Email</label>
              <input
                type="email"
                value={settings?.email || ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="support@modularhome.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
