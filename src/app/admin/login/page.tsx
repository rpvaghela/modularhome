"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Building2, 
  Cpu, 
  ArrowLeft,
  CheckCircle2,
  LockKeyhole
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("modularhome.admin@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [require2FA, setRequire2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Purge any residual tokens / timestamps on landing on the login portal
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_last_activity");
    }
    if (reason === "session_expired" || reason === "unauthorized" || reason === "session_reset") {
      fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    }
  }, [reason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, totpCode: require2FA ? totpCode : undefined }),
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.warn("Unexpected non-JSON response from login:", text.slice(0, 300));
        setError("Unable to authenticate. The server returned an unexpected response.");
        setIsLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        if (data.require2FA) {
          setRequire2FA(true);
          setIsLoading(false);
          return;
        }
        setError(data.error?.message || "Invalid administrator credentials.");
        setIsLoading(false);
        return;
      }

      // Initialize fresh activity timestamp on successful sign-in
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_last_activity", String(Date.now()));
        window.location.href = redirectPath;
      } else {
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please verify your connection.");
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("modularhome.admin@gmail.com");
    setPassword("modularhome123");
    setRequire2FA(false);
    setTotpCode("");
    setError("");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Session Expired / Status Alerts */}
      {(reason === "session_expired" || reason === "expired" || reason === "timeout") && !error && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#d97706]" />
          <div>
            <span className="font-bold block text-amber-950">Session Expired</span>
            <span>Your 1-hour secure admin session expired. Please sign in again.</span>
          </div>
        </div>
      )}

      {reason === "session_reset" && !error && (
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-blue-900 text-xs animate-in fade-in">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
          <div>
            <span className="font-bold block text-blue-950">Sessions Terminated</span>
            <span>All active sessions have been reset. Please enter your credentials.</span>
          </div>
        </div>
      )}

      {reason === "unauthorized" && !error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <div>
            <span className="font-bold block text-red-950">Authentication Required</span>
            <span>Please sign in to access the protected admin console.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="bg-white border border-gray-200 p-5 sm:p-7 rounded-[22px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
        {/* Top Gold Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#fcb907] via-[#f59e0b] to-[#fcb907]" />

        <div className="mb-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-[10px] font-extrabold uppercase tracking-widest">
              <LockKeyhole className="w-3 h-3 text-[#d97706]" />
              <span>Admin Console</span>
            </span>
            <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>256-bit SSL</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#101114] tracking-tight pt-1 font-display">
            Executive Sign In
          </h2>
          <p className="text-xs text-gray-500">
            Enter administrator credentials to manage models, pricing, and orders.
          </p>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          {!require2FA ? (
            <>
              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Administrator Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#d97706] transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="modularhome.admin@gmail.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] hover:bg-[#f1f3f6] focus:bg-white border border-gray-200 rounded-xl text-[#101114] text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Master Password
                  </label>
                  <span className="text-[10px] text-gray-400 font-mono">1-Hour Session</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#d97706] transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] hover:bg-[#f1f3f6] focus:bg-white border border-gray-200 rounded-xl text-[#101114] text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#101114] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500 hover:text-[#101114]" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500 hover:text-[#101114]" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-[#b45309]">
                  <KeyRound className="w-4 h-4" />
                  <span>Two-Factor Authentication</span>
                </span>
                <span>Enter the 6-digit code from your authenticator app.</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  6-Digit TOTP Code
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  maxLength={10}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="e.g. 482910"
                  className="block w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-[#101114] text-base font-mono font-black text-center tracking-[0.25em] focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading || (require2FA && !totpCode)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-sm text-xs sm:text-sm font-black text-[#101114] bg-[#fcb907] hover:bg-[#e5a706] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fcb907] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#101114]" />
                  <span>Authenticating...</span>
                </>
              ) : require2FA ? (
                <>
                  <span>Verify Code & Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              ) : (
                <>
                  <span>Sign In to Management Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            {require2FA && (
              <button
                type="button"
                onClick={() => {
                  setRequire2FA(false);
                  setTotpCode("");
                }}
                className="w-full mt-2 py-1.5 text-xs font-bold text-gray-500 hover:text-[#101114] transition-colors"
              >
                ← Back to credentials
              </button>
            )}
          </div>
        </form>

        {/* Quick Demo Pre-fill Pill */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-gray-400 font-mono truncate">
            modularhome.admin@gmail.com
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold text-[#b45309] transition-colors cursor-pointer shrink-0"
          >
            <KeyRound className="w-3 h-3 text-[#d97706]" />
            <span>Auto-fill Demo</span>
          </button>
        </div>
      </div>

      {/* Return to Public Website */}
      <div className="text-center pt-0.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#d97706] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to ModularHome.com</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#fafbfc] text-[#101114] flex flex-col justify-between relative selection:bg-[#fcb907] selection:text-[#101114]">
      {/* Background Architectural Blueprint Grid and Subtle Golden Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      
      {/* Soft Ambient Golden Radial Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#fcb907]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Gold Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#fcb907] via-[#f59e0b] to-[#fcb907] relative z-20 shrink-0" />

      {/* Header Bar */}
      <header className="relative z-20 wrap py-3 sm:py-4 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/newmodularlogo.png"
            alt="ModularHome Logo"
            width={200}
            height={45}
            className="h-7 sm:h-8 md:h-9 w-auto object-contain hover:opacity-90 transition-opacity"
            priority
          />
        </Link>

        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-gray-700">Production Live</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 font-bold">v2.4.0</span>
        </div>
      </header>

      {/* Main Content Area - Perfectly Centered, Non-Scrollable */}
      <main className="relative z-20 wrap flex-1 flex items-center justify-center py-2 px-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Hero & System Overview (Desktop) */}
          <div className="lg:col-span-6 space-y-4 hidden lg:block pr-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#b45309] text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Modular Systems Executive Engine</span>
            </div>

            <h1 className="text-2xl xl:text-3xl font-black text-[#101114] tracking-tight leading-snug font-display">
              Enterprise Control & Precision Modeling CMS
            </h1>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              Centralized administrative gateway for steel-engineered modular floor plans, real-time pricing configurations, and automated CAD distribution.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#b45309] text-xs font-extrabold">
                  <Building2 className="w-4 h-4 text-[#d97706]" />
                  <span>756 Factory Models</span>
                </div>
                <p className="text-[11px] text-gray-500">Real-time catalog sync across 10 categories.</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#b45309] text-xs font-extrabold">
                  <Cpu className="w-4 h-4 text-[#d97706]" />
                  <span>Smart Pricing Matrix</span>
                </div>
                <p className="text-[11px] text-gray-500">Instant price calculator & automated quotes.</p>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 pt-1 text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Role authorization with cryptographic session signatures.</span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-6 w-full">
            <Suspense
              fallback={
                <div className="bg-white p-6 rounded-2xl text-[#101114] text-center font-medium border border-gray-200 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#fcb907] mb-2" />
                  <span className="text-xs">Loading security portal...</span>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>

        </div>
      </main>

      {/* Footer Ribbon - Fixed at bottom without scrolling */}
      <footer className="relative z-20 border-t border-gray-200/80 py-2.5 bg-white/90 backdrop-blur-xs shrink-0">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} ModularHome.com Inc. All rights reserved. Executive Management System.
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:text-gray-700 transition-colors">SSL 256-Bit</span>
            <span>•</span>
            <span className="hover:text-gray-700 transition-colors">Zero Trust Architecture</span>
            <span>•</span>
            <span className="hover:text-gray-700 transition-colors">ISO 27001</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
