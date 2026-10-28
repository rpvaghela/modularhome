import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-gray-500 py-3 ${className}`}
    >
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-[#e11d1d] transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="w-3 h-3 text-gray-400 mx-1 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[#0a0a0a] truncate max-w-[220px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-[#e11d1d] transition-colors truncate max-w-[180px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

