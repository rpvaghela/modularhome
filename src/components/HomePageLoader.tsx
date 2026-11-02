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
      const previewTimer = window.setTimeout(() => setProgress(68), 0);
      return () => window.clearTimeout(previewTimer);
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
      aria-busy={!isFading}
      role="status"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#0b0f17] px-6 select-none transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        isFading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

      <div className="relative z-10 flex w-full max-w-[360px] flex-col items-center text-center">
        <div className="mb-10 flex items-center justify-center">
          <Image
            src="/newmodularlogo.png"
            alt="ModularHome.com"
            width={240}
            height={55}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
        </div>

        <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#aeb5c0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#fcb907]" />
          <span>Preparing your catalog</span>
        </div>

        <div className="mb-7 h-px w-full overflow-hidden bg-white/15">
          <div
            className="h-full bg-[#fcb907] transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex w-full items-center justify-between text-[11px] text-[#8e96a3]">
          <span>Factory direct homes</span>
          <span className="text-[#fcb907]">Please wait</span>
        </div>
      </div>
    </div>
  );
}
