"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  HelpCircle,
  DollarSign,
  CreditCard,
  Compass,
  BookOpen,
  FolderOpen,
  Layers,
  Home,
  FileText,
  Play,
  Info,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  NAV_ITEMS,
  MORE_BUYER_GUIDES,
  MORE_SERVICES_RESOURCES,
  TRUST_BADGES_TOP,
} from "@/data/navigation";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMoreExpanded, setMobileMoreExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [brandSettings, setBrandSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/bombshelter/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setBrandSettings(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const trustIcons: Record<string, React.ReactNode> = {
    "Nationwide Delivery": <Truck className="w-4 h-4 text-[#e11d1d]" />,
    "Custom Solutions": <Wrench className="w-4 h-4 text-[#e11d1d]" />,
    "Expert Support": <Headphones className="w-4 h-4 text-[#e11d1d]" />,
    "Made in USA": <Flag className="w-4 h-4 text-[#e11d1d]" />,
  };

  const moreIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Truck,
    HelpCircle,
    DollarSign,
    CreditCard,
    Compass,
    BookOpen,
    FolderOpen,
    Layers,
    Home,
    FileText,
    Play,
    Info,
    Shield,
    PhoneCall,
  };

  const getMoreIcon = (name: string) => {
    return moreIcons[name] || Info;
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* ── Top Announcement Banner (Synced with Admin Settings) ── */}
      {(brandSettings?.banner_active ?? brandSettings?.announcementEnabled) &&
        (brandSettings?.banner_message || brandSettings?.announcementText) && (
          <div className="bg-[#e11d1d] text-white text-[11px] sm:text-xs font-mono font-bold py-1.5 px-4 text-center tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{brandSettings.banner_message || brandSettings.announcementText}</span>
            {(brandSettings.banner_link || brandSettings.announcementLink) && (
              <Link
                href={brandSettings.banner_link || brandSettings.announcementLink}
                className="underline hover:text-black transition-colors ml-1 font-sans font-semibold text-[11px]"
              >
                Learn More →
              </Link>
            )}
          </div>
        )}

      {/* ── Top Bar (White Background) ────────────────────────── */}
      <div className="bg-white text-[#0a0a0a] border-b border-[#e2e8f0]">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block group">
              <Image
                src={
                  brandSettings?.logo_url && brandSettings?.logo_url !== "/logo.png" && brandSettings?.logo_url !== "/newmodularlogo.png"
                    ? brandSettings.logo_url
                    : brandSettings?.logoUrl && brandSettings?.logoUrl !== "/logo.png" && brandSettings?.logoUrl !== "/newmodularlogo.png"
                    ? brandSettings.logoUrl
                    : "/bomb_logo.png"
                }
                alt={brandSettings?.company_name || brandSettings?.companyName || "BombShelters.com"}
                width={360}
                height={120}
                priority
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform group-hover:scale-[1.02]"
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
              href={`tel:${brandSettings?.phone || "812-595-4033"}`}
              className="hidden md:flex items-center gap-2 text-[#0a0a0a] hover:text-[#e11d1d] font-display font-black text-sm tracking-wide transition-colors"
            >
              <Phone className="w-4 h-4 text-[#e11d1d]" />
              <span>Call Now {brandSettings?.phone || "812-595-4033"}</span>
            </a>

            <Button
              asLink
              href="/quote"
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

      {/* ── Navigation Bar Below (Dark Tactical Background) ───────────────────────────── */}
      <div className="hidden lg:block bg-[#111214] border-b border-white">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-1.5 flex items-center justify-between gap-2 overflow-visible">
          <nav className="flex items-center gap-0.5 xl:gap-1 flex-nowrap overflow-visible">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group shrink-0"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-1.5 xl:px-2 py-1 text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-display font-bold tracking-wider uppercase text-white hover:text-[#e11d1d] transition-colors rounded-[3px] hover:bg-white/5 whitespace-nowrap"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#e11d1d] transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Link>

                {/* Dropdown Menu for "More" */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className="absolute top-full right-0 mt-1 w-[580px] max-w-[94vw] p-4 bg-[#16181b] border border-[#2a2d31] rounded-[4px] shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
                      {/* Column 1: Buyer Guides & Logistics */}
                      <div>
                        <div className="text-[10px] font-display font-bold uppercase tracking-wider text-[#e11d1d] pb-1.5 border-b border-[#2a2d31] mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e11d1d]" />
                          <span>Buyer Guides &amp; Logistics</span>
                        </div>
                        <div className="space-y-0.5">
                          {MORE_BUYER_GUIDES.map((option) => {
                            const IconComponent = getMoreIcon(option.iconName);
                            return (
                              <Link
                                key={option.label}
                                href={option.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start gap-2.5 p-2 rounded hover:bg-white/5 text-[#cbd5e1] hover:text-white transition-colors group"
                              >
                                <div className="p-1.5 rounded bg-white/5 text-[#e11d1d] group-hover:bg-[#e11d1d] group-hover:text-white transition-colors shrink-0 mt-0.5">
                                  <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-display font-bold uppercase tracking-wide text-white group-hover:text-[#e11d1d] leading-snug transition-colors">
                                    {option.label}
                                  </div>
                                  <div className="text-[10.5px] text-[#94a3b8] font-sans font-normal leading-tight mt-0.5 truncate">
                                    {option.desc}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: Services & Planning */}
                      <div>
                        <div className="text-[10px] font-display font-bold uppercase tracking-wider text-[#94a3b8] pb-1.5 border-b border-[#2a2d31] mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                          <span>Services &amp; Planning</span>
                        </div>
                        <div className="space-y-0.5">
                          {MORE_SERVICES_RESOURCES.map((option) => {
                            const IconComponent = getMoreIcon(option.iconName);
                            return (
                              <Link
                                key={option.label}
                                href={option.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start gap-2.5 p-2 rounded hover:bg-white/5 text-[#cbd5e1] hover:text-white transition-colors group"
                              >
                                <div className="p-1.5 rounded bg-white/5 text-[#94a3b8] group-hover:bg-[#e11d1d] group-hover:text-white transition-colors shrink-0 mt-0.5">
                                  <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-display font-bold uppercase tracking-wide text-white group-hover:text-[#e11d1d] leading-snug transition-colors">
                                    {option.label}
                                  </div>
                                  <div className="text-[10.5px] text-[#94a3b8] font-sans font-normal leading-tight mt-0.5 truncate">
                                    {option.desc}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Input */}
          <div className="relative w-36 sm:w-44 xl:w-52 shrink-0 ml-auto">
            <input
              type="text"
              placeholder="Search shelters, cabins..."
              className="w-full bg-[#181a1d] text-white text-xs placeholder-[#71717a] border border-[#2a2d31] rounded-[4px] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#e11d1d] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* ── Mobile Hamburger Drawer (Dark Background) ────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111214] border-b border-white px-4 py-5 space-y-4 text-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shelters, cabins..."
              className="w-full bg-[#181a1d] text-white text-xs placeholder-[#71717a] border border-[#2a2d31] rounded-[4px] pl-8 pr-3 py-2 focus:outline-none focus:border-[#e11d1d]"
            />
            <Search className="w-4 h-4 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.label} className="border-b border-[#1f2226] pb-1">
                    <button
                      onClick={() => setMobileMoreExpanded(!mobileMoreExpanded)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-display font-bold tracking-wider uppercase text-white hover:text-[#e11d1d] hover:bg-white/5 rounded-[3px] transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#71717a] transition-transform ${
                          mobileMoreExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileMoreExpanded && (
                      <div className="pl-3 pr-2 py-2 space-y-1 bg-[#16181b] rounded-[4px] mb-2 border border-[#2a2d31]">
                        <div className="text-[10px] font-display font-bold uppercase tracking-wider text-[#e11d1d] px-2 py-1">
                          Buyer Guides &amp; Logistics
                        </div>
                        {MORE_BUYER_GUIDES.map((guide) => (
                          <Link
                            key={guide.label}
                            href={guide.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-1.5 text-xs text-[#cbd5e1] hover:text-white hover:bg-white/5 rounded transition-colors"
                          >
                            <span>{guide.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
                          </Link>
                        ))}
                        <div className="text-[10px] font-display font-bold uppercase tracking-wider text-[#94a3b8] px-2 pt-2 py-1">
                          Services &amp; Planning
                        </div>
                        {MORE_SERVICES_RESOURCES.map((res) => (
                          <Link
                            key={res.label}
                            href={res.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-1.5 text-xs text-[#cbd5e1] hover:text-white hover:bg-white/5 rounded transition-colors"
                          >
                            <span>{res.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-display font-bold tracking-wider uppercase text-white hover:text-[#e11d1d] hover:bg-white/5 rounded-[3px] border-b border-[#1f2226] transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#1f2226] flex flex-col gap-2.5">
            <a
              href={`tel:${brandSettings?.phone || "812-595-4033"}`}
              className="flex items-center gap-2 text-white font-display font-bold text-sm tracking-wide"
            >
              <Phone className="w-4 h-4 text-[#e11d1d]" />
              <span>{brandSettings?.phone || "812-595-4033"}</span>
            </a>
            <Button
              asLink
              href="/quote"
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
