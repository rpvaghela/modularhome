"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Search,
  Menu,
  X,
  ChevronDown,
  Shield,
  Truck,
  Wrench,
  Headphones,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NAV_ITEMS, TRUST_BADGES_TOP } from "@/data/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const trustIcons: Record<string, React.ReactNode> = {
    "Nationwide Delivery": <Truck className="w-4 h-4 text-[#e11d1d]" />,
    "Custom Solutions": <Wrench className="w-4 h-4 text-[#e11d1d]" />,
    "Expert Support": <Headphones className="w-4 h-4 text-[#e11d1d]" />,
    "Made in USA": <Flag className="w-4 h-4 text-[#e11d1d]" />,
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* ── Top Bar (White Background) ────────────────────────── */}
      <div className="bg-white text-[#0a0a0a] border-b border-[#e2e8f0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block group">
              <Image
                src="/bomb_logo.png"
                alt="BombShelters.com"
                width={360}
                height={120}
                priority
                className="h-14 sm:h-16 lg:h-[72px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>
          </div>

          {/* 4 Trust Badges (Desktop) */}
          <div className="hidden xl:flex items-center gap-6 text-xs text-[#1e293b]">
            {TRUST_BADGES_TOP.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 font-semibold text-[#1e293b]">
                {trustIcons[badge] || <Shield className="w-4 h-4 text-[#e11d1d]" />}
                <span>{badge}</span>
              </div>
            ))}
          </div>

          {/* Contact & CTA */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="tel:812-595-4033"
              className="hidden md:flex items-center gap-2 text-[#0a0a0a] hover:text-[#e11d1d] font-display font-black text-sm tracking-wide transition-colors"
            >
              <Phone className="w-4 h-4 text-[#e11d1d]" />
              <span>Call Now 812-595-4033</span>
            </a>

            <Button
              asLink
              href="#financing"
              size="sm"
              showArrow
              className="text-xs sm:text-sm shadow-md"
            >
              Get a Quote
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#0a0a0a] hover:text-[#e11d1d] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Navigation Bar Below ───────────────────────────── */}
      <div className="hidden lg:block bg-[#111214] border-b border-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <nav className="flex items-center gap-1 xl:gap-2">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs xl:text-sm font-display font-bold tracking-wider uppercase text-white hover:text-[#e11d1d] transition-colors rounded-[3px] hover:bg-white/5"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#e11d1d] transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 w-52 py-2 mt-1 bg-[#16181b] border border-[#2a2d31] rounded-[4px] shadow-2xl z-50">
                    <Link
                      href="#featured-models"
                      className="block px-4 py-2 text-xs font-sans text-[#cbd5e1] hover:text-white hover:bg-[#e11d1d]/20 transition-colors"
                    >
                      Browse {item.label}
                    </Link>
                    <Link
                      href="#financing"
                      className="block px-4 py-2 text-xs font-sans text-[#cbd5e1] hover:text-white hover:bg-[#e11d1d]/20 transition-colors"
                    >
                      Custom Specifications
                    </Link>
                    <Link
                      href="#faq"
                      className="block px-4 py-2 text-xs font-sans text-[#cbd5e1] hover:text-white hover:bg-[#e11d1d]/20 transition-colors"
                    >
                      Technical Standards
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Input */}
          <div className="relative w-56 xl:w-64">
            <input
              type="text"
              placeholder="Search shelters, cabins..."
              className="w-full bg-[#181a1d] text-white text-xs placeholder-[#71717a] border border-[#2a2d31] rounded-[4px] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#e11d1d] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* ── Mobile Hamburger Drawer ────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111214] border-b border-white px-4 py-5 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shelters, cabins..."
              className="w-full bg-[#181a1d] text-white text-xs placeholder-[#71717a] border border-[#2a2d31] rounded-[4px] pl-8 pr-3 py-2 focus:outline-none focus:border-[#e11d1d]"
            />
            <Search className="w-4 h-4 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-display font-bold tracking-wider uppercase text-white hover:text-[#e11d1d] hover:bg-white/5 rounded-[3px] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#1f2226] flex flex-col gap-2.5">
            <a
              href="tel:812-595-4033"
              className="flex items-center gap-2 text-white font-display font-bold text-sm tracking-wide"
            >
              <Phone className="w-4 h-4 text-[#e11d1d]" />
              <span>812-595-4033</span>
            </a>
            <Button
              asLink
              href="#financing"
              size="sm"
              showArrow
              onClick={() => setMobileMenuOpen(false)}
            >
              Get a Quote
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
