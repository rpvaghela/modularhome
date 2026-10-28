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
  LockKeyhole,
  ShieldAlert
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
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
      fetch("/api/bombshelter/admin/auth/logout", { method: "POST" }).catch(() => {});
    }
  }, [reason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bombshelter/admin/auth/login", {
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

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Session Expired / Status Alerts */}
      {(reason === "session_expired" || reason === "expired" || reason === "timeout") && !error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#e11d1d]" />
          <div>
            <span className="font-bold block text-red-950">Session Expired</span>
            <span>Your 1-hour secure admin session expired. Please sign in again.</span>
          </div>
        </div>
      )}

      {reason === "session_reset" && !error && (
        <div className="p-2.5 rounded-xl bg-gray-100 border border-gray-300 flex items-start gap-2.5 text-gray-900 text-xs animate-in fade-in">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#101114]" />
          <div>
            <span className="font-bold block text-gray-950">Sessions Terminated</span>
            <span>All active sessions have been reset. Please enter your credentials.</span>
          </div>
        </div>
      )}

      {reason === "unauthorized" && !error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#e11d1d]" />
          <div>
            <span className="font-bold block text-red-950">Authentication Required</span>
            <span>Please sign in to access the protected BombShelters command center.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#e11d1d]" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="bg-white border border-gray-200 p-5 sm:p-7 rounded-[22px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
        {/* Top Red Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e11d1d] via-[#dc2626] to-[#b91c1c]" />

        <div className="mb-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#e11d1d] text-[10px] font-extrabold uppercase tracking-widest">
              <LockKeyhole className="w-3 h-3 text-[#e11d1d]" />
              <span>Admin Console</span>
            </span>
            <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>256-bit SSL</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#101114] tracking-tight pt-1 font-display">
            Command Center Sign In
          </h2>
          <p className="text-xs text-gray-500">
            Enter administrator credentials to manage bunker models, pricing matrices, and defense orders.
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
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#e11d1d] transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bombshelters.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] hover:bg-[#f1f3f6] focus:bg-white border border-gray-200 rounded-xl text-[#101114] text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#e11d1d] focus:ring-2 focus:ring-[#e11d1d]/20 transition-all font-medium"
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
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#e11d1d] transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] hover:bg-[#f1f3f6] focus:bg-white border border-gray-200 rounded-xl text-[#101114] text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#e11d1d] focus:ring-2 focus:ring-[#e11d1d]/20 transition-all font-medium"
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
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 text-xs">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-[#e11d1d]">
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
                  className="block w-full px-4 py-2.5 bg-[#f8f9fa] border border-gray-200 rounded-xl text-[#101114] text-base font-mono font-black text-center tracking-[0.25em] focus:outline-none focus:border-[#e11d1d] focus:ring-2 focus:ring-[#e11d1d]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading || (require2FA && !totpCode)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm font-black text-white bg-[#e11d1d] hover:bg-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e11d1d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : require2FA ? (
                <>
                  <span>Verify Code & Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              ) : (
                <>
                  <span>Sign In to Command Center</span>
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

        {/* Security Notice Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted TLS session • Rate limited • Defense audit logged</span>
        </div>
      </div>

      {/* Return to Public Website */}
      <div className="text-center pt-0.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#e11d1d] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to BombShelters.com</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#fafbfc] text-[#101114] flex flex-col justify-between relative selection:bg-[#e11d1d] selection:text-white">
      {/* Background Architectural Blueprint Grid and Subtle Red Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      
      {/* Soft Ambient Red Radial Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#e11d1d]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Red Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#e11d1d] via-[#dc2626] to-[#b91c1c] relative z-20 shrink-0" />

      {/* Header Bar */}
      <header className="relative z-20 wrap py-3 sm:py-4 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/bomb_logo.png"
            alt="BombShelters Logo"
            width={240}
            height={60}
            className="h-8 sm:h-9 md:h-10 w-auto object-contain hover:opacity-90 transition-opacity"
            priority
          />
        </Link>

        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-gray-700">Defense System Live</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 font-bold">v2.4.0-DEFENSE</span>
        </div>
      </header>

      {/* Main Content Area - Perfectly Centered, Non-Scrollable */}
      <main className="relative z-20 wrap flex-1 flex items-center justify-center py-2 px-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Hero & System Overview (Desktop) */}
          <div className="lg:col-span-6 space-y-4 hidden lg:block pr-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#e11d1d] text-xs font-bold font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-[#e11d1d]" />
              <span>BombShelter Executive Command</span>
            </div>

            <h1 className="text-2xl xl:text-3xl font-black text-[#101114] tracking-tight leading-snug font-display">
              Subterranean Defense & Precision Modeling CMS
            </h1>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              Centralized administrative gateway for blast-engineered bomb shelters, storm safe rooms, real-time pricing configurations, and automated CAD blueprint distribution.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#e11d1d] text-xs font-extrabold">
                  <Building2 className="w-4 h-4 text-[#e11d1d]" />
                  <span>Blast-Rated Models</span>
                </div>
                <p className="text-[11px] text-gray-500">Real-time catalog sync across tactical bunker tiers.</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#e11d1d] text-xs font-extrabold">
                  <Cpu className="w-4 h-4 text-[#e11d1d]" />
                  <span>Smart Defense Matrix</span>
                </div>
                <p className="text-[11px] text-gray-500">Instant excavation & turnkey quote calculator.</p>
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
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#e11d1d] mb-2" />
                  <span className="text-xs">Loading command portal...</span>
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
            © {new Date().getFullYear()} BombShelters.com Inc. All rights reserved. Defense & Executive Management System.
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
