"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function BlueprintLoaderMark() {
  return (
    <div className="relative h-52 w-52 sm:h-60 sm:w-60" aria-hidden="true">
      <div className="absolute inset-5 rounded-[28px] border border-[#d8dee7] bg-white/75 shadow-[0_18px_50px_rgba(22,34,51,0.08)]" />
      <svg className="relative h-full w-full" fill="none" viewBox="0 0 240 240">
        <path d="M34 30h172v180H34z" stroke="#e3e7ed" strokeWidth="1" />
        <path d="M58 48h124M58 72h124M58 96h124M58 120h124M58 144h124M58 168h124M58 192h124" stroke="#eef1f4" strokeWidth="1" />
        <path d="M58 48v144M82 48v144M106 48v144M130 48v144M154 48v144M182 48v144" stroke="#eef1f4" strokeWidth="1" />

        <g stroke="#7d8998" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M58 177V106l62-43 62 43v71H58Z" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
            <animate attributeName="stroke-dashoffset" dur="2.8s" from="1" repeatCount="indefinite" to="0" />
          </path>
          <path d="M120 64v113M58 137h62M120 137h62M87 106h22v20H87zM131 106h22v20h-22z" opacity="0.8" />
          <path d="M104 177v-22h32v22M67 151h13M160 151h13" />
        </g>

        <g stroke="#fcb907" strokeLinecap="round" strokeWidth="3">
          <path d="M58 177V106l62-43 62 43" pathLength="1" strokeDasharray="0.42 0.58" strokeDashoffset="0.42">
            <animate attributeName="stroke-dashoffset" dur="2.8s" from="0.42" repeatCount="indefinite" to="-0.58" />
          </path>
          <circle cx="58" cy="177" fill="#fcb907" r="3">
            <animate attributeName="cx" dur="2.8s" repeatCount="indefinite" values="58;58;120;182;182" />
            <animate attributeName="cy" dur="2.8s" repeatCount="indefinite" values="177;106;63;106;177" />
          </circle>
        </g>

        <g fill="#fcb907">
          <rect height="4" rx="2" width="22" x="30" y="20" />
          <rect height="4" rx="2" width="12" x="188" y="216" />
        </g>
      </svg>
    </div>
  );
}

export default function HomePageLoader() {
  const [isFading, setIsFading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const isPreview = typeof window !== "undefined" && window.location.search.includes("previewLoader=true");
    if (isPreview) return;

    let fadeTimer: number | undefined;
    let removeTimer: number | undefined;
    const handleComplete = () => {
      fadeTimer = window.setTimeout(() => {
        setIsFading(true);
        removeTimer = window.setTimeout(() => {
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
      clearTimeout(safetyTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
      if (removeTimer) clearTimeout(removeTimer);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div
      aria-hidden={isFading}
      aria-busy={!isFading}
      aria-label="Loading ModularHome.com"
      role="status"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f8fafc]/95 px-6 select-none backdrop-blur-xl transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        isFading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundImage: "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex items-center justify-center">
          <Image
            src="/newmodularlogo.png"
            alt="ModularHome.com"
            width={240}
            height={55}
            priority
            className="h-8 w-auto object-contain sm:h-9"
          />
        </div>

        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#7d8998]">
          Precision-built living
        </p>

        <BlueprintLoaderMark />

        <div className="mt-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-[#4b5563]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#fcb907]" />
          <span>Preparing your home catalog</span>
        </div>
      </div>
    </div>
  );
}
