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

// Mockup-style heading: bold uppercase title with a red keyword, inline subtitle, and a "View All" link on the right.
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
      className={`flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6 mb-7 lg:mb-8 ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-1 lg:gap-5">
        <h2
          className={`font-display font-bold uppercase text-[28px] sm:text-[34px] lg:text-[40px] leading-none tracking-tight whitespace-nowrap ${
            dark ? "text-white" : "text-[#0a0a0a]"
          }`}
        >
          {title} {highlight && <span className="text-[#e11d1d]">{highlight}</span>}
        </h2>
        {subtitle && (
          <p
            className={`text-[13px] sm:text-sm leading-snug lg:pb-1 max-w-xl ${
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
          className={`inline-flex items-center gap-1.5 shrink-0 font-display font-semibold uppercase text-xs sm:text-[13px] tracking-wider transition-colors self-start md:self-auto md:pb-1 ${
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
