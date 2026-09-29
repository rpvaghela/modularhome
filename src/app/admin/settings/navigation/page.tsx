"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Menu,
  Eye,
  EyeOff,
  CornerDownRight,
} from "lucide-react";

interface MenuItem {
  id?: string;
  label: string;
  href: string;
  isExternal?: boolean;
  isVisible?: boolean;
  badge?: string;
  children?: Array<{ label: string; href: string; isExternal?: boolean; isVisible?: boolean }>;
}

export default function AdminNavigationSettingsPage() {
  const [navItems, setNavItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem>({ label: "", href: "", isVisible: true });
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data) {
        const rawNav = json.data.headerNavigation || json.data.navLinks || [];
        const parsed = Array.isArray(rawNav) ? rawNav : [];
        setNavItems(
          parsed.map((item: any) => ({
            label: item.label || "Link",
            href: item.href || item.url || "/",
            isExternal: !!item.isExternal || !!item.external,
            isVisible: item.isVisible !== false,
            badge: item.badge || "",
            children: Array.isArray(item.children) ? item.children : [],
          }))
        );
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load navigation configuration." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (itemsToSave = navItems) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headerNavigation: itemsToSave, navLinks: itemsToSave }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Navigation menu saved successfully!" });
      } else {
        setMessage({ type: "error", text: json.error?.message || "Failed to save navigation." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= navItems.length) return;
    const updated = [...navItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setNavItems(updated);
  };

  const handleDelete = (index: number) => {
    if (!confirm(`Delete menu item "${navItems[index].label}"?`)) return;
    const updated = navItems.filter((_, idx) => idx !== index);
    setNavItems(updated);
  };

  const handleToggleVisible = (index: number) => {
    const updated = [...navItems];
    updated[index].isVisible = !updated[index].isVisible;
    setNavItems(updated);
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setEditingItem({ label: "", href: "/", isVisible: true, isExternal: false, badge: "", children: [] });
    setModalOpen(true);
  };

  const openEditModal = (idx: number) => {
    setEditingIndex(idx);
    setEditingItem({ ...navItems[idx], children: navItems[idx].children || [] });
    setModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.label.trim()) return;

    let updated: MenuItem[];
    if (editingIndex !== null) {
      updated = [...navItems];
      updated[editingIndex] = editingItem;
    } else {
      updated = [...navItems, editingItem];
    }
    setNavItems(updated);
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500 text-xs flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#fcb907]" />
        <span>Loading navigation menus...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top bar */}
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
              Header Navigation Menu
            </h1>
            <p className="text-xs text-[#6b7280] mt-0.5 font-medium">
              Add, reorder, edit, or nest navigation links displayed in the website header.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#d5d9e0] bg-white text-[#101114] hover:bg-[#f6f7f9] text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#fcb907]" />
            <span>Add Menu Item</span>
          </button>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Navigation</span>
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

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-[#e7e9ee] pb-3 text-xs font-bold font-mono">
        <Link href="/admin/settings" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">All Settings</Link>
        <Link href="/admin/settings/header" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">Header</Link>
        <Link href="/admin/settings/navigation" className="px-3 py-1.5 rounded-lg bg-[#101114] text-white">Navigation</Link>
        <Link href="/admin/settings/footer" className="px-3 py-1.5 rounded-lg text-[#6b7280] hover:text-[#101114]">Footer</Link>
      </div>

      {/* Menu items list */}
      <div className="bg-white rounded-[20px] border border-[#e7e9ee] shadow-[0_12px_35px_rgba(16,24,40,0.04)] overflow-hidden">
        {navItems.length === 0 ? (
          <div className="py-20 text-center text-[#6b7280] text-xs font-medium">
            No navigation items configured. Click &quot;Add Menu Item&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-[#e7e9ee]">
            {navItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                  item.isVisible ? "hover:bg-[#f8f9fa]/70" : "bg-[#f8f9fa]/40 opacity-60"
                }`}
              >
                {/* Left: Reorder & Name */}
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
                      disabled={idx === navItems.length - 1}
                      className="p-1 rounded-lg text-[#6b7280] hover:text-[#101114] disabled:opacity-20 hover:bg-[#e7e9ee] transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-[#f8f9fa] border border-[#d5d9e0] font-mono text-xs font-bold flex items-center justify-center text-[#101114] shrink-0">
                    {idx + 1}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#101114] truncate font-sans">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[9px] uppercase">
                          {item.badge}
                        </span>
                      )}
                      {item.isExternal && (
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[9px]">
                          External
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[#6b7280] truncate">
                      {item.href}
                    </div>
                    {item.children && item.children.length > 0 && (
                      <div className="text-[11px] text-[#d97706] font-medium flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3" />
                        <span>{item.children.length} sub-menu dropdown items</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(idx)}
                    className="p-2 rounded-xl text-[#6b7280] hover:text-[#101114] hover:bg-[#f8f9fa] border border-transparent hover:border-[#d5d9e0] transition-colors cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleVisible(idx)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      item.isVisible
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {item.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{item.isVisible ? "Visible" : "Hidden"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-2 rounded-xl text-[#6b7280] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-md w-full p-6 shadow-2xl border border-[#e7e9ee] animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-3">
              <h3 className="text-base font-serif font-bold text-[#101114]">
                {editingIndex !== null ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#6b7280] hover:text-[#101114]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#101114] mb-1">Menu Label *</label>
                <input
                  type="text"
                  required
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  placeholder="e.g. Barndominiums"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#101114] mb-1">Target Link URL *</label>
                <input
                  type="text"
                  required
                  value={editingItem.href}
                  onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                  placeholder="e.g. /buildings?category=Barndominiums"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#101114] mb-1">Highlight Badge (Optional)</label>
                <input
                  type="text"
                  value={editingItem.badge || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="e.g. NEW or POPULAR"
                  className="w-full px-3 py-2 rounded-xl border border-[#d5d9e0] bg-[#f8f9fa] text-[#101114]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isExternal || false}
                    onChange={(e) => setEditingItem({ ...editingItem, isExternal: e.target.checked })}
                    className="rounded text-[#fcb907]"
                  />
                  <span>Open in new tab (External Link)</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#e7e9ee]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d5d9e0] text-[#101114] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-bold"
                >
                  {editingIndex !== null ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
