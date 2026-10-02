"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { notifyCustomerAuthChanged } from "@/context/CustomerAuthContext";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";
  const urlError = searchParams.get("error");
  const urlVerified = searchParams.get("verified");
  const urlReset = searchParams.get("reset");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(urlError || "");
  const [infoMessage, setInfoMessage] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (urlError) {
      setErrorMessage(
        urlError === "missing_credentials"
          ? "Login session expired or credentials missing. Please sign in."
          : decodeURIComponent(urlError)
      );
    }
    if (urlVerified === "true") {
      setInfoMessage("Email verified successfully! Please sign in with your credentials.");
    }
    if (urlReset === "true") {
      setInfoMessage("Password reset successfully. Please sign in with your new password.");
    }
  }, [urlError, urlVerified, urlReset]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setUnverifiedEmail(null);
    setIsLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await fetch("/api/customer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.requiresVerification || data.error?.code === "EMAIL_NOT_VERIFIED") {
          setUnverifiedEmail(cleanEmail);
          setErrorMessage(data.error?.message || "Please verify your email address before signing in.");
          setIsLoading(false);
          return;
        }
        throw new Error(data.error?.message || "Invalid email or password.");
      }

      // Notify entire app of auth state change
      notifyCustomerAuthChanged();

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to sign in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-2xl p-7 sm:p-10 space-y-6">
      {/* Brand & Title */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
          <Image
            src="/newmodularlogo.png"
            alt="ModularHome"
            width={280}
            height={60}
            className="h-11 sm:h-12 w-auto mx-auto object-contain"
            priority
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight pt-2">
          Customer Sign In
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Access your purchased blueprints, CAD downloads, and project files.
        </p>
      </div>

      {infoMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      )}

      {unverifiedEmail && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2 animate-in fade-in text-left">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <Mail className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Email Verification Required</span>
          </div>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            Your account requires email confirmation before accessing the portal.
          </p>
          <Link
            href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-xs transition-all shadow-xs"
          >
            <span>Verify or Resend Email</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {errorMessage && !unverifiedEmail && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* 1. Google OAuth Button */}
      <div className="space-y-3">
        <GoogleAuthButton
          mode="signin"
          redirectPath={redirectPath}
          onError={(msg) => setErrorMessage(msg)}
        />
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
            or sign in with email
          </span>
          <div className="border-t border-gray-200 w-full" />
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#101114] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/account/forgot-password"
              className="text-xs font-bold text-[#d97706] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-[#101114] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#fcb907] focus:ring-2 focus:ring-[#fcb907]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black text-sm py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#101114]" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-600">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-[#d97706] font-black hover:underline"
          >
            Create Customer Account →
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Secure 256-Bit Encrypted Customer Session</span>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Suspense fallback={<div className="text-center text-xs text-gray-400">Loading sign in...</div>}>
        <CustomerLoginForm />
      </Suspense>
    </div>
  );
}
