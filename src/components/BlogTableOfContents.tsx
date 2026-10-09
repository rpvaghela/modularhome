"use client";

import { useState } from "react";
import { ListOrdered, ChevronUp, ChevronDown } from "lucide-react";

export interface TocItem {
  id: string;
  number: number;
  title: string;
}

interface BlogTableOfContentsProps {
  items?: TocItem[];
}

export default function BlogTableOfContents({
  items = [
    { id: "introduction", number: 1, title: "Introduction" },
    { id: "key-features", number: 2, title: "Key Features" },
    { id: "floor-plan-specs", number: 3, title: "Floor Plan & Specifications" },
    { id: "interior-design", number: 4, title: "Interior Design & Living Spaces" },
    { id: "why-modular", number: 5, title: "Why Choose a Modular Cabin?" },
    { id: "ideal-uses", number: 6, title: "Ideal Uses" },
    { id: "pricing-customization", number: 7, title: "Pricing & Customization" },
    { id: "final-thoughts", number: 8, title: "Final Thoughts" },
  ],
}: BlogTableOfContentsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border border-[#e7e9ee] rounded-[18px] p-5 sm:p-6 shadow-xs my-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f1f3f7] pb-3 mb-4">
        <div className="flex items-center gap-2 font-black text-base text-[#101114] tracking-tight">
          <ListOrdered className="w-5 h-5 text-[#d97706]" />
          <span>Table of Contents</span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs font-bold text-[#6b7280] hover:text-[#101114] inline-flex items-center gap-1 cursor-pointer transition-colors"
          aria-expanded={!collapsed}
        >
          <span>{collapsed ? "Expand" : "Collapse"}</span>
          {collapsed ? (
            <ChevronDown className="w-4 h-4 text-[#d97706]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#d97706]" />
          )}
        </button>
      </div>

      {/* 2-Column Numbered List */}
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs sm:text-sm">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="text-left flex items-start gap-2.5 text-[#374151] hover:text-[#d97706] transition-colors py-1 group cursor-pointer"
            >
              <span className="font-extrabold text-[#d97706] group-hover:text-[#b45309] shrink-0 w-4 text-right">
                {item.number}
              </span>
              <span className="font-semibold group-hover:underline text-stone-700">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
