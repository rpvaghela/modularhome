"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Phone,
  Search,
  Menu,
  X,
  ChevronDown,
  Shield,
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
  PhoneCall,
  Star,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Button } from "@/components/ui/Button";
import {
  NAV_ITEMS,
  MORE_BUYER_GUIDES,
  MORE_SERVICES_RESOURCES,
} from "@/data/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const [headerQuery, setHeaderQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMoreExpanded, setMobileMoreExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [brandSettings, setBrandSettings] = useState<any>(null);
  const [logoSrc, setLogoSrc] = useState<string>("/bombshelters-logo-header.png");
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    fetch("/api/bombshelter/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setBrandSettings(json.data);
          const rawLogo = json.data.logo_url || json.data.logoUrl;
          if (rawLogo && rawLogo !== "/logo.png" && rawLogo !== "/newmodularlogo.png" && rawLogo !== "/bomb_logo.png" && rawLogo !== "/bomb_logo_trim.png") {
            setLogoSrc(rawLogo);
          } else {
            setLogoSrc("/bombshelters-logo-header.png");
          }
        }
      })
      .catch(() => {});
  }, []);

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

  const phoneDigits = (brandSettings?.phone || "812-595-4033").replace(/\D/g, "").slice(-10);
  const phoneDisplay =
    phoneDigits.length === 10
      ? `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`
      : brandSettings?.phone || "812-595-4033";

  const getMoreIcon = (name: string) => {
    return moreIcons[name] || Info;
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* ── Top Utility Ribbon (Red Bar with Phone, Rating & Quick Links) ── */}
      <div className="bg-[#FF1F1F] text-white select-none w-full border-b border-black/10 overflow-hidden">
        <div className="site-container py-1.5 sm:py-2 flex items-center justify-between gap-3 text-xs">
          {/* Left: Phone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={`tel:${phoneDigits ? `+1${phoneDigits}` : "+18125954033"}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 hover:text-white/85 transition-colors group shrink-0"
            >
              <span className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0">
                <PhoneCall className="w-2.5 sm:w-3 h-2.5 sm:h-3 stroke-[2.5] text-white" />
              </span>
              <span className="font-extrabold tracking-tight text-white whitespace-nowrap text-xs sm:text-[13px] lg:text-[14px]">
                +1 {phoneDisplay}
              </span>
            </a>
          </div>

          {/* Center: Rating & Social Proof */}
          <div className="hidden lg:flex items-center gap-2 text-white/95 shrink-0">
            <span className="text-amber-300 text-[10px]">●</span>
            <div className="flex items-center gap-0.5 text-amber-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              ))}
            </div>
            <span className="font-semibold text-white text-[11px] sm:text-xs tracking-tight">
              Trusted by 1,000,000 Followers
            </span>
          </div>

          {/* Right: Quick Action Links */}
          <div className="flex items-center gap-2 sm:gap-3 text-white/90 font-medium text-[11px] sm:text-[12px] shrink-0">
            <Link
              href="/upload-floor-plan"
              className="hidden md:inline hover:text-white transition-colors whitespace-nowrap"
            >
              Upload Plans
            </Link>
            <span className="hidden md:inline text-white/40">|</span>
            {isAuthenticated && customer ? (
              <>
                <Link
                  href="/account"
                  className="hover:text-amber-200 transition-colors inline-flex items-center gap-1.5 text-white font-bold whitespace-nowrap"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black">
                    {customer.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <span>Hi, {customer.name?.split(" ")[0]}</span>
                </Link>
                <span className="text-white/40">|</span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="hover:text-white transition-colors whitespace-nowrap text-white/80 hover:text-white cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/account/login"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-white font-semibold whitespace-nowrap"
                >
                  <User className="w-3 h-3 text-amber-300 stroke-[2.5]" />
                  <span>Sign In</span>
                </Link>
                <span className="hidden sm:inline text-white/40">|</span>
                <Link
                  href="/account/signup"
                  className="hidden sm:inline hover:text-white transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            )}
            <span className="hidden lg:inline text-white/40">|</span>
            <Link
              href="/contact"
              className="hidden lg:inline hover:text-white transition-colors whitespace-nowrap"
            >
              Support
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white text-[#0a0a0a]">
        {/* Logo | search (fills the middle) | phone */}
        <div className="site-container h-14 sm:h-[72px] lg:h-20 3xl:h-[100px] flex items-center justify-between gap-3 sm:gap-6 xl:gap-10 overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block group">
              {logoError ? (
                <div className="flex items-center gap-2 py-1 select-none">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e11d1d] flex items-center justify-center text-white shadow-md">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-black text-lg sm:text-xl tracking-tighter text-[#0a0a0a] leading-none">
                      BOMBSHELTERS<span className="text-[#e11d1d]">.COM</span>
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase mt-0.5">
                      Defense &amp; Bunkers
                    </span>
                  </div>
                </div>
              ) : (
                <Image
                  src={logoSrc}
                  alt={brandSettings?.company_name || brandSettings?.companyName || "BombShelters.com"}
                  width={1212}
                  height={194}
                  priority
                  unoptimized
                  onError={() => {
                    if (logoSrc !== "/bombshelters-logo-header.png") {
                      setLogoSrc("/bombshelters-logo-header.png");
                    } else {
                      setLogoError(true);
                    }
                  }}
                  // The spark sits above the lettering, so nudge up ~18% to centre the letters on the row
                  className="h-6 xs:h-7 sm:h-9 lg:h-[46px] 3xl:h-[58px] w-auto max-w-[160px] xs:max-w-[200px] sm:max-w-none object-contain -translate-y-[18%] transition-transform group-hover:scale-[1.02]"
                />
              )}
            </Link>
          </div>

          {/* Search (Desktop) — sends the query to the models catalog */}
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = headerQuery.trim();
              const url = q ? `/models?q=${encodeURIComponent(q)}` : "/models";
              // The catalog reads ?q on mount, so reload it when searching from the catalog itself
              if (pathname === "/models") window.location.assign(url);
              else router.push(url);
            }}
            // Light grey pill search with an inset black "Search" button
            className="group/search hidden lg:flex justify-self-center w-full max-w-[560px] 3xl:max-w-[640px] items-center h-11 3xl:h-12 pl-5 pr-1 rounded-full bg-[#f2f2f3] border border-[#e2e2e5] hover:border-[#d4d4d8] focus-within:bg-white focus-within:border-[#0a0a0a] focus-within:shadow-[0_0_0_4px_rgba(10,10,10,0.06)] transition-all"
          >
            <Search
              className="w-[18px] h-[18px] shrink-0 text-[#71717a] group-focus-within/search:text-[#0a0a0a] transition-colors"
              aria-hidden="true"
            />
            <input
              type="search"
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              placeholder="Search shelters, bunkers, safe rooms, manufacturers..."
              aria-label="Search shelters and models"
              className="flex-1 min-w-0 bg-transparent px-3 text-sm 3xl:text-[15px] text-[#0a0a0a] placeholder-[#71717a] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="submit"
              className="shrink-0 h-9 3xl:h-10 px-5 rounded-full bg-[#0a0a0a] hover:bg-[#e11d1d] text-white text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d1d]"
            >
              Search
            </button>
          </form>

          {/* Contact */}
          <div className="justify-self-end flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Red call button (same style as the site's primary buttons); icon-only on small screens */}
            <a
              href={`tel:${phoneDigits}`}
              className="group/call inline-flex items-center justify-center gap-2.5 whitespace-nowrap h-9 w-9 sm:h-10 sm:w-10 md:w-auto lg:h-11 3xl:h-12 md:px-6 rounded-[6px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-semibold text-[15px] 3xl:text-base shadow-[0_8px_20px_rgba(225,29,29,0.28)] hover:shadow-[0_10px_24px_rgba(225,29,29,0.38)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d1d]"
              aria-label={`Call ${phoneDisplay}`}
            >
              <Phone className="w-[18px] h-[18px] shrink-0" />
              <span className="hidden md:inline">Call {phoneDisplay}</span>
            </a>

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

      {/* ── Navigation Bar Below (Dark, category links) ───────────────────────────── */}
      <div className="hidden lg:block bg-[#111214] border-b border-white/10">
        <div className="site-container h-9 xl:h-10 3xl:h-11 flex items-stretch overflow-visible">
          <nav className="px-1 xl:px-2 flex-1 flex items-stretch justify-between flex-nowrap overflow-visible min-w-0">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group shrink-0 flex"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-1 px-1.5 xl:px-2 text-[11px] xl:text-[11.5px] 2xl:text-[12px] 3xl:text-[13.5px] font-display font-bold tracking-[0.06em] uppercase whitespace-nowrap transition-colors hover:text-white after:absolute after:inset-x-1.5 xl:after:inset-x-2 after:bottom-0 after:h-[2px] after:bg-[#e11d1d] after:origin-left after:transition-transform after:duration-200 group-hover:after:scale-x-100 ${
                    item.href !== "/" && pathname?.startsWith(item.href)
                      ? "text-white after:scale-x-100"
                      : "text-white/85 after:scale-x-0"
                  }`}
                >
                  <span>
                    {item.label === "ADUs & Granny Pods" ? (
                      <>
                        <span className="hidden xl:inline">ADUs &amp; Granny Pods</span>
                        <span className="xl:hidden">ADUs</span>
                      </>
                    ) : (
                      item.label
                    )}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Link>

                {/* Dropdown Menu for "More" */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className="absolute top-full right-0 w-[580px] max-w-[94vw] p-4 bg-[#16181b] border border-[#2a2d31] rounded-[4px] shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-150">
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
            {isAuthenticated && customer ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-bold hover:text-[#e11d1d]"
                >
                  <User className="w-4 h-4 text-amber-300" />
                  <span>Account: {customer.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-gray-400 hover:text-white font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/account/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/account/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-lg bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-bold text-xs"
                >
                  Register
                </Link>
              </div>
            )}
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
