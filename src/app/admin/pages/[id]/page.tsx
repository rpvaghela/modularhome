"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Save,
  ArrowLeft,
  Search,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
  Globe,
  Share2,
  Shield,
  Eye,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { getPageUrl } from "@/lib/publicData";

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string;
  const pageId = rawId ? decodeURIComponent(rawId) : "";

  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/pages/${encodeURIComponent(pageId)}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setPage(json.data);
      } else {
        setMessage({ type: "error", text: json.error?.message || "Page not found in database." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Error loading page details." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pageId) fetchPage();
  }, [pageId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const cleanSlug = (page.slug || page.handle || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSlug || cleanSlug === "undefined" || cleanSlug === "null") {
      setMessage({ type: "error", text: "Please provide a valid URL slug (e.g. 'about' or 'warranty-certifications')." });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/pages/${encodeURIComponent(pageId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...page,
          slug: cleanSlug,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setPage(json.data);
        setMessage({ type: "success", text: "Page saved successfully to database!" });
        // If slug changed, update URL without reload if needed
        if (json.data.slug && json.data.id && json.data.id !== pageId) {
          router.replace(`/admin/pages/${encodeURIComponent(json.data.id)}`);
        }
      } else {
        setMessage({ type: "error", text: json.error?.message || "Failed to update page in database." });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Network error while saving." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-gray-500 text-xs flex flex-col items-center gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-[#d97706]" />
        <span className="font-semibold text-sm text-[#101114]">Loading page data from database...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-[#e7e9ee] p-8 max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-serif font-bold text-[#101114]">Page Not Found</h2>
        <p className="text-xs text-[#6b7280] mt-1">The requested page does not exist in the database.</p>
        <Link href="/admin/pages" className="text-xs font-bold text-[#d97706] hover:underline mt-4 inline-block">
          ← Back to All Pages
        </Link>
      </div>
    );
  }

  const livePath = getPageUrl(page);
  const isSlugValid = livePath !== null;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e9ee] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2.5 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f6f7f9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-[#101114] tracking-tight">
                Edit: {page.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  page.status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : page.status === "DRAFT"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {page.status || "PUBLISHED"}
              </span>
            </div>
            <p className="text-xs text-[#6b7280] font-mono mt-0.5">
              Route: {isSlugValid ? <strong className="text-[#101114]">{livePath}</strong> : <span className="text-red-600 font-bold">Missing valid slug</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSlugValid && (
            <a
              href={livePath!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-[#b45309] hover:bg-amber-100 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Open live page in a new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Page</span>
            </a>
          )}
          <Link
            href={`/admin/sections?pageId=${page.id || pageId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f6f7f9] text-xs font-bold transition-all shadow-2xs"
          >
            <Layers className="w-4 h-4 text-[#d97706]" />
            <span>Manage Sections ({page.sectionCount ?? page.sections?.length ?? 0})</span>
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-top-1 ${
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Page Core Content & SEO */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d97706]" />
              <span>Page Identification & Content</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Page Title *</label>
              <input
                type="text"
                required
                value={page.title || ""}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">URL Slug (Path) *</label>
              <div className="flex items-center rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] overflow-hidden focus-within:ring-2 focus-within:ring-[#fcb907] focus-within:bg-white">
                <span className="px-3 text-[#6b7280] font-mono text-xs border-r border-[#d5d9e0] bg-[#eef0f4] py-2.5">/</span>
                <input
                  type="text"
                  required
                  value={page.slug || ""}
                  onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") })}
                  className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-transparent text-[#101114] focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-[#6b7280] mt-1 font-mono">
                Live URL: /{page.slug === "home" ? "" : (page.slug || "").replace(/[^a-z0-9_-]+/g, "-")}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Subtitle / Tagline</label>
              <input
                type="text"
                value={page.subtitle || ""}
                onChange={(e) => setPage({ ...page, subtitle: e.target.value })}
                placeholder="Brief summary displayed under the page hero heading"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Body Content (HTML / Narrative Text)</label>
              <textarea
                rows={8}
                value={page.content || ""}
                onChange={(e) => setPage({ ...page, content: e.target.value })}
                placeholder="Enter rich text, paragraphs, or editorial HTML content for this page..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs font-mono text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>

          {/* Search Engine Optimization (SEO) */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
              <Search className="w-4 h-4 text-[#d97706]" />
              <span>Search Engine Optimization (SEO)</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#101114]">SEO Meta Title</label>
                <span className={`text-[10px] font-mono ${(page.seoTitle?.length || 0) > 60 ? "text-amber-600 font-bold" : "text-[#6b7280]"}`}>
                  {page.seoTitle?.length || 0} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={page.seoTitle || ""}
                onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
                placeholder="e.g. Modern Steel Cabins | ModularHome.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#101114]">Meta Description</label>
                <span className={`text-[10px] font-mono ${(page.metaDescription?.length || 0) > 160 ? "text-amber-600 font-bold" : "text-[#6b7280]"}`}>
                  {page.metaDescription?.length || 0} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={page.metaDescription || ""}
                onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                placeholder="Concise, compelling description for search engine result snippets..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1.5">Canonical URL</label>
                <input
                  type="text"
                  value={page.canonicalUrl || ""}
                  onChange={(e) => setPage({ ...page, canonicalUrl: e.target.value })}
                  placeholder="https://modularhome.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1.5">Robots / Indexing</label>
                <select
                  value={page.robots || "index, follow"}
                  onChange={(e) => setPage({ ...page, robots: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
                >
                  <option value="index, follow">Index & Follow (Standard)</option>
                  <option value="noindex, follow">No Index, Follow links</option>
                  <option value="noindex, nofollow">No Index, No Follow (Private)</option>
                </select>
              </div>
            </div>
          </div>

          {/* OpenGraph & Social Sharing */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
              <Share2 className="w-4 h-4 text-[#d97706]" />
              <span>Social Media Previews (OpenGraph / Twitter)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1.5">OG Title</label>
                <input
                  type="text"
                  value={page.ogTitle || ""}
                  onChange={(e) => setPage({ ...page, ogTitle: e.target.value })}
                  placeholder="Fallback to SEO Title if empty"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1.5">OG Description</label>
                <input
                  type="text"
                  value={page.ogDescription || ""}
                  onChange={(e) => setPage({ ...page, ogDescription: e.target.value })}
                  placeholder="Fallback to Meta Description if empty"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>
            </div>

            <ImageUpload
              label="OG Social Share Image (1200x630)"
              value={page.ogImage || ""}
              onChange={(url) => setPage({ ...page, ogImage: url })}
              folder="pages"
              aspectRatio="16/9"
              helperText="Image displayed when this page is shared on Facebook, Twitter, iMessage, and LinkedIn."
            />
          </div>
        </div>

        {/* Right 1 Col: Status & Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
              Status & Publishing
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Page Status</label>
              <select
                value={page.status || "PUBLISHED"}
                onChange={(e) => setPage({ ...page, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
              >
                <option value="PUBLISHED">Published (Live to Public)</option>
                <option value="DRAFT">Draft (Admin Only)</option>
                <option value="ARCHIVED">Archived (Unpublished)</option>
              </select>
            </div>

            <ImageUpload
              label="Featured Hero Banner"
              value={page.featuredImage || ""}
              onChange={(url) => setPage({ ...page, featuredImage: url })}
              folder="pages"
              aspectRatio="16/9"
              helperText="Main hero header background image."
            />

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Hero Image Alt Text</label>
              <input
                type="text"
                value={page.imageAlt || ""}
                onChange={(e) => setPage({ ...page, imageAlt: e.target.value })}
                placeholder="Accessibility description for hero image"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            {/* Authoritative Database Timestamps */}
            <div className="pt-3 border-t border-[#e7e9ee] text-[11px] text-[#6b7280] space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span>Created:</span>
                <strong className="text-[#101114]">
                  {(page.createdAt || page.created_at)
                    ? new Date(page.createdAt || page.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "Not available"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <strong className="text-[#101114]">
                  {(page.updatedAt || page.updated_at)
                    ? new Date(page.updatedAt || page.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "Not available"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Published:</span>
                <strong className="text-[#101114]">
                  {(page.publishedAt || page.published_at)
                    ? new Date(page.publishedAt || page.published_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
                    : (page.status === "PUBLISHED" ? "Active" : "Unpublished")}
                </strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes to Database</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
