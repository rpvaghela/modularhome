import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/Breadcrumbs";

interface SubPageHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
}

export function SubPageHeader({
  badge,
  title,
  highlight,
  description,
  breadcrumbs,
}: SubPageHeaderProps) {
  return (
    <div className="bg-[#0e1013] text-white border-b border-[#22252a] relative overflow-hidden">
      {/* Background subtle tactical grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e11d1d_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e11d1d]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10 pt-4 pb-10 sm:pb-14">
        {/* Breadcrumbs with light styling on dark background */}
        <div className="mb-4">
          <nav aria-label="Breadcrumb" className="flex items-center text-xs text-gray-400 py-1">
            <ol className="flex items-center space-x-1.5 flex-wrap">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={index} className="inline-flex items-center">
                    <span className="text-gray-600 mx-1.5">/</span>
                    {isLast || !item.href ? (
                      <span className="font-semibold text-white truncate max-w-[220px] sm:max-w-none">
                        {item.label}
                      </span>
                    ) : (
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors truncate max-w-[180px] sm:max-w-none"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {badge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e11d1d]/15 border border-[#e11d1d]/30 text-[#ff4d4d] text-[11px] font-display font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e11d1d] animate-pulse" />
            <span>{badge}</span>
          </div>
        )}

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white max-w-4xl">
          {title}{" "}
          {highlight && <span className="text-[#e11d1d]">{highlight}</span>}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

