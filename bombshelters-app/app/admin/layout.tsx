"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  FolderOpen,
  Layers,
  ShoppingBag,
  UsersRound,
  Users,
  FileSpreadsheet,
  Calculator,
  TrendingUp,
  BarChart3,
  FileText,
  Bookmark,
  Star,
  HelpCircle,
  CornerDownRight,
  Globe,
  Image as ImageIcon,
  BookOpen,
  Video,
  Shield,
  KeyRound,
  Activity,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  RotateCw,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Download,
} from "lucide-react";

interface AdminUser {
  id?: string;
  email: string;
  name: string;
  role: string;
}

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 60-Minute Session Limit

function getStoredLastActivity(): number {
  if (typeof window === "undefined") return Date.now();
  try {
    const stored = localStorage.getItem("bombshelter_admin_last_activity");
    const num = stored ? Number(stored) : NaN;
    if (!num || isNaN(num) || num > Date.now()) {
      const now = Date.now();
      localStorage.setItem("bombshelter_admin_last_activity", String(now));
      return now;
    }
    return num;
  } catch {
    return Date.now();
  }
}

function getAdminPageTitle(pathname: string): string {
  if (!pathname || pathname === "/admin") return "Admin Dashboard | BombShelters.com";
  if (pathname === "/admin/login") return "Admin Sign In | BombShelters.com";
  if (pathname === "/admin/products") return "Shelter Models Catalog | Admin Dashboard";
  if (pathname === "/admin/products/new") return "New Shelter Model | Admin Dashboard";
  if (pathname.startsWith("/admin/products/")) return "Edit Shelter Model | Admin Dashboard";
  if (pathname === "/admin/collections") return "Collections Management | Admin Dashboard";
  if (pathname.startsWith("/admin/collections/")) return "Edit Collection | Admin Dashboard";
  if (pathname === "/admin/floor-plans") return "Floor Plans & Blueprints | Admin Dashboard";
  if (pathname === "/admin/floor-plans/new") return "New Blueprint Kit | Admin Dashboard";
  if (pathname.startsWith("/admin/floor-plans/")) return "Edit Blueprint Kit | Admin Dashboard";
  if (pathname === "/admin/orders") return "Fabrication Orders | Admin Dashboard";
  if (pathname === "/admin/customers") return "Client CRM Directory | Admin Dashboard";
  if (pathname.startsWith("/admin/customers/")) return "Client Profile | Admin Dashboard";
  if (pathname === "/admin/leads") return "Customer Inquiries & Leads | Admin Dashboard";
  if (pathname === "/admin/quotations") return "Quote Wizard Pipeline | Admin Dashboard";
  if (pathname === "/admin/pricing") return "Pricing Rules Engine | Admin Dashboard";
  if (pathname === "/admin/analytics") return "Traffic & Pipeline Analytics | Admin Dashboard";
  if (pathname === "/admin/reports") return "Defense Reports & Throughput | Admin Dashboard";
  if (pathname === "/admin/pages") return "CMS Content Pages | Admin Dashboard";
  if (pathname.startsWith("/admin/pages/")) return "Edit CMS Page | Admin Dashboard";
  if (pathname === "/admin/sections") return "Homepage Section Blocks | Admin Dashboard";
  if (pathname === "/admin/reviews") return "Testimonials & Blast Ratings | Admin Dashboard";
  if (pathname === "/admin/faqs") return "FAQ Knowledge Base | Admin Dashboard";
  if (pathname === "/admin/redirects") return "301/302 Redirect Manager | Admin Dashboard";
  if (pathname === "/admin/settings") return "Global Store Settings | Admin Dashboard";
  if (pathname === "/admin/settings/header") return "Header Settings | Admin Dashboard";
  if (pathname === "/admin/settings/footer") return "Footer Settings | Admin Dashboard";
  if (pathname === "/admin/settings/navigation") return "Navigation Menus | Admin Dashboard";
  if (pathname === "/admin/media") return "Media Assets Library | Admin Dashboard";
  if (pathname === "/admin/blogs") return "Survival Guides & Articles | Admin Dashboard";
  if (pathname === "/admin/blogs/new") return "New Technical Article | Admin Dashboard";
  if (pathname.startsWith("/admin/blogs/")) return "Edit Technical Article | Admin Dashboard";
  if (pathname === "/admin/videos") return "Video Gallery & Tours | Admin Dashboard";
  if (pathname === "/admin/shopify") return "Store & Shopify Sync | Admin Dashboard";
  if (pathname === "/admin/users") return "Clearance Users & Roles | Admin Dashboard";
  if (pathname === "/admin/security") return "Security & DEFCON Lockout | Admin Dashboard";
  if (pathname === "/admin/logs") return "Activity Audit Logs | Admin Dashboard";
  return "BombShelters.com Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const isLoginPage = pathname === "/admin/login";

  // Dynamic Browser Document Title
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = getAdminPageTitle(pathname);
    }
  }, [pathname]);

  // Logout Handler with full client purge
  const performLogout = useCallback(
    async (reason: "session_expired" | "unauthorized" | "manual" = "manual") => {
      if (isLoggingOut) return;
      setIsLoggingOut(true);
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("bombshelter_admin_last_activity");
          localStorage.setItem("bombshelter_admin_logout_signal", String(Date.now()));
        }
        await fetch("/api/bombshelter/admin/auth/logout", { method: "POST" });
      } catch {}
      setUser(null);
      const targetUrl =
        reason === "manual"
          ? "/admin/login?reason=manual"
          : `/admin/login?redirect=${encodeURIComponent(pathname || "/admin")}&reason=${reason}`;

      if (typeof window !== "undefined") {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
    },
    [isLoggingOut, pathname, router]
  );

  // Extend / Refresh Session
  const extendSession = useCallback(async () => {
    const now = Date.now();
    setLastActivity(now);
    setSecondsRemaining(Math.floor(INACTIVITY_LIMIT_MS / 1000));
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("bombshelter_admin_last_activity", String(now));
      }
      const res = await fetch("/api/bombshelter/admin/auth/me", { cache: "no-store" });
      if (res.status === 401) {
        performLogout("unauthorized");
      }
    } catch {}
  }, [performLogout]);

  // Check initial authentication
  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/bombshelter/admin/auth/me", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setUser(json.data);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // Default administrator user
      setUser({
        email: "admin@bombshelters.com",
        name: "Administrator",
        role: "DEFCON_COMMANDER",
      });
      setLoading(false);
    }

    checkAuth();
  }, [isLoginPage]);

  // Activity event listener for sliding session
  useEffect(() => {
    if (isLoginPage || typeof window === "undefined") return;

    let lastRecord = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastRecord > 3000) {
        lastRecord = now;
        setLastActivity(now);
        try {
          localStorage.setItem("bombshelter_admin_last_activity", String(now));
        } catch {}
      }
    };

    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("mousedown", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity, { passive: true });
    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("touchstart", handleActivity, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [isLoginPage]);

  // Inactivity countdown
  useEffect(() => {
    if (isLoginPage) return;

    const countdown = setInterval(() => {
      const last = getStoredLastActivity();
      const elapsed = Date.now() - last;
      const remaining = Math.max(0, Math.floor((INACTIVITY_LIMIT_MS - elapsed) / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(countdown);
        performLogout("session_expired");
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [isLoginPage, performLogout]);

  // Dynamic Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!pathname || pathname === "/admin") {
      return [{ label: "Dashboard", href: "/admin" }];
    }
    const parts = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Admin", href: "/admin" }];

    const routeMap: Record<string, string> = {
      products: "Shelter Models",
      "floor-plans": "Floor Plans & Blueprints",
      collections: "Collections",
      orders: "Fabrication Orders",
      customers: "Customer CRM",
      leads: "Inbound Leads",
      quotations: "Quotations",
      pricing: "Pricing Rules Engine",
      analytics: "Sales & Analytics",
      reports: "Reports & Financials",
      pages: "Pages",
      sections: "Page Sections",
      reviews: "Reviews & Testimonials",
      faqs: "FAQs",
      redirects: "301 Redirects",
      settings: "Global Settings",
      header: "Header Bar",
      footer: "Footer Config",
      navigation: "Navigation Menu",
      media: "Media Library",
      blogs: "Survival Guides",
      videos: "Video Tours",
      shopify: "Shopify Sync",
      users: "User Roles",
      security: "Security & Lockout",
      logs: "Activity Logs",
      new: "New Entry",
    };

    let accumulatedPath = "";
    parts.forEach((part, index) => {
      accumulatedPath += `/${part}`;
      if (index === 0) return;
      const label =
        routeMap[part] ||
        (part.length > 20 ? "Detail View" : part.charAt(0).toUpperCase() + part.slice(1));
      crumbs.push({ label, href: accumulatedPath });
    });

    return crumbs;
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#e11d1d] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-600 font-mono text-xs tracking-wider uppercase font-bold">
            Verifying Clearance Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Navigation Groups matching BombShelter structure in Black - White - Red theme
  const navSections = [
    {
      group: "Overview",
      items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      group: "Bunker Models & Blueprints",
      items: [
        { label: "Shelter Models", href: "/admin/products", icon: Home },
        { label: "Collections & Series", href: "/admin/collections", icon: FolderOpen },
        { label: "Floor Plan Kits", href: "/admin/floor-plans", icon: Download },
      ],
    },
    {
      group: "Transactions & Pipeline",
      items: [
        { label: "Fabrication Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Customer CRM", href: "/admin/customers", icon: UsersRound },
        { label: "Inbound Leads", href: "/admin/leads", icon: Users },
        { label: "Quote Wizard Pipeline", href: "/admin/quotations", icon: FileSpreadsheet },
        { label: "Pricing Rules Engine", href: "/admin/pricing", icon: TrendingUp },
      ],
    },
    {
      group: "Analytics & Intelligence",
      items: [
        { label: "Pipeline Analytics", href: "/admin/analytics", icon: TrendingUp },
        { label: "Financial Reports", href: "/admin/reports", icon: BarChart3 },
      ],
    },
    {
      group: "Website CMS & Pages",
      items: [
        { label: "Page Manager", href: "/admin/pages", icon: FileText },
        { label: "Section Blocks", href: "/admin/sections", icon: Bookmark },
        { label: "Reviews & Testimonials", href: "/admin/reviews", icon: Star },
        { label: "FAQs Manager", href: "/admin/faqs", icon: HelpCircle },
        { label: "301 Redirects", href: "/admin/redirects", icon: CornerDownRight },
        { label: "Global Settings", href: "/admin/settings", icon: Globe },
      ],
    },
    {
      group: "Media & Integrations",
      items: [
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
        { label: "Blogs & Articles", href: "/admin/blogs", icon: BookOpen },
        { label: "YouTube Auto-Sync", href: "/admin/videos", icon: Video },
        { label: "Shopify Migration", href: "/admin/shopify", icon: RefreshCw },
      ],
    },
    {
      group: "Security & Administration",
      items: [
        { label: "Admin Users & Roles", href: "/admin/users", icon: Shield },
        { label: "Security & DEFCON Lockout", href: "/admin/security", icon: KeyRound },
        { label: "Activity Logs & Audits", href: "/admin/logs", icon: Activity },
      ],
    },
  ];

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isExpiringSoon = secondsRemaining <= 180 && secondsRemaining > 0;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f8f9fa] flex flex-col text-[#101114] font-sans selection:bg-[#e11d1d] selection:text-white overflow-hidden z-10 antialiased">
      {/* Imminent Expiration Warning Banner (Black & Red) */}
      {isExpiringSoon && (
        <div className="bg-[#e11d1d] text-white px-4 py-2 text-xs font-black flex items-center justify-between shadow-md shrink-0 z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>
              Session Expiring in {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s due to inactivity. You will be automatically logged out.
            </span>
          </div>
          <button
            onClick={extendSession}
            className="px-3 py-1 bg-[#101114] text-white hover:bg-black rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5 text-white" />
            <span>Keep Working (Extend)</span>
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation (Black) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b0d11] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-white/10 lg:static lg:h-full lg:shrink-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-[#08090d] shrink-0">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-white/20 shadow-xs group-hover:scale-102 transition-transform">
                <Image
                  src="/bomb_logo.png"
                  alt="BombShelters.com Admin"
                  width={160}
                  height={36}
                  className="h-7 sm:h-8 w-auto object-contain"
                  priority
                  unoptimized
                />
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 scrollbar-thin scrollbar-thumb-white/10">
            {navSections.map((group) => (
              <div key={group.group} className="space-y-1.5">
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#e11d1d]">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-[#e11d1d] text-white shadow-lg shadow-red-900/30 font-extrabold"
                            : "text-gray-300 hover:text-white hover:bg-white/6"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-gray-400 group-hover:text-[#e11d1d]"
                          }`}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-white opacity-90 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Admin User Card */}
          <div className="p-4 border-t border-white/10 bg-[#08090d] shrink-0">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e11d1d] to-red-800 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs font-mono">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate font-sans">
                    {user?.name || "Administrator"}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                    <span className="uppercase tracking-wider font-semibold text-emerald-300/90 font-mono">
                      {user?.role || "DEFCON COMMANDER"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => performLogout("manual")}
                title="Sign Out of Admin"
                className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport (White & Clean) */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#f8f9fa]">
          {/* Top Fixed App Header (White) */}
          <header className="h-20 bg-white border-b border-[#e7e9ee] shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-[0_2px_16px_rgba(16,24,40,0.03)] z-20">
            <div className="flex items-center gap-4 min-w-0">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#101114] hover:bg-[#f6f7f9] border border-[#e7e9ee] transition-colors"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Dynamic Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-xs font-medium text-[#6b7280] truncate">
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <div key={crumb.href} className="flex items-center gap-1.5 truncate">
                      {idx > 0 && <span className="text-gray-300">/</span>}
                      {isLast ? (
                        <span className="font-bold text-[#101114] truncate font-sans">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="hover:text-[#e11d1d] transition-colors truncate"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Dynamic Session Countdown Pill */}
              <button
                onClick={extendSession}
                title="Click to refresh and extend active session"
                className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  secondsRemaining < 300
                    ? "bg-red-50 text-[#e11d1d] border-red-200 animate-pulse"
                    : "bg-red-50/70 hover:bg-red-100 text-[#e11d1d] border-red-200/80"
                }`}
              >
                <Clock
                  className={`w-3.5 h-3.5 ${
                    secondsRemaining < 300 ? "text-[#e11d1d]" : "text-[#e11d1d]"
                  }`}
                />
                <span>
                  {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s Session
                </span>
                <RotateCw className="w-3 h-3 text-[#e11d1d]/70 hover:rotate-180 transition-transform" />
              </button>

              {/* View Live Store */}
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101114] hover:bg-black text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                <span>View Live Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#e11d1d]" />
              </Link>
            </div>
          </header>

          {/* Page Content Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full pb-16">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
