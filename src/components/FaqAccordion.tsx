"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map((f) => f.category)));
    return ["All", ...cats];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = selectedCategory === "All" || faq.category === selectedCategory;
      const matchSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqs, selectedCategory, search]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-[#8c94a0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g., permits, financing, foundation, delivery timeline)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border border-[#e7e9ee] rounded-[14px] text-xs sm:text-sm text-[#101114] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#fcb907] focus:bg-white transition-all shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#101114] text-[#fcb907] shadow-sm"
                  : "bg-[#f8f9fa] text-[#4b5563] border border-[#e7e9ee] hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-[#f8f9fa] rounded-[16px] border border-[#e7e9ee] text-[#6b7280]">
            <p className="text-sm font-semibold">No questions found matching "{search}".</p>
            <p className="text-xs mt-1">Try another keyword or reach out to our team directly.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = Boolean(openIndices[idx]);
            return (
              <div
                key={idx}
                className="bg-[#f8f9fa] border border-[#e7e9ee] rounded-[16px] overflow-hidden transition-colors hover:border-[#fcb907]/60"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white text-[#d97706] px-2.5 py-1 rounded-md border border-[#e7e9ee] shrink-0 mt-0.5">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-[#101114] leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8c94a0] shrink-0 transition-transform duration-200 mt-1 ${
                      isOpen ? "rotate-180 text-[#d97706]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4b5563] leading-relaxed border-t border-[#e7e9ee]/60 bg-white/70">
                    <div className="pt-2 pl-2 border-l-2 border-[#fcb907]">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
