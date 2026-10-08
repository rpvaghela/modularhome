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
  Layers, 
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
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Session Expired / Status Alerts */}
      {(reason === "session_expired" || reason === "expired" || reason === "timeout") && !error && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-200 text-xs animate-in fade-in backdrop-blur-md">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#fcb907]" />
          <div>
            <span className="font-bold block text-[#fcb907]">Session Expired</span>
            <span>Your 1-hour secure admin session has expired. Please sign in again to continue.</span>
          </div>
        </div>
      )}

      {reason === "session_reset" && !error && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-blue-200 text-xs animate-in fade-in backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
          <div>
            <span className="font-bold block text-blue-300">All Sessions Terminated</span>
            <span>All active sessions across devices have been reset. Please sign in with your credentials.</span>
          </div>
        </div>
      )}

      {reason === "unauthorized" && !error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-200 text-xs animate-in fade-in backdrop-blur-md">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <div>
            <span className="font-bold block text-red-300">Authentication Required</span>
            <span>You must sign in with an executive administrator account to access this management area.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-200 text-xs animate-in fade-in backdrop-blur-md">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="bg-[#12161f]/90 border border-[#232a3b] p-6 sm:p-8 rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden">
        {/* Subtle Ambient Top Border Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#fcb907] to-transparent opacity-80" />

        <div className="mb-6 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fcb907]/15 border border-[#fcb907]/30 text-[#fcb907] text-[10px] font-extrabold uppercase tracking-widest">
              <LockKeyhole className="w-3 h-3 text-[#fcb907]" />
              <span>Admin Console</span>
            </span>
            <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>256-bit AES</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1 font-display">
            Executive Sign In
          </h2>
          <p className="text-xs text-gray-400">
            Enter your credentials to access the master management database.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!require2FA ? (
            <>
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  Administrator Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fcb907] transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="modularhome.admin@gmail.com"
                    className="block w-full pl-10 pr-4 py-3 bg-[#0a0d14] border border-[#232a3b] rounded-xl text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                    Master Password
                  </label>
                  <span className="text-[10.5px] text-gray-400 font-mono">1-Hour Session</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fcb907] transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-11 py-3 bg-[#0a0d14] border border-[#232a3b] rounded-xl text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-white" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-200 text-xs">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-[#fcb907]">
                  <KeyRound className="w-4 h-4" />
                  <span>Two-Factor Authentication Required</span>
                </span>
                <span>Open your authenticator app (Google Authenticator, Authy, Apple) and enter your 6-digit verification code.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  6-Digit TOTP / Backup Code
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  maxLength={10}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="e.g. 482910"
                  className="block w-full px-4 py-3 bg-[#0a0d14] border border-[#232a3b] rounded-xl text-white text-lg font-mono font-black text-center tracking-[0.25em] focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || (require2FA && !totpCode)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-black text-[#101114] bg-gradient-to-r from-[#fcb907] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#12161f] focus:ring-[#fcb907] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#101114]" />
                  <span>Authenticating Secure Token...</span>
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
                className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                ← Back to credentials
              </button>
            )}
          </div>
        </form>

        {/* Quick Demo Pre-fill Pill */}
        <div className="mt-6 pt-4 border-t border-[#232a3b] flex items-center justify-between gap-2">
          <div className="text-[11px] text-gray-400 font-mono truncate">
            modularhome.admin@gmail.com
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fcb907]/10 hover:bg-[#fcb907]/20 border border-[#fcb907]/20 text-[11px] font-bold text-[#fcb907] transition-colors cursor-pointer shrink-0"
          >
            <KeyRound className="w-3 h-3" />
            <span>Auto-fill Demo</span>
          </button>
        </div>
      </div>

      {/* Return to Public Website */}
      <div className="text-center pt-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#fcb907] transition-colors"
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
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#fcb907] selection:text-[#101114]">
      {/* Background Architectural Blueprint Grid and Radial Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Glowing Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#fcb907]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Gold Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#fcb907] to-transparent opacity-90 relative z-20" />

      {/* Navigation Brand Header */}
      <header className="relative z-20 wrap py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white/95 border border-white/20 px-3.5 py-1.5 rounded-xl shadow-lg group-hover:bg-white transition-all">
            <Image
              src="/newmodularlogo.png"
              alt="ModularHome Logo"
              width={200}
              height={45}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Production Database Live</span>
          </span>
          <span className="text-gray-700">•</span>
          <span className="text-gray-400">v2.4.0</span>
        </div>
      </header>

      {/* Main Dual-Column / Centered Executive Portal Content */}
      <main className="relative z-20 wrap flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero & Architecture Overview (Desktop) */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#fcb907] text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#fcb907]" />
              <span>Modular Systems Executive Engine</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight font-display">
              Enterprise Control & Precision Modeling CMS
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Centralized administrative gateway for steel-engineered modular floor plans, real-time pricing configurations, 3D CAD blueprints, and automated customer quotes.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#12161f]/60 border border-[#232a3b] space-y-1">
                <div className="flex items-center gap-2 text-[#fcb907] text-xs font-extrabold">
                  <Building2 className="w-4 h-4" />
                  <span>756 Factory Models</span>
                </div>
                <p className="text-[11px] text-gray-400">Real-time catalog sync across 10 architectural categories.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#12161f]/60 border border-[#232a3b] space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold">
                  <Cpu className="w-4 h-4" />
                  <span>Smart Pricing Matrix</span>
                </div>
                <p className="text-[11px] text-gray-400">Instant price calculator & automated blueprint downloads.</p>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-tier role authorization with cryptographic session signatures.</span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-6 w-full">
            <Suspense
              fallback={
                <div className="bg-[#12161f] p-8 rounded-2xl text-white text-center font-medium border border-[#232a3b]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#fcb907] mb-2" />
                  <span>Loading security portal...</span>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>

        </div>
      </main>

      {/* Footer Security Ribbon */}
      <footer className="relative z-20 border-t border-white/5 py-4 bg-[#05070a]/90 backdrop-blur-md">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} ModularHome.com Inc. All rights reserved. Executive Management System.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400 transition-colors">SSL 256-Bit</span>
            <span>•</span>
            <span className="hover:text-gray-400 transition-colors">Zero Trust Architecture</span>
            <span>•</span>
            <span className="hover:text-gray-400 transition-colors">ISO 27001</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
