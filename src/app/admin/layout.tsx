"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Layers,
  Home,
  FolderOpen,
  BookOpen,
  Video,
  Users,
  FileSpreadsheet,
  ShoppingBag,
  RefreshCw,
  Download,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  User as UserIcon,
  Image as ImageIcon,
  Star,
  HelpCircle,
  CornerDownRight,
  Shield,
  Activity,
  KeyRound,
  TrendingUp,
  BarChart3,
  UsersRound,
  AlertTriangle,
  RotateCw,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1-Hour Strict Session Limit

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const isLoginPage = pathname === "/admin/login";

  // Unified Logout Handler
  const performLogout = useCallback(
    async (reason: "session_expired" | "unauthorized" | "manual" = "manual") => {
      if (isLoggingOut) return;
      setIsLoggingOut(true);
      try {
        await fetch("/api/admin/auth/logout", { method: "POST" });
      } catch {}
      setUser(null);
      if (reason === "manual") {
        router.push("/admin/login");
      } else {
        router.push(
          `/admin/login?redirect=${encodeURIComponent(pathname || "/admin")}&reason=${reason}`
        );
      }
      router.refresh();
    },
    [isLoggingOut, pathname, router]
  );

  // Extend / Refresh Session
  const extendSession = useCallback(async () => {
    setLastActivity(Date.now());
    setSecondsRemaining(3600);
    try {
      const res = await fetch("/api/admin/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } else if (res.status === 401) {
        performLogout("session_expired");
      }
    } catch {}
  }, [performLogout]);

  // 1. Session Verification & Periodic Heartbeat (every 45s)
  useEffect(() => {
    if (isLoginPage) return;
    let isMounted = true;

    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/auth/me", { cache: "no-store" });
        if (!res.ok || res.status === 401) {
          if (isMounted) performLogout("session_expired");
          return;
        }
        const data = await res.json();
        if (!data.success || !data.user) {
          if (isMounted) performLogout("session_expired");
        } else if (isMounted) {
          setUser(data.user);
        }
      } catch (err) {
        // Network anomaly will be caught on subsequent heartbeat
      }
    };

    verifySession();
    const heartbeatTimer = setInterval(verifySession, 45000);

    return () => {
      isMounted = false;
      clearInterval(heartbeatTimer);
    };
  }, [isLoginPage, performLogout]);

  // 2. User Inactivity Detection (throttled listener)
  useEffect(() => {
    if (isLoginPage) return;

    let lastRecord = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastRecord > 5000) {
        // Throttle state updates to once every 5 seconds
        lastRecord = now;
        setLastActivity(now);
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

  // 3. Countdown Timer & Auto-Logout Trigger
  useEffect(() => {
    if (isLoginPage) return;

    const countdown = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = Math.max(0, Math.floor((INACTIVITY_LIMIT_MS - elapsed) / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(countdown);
        performLogout("session_expired");
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [isLoginPage, lastActivity, performLogout]);

  // 4. Global 401 Fetch Interceptor
  useEffect(() => {
    if (isLoginPage || typeof window === "undefined") return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      if (res.status === 401) {
        const url = typeof args[0] === "string" ? args[0] : (args[0] as Request)?.url || "";
        if (url.includes("/api/admin/") && !url.includes("/api/admin/auth/login")) {
          performLogout("session_expired");
        }
      }
      return res;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [isLoginPage, performLogout]);

  // Compute breadcrumbs from pathname
  const breadcrumbs = useMemo(() => {
    if (!pathname || pathname === "/admin") {
      return [{ label: "Dashboard", href: "/admin" }];
    }
    const parts = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Admin", href: "/admin" }];

    const routeMap: Record<string, string> = {
      products: "Home Models",
      "floor-plans": "Floor Plan Kits",
      collections: "Collections",
      blogs: "Blogs & News",
      leads: "Leads & Prospects",
      quotations: "Quotations",
      pricing: "Pricing Rules Engine",
      orders: "Blueprint Orders",
      customers: "Customer CRM",
      analytics: "Sales & Analytics",
      reports: "Reports & Financials",
      pages: "Pages",
      sections: "Page Sections",
      media: "Media Library",
      reviews: "Reviews & Testimonials",
      faqs: "FAQs",
      redirects: "301 Redirects",
      users: "User Roles",
      security: "Security & 2FA",
      logs: "Activity Logs",
      settings: "Global Settings",
      header: "Header Bar",
      navigation: "Navigation Menu",
      footer: "Footer Config",
      shopify: "Shopify Sync",
      videos: "YouTube Manager",
      new: "New Entry",
    };

    let accumulatedPath = "";
    parts.forEach((part, index) => {
      accumulatedPath += `/${part}`;
      if (index === 0) return; // skip initial 'admin'
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

  const userRole = (user?.role || "SUPER_ADMIN").toUpperCase();
  const isSuperAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";
  const isSales = isSuperAdmin || userRole === "SALES";
  const isContentAdmin = isSuperAdmin || userRole === "CONTENT_ADMIN" || userRole === "EDITOR";

  const navSections = [
    {
      group: "Overview",
      items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    ...(isContentAdmin
      ? [
          {
            group: "Catalogue & Models",
            items: [
              { label: "Home Models", href: "/admin/products", icon: Home },
              { label: "Collections & Series", href: "/admin/collections", icon: FolderOpen },
              { label: "Floor Plan Kits", href: "/admin/floor-plans", icon: Download },
            ],
          },
        ]
      : []),
    {
      group: "Transactions & Pipeline",
      items: [
        ...(isSuperAdmin || isSales
          ? [{ label: "Blueprint Orders", href: "/admin/orders", icon: ShoppingBag }]
          : []),
        ...(isSuperAdmin || isSales
          ? [{ label: "Customer CRM", href: "/admin/customers", icon: UsersRound }]
          : []),
        { label: "Inbound Leads", href: "/admin/leads", icon: Users },
        { label: "Quote Wizard Pipeline", href: "/admin/quotations", icon: FileSpreadsheet },
        { label: "Pricing Rules Engine", href: "/admin/pricing", icon: TrendingUp },
      ],
    },
    ...(isSuperAdmin || isSales
      ? [
          {
            group: "Analytics & Intelligence",
            items: [
              { label: "Sales & Analytics", href: "/admin/analytics", icon: TrendingUp },
              { label: "Financial Reports", href: "/admin/reports", icon: BarChart3 },
            ],
          },
        ]
      : []),
    ...(isContentAdmin
      ? [
          {
            group: "Website CMS & Pages",
            items: [
              { label: "Page Manager", href: "/admin/pages", icon: FileText },
              { label: "Section Blocks", href: "/admin/sections", icon: Layers },
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
              { label: "Articles & Resources", href: "/admin/blogs", icon: BookOpen },
              { label: "YouTube Auto-Sync", href: "/admin/videos", icon: Video },
              { label: "Shopify Migration", href: "/admin/shopify", icon: RefreshCw },
            ],
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            group: "Security & Administration",
            items: [
              { label: "Admin Users & Roles", href: "/admin/users", icon: Shield },
              { label: "Security & 2FA", href: "/admin/security", icon: KeyRound },
              { label: "Activity Logs & Audits", href: "/admin/logs", icon: Activity },
            ],
          },
        ]
      : []),
  ];

  // Format session minutes and seconds
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isExpiringSoon = secondsRemaining <= 120 && secondsRemaining > 0;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f8f9fa] flex flex-col text-[#101114] font-sans selection:bg-[#fcb907] selection:text-[#101114] overflow-hidden z-10">
      {/* Imminent Expiration Warning Banner */}
      {isExpiringSoon && (
        <div className="bg-amber-500 text-[#101114] px-4 py-2 text-xs font-black flex items-center justify-between shadow-md shrink-0 z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#101114]" />
            <span>
              Session Expiring in {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s due to inactivity. You will be automatically logged out.
            </span>
          </div>
          <button
            onClick={extendSession}
            className="px-3 py-1 bg-[#101114] text-white hover:bg-black rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#fcb907]" />
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

        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b0d11] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-white/10 lg:static lg:h-full lg:shrink-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-[#08090d] shrink-0">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="bg-white/95 p-2 rounded-xl border border-white/20 shadow-xs group-hover:scale-102 transition-transform">
                <Image
                  src="/finallogo.avif"
                  alt="ModularHome Logo"
                  width={130}
                  height={30}
                  className="h-6 sm:h-7 w-auto object-contain"
                  priority
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
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#fcb907]/70">
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
                            ? "bg-[#fcb907] text-[#101114] shadow-lg shadow-[#fcb907]/20 font-extrabold"
                            : "text-gray-300 hover:text-white hover:bg-white/6"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive ? "text-[#101114]" : "text-gray-400 group-hover:text-[#fcb907]"
                          }`}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-[#101114] opacity-80 shrink-0" />
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
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#fcb907] to-[#d97706] text-[#101114] flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate font-sans">
                    {user?.name || "Administrator"}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                    <span className="uppercase tracking-wider font-semibold text-emerald-300/90 font-mono">
                      {user?.role || "SUPER ADMIN"}
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

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {/* Top Fixed App Header */}
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
                          className="hover:text-[#101114] transition-colors truncate"
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
                    ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
                    : "bg-amber-50/80 hover:bg-amber-100 text-[#b45309] border-amber-200/80"
                }`}
              >
                <Clock
                  className={`w-3.5 h-3.5 ${
                    secondsRemaining < 300 ? "text-red-600" : "text-[#d97706]"
                  }`}
                />
                <span>
                  {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s Session
                </span>
                <RotateCw className="w-3 h-3 text-[#d97706]/70 hover:rotate-180 transition-transform" />
              </button>

              {/* View Live Store */}
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101114] hover:bg-black text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                <span>View Live Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#fcb907]" />
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
