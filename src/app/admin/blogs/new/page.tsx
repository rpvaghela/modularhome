"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminNewBlogPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    introduction: "",
    content: "",
    featuredImage: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    heroBackground: "",
    author: "ModularHome Editorial Team",
    publishedAt: new Date().toISOString().split("T")[0],
    status: "PUBLISHED",
    category: "Modular Cabins",
    categories: "Modular Cabins",
    tags: "Modular Cabins, Prefab, Amish Built, Floor Plan",
    embeddedVideoUrl: "",
    seoTitle: "",
    metaDescription: "",
    imageAltText: "",
    canonicalUrl: "",
    // Specs
    sqft: "1,750 Sq Ft",
    bedrooms: "3 Bed",
    bathrooms: "2 Bath",
    stories: "1 Story",
    hasLoft: true,
    buildingStyle: "Prefab Modular Home",
    buildType: "Modular / Prefab",
    price: "$265,000",
    qualityBadge: "Amish-Built Quality",
    // Pull Quote
    pullQuote: "A spacious, stylish, and affordable modular cabin — perfect for your forever home, vacation retreat, or rental property.",
    pullQuoteAuthor: "ModularHome.com Architectural Review",
    // Custom Features
    customFeatures: [
      { title: "1,750 Sq Ft", desc: "Spacious layout with open-concept design and high volume ceilings." },
      { title: "3 Bed", desc: "Comfortable bedrooms designed for family living, guests, or home office." },
      { title: "2 Bath", desc: "Modern and functional bathrooms with premium pre-installed fixtures." },
      { title: "Expansive Living Area", desc: "Extra elevated living space for guests, home office, or entertainment lounge." },
      { title: "Amish Built Quality", desc: "Crafted with premium structural materials and superior precision workmanship." },
      { title: "Modular & Prefab Built", desc: "Built indoors in climate control for 50% faster build times and cost efficiency." },
      { title: "Rustic Modern Design", desc: "Timeless architectural aesthetic with expansive floor-to-ceiling windows." },
      { title: "Energy Efficient", desc: "Engineered thermal envelope built for year-round comfort and lower utility bills." },
    ],
  });

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((prev) => ({
      ...prev,
      title: val,
      slug,
      seoTitle: `${val} | ModularHome.com`,
      imageAltText: val,
    }));
  };

  const handleAddFeature = () => {
    setForm((prev) => ({
      ...prev,
      customFeatures: [
        ...prev.customFeatures,
        { title: "New Feature", desc: "Feature description..." },
      ],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateFeature = (index: number, field: "title" | "desc", value: string) => {
    setForm((prev) => {
      const updated = [...prev.customFeatures];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customFeatures: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const categoriesArray = form.categories
        ? form.categories.split(",").map((c) => c.trim()).filter(Boolean)
        : [form.category];

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: form.category || categoriesArray[0] || "Modular Cabins",
          categories: categoriesArray,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();

      if (json.success) {
        router.push("/admin/blogs");
      } else {
        setError(json.error?.message || "Failed to create blog article.");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in pb-16">
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
            <h1 className="text-2xl font-serif font-bold text-[#101114] tracking-tight">
              Create New Article &amp; Resource
            </h1>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Publish editorial guides, cabin tours, floor plan breakdowns, and construction resources.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Publish Article</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#d97706]" />
          <span>{error}</span>
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
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. New Home: Amish-Built Modular Cabin Tour &amp; Specs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Slug / URL Path *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="new-home"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] font-mono text-[11px] text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Subtitle / Short Summary</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value, metaDescription: e.target.value })}
                placeholder="Brief headline subtitle or overview..."
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
                value={form.introduction}
                onChange={(e) => setForm({ ...form, introduction: e.target.value })}
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
                  value={form.sqft}
                  onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                  placeholder="e.g. 1,750 Sq Ft"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Bedrooms</label>
                <input
                  type="text"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                  placeholder="e.g. 3 Bed"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Bathrooms</label>
                <input
                  type="text"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                  placeholder="e.g. 2 Bath"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Stories</label>
                <input
                  type="text"
                  value={form.stories}
                  onChange={(e) => setForm({ ...form, stories: e.target.value })}
                  placeholder="e.g. 1 Story"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Starting Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. $265,000"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-bold text-[#d97706] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Architectural Style</label>
                <input
                  type="text"
                  value={form.buildingStyle}
                  onChange={(e) => setForm({ ...form, buildingStyle: e.target.value })}
                  placeholder="e.g. Prefab Modular Home"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Build Type</label>
                <input
                  type="text"
                  value={form.buildType}
                  onChange={(e) => setForm({ ...form, buildType: e.target.value })}
                  placeholder="e.g. Modular / Prefab"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101114] mb-1">Quality Badge</label>
                <input
                  type="text"
                  value={form.qualityBadge}
                  onChange={(e) => setForm({ ...form, qualityBadge: e.target.value })}
                  placeholder="e.g. Amish-Built Quality"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="hasLoft"
                  checked={Boolean(form.hasLoft)}
                  onChange={(e) => setForm({ ...form, hasLoft: e.target.checked })}
                  className="w-4 h-4 text-[#fcb907] rounded-md border-gray-300 focus:ring-[#fcb907] cursor-pointer"
                />
                <label htmlFor="hasLoft" className="text-xs font-bold text-[#101114] cursor-pointer">
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
                value={form.pullQuote}
                onChange={(e) => setForm({ ...form, pullQuote: e.target.value })}
                placeholder="e.g. A spacious, stylish, and affordable modular cabin — perfect for your forever home, vacation retreat, or rental property."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] italic focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1">Quote Attribution / Author</label>
              <input
                type="text"
                value={form.pullQuoteAuthor}
                onChange={(e) => setForm({ ...form, pullQuoteAuthor: e.target.value })}
                placeholder="e.g. ModularHome.com Architectural Review"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>

          {/* 4. Key Features Grid Builder */}
          <div className="bg-white p-6 rounded-[18px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
              <h2 className="text-sm font-serif font-bold text-[#101114] flex items-center gap-2">
                <span>Key Features Grid Cards ({form.customFeatures.length})</span>
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
              {form.customFeatures.map((feat, idx) => (
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
                    placeholder="Feature title (e.g. 1,750 Sq Ft)"
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
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write detailed paragraphs, model walkthroughs, room descriptions, bullet points..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] font-mono text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
            />
            <p className="text-[11px] text-[#6b7280]">
              Tip: Standard paragraphs, HTML tags (&lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;), and markdown are automatically formatted with responsive typography.
            </p>
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
                <span className={`text-[10px] ${form.seoTitle?.length > 60 ? "text-amber-600 font-bold" : "text-[#6b7280]"}`}>
                  {form.seoTitle?.length || 0} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#101114]">Meta Description</label>
                <span className={`text-[10px] ${form.metaDescription?.length > 160 ? "text-amber-600 font-bold" : "text-[#6b7280]"}`}>
                  {form.metaDescription?.length || 0} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
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
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
              >
                <option value="PUBLISHED">Published (Live on Site)</option>
                <option value="DRAFT">Draft</option>
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
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] cursor-pointer"
              />
              <p className="text-[10px] text-[#6b7280] mt-1">
                Sets the display date and chronological sorting on the live website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Primary Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, categories: e.target.value })}
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
                value={form.categories}
                onChange={(e) => setForm({ ...form, categories: e.target.value, category: e.target.value.split(",")[0]?.trim() || "Modular Cabins" })}
                placeholder="Or custom category name..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Author Name</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101114] mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
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
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
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
                value={form.embeddedVideoUrl}
                onChange={(e) => setForm({ ...form, embeddedVideoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d5d9e0] bg-[#f6f7f9] text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
