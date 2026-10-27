"use client";

import React from "react";
import Image from "next/image";
import { Radiation, CloudLightning, ShieldAlert, Tornado } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function Hero() {
  const threatPillars = [
    { title: "Nuclear Threats", icon: <Radiation className="w-4 h-4 text-white" /> },
    { title: "Natural Disasters", icon: <Tornado className="w-4 h-4 text-white" /> },
    { title: "Civil Unrest", icon: <ShieldAlert className="w-4 h-4 text-white" /> },
    { title: "Extreme Weather", icon: <CloudLightning className="w-4 h-4 text-white" /> },
  ];

  return (
    <section className="relative min-h-[500px] lg:min-h-[560px] flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Image - Vividly Visible with Directional Contrast */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=90"
          alt="Atmospheric defense landscape with subterranean shelter hatch"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center filter brightness-[0.82] contrast-[1.12]"
        />
        {/* Directional Vignette: Opaque on the Left for Text Legibility, Clear on the Right for Visual Impact */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 via-55% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
      </div>

      {/* Content Container - Compact & Perfectly Proportioned */}
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14 flex flex-col items-start text-left">
        {/* Animated Headline Block */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-[#16181b]/90 border border-[#2a2d31] backdrop-blur-sm mb-3.5">
            <span className="w-2 h-2 rounded-full bg-[#e11d1d] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-widest text-[#cbd5e1]">
              DEFENSE-GRADE SUB-SURFACE SECURITY
            </span>
          </div>

          <h1 className="font-display font-black uppercase tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.02]">
            <span className="text-white">THE WORLD IS </span>
            <span className="text-[#e11d1d] drop-shadow-[0_0_30px_rgba(225,29,29,0.55)]">
              UNPREDICTABLE.
            </span>
            <span className="block text-white text-2xl sm:text-3xl md:text-4xl lg:text-[42px] mt-1 font-extrabold tracking-tight">
              YOUR FAMILY&apos;S SAFETY{" "}
              <span className="font-serif italic text-[#e11d1d] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal lowercase tracking-normal">
                shouldn&apos;t be.
              </span>
            </span>
          </h1>

          <p className="mt-3.5 text-[#cbd5e1] text-xs sm:text-sm md:text-base font-sans font-light leading-relaxed max-w-xl">
            Engineered subterranean blast shelters, FEMA storm sanctuaries, and off-grid fortified
            steel homesteads. Built to withstand catastrophic threats for generations.
          </p>
        </motion.div>

        {/* 4 Threat Pillars in a Row - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-5 w-full max-w-2xl"
        >
          {threatPillars.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-2 px-2.5 py-2 rounded-[4px] bg-[#111214]/85 border border-[#2a2d31] backdrop-blur-md hover:border-[#e11d1d]/80 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-[#e11d1d] flex items-center justify-center shrink-0 shadow-redGlow group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider text-white truncate">
                {item.title}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Action Buttons - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
        >
          <Button
            asLink
            href="#featured-models"
            size="md"
            showArrow
            className="text-xs sm:text-sm px-6 py-2.5 sm:py-3 shadow-redGlow"
          >
            EXPLORE SHELTERS
          </Button>
          <Button
            asLink
            href="#financing"
            variant="outline"
            size="md"
            className="text-xs sm:text-sm px-6 py-2.5 sm:py-3 bg-black/40 backdrop-blur-sm hover:bg-white/10"
          >
            REQUEST CONSULTATION
          </Button>
        </motion.div>

        {/* Bottom Tagline Badge */}
        <div className="mt-6 lg:mt-8">
          <div className="inline-block transform -rotate-1 border-l-2 border-[#e11d1d] pl-2.5 py-0.5 bg-black/70 backdrop-blur-md text-left">
            <span className="font-display font-extrabold uppercase text-[10px] sm:text-xs tracking-widest text-[#e11d1d] block">
              REAL PEOPLE. REAL SOLUTIONS.
            </span>
            <span className="text-white text-[10px] sm:text-xs tracking-wider uppercase font-semibold">
              A SAFER TOMORROW.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
