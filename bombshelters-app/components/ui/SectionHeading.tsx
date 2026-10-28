import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  linkLabel?: string;
  linkHref?: string;
  dark?: boolean;
  className?: string;
}

// Section heading: centred bold uppercase title with a red keyword, subtitle below, and a "View All" link pinned right on desktop.
export function SectionHeading({
  title,
  highlight,
  subtitle,
  linkLabel,
  linkHref = "#",
  dark = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`relative flex flex-col items-center text-center gap-3 mb-7 lg:mb-9 ${className}`}
    >
      {/* Title with the subtitle stacked underneath, both centred; side padding only when a "View All" link needs room */}
      <div className={`flex flex-col items-center gap-2 min-w-0 ${linkLabel ? "md:px-48" : ""}`}>
        <h2
          className={`font-display font-bold uppercase text-[28px] sm:text-[34px] lg:text-[40px] leading-none tracking-tight ${
            dark ? "text-white" : "text-[#0a0a0a]"
          }`}
        >
          {title} {highlight && <span className="text-[#e11d1d]">{highlight}</span>}
        </h2>
        {subtitle && (
          <p
            className={`text-sm sm:text-[15px] leading-relaxed max-w-3xl text-balance ${
              dark ? "text-[#cbd5e1]" : "text-[#4a5568]"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {linkLabel && (
        <Link
          href={linkHref}
          className={`inline-flex items-center gap-1.5 shrink-0 font-display font-semibold uppercase text-xs sm:text-[13px] tracking-wider transition-colors md:absolute md:right-0 md:bottom-1 ${
            dark ? "text-white hover:text-[#e11d1d]" : "text-[#0a0a0a] hover:text-[#e11d1d]"
          }`}
        >
          <span>{linkLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
