"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomePageLoader() {
  const [progress, setProgress] = useState(15);
  const [isFading, setIsFading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const isPreview = typeof window !== "undefined" && window.location.search.includes("previewLoader=true");
    if (isPreview) {
      setProgress(68);
      return;
    }

    let currentProgress = 15;
    
    // Simulate natural progress increments
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 18) + 8;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 120);

    const handleComplete = () => {
      clearInterval(progressInterval);
      setProgress(100);

      // Give a tiny buffer for 100% state to register visually, then fade out
      setTimeout(() => {
        setIsFading(true);
        // Unmount after CSS transition completes
        setTimeout(() => {
          setIsRemoved(true);
        }, 700);
      }, 250);
    };

    if (document.readyState === "complete") {
      handleComplete();
    } else {
      window.addEventListener("load", handleComplete);
    }

    // Safety fallback: Never keep the loader visible longer than 2.5 seconds
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(safetyTimer);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div
      aria-hidden={isFading}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0b0f17] select-none transition-all duration-700 ease-out ${
        isFading ? "opacity-0 pointer-events-none scale-102" : "opacity-100"
      }`}
    >
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#fcb907]/12 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Brand Logo with Gentle Glow */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#fcb907]/20 rounded-2xl blur-xl animate-pulse" />
          <Image
            src="/newmodularlogo.png"
            alt="ModularHome.com"
            width={240}
            height={55}
            priority
            className="relative h-11 sm:h-13 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Minimalist Architectural Loader Icon */}
        <div className="relative w-12 h-12 mb-5 flex items-center justify-center">
          {/* Rotating outer spinner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[#fcb907] animate-spin" />
          
          {/* Inner pulsing blueprint square */}
          <div className="w-5 h-5 rounded-md bg-[#fcb907]/20 border border-[#fcb907]/50 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-xs bg-[#fcb907]" />
          </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-200 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-ping" />
          <span>Loading 2026 Home Models & Blueprint Kits</span>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-56 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/10 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-[#fcb907] to-amber-300 rounded-full transition-all duration-200 ease-out shadow-[0_0_12px_rgba(252,185,7,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage & Subtitle */}
        <div className="flex items-center justify-between w-56 sm:w-64 mt-2 text-[11px] text-gray-400 font-medium">
          <span>Factory Direct Built</span>
          <span className="font-mono text-amber-300 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
