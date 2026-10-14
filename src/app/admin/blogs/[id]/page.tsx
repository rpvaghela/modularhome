"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  BookOpen,
  Image as ImageIcon,
  Video,
  Layers,
  Quote,
  Home,
  Bed,
  Bath,
  DollarSign,
  Plus,
  Trash2,
  Sliders,
  ExternalLink,
  Calendar,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const POPULAR_CATEGORIES = [
  "Modular Cabins",
  "Modular Homes & Prefab Homes",
  "Modular Construction",
  "Building Guides",
  "Barndominiums",
  "Tiny Homes & ADUs",
  "Financing & Pricing",
];

export default function AdminEditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params?.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [categoriesText, setCategoriesText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!blogId) return;
    fetch(`/api/admin/blogs/${encodeURIComponent(blogId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const b = json.data;
          
          let parsedFeatures: Array<{ title: string; desc: string }> = [];
          if (Array.isArray(b.customFeatures)) {
            parsedFeatures = b.customFeatures;
          } else if (Array.isArray(b.custom_features)) {
            parsedFeatures = b.custom_features;
          } else {
            parsedFeatures = [
              { title: b.sqft || "1,750 Sq Ft", desc: "Spacious layout with open-concept design and high volume ceilings." },
              { title: b.bedrooms || "3 Bed", desc: "Comfortable bedrooms designed for family living, guests, or home office." },
              { title: b.bathrooms || "2 Bath", desc: "Modern and functional bathrooms with premium pre-installed fixtures." },
              { title: "Expansive Living Area", desc: "Extra elevated living space for guests, home office, or entertainment lounge." },
              { title: b.qualityBadge || "Amish Built Quality", desc: "Crafted with premium structural materials and superior precision workmanship." },
              { title: b.buildType || "Modular & Prefab Built", desc: "Built indoors in climate control for 50% faster build times and cost efficiency." },
              { title: "Rustic Modern Design", desc: "Timeless architectural aesthetic with expansive floor-to-ceiling windows." },
              { title: "Energy Efficient", desc: "Engineered thermal envelope built for year-round comfort and lower utility bills." },
            ];
          }

          const rawPubDate = b.publishedAt || b.published_at || b.date;
          let parsedPubDate = "";
          try {
            if (rawPubDate) {
              const d = new Date(rawPubDate);
              if (!isNaN(d.getTime())) {
                parsedPubDate = d.toISOString().split("T")[0];
              }
            }
          } catch {}
          if (!parsedPubDate) {
            parsedPubDate = new Date().toISOString().split("T")[0];
          }

          setBlog({
            ...b,
            publishedAt: parsedPubDate,
            category: b.category || "Modular Cabins",
            introduction: b.introduction || "",
            sqft: b.sqft || "1,750 Sq Ft",
            bedrooms: b.bedrooms || "3 Bed",
            bathrooms: b.bathrooms || "2 Bath",
            stories: b.stories || "1 Story",
            hasLoft: b.hasLoft !== undefined ? Boolean(b.hasLoft) : true,
            buildingStyle: b.buildingStyle || "Prefab Modular Home",
            buildType: b.buildType || "Modular / Prefab",
            price: b.price || b.startingPrice || "$265,000",
            qualityBadge: b.qualityBadge || "Amish-Built Quality",
            pullQuote: b.pullQuote || "A spacious, stylish, and affordable modular cabin — perfect for your forever home, vacation retreat, or rental property.",
            pullQuoteAuthor: b.pullQuoteAuthor || "ModularHome.com Architectural Review",
            customFeatures: parsedFeatures,
          });

          try {
            const cats = typeof b.categories === "string" ? JSON.parse(b.categories) : b.categories;
            setCategoriesText(Array.isArray(cats) ? cats.join(", ") : (b.category || "Modular Cabins"));
          } catch {
            setCategoriesText(b.category || "Modular Cabins");
          }

          try {
            const t = typeof b.tags === "string" ? JSON.parse(b.tags) : b.tags;
            setTagsText(Array.isArray(t) ? t.join(", ") : "");
          } catch {}
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [blogId]);

  const handleAddFeature = () => {
    setBlog((prev: any) => ({
      ...prev,
      customFeatures: [
        ...(prev.customFeatures || []),
        { title: "New Feature", desc: "Feature description..." },
      ],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setBlog((prev: any) => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleUpdateFeature = (index: number, field: "title" | "desc", value: string) => {
    setBlog((prev: any) => {
      const updated = [...(prev.customFeatures || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customFeatures: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const categoriesArray = categoriesText
        ? categoriesText.split(",").map((c) => c.trim()).filter(Boolean)
        : [blog.category];

      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...blog,
          category: blog.category || categoriesArray[0] || "Modular Cabins",
          categories: categoriesArray,
          tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();

      if (json.success) {
        setMessage({ type: "success", text: "Article & Resource updated successfully!" });
      } else {
        setMessage({ type: "error", text: json.error?.message || "Failed to update article." });
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
        <Loader2 className="w-6 h-6 animate-spin text-[#d97706]" />
        <span>Loading article data...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-600">Article not found.</p>
        <Link href="/admin/blogs" className="text-xs font-bold text-[#d97706] mt-2 inline-block">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  const previewCategory = (blog.category || "modular-construction").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const publicUrl = `/blogs/${previewCategory}/${blog.slug}`;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e9ee] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2.5 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f6f7f9] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-[#101114] tracking-tight">
                Edit Article: {blog.title}
              </h1>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-[#d97706] transition-colors"
                title="View live article"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-[#6b7280] font-mono mt-0.5">
              Live URL: {publicUrl}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
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
            <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Main Content, Specs, Pull Quotes, and Features */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Core Article Details */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#d97706]" />
              <span>Article Details &amp; Headline</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Article Title *</label>
              <input
                type="text"
                required
                value={blog.title || ""}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Slug *</label>
              <input
                type="text"
                required
                value={blog.slug || ""}
                onChange={(e) => setBlog({ ...blog, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] font-mono text-[11px] text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Subtitle / Short Summary</label>
              <textarea
                rows={2}
                value={blog.excerpt || ""}
                onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>

          {/* 2. Article Introduction (Screenshot Section) */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <div className="border-l-4 border-[#fcb907] pl-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-serif font-bold text-[#101114]">
                  Article &amp; Resource Introduction
                </h2>
                <p className="text-[11px] text-[#6b7280]">
                  Appears at the very top of the article body under the &ldquo;Introduction&rdquo; headline.
                </p>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-[#d97706] border border-amber-200">
                Introduction
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">
                Introduction Paragraphs (Plain text with line breaks or HTML)
              </label>
              <textarea
                rows={5}
                value={blog.introduction || ""}
                onChange={(e) => setBlog({ ...blog, introduction: e.target.value })}
                placeholder={`The New Home is one of the most popular designs for families, vacation rentals, and full-time living. With 3 Bed, 2 Bath, and a spacious loft, this 1,750 Sq Ft modular cabin offers the perfect combination of rustic elegance and modern functionality.

Amish-built with high-quality materials and expert craftsmanship, the New Home delivers timeless design, energy efficiency, and a comfortable open-concept layout — all at an incredible starting price of only $265,000.`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] leading-relaxed"
              />
              <p className="text-[11px] text-[#6b7280] mt-1">
                Leave empty to automatically generate from model title, specs, and price.
              </p>
            </div>
          </div>

          {/* 3. Key Specs & Ribbon Bar Settings */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#d97706]" />
              <span>Model Specs &amp; Ribbon Bar (Appears on Hero &amp; Sidebar)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Square Footage</label>
                <input
                  type="text"
                  value={blog.sqft || ""}
                  onChange={(e) => setBlog({ ...blog, sqft: e.target.value })}
                  placeholder="e.g. 1,750 Sq Ft"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Bedrooms</label>
                <input
                  type="text"
                  value={blog.bedrooms || ""}
                  onChange={(e) => setBlog({ ...blog, bedrooms: e.target.value })}
                  placeholder="e.g. 3 Bed"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Bathrooms</label>
                <input
                  type="text"
                  value={blog.bathrooms || ""}
                  onChange={(e) => setBlog({ ...blog, bathrooms: e.target.value })}
                  placeholder="e.g. 2 Bath"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Stories</label>
                <input
                  type="text"
                  value={blog.stories || ""}
                  onChange={(e) => setBlog({ ...blog, stories: e.target.value })}
                  placeholder="e.g. 1 Story"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Starting Price</label>
                <input
                  type="text"
                  value={blog.price || ""}
                  onChange={(e) => setBlog({ ...blog, price: e.target.value })}
                  placeholder="e.g. $265,000"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-bold text-[#d97706] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Architectural Style</label>
                <input
                  type="text"
                  value={blog.buildingStyle || ""}
                  onChange={(e) => setBlog({ ...blog, buildingStyle: e.target.value })}
                  placeholder="e.g. Prefab Modular Home"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Build Type</label>
                <input
                  type="text"
                  value={blog.buildType || ""}
                  onChange={(e) => setBlog({ ...blog, buildType: e.target.value })}
                  placeholder="e.g. Modular / Prefab"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Quality Badge</label>
                <input
                  type="text"
                  value={blog.qualityBadge || ""}
                  onChange={(e) => setBlog({ ...blog, qualityBadge: e.target.value })}
                  placeholder="e.g. Amish-Built Quality"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="editHasLoft"
                  checked={Boolean(blog.hasLoft)}
                  onChange={(e) => setBlog({ ...blog, hasLoft: e.target.checked })}
                  className="w-4 h-4 text-[#fcb907] rounded-md border-gray-300 focus:ring-[#fcb907] cursor-pointer"
                />
                <label htmlFor="editHasLoft" className="text-xs font-bold text-[#101114] cursor-pointer">
                  Loft Included in Model
                </label>
              </div>
            </div>
          </div>

          {/* 3. Editorial Pull Quote Card */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3 flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#d97706]" />
              <span>Editorial Highlight / Pull Quote</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1">Quote Text</label>
              <textarea
                rows={2}
                value={blog.pullQuote || ""}
                onChange={(e) => setBlog({ ...blog, pullQuote: e.target.value })}
                placeholder="e.g. A spacious, stylish, and affordable modular cabin — perfect for your forever home, vacation retreat, or rental property."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] italic focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1">Quote Attribution / Author</label>
              <input
                type="text"
                value={blog.pullQuoteAuthor || ""}
                onChange={(e) => setBlog({ ...blog, pullQuoteAuthor: e.target.value })}
                placeholder="e.g. ModularHome.com Architectural Review"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>

          {/* 4. Key Features Grid Builder */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
              <h2 className="text-sm font-serif font-bold text-[#101114] flex items-center gap-2">
                <span>Key Features Grid Cards ({blog.customFeatures?.length || 0})</span>
              </h2>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs font-bold text-[#d97706] hover:text-[#b45309] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Feature Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(blog.customFeatures || []).map((feat: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#e7e9ee] bg-[#fcfcfd] space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6b7280]">
                      Feature #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Remove feature card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => handleUpdateFeature(idx, "title", e.target.value)}
                    placeholder="Feature title"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] bg-white text-xs font-bold text-[#101114] focus:ring-2 focus:ring-[#fcb907]"
                  />
                  <textarea
                    rows={2}
                    value={feat.desc}
                    onChange={(e) => handleUpdateFeature(idx, "desc", e.target.value)}
                    placeholder="Short description..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#d5d9e0] bg-white text-[11px] text-[#4b5563] focus:ring-2 focus:ring-[#fcb907]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 5. Full Article Body */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <h2 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
              Full Article Body Content *
            </h2>
            <textarea
              rows={14}
              required
              value={blog.content || ""}
              onChange={(e) => setBlog({ ...blog, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] font-mono text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
            />
          </div>

          {/* 6. SEO Metadata */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
              <Search className="w-4 h-4 text-[#d97706]" />
              <span>SEO &amp; Search Engine Optimization</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#101114]">SEO Title</label>
                <span className={`text-[10px] ${blog.seoTitle?.length > 60 ? "text-amber-600 font-bold" : "text-[#6b7280]"}`}>
                  {blog.seoTitle?.length || 0} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={blog.seoTitle || ""}
                onChange={(e) => setBlog({ ...blog, seoTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#101114]">Meta Description</label>
                <span className={`text-[10px] ${blog.metaDescription?.length > 160 ? "text-amber-600 font-bold" : "text-[#6b7280]"}`}>
                  {blog.metaDescription?.length || 0} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={blog.metaDescription || ""}
                onChange={(e) => setBlog({ ...blog, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Publishing Settings, Category, Media & Visuals */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3">
              Publishing Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Publish Status</label>
              <select
                value={blog.status || "PUBLISHED"}
                onChange={(e) => setBlog({ ...blog, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
              >
                <option value="PUBLISHED">Published (Live on Site)</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Publication Date</span>
              </label>
              <input
                type="date"
                required
                value={blog.publishedAt || ""}
                onChange={(e) => setBlog({ ...blog, publishedAt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
              />
              <p className="text-[10px] text-[#6b7280] mt-1">
                Displayed on the article hero, card grids, and search results.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Primary Category</label>
              <select
                value={blog.category || "Modular Cabins"}
                onChange={(e) => {
                  setBlog({ ...blog, category: e.target.value });
                  setCategoriesText(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer mb-2"
              >
                {POPULAR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={categoriesText}
                onChange={(e) => {
                  setCategoriesText(e.target.value);
                  setBlog({ ...blog, category: e.target.value.split(",")[0]?.trim() || "Modular Cabins" });
                }}
                placeholder="Or comma-separated custom categories..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Author Name</label>
              <input
                type="text"
                value={blog.author || ""}
                onChange={(e) => setBlog({ ...blog, author: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Modular Cabins, Prefab, Price Guide"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>

          {/* Media & Video */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#101114] border-b border-[#e7e9ee] pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#d97706]" />
              <span>Media &amp; Video Tour</span>
            </h3>

            <ImageUpload
              label="Featured Article Header Image *"
              value={blog.featuredImage || blog.featured_image || ""}
              onChange={(url) => setBlog({ ...blog, featuredImage: url, featured_image: url })}
              folder="blogs"
              aspectRatio="16/10"
              helperText="Main editorial cover image displayed on blog listings and article hero."
            />

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Embedded YouTube Video Tour URL</span>
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={blog.embeddedVideoUrl || ""}
                onChange={(e) => setBlog({ ...blog, embeddedVideoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
