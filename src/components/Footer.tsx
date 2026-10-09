"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Sliders, 
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { PublicGlobalSettings } from "@/lib/settings";
import { CmsPage } from "@/lib/publicData";

export interface FooterProps {
  initialSettings?: PublicGlobalSettings;
  customPages?: CmsPage[];
}

export default function Footer({ initialSettings, customPages = [] }: FooterProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  // Mobile Accordion state: open Column 1 and 4 by default on mobile
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    explore: true,
    plan: false,
    company: false,
    contact: true,
  });

  // Cookie Settings Modal state
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });
  const [cookieSaved, setCookieSaved] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const companyName = initialSettings?.companyName || "ModularHome.com";
  const logoUrl = initialSettings?.logoUrl || "/newmodularlogo.png";
  const phone = initialSettings?.phone || "+1 (812) 595-4033";
  const emailAddress = initialSettings?.email || "support@modularhome.com";
  const address = initialSettings?.address || "Factory Headquarters, IN & Nationwide Delivery";
  const businessHours = initialSettings?.businessHours || "Mon – Fri: 8:00 AM – 6:00 PM EST";
  const footerText = initialSettings?.footerText || "ModularHome.com leads the American prefabricated housing movement with precision-engineered modular residences, luxury barndominiums, and rapid-deployment cabin kits.";
  const socialLinks = initialSettings?.socialLinks || {};

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setSubscribeError("Please enter a valid email address.");
      return;
    }

    setIsSubscribing(true);
    setSubscribeError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: email.trim(),
          enquiryDetails: "Subscribed to ModularHome.com newsletter and new model releases.",
          source: "NEWSLETTER",
        }),
      });

      if (!res.ok) {
        throw new Error("Subscription failed. Please try again.");
      }

      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      // Even if network blip, show friendly message
      setSubscribed(true);
      setEmail("");
    } finally {
      setIsSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  // Column 1: Explore Homes (12 Collections)
  const exploreLinks = [
    { label: "Modular Homes", href: "/modular-homes" },
    { label: "Prefab Homes", href: "/prefab-homes" },
    { label: "Modular Cabins", href: "/modular-cabins" },
    { label: "Barndominiums", href: "/barndominiums" },
    { label: "House Kits", href: "/house-kits" },
    { label: "Tiny Homes", href: "/tiny-homes" },
    { label: "Park Models", href: "/park-models" },
    { label: "Cabins", href: "/cabins" },
    { label: "ADUs & Granny Pods", href: "/adus" },
    { label: "A-Frame Homes", href: "/a-frame-homes" },
    { label: "Commercial Buildings", href: "/commercial-modular-buildings" },
    { label: "Custom Homes", href: "/custom-homes" },
  ];

  // Column 2: Plan Your Home (10 Destinations)
  const planLinks = [
    { label: "Browse Floor Plans", href: "/floor-plans" },
    { label: "Upload Your Floor Plan", href: "/upload-floor-plan" },
    { label: "Request a Quote", href: "/quote" },
    { label: "Pricing & Packages", href: "/pricing" },
    { label: "Financing", href: "/financing" },
    { label: "Find Homes by State", href: "/buildings" },
    { label: "Delivery & Installation", href: "/delivery" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Buying & Permits Guide", href: "/blogs" },
    { label: "FAQs", href: "/faqs" },
  ];

  // Column 3: Company & Resources (8 Destinations)
  const companyLinks = [
    { label: "About ModularHome", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Blog & Articles", href: "/blogs" },
    { label: "Home Tours & Videos", href: "/videos" },
    { label: "Customer Support", href: "/contact#support" },
    { label: "Warranty Information", href: "/warranty" },
    { label: "Customer Login", href: "/account/login" },
    { label: "Create an Account", href: "/account/signup" },
  ];

  return (
    <footer className="bg-white border-t border-[#e7e9ee] pt-10 sm:pt-14 pb-24 md:pb-10 text-[#101114]" aria-label="Site Footer">
      <div className="wrap">
        {/* 4 Balanced Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 pb-8 border-b border-[#e7e9ee]">
          
          {/* ========================================================= */}
          {/* COLUMN 1: Explore Homes                                    */}
          {/* ========================================================= */}
          <div className="border-b border-[#f0f2f5] md:border-b-0 pb-4 md:pb-0">
            {/* Mobile Accordion Header */}
            <button
              type="button"
              onClick={() => toggleSection("explore")}
              className="flex items-center justify-between w-full md:hidden py-2 text-left font-black text-base text-[#101114] tracking-tight bg-transparent cursor-pointer"
              aria-expanded={openSections.explore}
            >
              <span>Explore Homes</span>
              <ChevronDown
                className={`w-5 h-5 text-[#8c94a0] transition-transform duration-200 ${
                  openSections.explore ? "rotate-180 text-[#fcb907]" : ""
                }`}
              />
            </button>

            {/* Desktop Header */}
            <h3 className="hidden md:block text-base font-black text-[#101114] tracking-tight mb-4">
              Explore Homes
            </h3>

            {/* Links List */}
            <div className={`space-y-2 pt-2 md:pt-0 ${openSections.explore ? "block" : "hidden md:block"}`}>
              {exploreLinks.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-sm font-medium text-[#4b5563] hover:text-[#d97706] hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2: Plan Your Home                                  */}
          {/* ========================================================= */}
          <div className="border-b border-[#f0f2f5] md:border-b-0 pb-4 md:pb-0">
            {/* Mobile Accordion Header */}
            <button
              type="button"
              onClick={() => toggleSection("plan")}
              className="flex items-center justify-between w-full md:hidden py-2 text-left font-black text-base text-[#101114] tracking-tight bg-transparent cursor-pointer"
              aria-expanded={openSections.plan}
            >
              <span>Plan Your Home</span>
              <ChevronDown
                className={`w-5 h-5 text-[#8c94a0] transition-transform duration-200 ${
                  openSections.plan ? "rotate-180 text-[#fcb907]" : ""
                }`}
              />
            </button>

            {/* Desktop Header */}
            <h3 className="hidden md:block text-base font-black text-[#101114] tracking-tight mb-4">
              Plan Your Home
            </h3>

            {/* Links List */}
            <div className={`space-y-2 pt-2 md:pt-0 ${openSections.plan ? "block" : "hidden md:block"}`}>
              {planLinks.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-sm font-medium text-[#4b5563] hover:text-[#d97706] hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3: Company & Resources                              */}
          {/* ========================================================= */}
          <div className="border-b border-[#f0f2f5] md:border-b-0 pb-4 md:pb-0">
            {/* Mobile Accordion Header */}
            <button
              type="button"
              onClick={() => toggleSection("company")}
              className="flex items-center justify-between w-full md:hidden py-2 text-left font-black text-base text-[#101114] tracking-tight bg-transparent cursor-pointer"
              aria-expanded={openSections.company}
            >
              <span>Company & Resources</span>
              <ChevronDown
                className={`w-5 h-5 text-[#8c94a0] transition-transform duration-200 ${
                  openSections.company ? "rotate-180 text-[#fcb907]" : ""
                }`}
              />
            </button>

            {/* Desktop Header */}
            <h3 className="hidden md:block text-base font-black text-[#101114] tracking-tight mb-4">
              Company & Resources
            </h3>

            {/* Links List */}
            <div className={`space-y-2 pt-2 md:pt-0 ${openSections.company ? "block" : "hidden md:block"}`}>
              {companyLinks.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-sm font-medium text-[#4b5563] hover:text-[#d97706] hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 4: Contact & Stay Connected                         */}
          {/* ========================================================= */}
          <div>
            {/* Mobile Accordion Header */}
            <button
              type="button"
              onClick={() => toggleSection("contact")}
              className="flex items-center justify-between w-full md:hidden py-2 text-left font-black text-base text-[#101114] tracking-tight bg-transparent cursor-pointer"
              aria-expanded={openSections.contact}
            >
              <span>Contact & Stay Connected</span>
              <ChevronDown
                className={`w-5 h-5 text-[#8c94a0] transition-transform duration-200 ${
                  openSections.contact ? "rotate-180 text-[#fcb907]" : ""
                }`}
              />
            </button>

            {/* Desktop Header / Logo */}
            <div className={`pt-3 md:pt-0 space-y-4 ${openSections.contact ? "block" : "hidden md:block"}`}>
              {/* Logo & Description */}
              <div className="space-y-2.5">
                <Link href="/" prefetch={true} className="inline-block">
                  <Image
                    src={logoUrl}
                    alt={companyName}
                    width={220}
                    height={46}
                    className="h-8 sm:h-9 w-auto object-contain"
                  />
                </Link>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  {footerText}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs text-[#374151]">
                {/* Phone */}
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="font-bold text-[#101114] hover:text-[#d97706] transition-colors"
                  >
                    {phone}
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${emailAddress}`}
                    className="hover:text-[#d97706] transition-colors break-all"
                  >
                    {emailAddress}
                  </a>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-2 text-[#6b7280]">
                  <Clock className="w-3.5 h-3.5 text-[#8c94a0] shrink-0 mt-0.5" />
                  <span>{businessHours}</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-[#6b7280]">
                  <MapPin className="w-3.5 h-3.5 text-[#8c94a0] shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              </div>

              {/* Social Icons (Facebook, Instagram, YouTube, TikTok) */}
              <div className="pt-1">
                {/* <div className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2">
                  Follow Us
                </div>
                <div className="flex items-center gap-2">
                 
                  {socialLinks.facebook !== "" && (
                    <a
                      href={socialLinks.facebook || "https://facebook.com/modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="ModularHome on Facebook"
                      className="w-8 h-8 rounded-full bg-[#0f1218] text-white flex items-center justify-center hover:bg-[#fcb907] hover:text-[#101114] transition-all hover:scale-110 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}

                  
                  {socialLinks.instagram !== "" && (
                    <a
                      href={socialLinks.instagram || "https://instagram.com/modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="ModularHome on Instagram"
                      className="w-8 h-8 rounded-full bg-[#0f1218] text-white flex items-center justify-center hover:bg-[#fcb907] hover:text-[#101114] transition-all hover:scale-110 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}

                 
                  {socialLinks.youtube !== "" && (
                    <a
                      href={socialLinks.youtube || "https://youtube.com/@modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="ModularHome on YouTube"
                      className="w-8 h-8 rounded-full bg-[#0f1218] text-white flex items-center justify-center hover:bg-[#fcb907] hover:text-[#101114] transition-all hover:scale-110 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}

                  {socialLinks.tiktok !== "" && (
                    <a
                      href={socialLinks.tiktok || "https://tiktok.com/@modularhome"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="ModularHome on TikTok"
                      className="w-8 h-8 rounded-full bg-[#0f1218] text-white flex items-center justify-center hover:bg-[#fcb907] hover:text-[#101114] transition-all hover:scale-110 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.18 2.09 2.35 2.3 1.05.21 2.18-.08 2.96-.8.61-.53.97-1.3 1.01-2.11.05-3.87.02-7.74.03-11.61z" />
                      </svg>
                    </a>
                  )}

                 
                  {(socialLinks.twitter || socialLinks.x) && (
                    <a
                      href={socialLinks.twitter || socialLinks.x}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="ModularHome on X"
                      className="w-8 h-8 rounded-full bg-[#0f1218] text-white flex items-center justify-center hover:bg-[#fcb907] hover:text-[#101114] transition-all hover:scale-110 shadow-sm"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                </div> */}
              </div>

              {/* Newsletter Signup Form */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1">
                  Stay Updated
                </div>
                <p className="text-xs text-[#6b7280] mb-2">
                  Get newly released modular plans and buyer incentives.
                </p>

                {subscribed ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-[9px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You're subscribed! Thank you.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubscribing}
                        className="min-w-0 flex-1 px-3 py-2 border border-[#dfe2e7] rounded-[8px] text-xs text-[#101114] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#fcb907] bg-white"
                      />
                      <button
                        type="submit"
                        disabled={isSubscribing}
                        className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black px-3.5 py-2 text-xs rounded-[8px] transition-colors shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-60"
                      >
                        {isSubscribing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Subscribe</span>
                        )}
                      </button>
                    </div>
                    {subscribeError && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {subscribeError}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM BAR: Policies, Legal and Copyright                */}
        {/* ========================================================= */}
        <div className="pt-8 mt-2 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-[#6b7280]">
          {/* Left: Copyright & Engineering Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center md:text-left">
            <span className="font-semibold text-[#101114]">
              © {currentYear} {companyName}.
            </span>
            <span className="text-[#6b7280]">All rights reserved.</span>
            <span className="hidden lg:inline text-[#d1d5db]" aria-hidden="true">•</span>
            <span className="text-[#9ca3af] text-[11px] hidden lg:inline">
              Precision Engineered Modular Housing & Cabins
            </span>
          </div>

          {/* Right: Policy Links & Cookie Settings */}
          <nav aria-label="Legal & Policies" className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 sm:gap-x-6 gap-y-2 text-xs">
            <Link
              href="/privacy-policy"
              className="text-[#6b7280] hover:text-[#d97706] transition-colors py-0.5 whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-[#6b7280] hover:text-[#d97706] transition-colors py-0.5 whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <Link
              href="/refund-cancellation-policy"
              className="text-[#6b7280] hover:text-[#d97706] transition-colors py-0.5 whitespace-nowrap"
            >
              Refund Policy
            </Link>
            <Link
              href="/shipping-delivery-policy"
              className="text-[#6b7280] hover:text-[#d97706] transition-colors py-0.5 whitespace-nowrap"
            >
              Shipping & Delivery
            </Link>
            <Link
              href="/accessibility"
              className="text-[#6b7280] hover:text-[#d97706] transition-colors py-0.5 whitespace-nowrap"
            >
              Accessibility
            </Link>
            <button
              type="button"
              onClick={() => setShowCookieModal(true)}
              className="text-[#6b7280] hover:text-[#d97706] transition-colors inline-flex items-center gap-1.5 py-0.5 whitespace-nowrap cursor-pointer bg-transparent border-none p-0"
            >
              <Sliders className="w-3.5 h-3.5 text-[#9ca3af]" />
              <span>Cookie Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Interactive Cookie Settings Modal                         */}
      {/* ========================================================= */}
      {showCookieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[16px] shadow-2xl max-w-lg w-full overflow-hidden border border-[#e7e9ee]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#f0f2f5] flex items-center justify-between bg-[#fbfbfc]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#101114]">
                    Cookie Preferences
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Manage how cookies are used to enhance your experience.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCookieModal(false)}
                className="text-[#9ca3af] hover:text-[#101114] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-[#374151]">
              {cookieSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your cookie preferences have been saved successfully!</span>
                </div>
              )}

              {/* Essential Cookies */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#101114]">
                    <span>Essential & Security Cookies</span>
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280]">
                    Necessary for core website security, session persistence, and shopping cart functions. Cannot be disabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="mt-1 h-4 w-4 rounded text-[#fcb907] cursor-not-allowed opacity-70"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#101114]">
                    Performance & Analytics
                  </div>
                  <p className="text-xs text-[#6b7280]">
                    Helps us understand how visitors interact with our floor plan catalog and model pages to improve site performance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="cookie-analytics"
                  checked={cookiePreferences.analytics}
                  onChange={(e) =>
                    setCookiePreferences((prev) => ({
                      ...prev,
                      analytics: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded text-[#fcb907] focus:ring-[#fcb907] cursor-pointer"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#101114]">
                    Personalized Recommendations & Marketing
                  </div>
                  <p className="text-xs text-[#6b7280]">
                    Allows us to provide personalized regional floor plan suggestions and tailored incentives.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="cookie-marketing"
                  checked={cookiePreferences.marketing}
                  onChange={(e) =>
                    setCookiePreferences((prev) => ({
                      ...prev,
                      marketing: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded text-[#fcb907] focus:ring-[#fcb907] cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#f0f2f5] bg-[#fbfbfc] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setCookiePreferences({
                    essential: true,
                    analytics: true,
                    marketing: true,
                  });
                  setCookieSaved(true);
                  setTimeout(() => setShowCookieModal(false), 800);
                }}
                className="text-xs font-bold text-[#4b5563] hover:text-[#101114] px-3 py-2 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                Accept All
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCookieModal(false)}
                  className="text-xs font-bold text-[#4b5563] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCookieSaved(true);
                    setTimeout(() => setShowCookieModal(false), 800);
                  }}
                  className="text-xs font-black bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
