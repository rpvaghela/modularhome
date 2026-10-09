"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { getPageUrl } from "@/lib/publicData";
import { useConfirm } from "@/context/ConfirmDialogContext";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const confirm = useConfirm();

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    status: "PUBLISHED",
    seoTitle: "",
    metaDescription: "",
  });
  const [createError, setCreateError] = useState("");
  const [lastCreatedPage, setLastCreatedPage] = useState<{ title: string; slug: string; publicUrl: string } | null>(null);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/pages", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setPages(json.data || []);
      }
    } catch (e) {
      console.error("Error fetching pages:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPages();
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setCreateForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
      seoTitle: prev.seoTitle === "" || prev.seoTitle === `${prev.title} | ModularHome.com` ? `${val} | ModularHome.com` : prev.seoTitle,
    }));
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError("");

    const cleanSlug = createForm.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSlug || cleanSlug === "undefined" || cleanSlug === "null") {
      setCreateError("Please provide a valid URL slug (e.g. 'new-home' or 'custom-series').");
      setIsCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          slug: cleanSlug,
        }),
      });
      const json = await res.json();

      if (json.success) {
        const createdSlug = json.data?.slug || cleanSlug;
        const createdTitle = json.data?.title || createForm.title;
        const publicUrl = `/${createdSlug === "home" ? "" : createdSlug}`;
        setLastCreatedPage({ title: createdTitle, slug: createdSlug, publicUrl });
        setCreateModalOpen(false);
        setCreateForm({
          title: "",
          slug: "",
          subtitle: "",
          status: "PUBLISHED",
          seoTitle: "",
          metaDescription: "",
        });
        await fetchPages();
      } else {
        setCreateError(json.error?.message || "Failed to create page in database.");
      }
    } catch (e: any) {
      setCreateError(e.message || "Network error while creating page.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePage = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete CMS Page?",
      message: `Are you sure you want to permanently delete "${title}"? All associated layout blocks, SEO settings, and modular sections will be removed.`,
      confirmText: "Delete Page",
      cancelText: "Keep Page",
      type: "danger",
      icon: "trash",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        await fetchPages();
      } else {
        alert(json.error?.message || "Failed to delete page from database.");
      }
    } catch (e) {
      alert("Failed to delete page from database.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e9ee] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101114] font-serif">
            Page Manager & Route CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1 font-medium">
            Authoritative database management for landing pages, dynamic custom routes, and modular layout sections.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateError("");
            setCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Success alert on recently created page */}
      {lastCreatedPage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>
              <strong>Page Saved to Database!</strong> &ldquo;{lastCreatedPage.title}&rdquo; is now live at{" "}
              <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900">
                {lastCreatedPage.publicUrl}
              </code>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={lastCreatedPage.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
            >
              <span>View Live Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setLastCreatedPage(null)}
              className="p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages by title or slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
          />
          <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#101114] font-bold uppercase tracking-wider font-mono">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-[#6b7280] text-xs flex flex-col items-center gap-2 font-medium">
            <Loader2 className="w-6 h-6 animate-spin text-[#fcb907]" />
            <span>Loading pages from database...</span>
          </div>
        ) : pages.length === 0 ? (
          <div className="py-20 text-center text-[#6b7280] text-xs font-medium">
            No pages found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[750px]">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e7e9ee] text-[#6b7280] font-bold uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-4 px-5">Page Title</th>
                  <th className="py-4 px-5">URL Route</th>
                  <th className="py-4 px-5">Modular Sections</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Last Updated</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e9ee]">
                {pages.map((page) => {
                  const pageId = page._id || page.id;
                  const livePath = getPageUrl(page);
                  const isSlugValid = livePath !== null;
                  const formattedUpdated = (page.updatedAt || page.updated_at || page.createdAt || page.created_at)
                    ? new Date(page.updatedAt || page.updated_at || page.createdAt || page.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not available";

                  return (
                    <tr key={pageId} className="hover:bg-[#f8f9fa]/70 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#101114]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-serif">{page.title}</span>
                          {!isSlugValid && (
                            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-mono font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              Missing Slug
                            </span>
                          )}
                        </div>
                        {page.subtitle && (
                          <span className="block text-[11px] font-normal text-[#6b7280] truncate max-w-xs font-sans mt-0.5">
                            {page.subtitle}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-mono text-[11px]">
                        {isSlugValid ? (
                          <a
                            href={livePath!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6b7280] hover:text-[#d97706] hover:underline inline-flex items-center gap-1 font-bold group"
                            title="Open live page in new tab"
                          >
                            <span>{livePath}</span>
                            <ExternalLink className="w-3 h-3 text-[#9ca3af] group-hover:text-[#d97706]" />
                          </a>
                        ) : (
                          <span className="text-amber-700 italic font-sans text-[11px]">
                            Slug required to preview
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <Link
                          href={`/admin/sections?pageId=${pageId}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-[#b45309] border border-amber-200 font-bold hover:bg-amber-100 transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>
                            {(page.sectionCount ?? page._count?.sections ?? 0)}{" "}
                            {(page.sectionCount === 1 || page._count?.sections === 1) ? "Section" : "Sections"}
                          </span>
                        </Link>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            page.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : page.status === "DRAFT"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {page.status || "PUBLISHED"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[#6b7280] text-[11px] font-medium whitespace-nowrap">
                        {formattedUpdated}
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        {isSlugValid ? (
                          <a
                            href={livePath!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-[#d97706] hover:bg-amber-50 border border-transparent hover:border-amber-200 inline-block transition-all shadow-2xs"
                            title="View Live Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <Link
                            href={`/admin/pages/${pageId}`}
                            className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 border border-amber-200 inline-block transition-all shadow-2xs text-[11px] font-bold"
                            title="Repair Slug"
                          >
                            Fix Slug
                          </Link>
                        )}
                        <Link
                          href={`/admin/pages/${pageId}`}
                          className="p-2 rounded-xl text-[#101114] hover:bg-white hover:border-[#d5d9e0] border border-transparent inline-block transition-all shadow-2xs"
                          title="Edit Page & SEO"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePage(pageId, page.title)}
                          className="p-2 rounded-xl text-[#6b7280] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 inline-block transition-all cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#e7e9ee] animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
              <h3 className="text-base font-bold text-[#101114] font-serif">
                Create New Page
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#101114] hover:bg-[#f8f9fa] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-800 text-xs font-semibold flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#101114] mb-1.5">Page Title *</label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Modern Steel Cabins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#101114] mb-1.5">URL Slug (Path) *</label>
                <div className="flex items-center rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] overflow-hidden focus-within:ring-2 focus-within:ring-[#fcb907] focus-within:bg-white">
                  <span className="px-3 text-[#6b7280] font-mono text-xs border-r border-[#d5d9e0] bg-[#eef0f4] py-2.5">/</span>
                  <input
                    type="text"
                    required
                    value={createForm.slug}
                    onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") })}
                    placeholder="modern-steel-cabins"
                    className="w-full px-3 py-2.5 text-xs font-mono font-bold bg-transparent text-[#101114] focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#6b7280] mt-1 font-mono">
                  Live URL: /{createForm.slug ? createForm.slug.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") : "..."}
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#101114] mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={createForm.subtitle}
                  onChange={(e) => setCreateForm({ ...createForm, subtitle: e.target.value })}
                  placeholder="e.g. Factory-built precision housing engineered for luxury mountain living"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#101114] mb-1.5">Initial Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
                  >
                    <option value="PUBLISHED">Published (Live)</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#101114] mb-1.5">SEO Title Preview</label>
                  <input
                    type="text"
                    value={createForm.seoTitle}
                    onChange={(e) => setCreateForm({ ...createForm, seoTitle: e.target.value })}
                    placeholder="Auto-generated from title"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e7e9ee]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#d5d9e0] text-[#101114] font-bold text-xs hover:bg-[#f8f9fa] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black uppercase tracking-wider text-xs shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Save Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
