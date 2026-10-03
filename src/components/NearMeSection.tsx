"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, CheckCircle2, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function NearMeSection() {
  const [zipCode, setZipCode] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      setSearchResult(`Active delivery routes available for ZIP ${zipCode}! Factory certified installers on standby.`);
    }
  };

  const handleStateClick = (state: string) => {
    setSearchResult(`Nationwide delivery and full turnkey installation available across ${state}.`);
  };

  return (
    <section className="py-8 sm:py-14 bg-white">
      <div className="wrap">
        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl xs:text-2xl sm:text-4xl font-black tracking-[-1px] sm:tracking-[-1.3px] text-[#101114] m-0">
            Find Homes Near You
          </h2>
          <p className="text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0">
            We deliver modular homes nationwide.
          </p>
        </div>

        {/* 3-Column Layout: ZIP Search (1fr), Map Visual (1.2fr), Delivery Info (0.8fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_0.8fr] gap-3.5 sm:gap-5">
          {/* Card 1: Search by ZIP Code */}
          <div className="card p-4 sm:p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-[#101114] mb-3">
                Search by ZIP Code
              </h3>
              <form onSubmit={handleZipSearch} className="space-y-3">
                <div className="border border-[#dfe2e7] rounded-[11px] p-3 bg-white focus-within:border-[#fcb907] focus-within:ring-1 focus-within:ring-[#fcb907] transition-all">
                  <input
                    type="text"
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-transparent font-bold text-sm text-[#101114] focus:outline-none placeholder:text-[#9ca3af] placeholder:font-normal"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] w-full py-3 text-sm font-black rounded-[11px] shadow-sm transition-all cursor-pointer"
                >
                  Search →
                </button>
              </form>

              {searchResult && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg animate-in fade-in">
                  ✓ {searchResult}
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[#e7e9ee]">
              <p className="text-xs text-[#6b7280] leading-relaxed m-0">
                <span className="font-bold text-[#101114]">Popular: </span>
                {["Texas", "Florida", "California", "North Carolina", "Tennessee", "Georgia", "Ohio", "Michigan"].map((st, i, arr) => (
                  <span key={st}>
                    <button
                      type="button"
                      onClick={() => handleStateClick(st)}
                      className="hover:text-[#d97706] hover:underline cursor-pointer font-medium"
                    >
                      {st}
                    </button>
                    {i < arr.length - 1 && " · "}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Card 2: Interactive Styled USA Map Graphic */}
          <div className="card overflow-hidden relative flex flex-col items-center justify-center min-h-[260px] bg-gradient-to-br from-[#f8f9fa] to-[#eceef2] border border-[#e7e9ee] p-6 text-center">
            {/* SVG Visual Styling */}
            <div className="w-full max-w-sm h-full flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 600 350" className="w-full h-auto text-[#cbd5e1] drop-shadow-sm fill-current opacity-80 hover:opacity-100 transition-opacity">
                {/* Simplified stylized US nationwide contour */}
                <path d="M 50,70 Q 120,40 220,50 Q 300,30 420,40 Q 520,30 560,90 Q 580,140 550,200 Q 520,280 440,290 Q 380,310 320,300 Q 240,320 180,290 Q 100,280 60,220 Q 30,160 50,70 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="3" />
                {/* Regional hub delivery pin markers */}
                <circle cx="160" cy="180" r="8" fill="#fcb907" className="animate-pulse" />
                <circle cx="280" cy="190" r="8" fill="#fcb907" className="animate-pulse" />
                <circle cx="390" cy="150" r="8" fill="#fcb907" className="animate-pulse" />
                <circle cx="470" cy="210" r="8" fill="#fcb907" className="animate-pulse" />
                <circle cx="480" cy="110" r="8" fill="#fcb907" className="animate-pulse" />
                <circle cx="110" cy="120" r="8" fill="#fcb907" className="animate-pulse" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl sm:text-4xl font-black text-[#101114] tracking-wider opacity-90">
                  NATIONWIDE
                </div>
                <div className="text-xs font-bold text-[#d97706] mt-1 bg-white/95 px-3 py-1 rounded-full shadow-xs backdrop-blur-xs">
                  Direct Factory Delivery Across All 50 States
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Nationwide Delivery & Setup */}
          <div className="card p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-[#101114] mb-3">
                Nationwide Delivery & Setup
              </h3>
              <div className="space-y-2.5 text-sm text-[#3f4650] font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-base">✓</span>
                  <span>Delivered to your site</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-base">✓</span>
                  <span>Professional installation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-base">✓</span>
                  <span>All 50 states coverage</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/about"
                className="btn-outline w-full py-3 text-sm font-extrabold rounded-[11px] text-center justify-center hover:border-[#fcb907]"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
