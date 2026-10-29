"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, Clock, Youtube, Twitter, Facebook, Instagram, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

const FOOTER_COLUMNS = [
  {
    title: "Models & Shelters",
    links: [
      { label: "All Models Catalog", href: "/models" },
      { label: "Bomb Shelters & Bunkers", href: "/bomb-shelters" },
      { label: "Modular Homes", href: "/modular-homes" },
      { label: "Steel Barndominiums", href: "/barndominiums" },
      { label: "Cabins & Retreats", href: "/cabins" },
      { label: "Safe Rooms & ADUs", href: "/adus" },
      { label: "Hardened Floor Plans", href: "/floor-plans" },
      { label: "Curated Collections", href: "/collections" },
    ],
  },
  {
    title: "Logistics & Planning",
    links: [
      { label: "Delivery & Rigging", href: "/delivery" },
      { label: "How It Works (5 Steps)", href: "/how-it-works" },
      { label: "Turnkey Pricing", href: "/pricing" },
      { label: "Financing & Loans", href: "/financing" },
      { label: "Interactive Quote Wizard", href: "/quote" },
      { label: "Upload Site Blueprint", href: "/upload-floor-plan" },
    ],
  },
  {
    title: "Company & Media",
    links: [
      { label: "About BombShelters", href: "/about" },
      { label: "Technical Blogs", href: "/blogs" },
      { label: "Frequently Asked Questions", href: "/faqs" },
      { label: "Factory Video Gallery", href: "/videos" },
      { label: "Buyer Resources & Manuals", href: "/resources" },
      { label: "Contact Engineering Desk", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com" },
  { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export function Footer() {
  const pathname = usePathname();
  const [brandSettings, setBrandSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/bombshelter/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setBrandSettings(json.data);
        }
      })
      .catch(() => {});
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const phone = brandSettings?.phone || "812-595-4033";
  const email = brandSettings?.email || "defense@bombshelters.com";
  const facebook = brandSettings?.social_links?.facebook || "https://facebook.com";
  const twitter = brandSettings?.social_links?.twitter || "https://twitter.com";
  const youtube = brandSettings?.social_links?.youtube || "https://youtube.com";
  const instagram = brandSettings?.social_links?.instagram || "https://instagram.com";

  const dynamicSocials = [
    { label: "Facebook", icon: Facebook, href: facebook },
    { label: "Instagram", icon: Instagram, href: instagram },
    { label: "YouTube", icon: Youtube, href: youtube },
    { label: "Twitter", icon: Twitter, href: twitter },
  ];

  return (
    <footer className="bg-[#CFCFCF] text-[#27272a] text-[13px] border-t-2 border-[#e11d1d] overflow-hidden w-full">
      {/* ── Main Footer Grid ───────────────────────────────── */}
      <div className="site-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.4fr] gap-8">
          {/* Brand & Blurb */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block group">
              {/* 3D logo straight on black; a thin light outline keeps the dark "SHELTERS" readable */}
              <Image
                src="/bomb_logo_trim.png"
                alt="BombShelters.com"
                width={2118}
                height={409}
                unoptimized
                className="h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
              <span className="block text-[9px] font-display font-semibold uppercase tracking-[0.12em] whitespace-nowrap text-[#52525b] mt-1.5">
                Bunkers. Cabins. A Stronger Tomorrow.
              </span>
            </Link>
            <p className="leading-relaxed max-w-xs text-xs text-[#3f3f46]">
              America&apos;s premier direct manufacturer network for certified blast-resistant bomb shelters, tornado bunkers, and hardened modular homes.
            </p>
            <div className="flex items-center gap-2">
              {dynamicSocials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/80 border border-gray-400/80 flex items-center justify-center text-[#0a0a0a] hover:bg-[#e11d1d] hover:border-[#e11d1d] hover:text-white transition-colors shadow-xs"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="font-display font-bold text-[#0a0a0a] uppercase tracking-wider text-xs">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#3f3f46] hover:text-[#e11d1d] transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Dispatch */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-display font-bold text-[#0a0a0a] uppercase tracking-wider text-xs">
              Direct Dispatch
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-[#0a0a0a] hover:text-[#e11d1d] transition-colors font-semibold"
              >
                <Phone className="w-4 h-4 text-[#e11d1d] shrink-0" />
                <span>{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-[#3f3f46] hover:text-[#e11d1d] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#e11d1d] shrink-0" />
                <span>{email}</span>
              </a>
              <div className="flex items-center gap-2 text-[#3f3f46]">
                <Clock className="w-4 h-4 text-[#e11d1d] shrink-0" />
                <span>Mon – Sat: 8AM – 7PM EST</span>
              </div>
            </div>

            <div className="pt-2">
              <Button asLink href="/quote" size="sm" className="w-full text-center">
                Get an Itemized Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Legal Bar ───────────────────────────────── */}
      <div className="border-t border-[#b8b8b8]">
        <div className="site-container py-5 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#3f3f46]">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px]">
            <Link href="/privacy-policy" className="hover:text-[#0a0a0a] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#0a0a0a] transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping-delivery-policy" className="hover:text-[#0a0a0a] transition-colors">
              Shipping &amp; Delivery Policy
            </Link>
            <Link href="/refund-cancellation-policy" className="hover:text-[#0a0a0a] transition-colors">
              Refund &amp; Cancellation
            </Link>
            <Link href="/warranty" className="hover:text-[#0a0a0a] transition-colors">
              Lifetime Warranty
            </Link>
            <Link href="/accessibility" className="hover:text-[#0a0a0a] transition-colors">
              Accessibility
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[#0a0a0a] text-xs">
            <ShieldCheck className="w-4 h-4 text-[#e11d1d]" />
            <span className="font-display font-semibold uppercase tracking-wider">
              Built for a Stronger Tomorrow.
            </span>
          </div>
        </div>
        <p className="text-center text-[11px] text-[#52525b] pb-5">
          &copy; 2026 BombShelters.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
