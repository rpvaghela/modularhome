"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  User,
  Shield,
  KeyRound,
} from "lucide-react";
import { useCustomerAuth, notifyCustomerAuthChanged } from "@/context/CustomerAuthContext";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";
  const { customer, isAuthenticated, isLoading: authLoading } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && isAuthenticated && customer) {
      router.replace(redirectPath);
    }
  }, [authLoading, isAuthenticated, customer, redirectPath, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
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
        throw new Error(data.message || "Invalid email or password.");
      }

      setSuccessMessage("Signed in successfully. Redirecting...");
      notifyCustomerAuthChanged();
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to sign in. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setEmail("user@bombshelters.com");
    setPassword("user123");
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header & Logo */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
          <Image
            src="/bombshelters-logo-header.png"
            alt="BombShelters.com"
            width={320}
            height={80}
            className="h-10 sm:h-11 w-auto mx-auto object-contain"
            priority
          />
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#e11d1d] text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111214] tracking-tight font-display">
            CLIENT SIGN IN
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Access your bunker blueprints, floor plans, and custom quotations.
          </p>
        </div>
      </div>

      {/* Demo Credentials Quick Fill Box */}
      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#e11d1d] shrink-0" />
          <div>
            <span className="font-bold text-gray-900 block">Demo Customer Account</span>
            <span className="text-[11px] text-gray-500">user@bombshelters.com • user123</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-semibold transition-colors"
        >
          Auto Fill
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 block">
            Email Address <span className="text-[#e11d1d]">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d] focus:border-[#e11d1d] transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-gray-800">
              Password <span className="text-[#e11d1d]">*</span>
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d1d] focus:border-[#e11d1d] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-extrabold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Register Prompt */}
      <div className="pt-2 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          Don&apos;t have a customer account?{" "}
          <Link
            href="/account/signup"
            className="font-bold text-[#e11d1d] hover:underline transition-colors"
          >
            Create Account
          </Link>
        </p>
      </div>

      {/* Admin Panel Link */}
      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
        <p className="text-[11px] text-gray-500">
          Administrator or Staff member?{" "}
          <Link
            href="/admin/login"
            className="font-bold text-gray-900 hover:text-[#e11d1d] hover:underline"
          >
            Admin Control Panel &rarr;
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>End-to-End Encrypted Customer Session (30-Day Expiry)</span>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-[80vh] bg-white flex flex-col justify-center items-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#e11d1d]" />
          </div>
        }
      >
        <CustomerLoginForm />
      </Suspense>
    </div>
  );
}

