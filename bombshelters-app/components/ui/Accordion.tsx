"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

export function Accordion({ items, className = "" }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`border rounded-[3px] overflow-hidden bg-white transition-colors ${
              isOpen ? "border-[#e11d1d]/50 shadow-sm" : "border-[#e2e8f0]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left font-semibold text-[14px] text-[#0a0a0a] hover:text-[#e11d1d] transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="pr-4">{item.question}</span>
              <Plus
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-45 text-[#e11d1d]" : "text-[#0a0a0a]"
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-4 text-[#4a5568] text-[13px] leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
