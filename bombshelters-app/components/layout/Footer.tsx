import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageSquare, Clock, Youtube, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e2e8f0] text-[#475569] text-sm">
      {/* ── Main Footer Grid ───────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Blurb */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group mb-1">
              <Image
                src="/bomb_logo.png"
                alt="BombShelters.com"
                width={360}
                height={120}
                className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-sm">
              America&apos;s foremost authority in subterranean bomb shelters, military-grade blast
              bunkers, ballistic panic rooms, and indestructible cold-formed steel homestead cabins.
              Engineered to endure.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-[#475569]">
              <a
                href="#"
                className="p-2.5 rounded-[4px] bg-white border border-[#e2e8f0] hover:text-[#e11d1d] hover:bg-[#fee2e2] hover:border-[#fca5a5] shadow-xs transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-[4px] bg-white border border-[#e2e8f0] hover:text-[#e11d1d] hover:bg-[#fee2e2] hover:border-[#fca5a5] shadow-xs transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-[4px] bg-white border border-[#e2e8f0] hover:text-[#e11d1d] hover:bg-[#fee2e2] hover:border-[#fca5a5] shadow-xs transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-[4px] bg-white border border-[#e2e8f0] hover:text-[#e11d1d] hover:bg-[#fee2e2] hover:border-[#fca5a5] shadow-xs transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-[#0a0a0a] uppercase tracking-wider text-sm">
              Shop Shelters
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="#featured-models" className="hover:text-[#e11d1d] transition-colors">Underground Bomb Shelters</Link></li>
              <li><Link href="#featured-models" className="hover:text-[#e11d1d] transition-colors">FEMA Storm Shelters</Link></li>
              <li><Link href="#featured-models" className="hover:text-[#e11d1d] transition-colors">Ballistic Safe Rooms</Link></li>
              <li><Link href="#featured-models" className="hover:text-[#e11d1d] transition-colors">Luxury Multi-Room Bunkers</Link></li>
              <li><Link href="#featured-models" className="hover:text-[#e11d1d] transition-colors">Steel Framed Homes</Link></li>
              <li><Link href="#featured-models" className="hover:text-[#e11d1d] transition-colors">Modular Cabins</Link></li>
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-[#0a0a0a] uppercase tracking-wider text-sm">
              Company & Guide
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="#why-choose" className="hover:text-[#e11d1d] transition-colors">Why Choose Us</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[#e11d1d] transition-colors">How It Works</Link></li>
              <li><Link href="#financing" className="hover:text-[#e11d1d] transition-colors">Financing Programs</Link></li>
              <li><Link href="#manufacturers" className="hover:text-[#e11d1d] transition-colors">Vetted Manufacturers</Link></li>
              <li><Link href="#faq" className="hover:text-[#e11d1d] transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="#testimonials" className="hover:text-[#e11d1d] transition-colors">Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-[#0a0a0a] uppercase tracking-wider text-sm">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <a href="tel:812-595-4033" className="flex items-center gap-2 hover:text-[#e11d1d] transition-colors text-[#0a0a0a] font-bold">
                <Phone className="w-4 h-4 text-[#e11d1d]" />
                <span>812-595-4033</span>
              </a>
              <div className="flex items-center gap-2 text-[#475569]">
                <Mail className="w-4 h-4 text-[#e11d1d]" />
                <span>info@bombshelters.com</span>
              </div>
              <div className="flex items-center gap-2 text-[#475569]">
                <MessageSquare className="w-4 h-4 text-[#e11d1d]" />
                <span>Live Chat: 24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748b]">
                <Clock className="w-4 h-4 text-[#94a3b8]" />
                <span>Mon-Fri: 8AM-6PM CT</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-3">
              <span className="block text-xs font-bold text-[#0a0a0a] uppercase tracking-wider mb-2">
                Preparedness Intel
              </span>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-[#cbd5e1] rounded-[4px] px-3 py-1.5 text-xs text-[#0a0a0a] placeholder-[#94a3b8] focus:outline-none focus:border-[#e11d1d]"
                />
                <Button size="sm" className="px-3 text-xs shadow-sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────── */}
      <div className="border-t border-[#e2e8f0] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[#0a0a0a] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-[#0a0a0a] transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="#" className="hover:text-[#0a0a0a] transition-colors">Sitemap</Link>
          </div>

          <div className="text-center sm:text-right">
            <p className="font-display font-extrabold uppercase tracking-wider text-[#0a0a0a]">
              Built for a Safer Tomorrow.
            </p>
            <p className="mt-0.5 text-[#64748b]">
              &copy; 2026 BombShelters.com. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
