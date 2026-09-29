"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Plus,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileText,
  ImageIcon,
  ExternalLink,
  Copy,
  Code,
  Layout,
  HelpCircle,
  Play,
  Star,
  Check,
  CreditCard,
  Grid,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const SECTION_TYPES = [
  { value: "HERO", label: "Hero Banner", desc: "Top headline with background image and call-to-actions" },
  { value: "TRUST", label: "Trust & Feature Cards", desc: "Key benefits, guarantee badges, and credibility points" },
  { value: "PRODUCT_GRID", label: "Models / Products Showcase", desc: "Interactive grid of home models filtered by category" },
  { value: "COLLECTION_GRID", label: "Categories / Series Grid", desc: "Architectural series and collections showcase" },
  { value: "HOW_IT_WORKS", label: "How It Works (Steps)", desc: "Numbered step-by-step building & delivery workflow" },
  { value: "FINANCING", label: "Financing & Budget Callout", desc: "Payment estimation and financing partner details" },
  { value: "VIDEO", label: "Video Showcase", desc: "Featured YouTube building tour or factory walkthrough" },
  { value: "TESTIMONIALS", label: "Customer Reviews", desc: "Homeowner testimonials with ratings and photos" },
  { value: "FAQ", label: "Frequently Asked Questions", desc: "Accordion style Q&A for buyer information" },
  { value: "GALLERY", label: "Image Gallery Carousel", desc: "Architectural photography and rendering gallery" },
  { value: "CTA", label: "Call To Action Banner", desc: "High-conversion quote request banner" },
  { value: "RICH_CONTENT", label: "Rich Text / Narrative", desc: "Long-form editorial copy, specifications, and tables" },
];

interface SchemaFields {
  heading?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  videoUrl?: string;
  videoTitle?: string;
  rawText?: string;
  cards?: Array<{ title: string; description: string; image?: string; link?: string; alt?: string }>;
  steps?: Array<{ stepNumber: number | string; title: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  testimonials?: Array<{ name: string; location: string; rating: number; text: string }>;
}

function parseSectionContent(contentStr: any): SchemaFields {
  if (!contentStr) return {};
  if (typeof contentStr === "object") return contentStr;
  try {
    const parsed = JSON.parse(contentStr);
    if (typeof parsed === "object" && parsed !== null) return parsed;
    return { rawText: String(contentStr) };
  } catch {
    return { rawText: String(contentStr) };
  }
}

function SectionsManager() {
  const searchParams = useSearchParams();
  const initialPageId = searchParams.get("pageId") || "";

  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState(initialPageId);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState(false);

  // Form State
  const [formType, setFormType] = useState("HERO");
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formIsVisible, setFormIsVisible] = useState(true);
  const [formSchema, setFormSchema] = useState<SchemaFields>({
    cards: [{ title: "Precision Steel Framing", description: "Engineered for 150 MPH winds", link: "" }],
    steps: [{ stepNumber: 1, title: "Choose Your Model", description: "Select from 50+ pre-engineered designs" }],
    faqs: [{ question: "How long does factory build take?", answer: "Typically 4-8 weeks." }],
    testimonials: [{ name: "David M.", location: "Colorado", rating: 5, text: "Built in 4 weeks. Perfect tolerances." }],
  });
  const [rawJsonText, setRawJsonText] = useState("");

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setPages(json.data);
        if (initialPageId) {
          const matched = json.data.find(
            (p: any) => (p.id || p._id) === initialPageId || p.slug === initialPageId
          );
          if (matched) {
            setSelectedPageId(matched.id || matched._id);
          } else {
            setSelectedPageId(initialPageId);
          }
        } else if (!selectedPageId) {
          setSelectedPageId(json.data[0].id || json.data[0]._id);
        }
      }
    } catch (e) {
      console.error("Error fetching pages:", e);
    }
  };

  const fetchSections = async (pageId: string) => {
    if (!pageId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/sections?pageId=${pageId}`);
      const json = await res.json();
      if (json.success) {
        setSections(json.data || []);
      }
    } catch (e) {
      console.error("Error fetching sections:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPageId) {
      fetchSections(selectedPageId);
    }
  }, [selectedPageId]);

  const openCreateModal = () => {
    setIsEditing(false);
    setActiveSectionId(null);
    setFormType("HERO");
    setFormTitle("");
    setFormSubtitle("");
    setFormIsVisible(true);
    setFormSchema({
      image: "",
      imageAlt: "",
      ctaLabel: "Explore Models",
      ctaLink: "/buildings",
      secondaryCtaLabel: "Instant Quote",
      secondaryCtaLink: "/quote",
      cards: [
        { title: "Commercial Grade Steel", description: "Zero warping or mold", link: "/about" },
        { title: "Rapid Factory Build", description: "Delivered ready to assemble in 4-8 weeks", link: "/about" }
      ],
      steps: [
        { stepNumber: 1, title: "Select Floor Plan", description: "Choose size and layout" },
        { stepNumber: 2, title: "Precision Manufacturing", description: "Built in our controlled facility" }
      ],
      faqs: [
        { question: "What is included with the structure?", answer: "Complete engineered framing, blueprints, and assembly schematics." }
      ],
      testimonials: [
        { name: "Sarah K.", location: "Texas", rating: 5, text: "Seamless county permitting and great engineering support." }
      ],
    });
    setJsonMode(false);
    setModalOpen(true);
  };

  const openEditModal = (sec: any) => {
    setIsEditing(true);
    setActiveSectionId(sec.id || sec._id);
    setFormType(sec.type || "HERO");
    setFormTitle(sec.title || "");
    setFormSubtitle(sec.subtitle || "");
    setFormIsVisible(sec.isVisible !== false && sec.is_visible !== false);

    const parsed = parseSectionContent(sec.content);
    setFormSchema(parsed);
    setRawJsonText(typeof sec.content === "object" ? JSON.stringify(sec.content, null, 2) : sec.content || "");
    setJsonMode(false);
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPageId) return;
    setIsSaving(true);
    setMessage(null);

    try {
      let finalContentString = "";
      if (jsonMode) {
        finalContentString = rawJsonText;
      } else {
        const payload: any = {
          ...formSchema,
          rawText: formSchema.rawText || "",
        };
        finalContentString = JSON.stringify(payload);
      }

      if (isEditing && activeSectionId) {
        const res = await fetch(`/api/admin/sections/${activeSectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: formType,
            title: formTitle,
            subtitle: formSubtitle,
            content: finalContentString,
            isVisible: formIsVisible,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setMessage({ type: "success", text: "Section updated successfully!" });
          setModalOpen(false);
          await fetchSections(selectedPageId);
        } else {
          alert(json.error?.message || "Failed to update section.");
        }
      } else {
        const res = await fetch("/api/admin/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageId: selectedPageId,
            type: formType,
            title: formTitle,
            subtitle: formSubtitle,
            content: finalContentString,
            displayOrder: sections.length + 1,
            isVisible: formIsVisible,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setMessage({ type: "success", text: "Section created successfully!" });
          setModalOpen(false);
          await fetchSections(selectedPageId);
        } else {
          alert(json.error?.message || "Failed to create section.");
        }
      }
    } catch (err: any) {
      alert(err.message || "Network error while saving section.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleVisibility",
          sectionId: id,
          isVisible: !currentVisible,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSections((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isVisible: !currentVisible } : s))
        );
      }
    } catch (e) {
      alert("Failed to toggle visibility.");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const reordered = newSections.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    setSections(newSections.map((item, idx) => ({ ...item, order: idx + 1, displayOrder: idx + 1 })));

    try {
      await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          reorderedItems: reordered,
        }),
      });
    } catch (e) {
      alert("Failed to save section order.");
    }
  };

  const handleDuplicate = async (sec: any) => {
    if (!selectedPageId) return;
    const secId = sec.id || sec._id;
    setDuplicatingId(secId);

    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedPageId,
          type: sec.type,
          title: sec.title ? `${sec.title} (Copy)` : "Copied Section",
          subtitle: sec.subtitle || "",
          content: sec.content || "",
          displayOrder: sections.length + 1,
          isVisible: sec.isVisible !== false,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchSections(selectedPageId);
      }
    } catch {
      alert("Failed to duplicate section.");
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section block?")) return;
    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setSections((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert("Failed to delete section.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e9ee] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101114] font-serif">
            Modular Section & Block Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1 font-medium">
            Visual, schema-driven block manager. Configure hero headers, feature cards, video tours, FAQs, and testimonials without editing JSON.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {selectedPageId && (
            <a
              href={(() => {
                const selectedPage = pages.find((p) => (p.id || p._id) === selectedPageId);
                const rawSlug = selectedPage?.slug || selectedPage?.handle || selectedPageId;
                return `/${rawSlug === "home" ? "" : rawSlug}`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f6f7f9] text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Preview live page in new tab"
            >
              <ExternalLink className="w-4 h-4 text-[#d97706]" />
              <span>Preview Live Page</span>
            </a>
          )}
          <button
            onClick={openCreateModal}
            disabled={!selectedPageId}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section Block</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Page Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#101114] uppercase tracking-wider font-mono">Select Page:</span>
          <select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-xs text-[#101114] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
          >
            {pages.map((p) => {
              const rawSlug = p.slug || p.handle || p.id;
              return (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.title} (/{rawSlug === "home" ? "" : rawSlug})
                </option>
              );
            })}
          </select>
        </div>

        <div className="text-xs text-[#6b7280] font-medium">
          Configured: <span className="font-bold text-[#101114]">{sections.length} sections</span>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-[#6b7280] text-xs flex flex-col items-center gap-2 font-medium">
            <Loader2 className="w-6 h-6 animate-spin text-[#fcb907]" />
            <span>Loading sections...</span>
          </div>
        ) : sections.length === 0 ? (
          <div className="py-20 text-center text-[#6b7280] text-xs font-medium">
            No section blocks configured for this page yet. Click &quot;Add Section Block&quot; above to create one.
          </div>
        ) : (
          <div className="divide-y divide-[#e7e9ee]">
            {sections.map((sec, idx) => (
              <div
                key={sec.id || sec._id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                  sec.isVisible ? "hover:bg-[#f8f9fa]/70" : "bg-[#f8f9fa]/40 opacity-60"
                }`}
              >
                {/* Left: Reorder arrows + Order badge + Title */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded-lg text-[#6b7280] hover:text-[#101114] disabled:opacity-20 hover:bg-[#e7e9ee] transition-colors cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === sections.length - 1}
                      className="p-1 rounded-lg text-[#6b7280] hover:text-[#101114] disabled:opacity-20 hover:bg-[#e7e9ee] transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-[#f8f9fa] border border-[#d5d9e0] font-mono text-xs font-bold flex items-center justify-center text-[#101114] shrink-0">
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#101114] text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                        {sec.type}
                      </span>
                      <span className="font-bold text-xs text-[#101114] truncate font-sans">
                        {sec.title || "(Untitled Section)"}
                      </span>
                    </div>
                    {sec.subtitle && (
                      <p className="text-[11px] text-[#6b7280] truncate mt-0.5">
                        {sec.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDuplicate(sec)}
                    disabled={duplicatingId === (sec.id || sec._id)}
                    className="p-2 rounded-xl text-[#6b7280] hover:text-[#101114] hover:bg-[#f8f9fa] border border-transparent hover:border-[#d5d9e0] transition-colors cursor-pointer"
                    title="Duplicate Section"
                  >
                    {duplicatingId === (sec.id || sec._id) ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#fcb907]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => openEditModal(sec)}
                    className="p-2 rounded-xl text-[#6b7280] hover:text-[#101114] hover:bg-[#f8f9fa] border border-transparent hover:border-[#d5d9e0] transition-colors cursor-pointer"
                    title="Edit Section"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleVisibility(sec.id || sec._id, sec.isVisible)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      sec.isVisible
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-[#f8f9fa] text-[#6b7280] border border-[#d5d9e0] hover:bg-[#e7e9ee]"
                    }`}
                  >
                    {sec.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-[#6b7280]" />}
                    <span>{sec.isVisible ? "Visible" : "Hidden"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(sec.id || sec._id)}
                    className="p-2 rounded-xl text-[#6b7280] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schema-Driven Modal (No Raw JSON Required!) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#e7e9ee] animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#101114]">
                  {isEditing ? "Edit Section Block" : "Add Section Block"}
                </h3>
                <p className="text-[11px] text-[#6b7280]">
                  Configure fields easily using structured forms.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setJsonMode(!jsonMode)}
                  className="px-2.5 py-1 rounded-lg border border-[#d5d9e0] text-[10px] font-mono font-bold text-[#6b7280] hover:text-[#101114] hover:bg-[#f8f9fa]"
                >
                  {jsonMode ? "Form Mode" : "JSON Mode"}
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl text-[#6b7280] hover:text-[#101114] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              {/* Type selector */}
              <div>
                <label className="block font-bold text-[#101114] mb-1.5">Section Type *</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
                >
                  {SECTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label} ({t.value})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#101114] mb-1.5">Section Title / Heading</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Precision Engineered For Life"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#101114] mb-1.5">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="e.g. Factory-built in 4-8 weeks"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
              </div>

              {jsonMode ? (
                /* Optional Advanced JSON Mode */
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-[#101114]">Advanced JSON Payload</label>
                    <span className="text-[10px] text-amber-700 font-mono font-bold">Debug / Dev Mode</span>
                  </div>
                  <textarea
                    rows={10}
                    value={rawJsonText}
                    onChange={(e) => setRawJsonText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#101114] text-amber-400 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
              ) : (
                /* Schema-driven form editors */
                <div className="space-y-4 p-4 rounded-2xl bg-[#f8f9fa] border border-[#e7e9ee]">
                  {/* HERO & CTA Fields */}
                  {(formType === "HERO" || formType === "CTA") && (
                    <div className="space-y-3">
                      <ImageUpload
                        label="Background Banner Image"
                        value={formSchema.image || ""}
                        onChange={(url) => setFormSchema({ ...formSchema, image: url })}
                        folder="sections"
                        aspectRatio="16/9"
                        helperText="High-resolution hero banner or background photo"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#101114] mb-1">Primary Button Label</label>
                          <input
                            type="text"
                            value={formSchema.ctaLabel || ""}
                            onChange={(e) => setFormSchema({ ...formSchema, ctaLabel: e.target.value })}
                            placeholder="e.g. Explore Models"
                            className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#101114] mb-1">Primary Button URL</label>
                          <input
                            type="text"
                            value={formSchema.ctaLink || ""}
                            onChange={(e) => setFormSchema({ ...formSchema, ctaLink: e.target.value })}
                            placeholder="e.g. /buildings"
                            className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#101114] mb-1">Secondary Button Label</label>
                          <input
                            type="text"
                            value={formSchema.secondaryCtaLabel || ""}
                            onChange={(e) => setFormSchema({ ...formSchema, secondaryCtaLabel: e.target.value })}
                            placeholder="e.g. Calculate Quote"
                            className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#101114] mb-1">Secondary Button URL</label>
                          <input
                            type="text"
                            value={formSchema.secondaryCtaLink || ""}
                            onChange={(e) => setFormSchema({ ...formSchema, secondaryCtaLink: e.target.value })}
                            placeholder="e.g. /quote"
                            className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIDEO Fields */}
                  {formType === "VIDEO" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-[#101114] mb-1">YouTube Video URL / Embed</label>
                        <input
                          type="text"
                          value={formSchema.videoUrl || ""}
                          onChange={(e) => setFormSchema({ ...formSchema, videoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                        />
                      </div>
                      <ImageUpload
                        label="Video Preview Thumbnail"
                        value={formSchema.image || ""}
                        onChange={(url) => setFormSchema({ ...formSchema, image: url })}
                        folder="videos"
                        aspectRatio="16/9"
                        helperText="Custom thumbnail shown prior to playback"
                      />
                    </div>
                  )}

                  {/* TRUST / FEATURE CARDS */}
                  {(formType === "TRUST" || formType === "PRODUCT_GRID") && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#101114]">Feature Cards ({formSchema.cards?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormSchema({
                              ...formSchema,
                              cards: [...(formSchema.cards || []), { title: "New Feature", description: "Feature detail description", link: "" }],
                            })
                          }
                          className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer"
                        >
                          + Add Card
                        </button>
                      </div>

                      {(formSchema.cards || []).map((card, cIdx) => (
                        <div key={cIdx} className="p-3 bg-white rounded-xl border border-[#d5d9e0] space-y-2 relative">
                          <button
                            type="button"
                            onClick={() =>
                              setFormSchema({
                                ...formSchema,
                                cards: formSchema.cards?.filter((_, i) => i !== cIdx),
                              })
                            }
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const newCards = [...(formSchema.cards || [])];
                                newCards[cIdx].title = e.target.value;
                                setFormSchema({ ...formSchema, cards: newCards });
                              }}
                              placeholder="Card Title"
                              className="px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={card.link || ""}
                              onChange={(e) => {
                                const newCards = [...(formSchema.cards || [])];
                                newCards[cIdx].link = e.target.value;
                                setFormSchema({ ...formSchema, cards: newCards });
                              }}
                              placeholder="Link URL (e.g. /buildings)"
                              className="px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                            />
                          </div>
                          <input
                            type="text"
                            value={card.description}
                            onChange={(e) => {
                              const newCards = [...(formSchema.cards || [])];
                              newCards[cIdx].description = e.target.value;
                              setFormSchema({ ...formSchema, cards: newCards });
                            }}
                            placeholder="Card Description"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* HOW IT WORKS (Steps) */}
                  {formType === "HOW_IT_WORKS" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#101114]">Steps Workflow ({formSchema.steps?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormSchema({
                              ...formSchema,
                              steps: [
                                ...(formSchema.steps || []),
                                {
                                  stepNumber: (formSchema.steps?.length || 0) + 1,
                                  title: "New Step",
                                  description: "Describe this milestone in the construction process.",
                                },
                              ],
                            })
                          }
                          className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer"
                        >
                          + Add Step
                        </button>
                      </div>

                      {(formSchema.steps || []).map((step, sIdx) => (
                        <div key={sIdx} className="p-3 bg-white rounded-xl border border-[#d5d9e0] space-y-2 relative">
                          <button
                            type="button"
                            onClick={() =>
                              setFormSchema({
                                ...formSchema,
                                steps: formSchema.steps?.filter((_, i) => i !== sIdx),
                              })
                            }
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex items-center gap-2 pr-6">
                            <span className="w-6 h-6 rounded-full bg-[#fcb907] font-bold text-[10px] flex items-center justify-center shrink-0">
                              {sIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const newSteps = [...(formSchema.steps || [])];
                                newSteps[sIdx].title = e.target.value;
                                setFormSchema({ ...formSchema, steps: newSteps });
                              }}
                              placeholder="Step Title"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs font-bold"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => {
                              const newSteps = [...(formSchema.steps || [])];
                              newSteps[sIdx].description = e.target.value;
                              setFormSchema({ ...formSchema, steps: newSteps });
                            }}
                            placeholder="Step details and customer instructions"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FAQ Accordion Editor */}
                  {formType === "FAQ" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#101114]">FAQ Q&A List ({formSchema.faqs?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormSchema({
                              ...formSchema,
                              faqs: [...(formSchema.faqs || []), { question: "Frequently asked question?", answer: "Clear detailed answer." }],
                            })
                          }
                          className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer"
                        >
                          + Add Question
                        </button>
                      </div>

                      {(formSchema.faqs || []).map((faq, fIdx) => (
                        <div key={fIdx} className="p-3 bg-white rounded-xl border border-[#d5d9e0] space-y-2 relative">
                          <button
                            type="button"
                            onClick={() =>
                              setFormSchema({
                                ...formSchema,
                                faqs: formSchema.faqs?.filter((_, i) => i !== fIdx),
                              })
                            }
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...(formSchema.faqs || [])];
                              newFaqs[fIdx].question = e.target.value;
                              setFormSchema({ ...formSchema, faqs: newFaqs });
                            }}
                            placeholder="Question"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs font-bold pr-6"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = [...(formSchema.faqs || [])];
                              newFaqs[fIdx].answer = e.target.value;
                              setFormSchema({ ...formSchema, faqs: newFaqs });
                            }}
                            placeholder="Answer"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RICH CONTENT / NARRATIVE */}
                  {(formType === "RICH_CONTENT" || !["HERO", "TRUST", "VIDEO", "HOW_IT_WORKS", "FAQ"].includes(formType)) && (
                    <div>
                      <label className="block font-bold text-[#101114] mb-1.5">Narrative Body Copy (HTML / Text)</label>
                      <textarea
                        rows={6}
                        value={formSchema.rawText || ""}
                        onChange={(e) => setFormSchema({ ...formSchema, rawText: e.target.value })}
                        placeholder="Enter narrative text, specifications, or paragraph copy..."
                        className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white font-mono text-xs text-[#101114]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Visibility toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsVisible"
                  checked={formIsVisible}
                  onChange={(e) => setFormIsVisible(e.target.checked)}
                  className="rounded text-[#fcb907] focus:ring-[#fcb907] cursor-pointer"
                />
                <label htmlFor="formIsVisible" className="font-bold text-[#101114] cursor-pointer">
                  Section is visible on live page
                </label>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex justify-end gap-2.5 border-t border-[#e7e9ee]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[#101114] font-bold hover:bg-[#f8f9fa] border border-[#d5d9e0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-bold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? "Save Changes" : "Create Section"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSectionsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#6b7280] text-xs">Loading sections manager...</div>}>
      <SectionsManager />
    </Suspense>
  );
}
