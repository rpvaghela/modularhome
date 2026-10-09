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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { getPageUrl } from "@/lib/publicData";
import { useConfirm } from "@/context/ConfirmDialogContext";

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
  category?: string;
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
  testimonials?: Array<{ name: string; location: string; rating: number; text: string; image?: string }>;
  galleryImages?: Array<{ url: string; alt?: string; caption?: string }>;
}

function parseSectionContent(contentStr: any): SchemaFields {
  if (!contentStr) return {};
  if (typeof contentStr === "object") return contentStr;
  try {
    const parsed = JSON.parse(contentStr);
    if (typeof parsed === "object" && parsed !== null) {
      if (Array.isArray(parsed)) {
        return { cards: parsed };
      }
      return {
        ...parsed,
        rawText: parsed.rawText || parsed.text || parsed.content || "",
      };
    }
    return { rawText: String(contentStr) };
  } catch {
    return { rawText: String(contentStr) };
  }
}

function serializeSectionContent(type: string, schema: SchemaFields): string {
  const payload: any = { ...schema };
  return JSON.stringify(payload);
}

function SectionsManager() {
  const searchParams = useSearchParams();
  const initialPageId = searchParams.get("pageId") || "";

  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState(initialPageId);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const confirm = useConfirm();

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [showAdvancedJson, setShowAdvancedJson] = useState(false);

  // Form State
  const [formType, setFormType] = useState("HERO");
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formIsVisible, setFormIsVisible] = useState(true);
  const [formSchema, setFormSchema] = useState<SchemaFields>({
    cards: [{ title: "Precision Steel Framing", description: "Engineered for 150 MPH hurricane winds", link: "/about" }],
    steps: [{ stepNumber: 1, title: "Choose Your Model", description: "Select from 50+ pre-engineered designs" }],
    faqs: [{ question: "How long does factory build take?", answer: "Typically 4 to 8 weeks from engineering approval." }],
    testimonials: [{ name: "David M.", location: "Boulder, CO", rating: 5, text: "Built in 4 weeks. Perfect tolerances and airtight insulation." }],
    galleryImages: [{ url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Modern Exterior", caption: "Custom Barndominium Build" }],
  });
  const [rawJsonText, setRawJsonText] = useState("");

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages", { cache: "no-store" });
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
      const res = await fetch(`/api/admin/sections?pageId=${encodeURIComponent(pageId)}`, { cache: "no-store" });
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

  const currentPage = pages.find((p) => (p.id || p._id) === selectedPageId || p.slug === selectedPageId);
  const liveUrl = currentPage ? getPageUrl(currentPage) : null;

  const openCreateModal = () => {
    setIsEditing(false);
    setActiveSectionId(null);
    setFormType("HERO");
    setFormTitle("");
    setFormSubtitle("");
    setFormIsVisible(true);
    const initialSchema: SchemaFields = {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Modern Modular Residence",
      category: "All",
      ctaLabel: "Explore Models",
      ctaLink: "/buildings",
      secondaryCtaLabel: "Instant Quote",
      secondaryCtaLink: "/quote",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      cards: [
        { title: "Commercial Grade Steel", description: "Cold-formed framing engineered to never warp, rot, or settle.", link: "/about" },
        { title: "Rapid Turnkey Delivery", description: "Manufactured in a climate-controlled facility in 4-8 weeks.", link: "/about" }
      ],
      steps: [
        { stepNumber: 1, title: "Select Floor Plan", description: "Choose from our engineered modular and cabin designs." },
        { stepNumber: 2, title: "Precision Manufacturing", description: "Built indoors with CNC steel cutting and strict quality checks." },
        { stepNumber: 3, title: "Crane Assembly & Handover", description: "Delivered to your site and assembled on your foundation." }
      ],
      faqs: [
        { question: "How long does manufacturing take?", answer: "Most models are completed in factory in 4 to 8 weeks." },
        { question: "Are architectural blueprints included?", answer: "Yes, fully stamped engineering calculations and CAD blueprints are provided." }
      ],
      testimonials: [
        { name: "Robert K.", location: "Denver, CO", rating: 5, text: "The steel frame tolerances were immaculate. Saved 6 months compared to stick-built." }
      ],
      galleryImages: [
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Barndominium Great Room", caption: "Expansive Clearspan Living Area" }
      ],
      rawText: "<h3>Engineered For Generations</h3><p>Our prefabricated steel structures provide unmatched durability, energy efficiency, and modern design aesthetic.</p>"
    };
    setFormSchema(initialSchema);
    setRawJsonText(JSON.stringify(initialSchema, null, 2));
    setShowAdvancedJson(false);
    setModalOpen(true);
  };

  const openEditModal = (section: any) => {
    setIsEditing(true);
    setActiveSectionId(section.id || section._id);
    setFormType(section.type || "HERO");
    setFormTitle(section.title || "");
    setFormSubtitle(section.subtitle || "");
    setFormIsVisible(section.isVisible !== false && section.is_visible !== false);
    const parsed = parseSectionContent(section.content);
    setFormSchema(parsed);
    setRawJsonText(JSON.stringify(parsed, null, 2));
    setShowAdvancedJson(false);
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPageId) return;

    setIsSaving(true);
    setMessage(null);

    let finalContent = "";
    if (showAdvancedJson) {
      try {
        finalContent = rawJsonText.trim();
        // validate JSON
        if (finalContent) JSON.parse(finalContent);
      } catch {
        setMessage({ type: "error", text: "Invalid JSON format in Advanced Settings." });
        setIsSaving(false);
        return;
      }
    } else {
      finalContent = serializeSectionContent(formType, formSchema);
    }

    try {
      if (isEditing && activeSectionId) {
        const res = await fetch(`/api/admin/sections/${encodeURIComponent(activeSectionId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: formType,
            title: formTitle,
            subtitle: formSubtitle,
            content: finalContent,
            isVisible: formIsVisible,
            pageSlug: currentPage?.slug,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setMessage({ type: "success", text: "Section updated in database successfully!" });
          setModalOpen(false);
          await fetchSections(selectedPageId);
        } else {
          setMessage({ type: "error", text: json.error?.message || "Failed to update section in database." });
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
            content: finalContent,
            order: sections.length + 1,
            isVisible: formIsVisible,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setMessage({ type: "success", text: "Section added to database successfully!" });
          setModalOpen(false);
          await fetchSections(selectedPageId);
        } else {
          setMessage({ type: "error", text: json.error?.message || "Failed to create section in database." });
        }
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Network error." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (id: string, currentVis: boolean) => {
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleVisibility",
          sectionId: id,
          isVisible: !currentVis,
          pageSlug: currentPage?.slug,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchSections(selectedPageId);
      }
    } catch (e) {
      console.error("Error toggling section visibility:", e);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    setSections(newSections);

    try {
      await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          reorderedItems: newSections,
          pageSlug: currentPage?.slug,
        }),
      });
    } catch (e) {
      console.error("Error reordering sections:", e);
      await fetchSections(selectedPageId);
    }
  };

  const handleDuplicate = async (section: any) => {
    setDuplicatingId(section.id || section._id);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedPageId,
          type: section.type,
          title: section.title ? `${section.title} (Copy)` : "Section Copy",
          subtitle: section.subtitle || "",
          content: section.content || "",
          order: sections.length + 1,
          isVisible: section.isVisible !== false,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Section duplicated in database!" });
        await fetchSections(selectedPageId);
      }
    } catch (e) {
      console.error("Error duplicating section:", e);
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Section Block?",
      message: "Are you sure you want to delete this section block from the database? This layout change will immediately reflect on the live page.",
      confirmText: "Delete Section",
      cancelText: "Cancel",
      type: "danger",
      icon: "trash",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/sections/${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Section deleted from database." });
        await fetchSections(selectedPageId);
      }
    } catch (e) {
      console.error("Error deleting section:", e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e9ee] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101114] font-serif">
            Modular Section Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1 font-medium">
            Visual block layout manager for homepage and landing pages. Reorder, edit, and configure dynamic content blocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-[#b45309] hover:bg-amber-100 text-xs font-bold transition-all shadow-2xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Page</span>
            </a>
          )}
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section Block</span>
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

      {/* Target Page Selector Banner */}
      <div className="bg-white p-5 rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#fcb907]/20 text-[#101114] shrink-0 font-bold">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b7280] font-mono">
              Currently Editing Sections For:
            </label>
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="mt-1 text-sm font-bold text-[#101114] bg-transparent border-0 font-serif focus:ring-0 cursor-pointer p-0 pr-6"
            >
              {pages.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.title} (/{p.slug})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#f8f9fa] border border-[#d5d9e0] font-bold text-[#101114]">
            {sections.length} Active {sections.length === 1 ? "Block" : "Blocks"}
          </span>
          <Link
            href={`/admin/pages/${selectedPageId}`}
            className="text-xs font-bold text-[#d97706] hover:underline"
          >
            Edit Page SEO & Metadata →
          </Link>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] overflow-hidden p-5 space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-[#6b7280] text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#fcb907]" />
            <span className="font-semibold">Loading section blocks from database...</span>
          </div>
        ) : sections.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#d97706] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#101114]">No Section Blocks Yet</h3>
            <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
              Add modular hero banners, trust cards, video walkthroughs, and FAQ accordions to this page.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fcb907] text-[#101114] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Section</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div
                key={sec.id || sec._id || idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  sec.isVisible
                    ? "bg-white border-[#e7e9ee] hover:border-[#fcb907]/50 shadow-xs"
                    : "bg-[#f8f9fa] border-dashed border-[#d5d9e0] opacity-70"
                }`}
              >
                {/* Left: Reorder Controls + Info */}
                <div className="flex items-center gap-3.5">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 rounded-lg border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f8f9fa] disabled:opacity-30 cursor-pointer shadow-2xs"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 rounded-lg border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f8f9fa] disabled:opacity-30 cursor-pointer shadow-2xs"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-7 h-7 rounded-xl bg-[#f8f9fa] border border-[#d5d9e0] text-[#101114] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#fcb907]/20 text-[#101114] font-mono text-[10px] font-black uppercase">
                        {sec.type}
                      </span>
                      <h4 className="text-sm font-bold text-[#101114] font-serif">
                        {sec.title || "Untitled Section Block"}
                      </h4>
                    </div>
                    {sec.subtitle && (
                      <p className="text-[11px] text-[#6b7280] font-sans mt-0.5 line-clamp-1">
                        {sec.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
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
                    className="p-2 rounded-xl text-[#101114] hover:bg-[#f8f9fa] border border-[#d5d9e0] transition-colors cursor-pointer shadow-2xs"
                    title="Edit Section Content"
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
                    className="p-2 rounded-xl text-[#6b7280] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
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

      {/* Structured Visual Modal (No Raw JSON Editing Required!) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#e7e9ee] animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#101114]">
                  {isEditing ? "Edit Section Block" : "Add Section Block"}
                </h3>
                <p className="text-[11px] text-[#6b7280]">
                  Configure block attributes using visual controls. All changes save directly to the database.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-[#6b7280] hover:text-[#101114] hover:bg-[#f8f9fa] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
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
                  <label className="block font-bold text-[#101114] mb-1.5">Section Headline</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Engineered For Life"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#101114] mb-1.5">Subtitle / Description</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="e.g. Precision manufactured in 4-8 weeks"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
              </div>

              {/* Visual Form Editors for each section type */}
              <div className="space-y-4 p-4 rounded-2xl bg-[#f8f9fa] border border-[#e7e9ee]">
                {/* 1. HERO / CTA */}
                {(formType === "HERO" || formType === "CTA") && (
                  <div className="space-y-3">
                    <ImageUpload
                      label="Background Banner Image"
                      value={formSchema.image || ""}
                      onChange={(url) => setFormSchema({ ...formSchema, image: url })}
                      folder="sections"
                      aspectRatio="16/9"
                      helperText="High-resolution background photo for hero banner"
                    />
                    <div>
                      <label className="block font-bold text-[#101114] mb-1">Banner Image Alt Text</label>
                      <input
                        type="text"
                        value={formSchema.imageAlt || ""}
                        onChange={(e) => setFormSchema({ ...formSchema, imageAlt: e.target.value })}
                        placeholder="Accessibility description"
                        className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                      />
                    </div>
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
                          placeholder="e.g. Instant Quote"
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

                {/* 2. VIDEO */}
                {formType === "VIDEO" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-[#101114] mb-1">YouTube Video URL</label>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#101114] mb-1">CTA Button Label</label>
                        <input
                          type="text"
                          value={formSchema.ctaLabel || ""}
                          onChange={(e) => setFormSchema({ ...formSchema, ctaLabel: e.target.value })}
                          placeholder="e.g. Watch More Tours"
                          className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#101114] mb-1">CTA Button URL</label>
                        <input
                          type="text"
                          value={formSchema.ctaLink || ""}
                          onChange={(e) => setFormSchema({ ...formSchema, ctaLink: e.target.value })}
                          placeholder="e.g. /videos"
                          className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PRODUCT_GRID / COLLECTION_GRID */}
                {(formType === "PRODUCT_GRID" || formType === "COLLECTION_GRID") && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-[#101114] mb-1">Category Filter</label>
                      <select
                        value={formSchema.category || "All"}
                        onChange={(e) => setFormSchema({ ...formSchema, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] font-bold"
                      >
                        <option value="All">All Categories</option>
                        <option value="Cabins">Cabins</option>
                        <option value="Barndominiums">Barndominiums</option>
                        <option value="Modular Homes">Modular Homes</option>
                        <option value="Tiny Homes">Tiny Homes</option>
                        <option value="ADUs & Granny Pods">ADUs & Granny Pods</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#101114] mb-1">View All Button Label</label>
                        <input
                          type="text"
                          value={formSchema.ctaLabel || ""}
                          onChange={(e) => setFormSchema({ ...formSchema, ctaLabel: e.target.value })}
                          placeholder="e.g. Browse All Models"
                          className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#101114] mb-1">View All URL</label>
                        <input
                          type="text"
                          value={formSchema.ctaLink || ""}
                          onChange={(e) => setFormSchema({ ...formSchema, ctaLink: e.target.value })}
                          placeholder="e.g. /buildings"
                          className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TRUST CARDS */}
                {formType === "TRUST" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101114]">Trust & Feature Cards ({formSchema.cards?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormSchema({
                            ...formSchema,
                            cards: [...(formSchema.cards || []), { title: "New Feature", description: "Feature detail description", link: "/about" }],
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
                          title="Remove Card"
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
                            placeholder="Link URL (e.g. /about)"
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

                {/* 5. HOW IT WORKS (Steps) */}
                {formType === "HOW_IT_WORKS" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101114]">Workflow Steps ({formSchema.steps?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormSchema({
                            ...formSchema,
                            steps: [
                              ...(formSchema.steps || []),
                              {
                                stepNumber: (formSchema.steps?.length || 0) + 1,
                                title: "New Step Milestone",
                                description: "Describe this milestone in the building workflow.",
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
                          title="Remove Step"
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
                          placeholder="Step details and instructions"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. FAQ Accordion */}
                {formType === "FAQ" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101114]">FAQ Questions ({formSchema.faqs?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormSchema({
                            ...formSchema,
                            faqs: [...(formSchema.faqs || []), { question: "Frequently asked question?", answer: "Clear, detailed answer for homebuyers." }],
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
                          title="Remove FAQ"
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

                {/* 7. TESTIMONIALS */}
                {formType === "TESTIMONIALS" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101114]">Reviews & Testimonials ({formSchema.testimonials?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormSchema({
                            ...formSchema,
                            testimonials: [
                              ...(formSchema.testimonials || []),
                              { name: "Jane Doe", location: "Austin, TX", rating: 5, text: "Outstanding quality and turnkey delivery." },
                            ],
                          })
                        }
                        className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer"
                      >
                        + Add Review
                      </button>
                    </div>

                    {(formSchema.testimonials || []).map((t, tIdx) => (
                      <div key={tIdx} className="p-3 bg-white rounded-xl border border-[#d5d9e0] space-y-2 relative">
                        <button
                          type="button"
                          onClick={() =>
                            setFormSchema({
                              ...formSchema,
                              testimonials: formSchema.testimonials?.filter((_, i) => i !== tIdx),
                            })
                          }
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-3 gap-2 pr-6">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const newT = [...(formSchema.testimonials || [])];
                              newT[tIdx].name = e.target.value;
                              setFormSchema({ ...formSchema, testimonials: newT });
                            }}
                            placeholder="Customer Name"
                            className="px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={t.location}
                            onChange={(e) => {
                              const newT = [...(formSchema.testimonials || [])];
                              newT[tIdx].location = e.target.value;
                              setFormSchema({ ...formSchema, testimonials: newT });
                            }}
                            placeholder="Location (City, State)"
                            className="px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                          />
                          <select
                            value={t.rating}
                            onChange={(e) => {
                              const newT = [...(formSchema.testimonials || [])];
                              newT[tIdx].rating = Number(e.target.value);
                              setFormSchema({ ...formSchema, testimonials: newT });
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs font-bold"
                          >
                            <option value={5}>★★★★★ (5 Stars)</option>
                            <option value={4}>★★★★☆ (4 Stars)</option>
                            <option value={3}>★★★☆☆ (3 Stars)</option>
                          </select>
                        </div>
                        <textarea
                          rows={2}
                          value={t.text}
                          onChange={(e) => {
                            const newT = [...(formSchema.testimonials || [])];
                            newT[tIdx].text = e.target.value;
                            setFormSchema({ ...formSchema, testimonials: newT });
                          }}
                          placeholder="Customer Review Quote"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 8. GALLERY */}
                {formType === "GALLERY" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101114]">Gallery Images ({formSchema.galleryImages?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormSchema({
                            ...formSchema,
                            galleryImages: [
                              ...(formSchema.galleryImages || []),
                              { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Photo", caption: "Caption" },
                            ],
                          })
                        }
                        className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer"
                      >
                        + Add Image
                      </button>
                    </div>

                    {(formSchema.galleryImages || []).map((img, gIdx) => (
                      <div key={gIdx} className="p-3 bg-white rounded-xl border border-[#d5d9e0] space-y-2 relative">
                        <button
                          type="button"
                          onClick={() =>
                            setFormSchema({
                              ...formSchema,
                              galleryImages: formSchema.galleryImages?.filter((_, i) => i !== gIdx),
                            })
                          }
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ImageUpload
                          label={`Image #${gIdx + 1}`}
                          value={img.url}
                          onChange={(url) => {
                            const newG = [...(formSchema.galleryImages || [])];
                            newG[gIdx].url = url;
                            setFormSchema({ ...formSchema, galleryImages: newG });
                          }}
                          folder="gallery"
                          aspectRatio="16/10"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={img.caption || ""}
                            onChange={(e) => {
                              const newG = [...(formSchema.galleryImages || [])];
                              newG[gIdx].caption = e.target.value;
                              setFormSchema({ ...formSchema, galleryImages: newG });
                            }}
                            placeholder="Caption text"
                            className="px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                          />
                          <input
                            type="text"
                            value={img.alt || ""}
                            onChange={(e) => {
                              const newG = [...(formSchema.galleryImages || [])];
                              newG[gIdx].alt = e.target.value;
                              setFormSchema({ ...formSchema, galleryImages: newG });
                            }}
                            placeholder="Alt text"
                            className="px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 9. FINANCING */}
                {formType === "FINANCING" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#101114] mb-1">CTA Button Label</label>
                        <input
                          type="text"
                          value={formSchema.ctaLabel || ""}
                          onChange={(e) => setFormSchema({ ...formSchema, ctaLabel: e.target.value })}
                          placeholder="e.g. Check Your Financing Options"
                          className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#101114] mb-1">CTA URL</label>
                        <input
                          type="text"
                          value={formSchema.ctaLink || ""}
                          onChange={(e) => setFormSchema({ ...formSchema, ctaLink: e.target.value })}
                          placeholder="e.g. /quote"
                          className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-white text-[#101114]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. RICH CONTENT / Narrative */}
                {(formType === "RICH_CONTENT" || !["HERO", "TRUST", "VIDEO", "HOW_IT_WORKS", "FAQ", "TESTIMONIALS", "GALLERY", "PRODUCT_GRID", "COLLECTION_GRID", "CTA", "FINANCING"].includes(formType)) && (
                  <div>
                    <label className="block font-bold text-[#101114] mb-1.5">Editorial Body Copy (HTML / Narrative Text)</label>
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

              {/* Optional Advanced / Developer Settings (JSON Content) */}
              <div className="border border-[#e7e9ee] rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => {
                    if (!showAdvancedJson) {
                      setRawJsonText(JSON.stringify(formSchema, null, 2));
                    }
                    setShowAdvancedJson(!showAdvancedJson);
                  }}
                  className="w-full px-4 py-3 bg-[#f8f9fa] flex items-center justify-between text-xs font-bold text-[#101114] hover:bg-[#eef0f4] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#d97706]" />
                    <span>Advanced / Developer Settings (JSON Payload)</span>
                  </span>
                  {showAdvancedJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvancedJson && (
                  <div className="p-4 space-y-2 border-t border-[#e7e9ee] bg-[#101114]">
                    <p className="text-[11px] text-[#9ca3af]">
                      Direct raw payload JSON editor for custom integrations or edge cases.
                    </p>
                    <textarea
                      rows={8}
                      value={rawJsonText}
                      onChange={(e) => setRawJsonText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black text-amber-400 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#fcb907]"
                    />
                  </div>
                )}
              </div>

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
                  <span>{isEditing ? "Save Changes to DB" : "Create Section in DB"}</span>
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
    <Suspense fallback={<div className="py-20 text-center text-[#6b7280] text-xs font-medium">Loading section builder...</div>}>
      <SectionsManager />
    </Suspense>
  );
}
