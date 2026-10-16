"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  Search, 
  Play, 
  BookOpen, 
  Info, 
  PhoneCall, 
  Star, 
  Compass,
  Layers,
  FolderOpen,
  FileText,
  ShieldCheck,
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Download,
  Home,
  Truck,
  HelpCircle,
  DollarSign,
  CreditCard
} from "lucide-react";
import { PublicGlobalSettings } from "@/lib/settings";
import { CmsPage, MegaMenuCatalog } from "@/lib/publicData";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface CategoryNavOption {
  label: string;
  href: string;
  categoryQuery?: string;
  badge?: string;
}

const PRIMARY_MENU_OPTIONS: CategoryNavOption[] = [
  { label: "Modular Homes", href: "/modular-homes", categoryQuery: "Modular Homes" },
  { label: "Prefab Homes", href: "/prefab-homes", categoryQuery: "Prefab Homes" },
  { label: "Modular Cabins", href: "/modular-cabins", categoryQuery: "Modular Cabins" },
  { label: "Barndominiums", href: "/barndominiums", categoryQuery: "Barndominiums" },
  { label: "House Kits", href: "/house-kits", categoryQuery: "House Kits" },
  { label: "Tiny Homes", href: "/tiny-homes", categoryQuery: "Tiny Homes" },
  { label: "Park Models", href: "/park-models", categoryQuery: "Park Models" },
  { label: "Cabins", href: "/cabins", categoryQuery: "Cabins" },
  { label: "ADUs & Granny Pods", href: "/adus", categoryQuery: "ADUs & Granny Pods" },
  { label: "A-Frames", href: "/a-frame-homes", categoryQuery: "A-Frame Homes" },
  { label: "Commercial", href: "/commercial-modular-buildings", categoryQuery: "Commercial Buildings" },
];

const MORE_BUYER_GUIDES = [
  { 
    label: "Delivery & Crane Setting", 
    href: "/delivery", 
    desc: "Nationwide freight, cranes & site prep",
    icon: Truck 
  },
  { 
    label: "Frequently Asked Questions", 
    href: "/faqs", 
    desc: "Clear answers to top buyer questions",
    icon: HelpCircle 
  },
  { 
    label: "Pricing & Packages", 
    href: "/pricing", 
    desc: "Turnkey cost tiers & square foot rates",
    icon: DollarSign 
  },
  { 
    label: "Financing & Mortgages", 
    href: "/financing", 
    desc: "FHA, VA, USDA & construction loans",
    icon: CreditCard 
  },
  { 
    label: "How It Works", 
    href: "/how-it-works", 
    desc: "5-step factory build to move-in day",
    icon: Compass 
  },
  { 
    label: "Blogs", 
    href: "/blogs", 
    desc: "Educational articles, tours & build guides",
    icon: BookOpen 
  },
  { 
    label: "Collections", 
    href: "/collections", 
    desc: "Browse 400+ curated home & cabin collections",
    icon: FolderOpen 
  },
];

const MORE_SERVICES_RESOURCES = [
  { 
    label: "Floor Plan Store", 
    href: "/floor-plans", 
    desc: "Browse & download construction blueprints",
    icon: Layers 
  },
  { 
    label: "Custom Homes", 
    href: "/custom-homes", 
    desc: "Bespoke engineered modular floor plans",
    icon: Compass 
  },
  { 
    label: "Upload Floor Plan", 
    href: "/upload-floor-plan", 
    desc: "Submit sketch or CAD for instant estimate",
    icon: FileText 
  },
  { 
    label: "Factory Video Tours", 
    href: "/videos", 
    desc: "Watch indoor precision build walk-throughs",
    icon: Play 
  },
  { 
    label: "About ModularHome", 
    href: "/about", 
    desc: "Our story, IRC standards & warranty",
    icon: Info 
  },
  { 
    label: "Customer Reviews", 
    href: "/#testimonials", 
    desc: "Verified homeowner ratings & project photos",
    icon: Star 
  },
  { 
    label: "Contact & Consultations", 
    href: "/contact", 
    desc: "Speak with an architectural advisor",
    icon: PhoneCall 
  },
];

export interface NavbarProps {
  initialSettings?: PublicGlobalSettings;
  customPages?: CmsPage[];
  megaMenuCatalog?: MegaMenuCatalog;
}

function NavbarContent({ initialSettings, customPages = [], megaMenuCatalog = {} }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMegaCategory, setOpenMegaCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isPinnedMore, setIsPinnedMore] = useState(false);
  const moreDropdownOpenRef = useRef(false);
  const isPinnedMoreRef = useRef(false);
  const isInteractingDropdownRef = useRef(false);

  useEffect(() => {
    moreDropdownOpenRef.current = moreDropdownOpen;
  }, [moreDropdownOpen]);

  useEffect(() => {
    isPinnedMoreRef.current = isPinnedMore;
  }, [isPinnedMore]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const headerContainerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuPanelRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { customer, isAuthenticated, logout } = useCustomerAuth();

  const currentCategory = searchParams ? searchParams.get("category") : null;

  // Set of all core/featured slugs so they are never duplicated under "Special Guides & Pages"
  const KNOWN_NAV_SLUGS = new Set([
    "delivery", "faqs", "faq", "pricing", "financing", "how-it-works",
    "floor-plans", "custom-homes", "upload-floor-plan", "videos", 
    "blogs", "blog", "about", "contact", "home", "index", "quote",
    "cabins", "adus", "a-frame-homes", "commercial-modular-buildings", "buildings",
    "collections"
  ]);

  // Published custom pages (excluding core duplicates and home/index)
  const publishedPages = (customPages || []).filter((p) => {
    if (!p || p.status !== "PUBLISHED") return false;
    const cleanSlug = (p.slug || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    return cleanSlug !== "" && !KNOWN_NAV_SLUGS.has(cleanSlug);
  });

  const phone = initialSettings?.phone || "+1 (812) 595-4033";
  const email = initialSettings?.email || "support@modularhome.com";
  const logoUrl = initialSettings?.logoUrl || "/newmodularlogo.png";
  const announcementText = initialSettings?.announcementText || "Direct Factory Modular & Prefab Home Builder • 2026 Models Released";
  const announcementLink = initialSettings?.announcementLink || "/buildings";
  const announcementEnabled = initialSettings?.announcementEnabled !== false;
  const ctaLabel = initialSettings?.ctaLabel || "Get Your Free Quote";
  const ctaLink = initialSettings?.ctaLink || "/quote";
  const socialLinks = initialSettings?.socialLinks || {};

  // Display strictly the building product categories that are available with active models
  const menuItems: CategoryNavOption[] = PRIMARY_MENU_OPTIONS.filter((item) => {
    if (item.href === "/collections" || item.label.toLowerCase().includes("collection")) return true;
    if (megaMenuCatalog && Object.keys(megaMenuCatalog).length > 0) {
      const catData = megaMenuCatalog[item.label];
      return Boolean(catData && catData.products && catData.products.length > 0);
    }
    return true;
  });

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMegaCategory(null);
    setMoreDropdownOpen(false);
    setIsPinnedMore(false);
    setUserMenuOpen(false);
  }, [pathname, searchParams]);

  // Handle outside clicks, scrollbar interactions, and Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If user is currently dragging or interacting with the dropdown scrollbar, do not close!
      if (isInteractingDropdownRef.current) return;

      const target = event.target as Node | null;

      // Check if click was on or inside the header or dropdown
      if (target) {
        if (headerContainerRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
          return;
        }
      }

      // Check if click coordinates fall within the More dropdown card rect (including scrollbar area)
      if (dropdownRef.current && moreDropdownOpenRef.current) {
        const card = dropdownRef.current.querySelector("[data-dropdown-card]");
        const button = dropdownRef.current.querySelector("button");
        const { clientX, clientY } = event;

        if (button) {
          const btnRect = button.getBoundingClientRect();
          if (
            clientX >= btnRect.left &&
            clientX <= btnRect.right &&
            clientY >= btnRect.top &&
            clientY <= btnRect.bottom
          ) {
            return;
          }
        }

        if (card) {
          const rect = card.getBoundingClientRect();
          if (
            clientX >= rect.left - 5 &&
            clientX <= rect.right + 25 &&
            clientY >= rect.top - 5 &&
            clientY <= rect.bottom + 25
          ) {
            isInteractingDropdownRef.current = true;
            clearMegaMenuTimer();
            return;
          }
        }
      }

      setOpenMegaCategory(null);
      setMoreDropdownOpen(false);
      setIsPinnedMore(false);
      setUserMenuOpen(false);
    }

    function handleGlobalMouseUp() {
      // Release interacting flag slightly after mouseup
      setTimeout(() => {
        isInteractingDropdownRef.current = false;
      }, 80);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMegaCategory(null);
        setMoreDropdownOpen(false);
        setIsPinnedMore(false);
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buildings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/buildings`);
    }
  };

  const isMoreActive = [
    "/about",
    "/videos",
    "/blogs",
    "/collections",
    "/resources",
    "/contact",
    "/upload-floor-plan",
  ].some((path) => pathname.startsWith(path)) || currentCategory === "Custom Homes" || publishedPages.some((p) => pathname === `/${p.slug}`);

  const megaMenuCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearMegaMenuTimer = () => {
    if (megaMenuCloseTimeoutRef.current) {
      clearTimeout(megaMenuCloseTimeoutRef.current);
      megaMenuCloseTimeoutRef.current = null;
    }
  };

  const scheduleMegaMenuClose = (delay = 200) => {
    if (isPinnedMoreRef.current || isInteractingDropdownRef.current) {
      return;
    }
    clearMegaMenuTimer();
    megaMenuCloseTimeoutRef.current = setTimeout(() => {
      if (isPinnedMoreRef.current || isInteractingDropdownRef.current) {
        return;
      }
      setOpenMegaCategory(null);
      setMoreDropdownOpen(false);
    }, delay);
  };

  useEffect(() => {
    return () => {
      clearMegaMenuTimer();
    };
  }, []);

  // Hover opens the mega-menu for a category immediately
  const handleCategoryMouseEnter = (categoryLabel: string, href?: string) => {
    clearMegaMenuTimer();
    if (href) router.prefetch(href);
    if (megaMenuCatalog && megaMenuCatalog[categoryLabel]) {
      setOpenMegaCategory(categoryLabel);
      setMoreDropdownOpen(false);
      setUserMenuOpen(false);
    }
  };

  const activeCategoryData = openMegaCategory ? megaMenuCatalog[openMegaCategory] : null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (DARK SLEEK RIBBON) */}
      {/* ========================================================================= */}
      {announcementEnabled && (
        <div className="bg-[#0f1218] text-white text-[12px] border-b border-[#1c222e] select-none w-full">
          <div className="wrap py-1.5 sm:py-2 flex items-center justify-between gap-2">
            {/* Left: Phone & Support Email */}
            <div className="flex items-center gap-2 sm:gap-4 text-gray-300 overflow-hidden">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1.5 sm:gap-2 hover:text-[#fcb907] transition-all text-xs sm:text-[14px] lg:text-[15px] font-extrabold text-white group shrink-0"
              >
                <span className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#e5a706] transition-transform shadow-xs shrink-0">
                  <PhoneCall className="w-2.5 sm:w-3 h-2.5 sm:h-3 stroke-[2.5]" />
                </span>
                <span className="tracking-tight text-white group-hover:text-[#fcb907] transition-colors whitespace-nowrap">
                  {phone}
                </span>
              </a>

              <span className="text-[#fcb907]/40 text-[10px] hidden xs:inline">●</span>

              <a
                href={`mailto:${email}`}
                className="hidden xs:inline-flex items-center gap-1.5 hover:text-[#fcb907] transition-colors text-[11px] sm:text-[12px] text-gray-300 group truncate"
              >
                <svg className="w-3 h-3 fill-current text-[#fcb907] group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span className="truncate">{email}</span>
              </a>
            </div>

            {/* Middle: Announcement message */}
            <div className="hidden xl:flex items-center gap-2 text-[11.5px] text-gray-300 truncate max-w-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-pulse"></span>
              <Link href={announcementLink} className="hover:text-[#fcb907] hover:underline truncate">
                {announcementText}
              </Link>
            </div>

            {/* Right: Quick Portal Links & Social Media Icons */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {isAuthenticated && customer ? (
                <div className="hidden lg:flex items-center gap-3 text-[11.5px] text-gray-300 font-medium">
                  <Link href="/account" className="hover:text-[#fcb907] transition-colors flex items-center gap-1.5 text-white font-bold group">
                    <span className="w-4 h-4 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center text-[9px] font-black group-hover:scale-105 transition-transform">
                      {customer.name ? customer.name.charAt(0).toUpperCase() : "U"}
                    </span>
                    <span>Hi, {customer.name ? customer.name.split(" ")[0] : "Customer"}</span>
                  </Link>
                  <span className="text-gray-700">|</span>
                  <Link href="/account?tab=downloads" className="hover:text-[#fcb907] transition-colors">
                    My Blueprints
                  </Link>
                  <span className="text-gray-700">|</span>
                  <Link href="/account?tab=orders" className="hover:text-[#fcb907] transition-colors">
                    Orders
                  </Link>
                  <span className="text-gray-700">|</span>
                  <button
                    onClick={() => logout()}
                    className="hover:text-red-400 text-gray-400 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3 text-[11.5px] text-gray-400 font-medium">
                  <Link href="/upload-floor-plan" className="hover:text-[#fcb907] transition-colors">
                    Upload Plans
                  </Link>
                  <span className="text-gray-700">|</span>
                  <Link href="/account/login" className="hover:text-[#fcb907] transition-colors flex items-center gap-1 text-gray-200">
                    <User className="w-3 h-3 text-[#fcb907]" />
                    <span>Sign In</span>
                  </Link>
                  <span className="text-gray-700">|</span>
                  <Link href="/account/signup" className="hover:text-[#fcb907] transition-colors">
                    Register
                  </Link>
                  <span className="text-gray-700">|</span>
                  <Link href="/contact" className="hover:text-[#fcb907] transition-colors">
                    Support
                  </Link>
                </div>
              )}

              {/* Social Media links (Disabled) */}
              {false && (
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-[10.5px] font-bold tracking-wider uppercase text-gray-400 mr-1 hidden md:inline">
                    FOLLOW:
                  </span>
                  {socialLinks.facebook !== "" && (
                    <a
                      href={socialLinks.facebook || "https://facebook.com/modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="w-[22px] h-[22px] rounded-full bg-white/10 text-white hover:bg-[#fcb907] hover:text-[#101114] flex items-center justify-center hover:scale-110 transition-all"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.instagram !== "" && (
                    <a
                      href={socialLinks.instagram || "https://instagram.com/modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="w-[22px] h-[22px] rounded-full bg-white/10 text-white hover:bg-[#fcb907] hover:text-[#101114] flex items-center justify-center hover:scale-110 transition-all"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.youtube !== "" && (
                    <a
                      href={socialLinks.youtube || "https://youtube.com/@modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="YouTube"
                      className="w-[22px] h-[22px] rounded-full bg-white/10 text-white hover:bg-[#fcb907] hover:text-[#101114] flex items-center justify-center hover:scale-110 transition-all"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.tiktok !== "" && (
                    <a
                      href={socialLinks.tiktok || "https://tiktok.com/@modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="TikTok"
                      className="w-[22px] h-[22px] rounded-full bg-white/10 text-white hover:bg-[#fcb907] hover:text-[#101114] flex items-center justify-center hover:scale-110 transition-all"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.18 2.09 2.35 2.3 1.05.21 2.18-.08 2.96-.8.61-.53.97-1.3 1.01-2.11.05-3.87.02-7.74.03-11.61z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Contact Quick Action */}
            <Link
              href="/contact"
              className="sm:hidden text-gray-300 hover:text-[#fcb907] text-[11px] font-medium flex items-center gap-1"
            >
              <span>Contact</span>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STICKY TWO-TIER ARCHITECTURAL HEADER + PRODUCT MEGA MENU */}
      {/* ========================================================================= */}
      <header 
        ref={headerContainerRef}
        className="sticky top-0 z-50 bg-white/98 backdrop-blur-md shadow-xs transition-shadow w-full select-none"
      >
        {/* --- ROW 1: BRAND LOGO + GLOBAL SEARCH + CTAs --- */}
        <div className="border-b border-[#f0f2f5] w-full bg-white">
          <div className="wrap h-[62px] sm:h-[76px] md:h-[84px] flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-4 md:gap-6">
            
            {/* Left: Mobile Hamburger Toggle + Logo */}
            <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-3 shrink-0 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 -ml-1 text-[#101114] hover:text-[#d97706] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              <Link
                href="/"
                prefetch={true}
                onMouseEnter={() => router.prefetch("/")}
                className="flex items-center group select-none shrink-0 py-0.5"
              >
                <Image
                  src={logoUrl}
                  alt={initialSettings?.companyName || "ModularHome.com"}
                  width={400}
                  height={85}
                  priority
                  className="h-8.5 xs:h-9.5 sm:h-12 md:h-14 lg:h-[58px] xl:h-[64px] w-auto max-w-[185px] xs:max-w-[235px] sm:max-w-[310px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-none object-contain hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>

            {/* Center: Search / Explore Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 50+ modular models, floor plans, ADUs, cabins..."
                  className="w-full bg-[#f6f7f9] hover:bg-[#f1f3f6] focus:bg-white text-xs sm:text-[13px] text-[#101114] placeholder-gray-400 pl-10 pr-24 py-2 sm:py-2.5 rounded-full border border-gray-200/90 focus:border-[#fcb907] focus:ring-3 focus:ring-[#fcb907]/20 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1 sm:py-1.5 bg-[#101114] hover:bg-[#fcb907] hover:text-[#101114] text-white text-[11px] font-bold rounded-full transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right: Quick Features & Main CTA Button */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label={`View Cart with ${itemCount} items`}
                className="relative p-1.5 sm:p-2 text-[#101114] hover:text-[#d97706] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#fcb907] text-[#101114] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Customer Account Button / Dropdown */}
              {isAuthenticated && customer ? (
                <div
                  ref={userMenuRef}
                  className="relative hidden sm:inline-block"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold py-1.5 px-2.5 rounded-xl border transition-all cursor-pointer ${
                      userMenuOpen
                        ? "bg-amber-50 border-amber-300 text-[#b45309]"
                        : "bg-[#f6f7f9] hover:bg-gray-100 border-gray-200 text-[#101114]"
                    }`}
                    aria-expanded={userMenuOpen}
                  >
                    <span className="w-5 h-5 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center text-[10px] font-black shrink-0">
                      {customer.name ? customer.name.charAt(0).toUpperCase() : "U"}
                    </span>
                    <span className="max-w-[100px] truncate hidden md:inline">
                      {customer.name ? customer.name.split(" ")[0] : "Account"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-full pt-1.5 w-64 z-[100] animate-in fade-in zoom-in-95 duration-150"
                      onMouseEnter={() => setUserMenuOpen(true)}
                    >
                      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-2.5 shadow-2xl ring-1 ring-black/5 space-y-2">
                        <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="text-xs font-extrabold text-[#101114] truncate">
                            {customer.name || "Customer"}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">
                            {customer.email}
                          </div>
                          {customer.email_verified && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Member</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <Link
                            href="/account"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-[#f6f7f9] hover:text-[#d97706] transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#d97706]" />
                            <span>Client Portal</span>
                          </Link>
                          <Link
                            href="/account?tab=downloads"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-[#f6f7f9] hover:text-[#d97706] transition-colors"
                          >
                            <Download className="w-4 h-4 text-[#d97706]" />
                            <span>My Blueprints & CAD</span>
                          </Link>
                          <Link
                            href="/account?tab=orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-[#f6f7f9] hover:text-[#d97706] transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#d97706]" />
                            <span>Orders & Invoices</span>
                          </Link>
                          <Link
                            href="/account?tab=profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-[#f6f7f9] hover:text-[#d97706] transition-colors"
                          >
                            <User className="w-4 h-4 text-[#d97706]" />
                            <span>Profile & Security</span>
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account/login"
                  title="Sign In to Customer Account"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#101114] hover:text-[#d97706] py-2 px-3 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#fcb907]" />
                  <span>Sign In</span>
                </Link>
              )}

              <Link
                href={ctaLink}
                className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black py-1.5 sm:py-2.5 px-2 xs:px-3 sm:px-4 text-[11px] xs:text-xs md:text-[13px] tracking-tight rounded-lg sm:rounded-xl shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                <span className="hidden xs:inline">{ctaLabel}</span>
                <span className="xs:hidden">Get Quote</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* --- ROW 2: PRIMARY ARCHITECTURAL HOUSING CATEGORIES RIBBON --- */}
        <div className="hidden lg:block border-b border-gray-200/80 bg-white relative z-40">
          <div className="wrap relative overflow-visible">
            <nav 
              className="flex items-center justify-center relative py-1.5 overflow-visible"
              aria-label="Main Housing Categories Navigation"
            >
              <div className="flex items-center justify-between w-full max-w-full gap-0.5 xl:gap-1.5 2xl:gap-2 flex-nowrap overflow-visible">
                {menuItems.map((item) => {
                  const activeRoute = Boolean(
                    currentCategory === item.categoryQuery ||
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(`${item.href}/`))
                  );

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      prefetch={true}
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        setOpenMegaCategory(null);
                      }}
                      className={`inline-flex items-center gap-1 px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-150 shrink-0 ${
                        activeRoute
                          ? "bg-amber-50/90 text-[#b45309] font-black"
                          : "text-gray-700 hover:text-[#101114] hover:bg-gray-50/80"
                      }`}
                      style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-[#fcb907] text-[#101114] text-[8.5px] font-black tracking-tight leading-none">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {/* "More" Dropdown Menu */}
                <div 
                  ref={dropdownRef}
                  className="relative inline-block shrink-0"
                  onMouseEnter={() => {
                    clearMegaMenuTimer();
                    setMoreDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (!isPinnedMore && !isInteractingDropdownRef.current) {
                      scheduleMegaMenuClose(350);
                    }
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearMegaMenuTimer();
                      if (moreDropdownOpen && isPinnedMore) {
                        setMoreDropdownOpen(false);
                        setIsPinnedMore(false);
                      } else {
                        setMoreDropdownOpen(true);
                        setIsPinnedMore(true);
                      }
                    }}
                    className={`inline-flex items-center gap-1 px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isMoreActive || moreDropdownOpen
                        ? "bg-amber-50/90 text-[#b45309] font-black"
                        : "text-gray-700 hover:text-[#101114] hover:bg-gray-50/80"
                    }`}
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                    aria-expanded={moreDropdownOpen}
                  >
                    <span>More</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Floating Card */}
                  {moreDropdownOpen && (
                    <div 
                      className="absolute right-0 top-full pt-2 w-[94vw] max-w-[640px] sm:w-[640px] z-[100] animate-in fade-in zoom-in-95 duration-150"
                      onMouseEnter={clearMegaMenuTimer}
                      onMouseLeave={() => {
                        if (!isPinnedMore && !isInteractingDropdownRef.current) {
                          scheduleMegaMenuClose(350);
                        }
                      }}
                    >
                      <div 
                        data-dropdown-card="true"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          clearMegaMenuTimer();
                          isInteractingDropdownRef.current = true;
                        }}
                        className="bg-white border border-[#e5e7eb] rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden flex flex-col"
                      >
                        <div 
                          onScroll={clearMegaMenuTimer}
                          onWheel={(e) => {
                            const el = e.currentTarget;
                            const atTop = el.scrollTop === 0;
                            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
                            if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                              // at boundary — do nothing (let the event be consumed but don't propagate)
                            }
                            e.stopPropagation();
                          }}
                          className="max-h-[min(74vh,540px)] overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3 dropdown-menu-scrollbar"
                        >
                          {/* 2-Column Responsive Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
                            {/* Column 1: Essential Buyer Guides */}
                            <div>
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#d97706] px-2 py-1 border-b border-gray-100 mb-1.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#fcb907]" />
                                <span>Buyer Guides & Logistics</span>
                              </div>
                              <div className="space-y-0.5">
                                {MORE_BUYER_GUIDES.map((option) => (
                                  <Link
                                    key={option.label}
                                    href={option.href}
                                    onClick={() => {
                                      setMoreDropdownOpen(false);
                                      setIsPinnedMore(false);
                                    }}
                                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f6f7f9] text-[#101114] hover:text-[#d97706] transition-colors group"
                                  >
                                    <div className="p-1.5 rounded-lg bg-[#fcb907]/15 text-[#d97706] group-hover:bg-[#fcb907] group-hover:text-[#101114] transition-colors shrink-0 mt-0.5">
                                      <option.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold leading-snug group-hover:text-[#d97706]">
                                        {option.label}
                                      </div>
                                      <div className="text-[10.5px] text-[#6b7280] font-normal leading-tight mt-0.5 truncate">
                                        {option.desc}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Column 2: Design & Planning Resources */}
                            <div>
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2 py-1 border-b border-gray-100 mb-1.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                <span>Services & Planning</span>
                              </div>
                              <div className="space-y-0.5">
                                {MORE_SERVICES_RESOURCES.map((option) => (
                                  <Link
                                    key={option.label}
                                    href={option.href}
                                    onClick={() => {
                                      setMoreDropdownOpen(false);
                                      setIsPinnedMore(false);
                                    }}
                                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f6f7f9] text-[#101114] hover:text-[#d97706] transition-colors group"
                                  >
                                    <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-[#fcb907] group-hover:text-[#101114] transition-colors shrink-0 mt-0.5">
                                      <option.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold leading-snug group-hover:text-[#d97706]">
                                        {option.label}
                                      </div>
                                      <div className="text-[10.5px] text-[#6b7280] font-normal leading-tight mt-0.5 truncate">
                                        {option.desc}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Extra Custom Pages (if any exist that are not core) */}
                          {publishedPages.length > 0 && (
                            <div className="border-t border-[#f0f2f5] pt-2.5">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#d97706] px-2 py-1 border-b border-gray-100 mb-1 flex items-center justify-between">
                                <span>Additional Resources & Pages</span>
                                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-[#b45309] text-[9px]">
                                  {publishedPages.length}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                {publishedPages.map((page) => (
                                  <Link
                                    key={page.id}
                                    href={`/${page.slug}`}
                                    onClick={() => {
                                      setMoreDropdownOpen(false);
                                      setIsPinnedMore(false);
                                    }}
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-amber-50/70 text-[#101114] hover:text-[#d97706] transition-colors group"
                                  >
                                    <div className="p-1 rounded bg-[#f6f7f9] text-[#6b7280] group-hover:bg-[#fcb907] group-hover:text-[#101114] transition-colors shrink-0">
                                      <FileText className="w-3 h-3" />
                                    </div>
                                    <span className="text-[11px] font-bold truncate flex-1">{page.title}</span>
                                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#d97706] shrink-0" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Bottom Quick Help Bar */}
                          <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between text-[11px] px-1">
                            <span className="text-gray-500 font-medium">Have questions about site requirements or building codes?</span>
                            <Link
                              href="/quote"
                              onClick={() => {
                                setMoreDropdownOpen(false);
                                setIsPinnedMore(false);
                              }}
                              className="text-[#d97706] font-extrabold hover:underline flex items-center gap-1 shrink-0 ml-2"
                            >
                              <span>Get Free Estimate</span>
                              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Desktop category mega-menu disabled: direct navigation on click; only More has options */}
        {Boolean(false) && activeCategoryData && (
          <div
            id="mega-menu-panel"
            ref={megaMenuPanelRef}
            onMouseEnter={clearMegaMenuTimer}
            onMouseLeave={() => scheduleMegaMenuClose(150)}
            className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white border-b border-gray-200/90 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            <div className="wrap py-7 px-4 sm:px-6">
              <div className="grid grid-cols-12 gap-8 items-stretch">
                
                {/* LEFT SIDE: Category Information + Product Links List */}
                <div className="col-span-7 xl:col-span-8 flex flex-col justify-between pr-6 border-r border-gray-100">
                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#d97706] mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                        <span>{activeCategoryData.categoryLabel}</span>
                      </div>
                      <div 
                        className="text-2xl font-black tracking-tight text-[#101114]"
                        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                      >
                        {activeCategoryData.categoryLabel}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {activeCategoryData.tagline || `Explore top-rated precision models and custom options.`}
                      </p>
                    </div>

                    {/* Products Links Grid */}
                    {activeCategoryData.products && activeCategoryData.products.length > 0 ? (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-1.5 my-2">
                        {activeCategoryData.products.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setOpenMegaCategory(null)}
                            className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/60 transition-all border border-transparent hover:border-amber-200/50"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span 
                                  className="text-[13.5px] font-bold text-[#1e293b] group-hover:text-[#d97706] transition-colors truncate"
                                  style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                                >
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-[#b45309] text-[9px] font-black uppercase shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#64748b] font-medium flex items-center gap-1.5 mt-0.5">
                                {item.startingPrice && item.startingPrice > 0 ? (
                                  <span className="text-[#0f172a] font-bold">
                                    ${new Intl.NumberFormat("en-US").format(item.startingPrice)}
                                  </span>
                                ) : null}
                                {item.sqft && item.sqft > 0 ? (
                                  <span>• {item.sqft} SQ FT</span>
                                ) : null}
                                {item.bedrooms && item.bedrooms > 0 ? (
                                  <span>• {item.bedrooms} Bed</span>
                                ) : null}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#d97706] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 px-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500 font-medium my-2">
                        No featured models listed yet in this section.
                      </div>
                    )}
                  </div>

                  {/* Explore All CTA Link */}
                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={activeCategoryData.viewAllHref}
                      onClick={() => setOpenMegaCategory(null)}
                      className="inline-flex items-center gap-2 text-sm font-black text-[#d97706] hover:text-[#b45309] group"
                      style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                    >
                      <span className="group-hover:underline">Explore All {activeCategoryData.categoryLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                    </Link>

                    <Link
                      href="/quote"
                      onClick={() => setOpenMegaCategory(null)}
                      className="text-xs text-gray-400 hover:text-gray-700 font-medium hover:underline"
                    >
                      Need Custom Pricing? Get a Quote →
                    </Link>
                  </div>
                </div>

                {/* RIGHT SIDE: Featured Model Showcase Card */}
                <div className="col-span-5 xl:col-span-4 flex flex-col">
                  {activeCategoryData.featuredProduct ? (
                    <Link
                      href={activeCategoryData.featuredProduct.href}
                      onClick={() => setOpenMegaCategory(null)}
                      className="block h-full group bg-[#f8fafc] hover:bg-amber-50/40 border border-gray-200/80 hover:border-amber-300/80 rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Container with Badge */}
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-200 mb-3.5">
                          <Image
                            src={activeCategoryData.featuredProduct.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
                            alt={activeCategoryData.featuredProduct.name}
                            fill
                            sizes="(max-width: 1200px) 35vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-[#101114]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                            ★ {activeCategoryData.featuredProduct.badge || "Featured Model"}
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#d97706]">
                          {activeCategoryData.categoryLabel}
                        </div>
                        <div 
                          className="text-base font-black text-[#101114] group-hover:text-[#d97706] transition-colors truncate mt-0.5"
                          style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                        >
                          {activeCategoryData.featuredProduct.name}
                        </div>
                        <p className="text-xs text-[#64748b] line-clamp-1 mt-0.5 font-medium">
                          {activeCategoryData.featuredProduct.tagline || `${activeCategoryData.categoryLabel} Floor Plan & Kit`}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                        {activeCategoryData.featuredProduct.startingPrice && activeCategoryData.featuredProduct.startingPrice > 0 ? (
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-bold">Starting Price</span>
                            <span className="font-black text-[#101114] text-[13px]">
                              ${new Intl.NumberFormat("en-US").format(activeCategoryData.featuredProduct.startingPrice)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-gray-500 font-bold">Custom Quote Available</div>
                        )}

                        <span className="inline-flex items-center gap-1 font-black text-[#d97706] group-hover:underline">
                          <span>View Model</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center flex-1 flex flex-col items-center justify-center">
                      <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <div className="text-xs font-bold text-gray-700">Custom Engineering Available</div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        We build bespoke floor plans and structures configured to your exact site specs.
                      </p>
                      <Link
                        href={activeCategoryData.viewAllHref}
                        onClick={() => setOpenMegaCategory(null)}
                        className="inline-block mt-3 text-xs font-black text-[#d97706] hover:underline"
                      >
                        Explore All {activeCategoryData.categoryLabel} →
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="w-[88%] max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e7e9ee]">
              <Link
                href="/"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center"
              >
                <Image
                  src={logoUrl}
                  alt="ModularHome.com"
                  width={300}
                  height={65}
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-[#101114] rounded-lg hover:bg-gray-100 cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="py-4 border-b border-[#e7e9ee]">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search home designs..."
                  className="w-full bg-[#f6f7f9] text-xs text-[#101114] pl-9 pr-3 py-2.5 rounded-xl border border-[#dfe2e7] focus:outline-none focus:border-[#fcb907]"
                />
              </form>
            </div>

            {/* Mobile Categories List with Expandable Accordions */}
            <div className="py-3 flex-1 space-y-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Building Categories
                          <div className="space-y-1">
                  {menuItems.map((item) => (
                    <div key={item.label} className="border-b border-gray-50 last:border-none pb-0.5">
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-[#f6f7f9] hover:text-[#d97706]"
                      >
                        <span className="flex items-center gap-1.5">
                          {item.label}
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#fcb907] text-[#101114] text-[9px] font-black">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                    </div>
                  ))}
                </div>        </div>
              </div>

              {/* Buyer Guides & Resources on Mobile */}
              <div className="pt-2 border-t border-[#e7e9ee] space-y-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#d97706] mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Buyer Guides & Logistics</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {MORE_BUYER_GUIDES.map((guide) => (
                      <Link
                        key={guide.label}
                        href={guide.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-amber-50 hover:text-[#d97706]"
                      >
                        <span className="flex items-center gap-2">
                          <guide.icon className="w-3.5 h-3.5 text-[#d97706]" />
                          <span>{guide.label}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Services & Planning</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {MORE_SERVICES_RESOURCES.map((res) => (
                      <Link
                        key={res.label}
                        href={res.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-gray-100 hover:text-[#d97706]"
                      >
                        <span className="flex items-center gap-2">
                          <res.icon className="w-3.5 h-3.5 text-gray-500" />
                          <span>{res.label}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Pages on Mobile */}
              {publishedPages.length > 0 && (
                <div className="pt-2 border-t border-[#e7e9ee]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#d97706] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Additional Resources</span>
                  </div>
                  <div className="space-y-1">
                    {publishedPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#101114] hover:bg-amber-50 hover:text-[#d97706]"
                      >
                        <span className="truncate">{page.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Customer Portal Section */}
              <div className="pt-2 border-t border-[#e7e9ee]">
                {isAuthenticated && customer ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fcb907] text-[#101114] flex items-center justify-center text-sm font-black shrink-0">
                          {customer.name ? customer.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-[#101114] truncate">
                            {customer.name || "Customer"}
                          </div>
                          <div className="text-[11px] text-gray-600 truncate">
                            {customer.email}
                          </div>
                          {customer.email_verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 mt-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Member</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#374151]">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#101114] hover:text-[#d97706] flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#d97706]" />
                        <span>Portal</span>
                      </Link>
                      <Link
                        href="/account?tab=downloads"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#101114] hover:text-[#d97706] flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-[#d97706]" />
                        <span>Downloads</span>
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#101114] hover:text-[#d97706] flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#d97706]" />
                        <span>Orders</span>
                      </Link>
                      <Link
                        href="/account?tab=profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#101114] hover:text-[#d97706] flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-[#d97706]" />
                        <span>Profile</span>
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Customer Account
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/account/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 bg-[#f6f7f9] hover:bg-gray-200 text-[#101114] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5 text-[#fcb907]" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/account/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black rounded-xl flex items-center justify-center gap-1"
                      >
                        <span>Register</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Quick Links */}
              <div className="pt-2 border-t border-[#e7e9ee]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Explore & Learn
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#374151]">
                  <Link href="/floor-plans" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#d97706] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Plans Store</span>
                  </Link>
                  <Link href="/videos" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#d97706] flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Videos</span>
                  </Link>
                  <Link href="/blogs" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#d97706] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Blog & Guides</span>
                  </Link>
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#d97706] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>About Us</span>
                  </Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#d97706] flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Contact</span>
                  </Link>
                  <Link href="/upload-floor-plan" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#d97706] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Custom Plans</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 space-y-2.5 border-t border-[#e7e9ee] mt-4">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-[#101114] hover:bg-[#222] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Call {phone}</span>
              </Link>

              <Link
                href={ctaLink}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar({ initialSettings, customPages = [], megaMenuCatalog = {} }: NavbarProps) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-[#e7e9ee] h-[110px]" />
    }>
      <NavbarContent initialSettings={initialSettings} customPages={customPages} megaMenuCatalog={megaMenuCatalog} />
    </Suspense>
  );
}
