import React from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  children: React.ReactNode;
  className?: string;
  asLink?: boolean;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  showArrow = false,
  children,
  className = "",
  asLink = false,
  href,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-display uppercase tracking-wider font-bold transition-all duration-200 rounded-[4px] select-none text-center";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#e11d1d] hover:bg-[#ff2b2b] text-white shadow-md hover:shadow-redGlow active:scale-[0.98]",
    outline:
      "bg-transparent border border-[#2a2d31] hover:border-white/50 text-white hover:bg-white/5 active:scale-[0.98]",
    dark: "bg-[#16181b] hover:bg-[#202428] text-white border border-[#2a2d31] active:scale-[0.98]",
    ghost: "bg-transparent text-[#a1a1aa] hover:text-white hover:bg-white/5",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (asLink && href) {
    return (
      <a href={href} className={combinedClasses}>
        <span>{children}</span>
        {showArrow && <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      <span>{children}</span>
      {showArrow && <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
