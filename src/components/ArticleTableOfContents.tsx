"use client";

import { useState, useEffect } from "react";
import { List, ChevronRight } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleTableOfContentsProps {
  contentSelector?: string;
  defaultItems?: { id: string; text: string }[];
}

export default function ArticleTableOfContents({
  defaultItems = [
    { id: "overview", text: "Architectural Overview" },
    { id: "specs", text: "Floor Plan Specifications" },
    { id: "video-tour", text: "Video Walkthrough & Features" },
    { id: "interior-design", text: "Interior Living & Finishes" },
    { id: "pricing-quote", text: "Pricing & Custom Options" },
  ],
}: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0% -60% 0%" }
    );

    defaultItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [defaultItems]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="p-5 bg-[#fdfbf7] border border-[#fef3c7] rounded-[18px] shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#101114]">
        <List className="w-4 h-4 text-[#d97706]" />
        <span>Table of Contents</span>
      </div>
      <nav className="space-y-1 text-xs">
        {defaultItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left py-1.5 px-2 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                isActive
                  ? "bg-[#fcb907]/25 text-[#101114] font-bold"
                  : "text-[#4b5563] hover:text-[#101114] hover:bg-black/5 font-medium"
              }`}
            >
              <span className="truncate">{item.text}</span>
              <ChevronRight className={`w-3 h-3 shrink-0 ${isActive ? "text-[#d97706]" : "text-[#9ca3af]"}`} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
