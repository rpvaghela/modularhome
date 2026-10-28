"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";

export default function AdminFooterSettingsPage() {
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
        const d = json.data;
        if (!d.socialLinks) d.socialLinks = {};
        if (!d.footerLinks) d.footerLinks = [];
        setSettings(d);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load footer settings." });
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
        setMessage({ type: "success", text: "Footer configuration saved successfully!" });
      } else {
        setMessage({ type: "error", text: json.error?.message || "Failed to save footer settings." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error." });
    } finally {
      setIsSaving(false);
    }
  };

  const addFooterLink = () => {
    const current = settings?.footerLinks || [];
    setSettings({
      ...settings,
      footerLinks: [...current, { label: "New Link", href: "/" }],
    });
  };

  const updateFooterLink = (index: number, field: "label" | "href", val: string) => {
    const current = [...(settings?.footerLinks || [])];
    current[index] = { ...current[index], [field]: val };
    setSettings({ ...settings, footerLinks: current });
  };

  const removeFooterLink = (index: number) => {
    const current = [...(settings?.footerLinks || [])];
    current.splice(index, 1);
    setSettings({ ...settings, footerLinks: current });
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500 text-xs flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#e11d1d]" />
        <span>Loading Footer settings...</span>
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
              Footer & Social Settings
            </h1>
            <p className="text-xs text-[#6b7280] mt-0.5 font-medium">
              Manage footer brand mission text, social media channels, direct contact info, and custom quick links.
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
            <ExternalLink className="w-4 h-4 text-[#e11d1d]" />
            <span>View Public Site</span>
          </a>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e11d1d] hover:bg-[#b91c1c] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Footer</span>
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
        <Link href="/admin/settings/header" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">Header</Link>
        <Link href="/admin/settings/navigation" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">Navigation</Link>
        <Link href="/admin/settings/footer" className="px-3 py-1.5 rounded-lg bg-[#101114] text-white">Footer</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Brand Mission & Address */}
        <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
            Company Bio & Physical Headquarters
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1.5">Footer Brand Summary</label>
            <textarea
              rows={4}
              value={settings?.footerText || ""}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              placeholder="e.g. BombShelters.com leads the American prefabricated housing movement..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1.5">Headquarters / Plant Address</label>
            <input
              type="text"
              value={settings?.address || ""}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Factory Headquarters, IN & Nationwide Delivery"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Support Phone</label>
              <input
                type="text"
                value={settings?.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Support Email</label>
              <input
                type="email"
                value={settings?.email || ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
              />
            </div>
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
            Social Media Handles & Links
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1">YouTube Channel URL</label>
            <input
              type="text"
              value={settings?.socialLinks?.youtube || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                })
              }
              placeholder="https://www.youtube.com/@modularhome"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1">Facebook URL</label>
            <input
              type="text"
              value={settings?.socialLinks?.facebook || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                })
              }
              placeholder="https://www.facebook.com/modularhome"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1">Instagram URL</label>
            <input
              type="text"
              value={settings?.socialLinks?.instagram || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                })
              }
              placeholder="https://www.instagram.com/modularhome"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1">TikTok URL</label>
            <input
              type="text"
              value={settings?.socialLinks?.tiktok || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, tiktok: e.target.value },
                })
              }
              placeholder="https://www.tiktok.com/@modularhome"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101114] mb-1">X (Twitter) URL</label>
            <input
              type="text"
              value={settings?.socialLinks?.x || settings?.socialLinks?.twitter || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, x: e.target.value, twitter: e.target.value },
                })
              }
              placeholder="https://x.com/modularhome"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-mono text-[#101114] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
          </div>
        </div>

        {/* Custom Quick Links Column */}
        <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
            <div>
              <h2 className="text-sm font-serif font-bold text-[#101114]">
                Custom Footer Quick Links
              </h2>
              <p className="text-[11px] text-[#6b7280]">
                Override or customize the list of links displayed in the Footer Quick Links column.
              </p>
            </div>
            <button
              type="button"
              onClick={addFooterLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f6f7f9] hover:bg-[#eaecee] text-[#101114] text-xs font-bold border border-[#d5d9e0] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#e11d1d]" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {(!settings?.footerLinks || settings.footerLinks.length === 0) ? (
              <p className="text-xs text-[#6b7280] italic py-3">
                No custom footer links configured. Default system links (Home, Models, Floor Plans, Upload, Videos, About, Contact) are actively displayed.
              </p>
            ) : (
              settings.footerLinks.map((link: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#f8f9fa] border border-[#e7e9ee] rounded-xl">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateFooterLink(idx, "label", e.target.value)}
                      placeholder="Link Label"
                      className="px-3 py-1.5 rounded-lg border border-[#d5d9e0] bg-white text-xs text-[#101114] font-bold focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateFooterLink(idx, "href", e.target.value)}
                      placeholder="Target URL (e.g. /floor-plans)"
                      className="px-3 py-1.5 rounded-lg border border-[#d5d9e0] bg-white text-xs font-mono text-[#101114] focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFooterLink(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
