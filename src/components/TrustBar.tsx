"use client";

import { Home, DollarSign, Leaf, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: Home,
      label: "Faster Build Times",
      desc: "50% faster than site-built",
      accent: "from-amber-400 to-yellow-500",
    },
    {
      icon: DollarSign,
      label: "Lower Costs",
      desc: "Up to 30% factory savings",
      accent: "from-yellow-400 to-amber-500",
    },
    {
      icon: Leaf,
      label: "Energy Efficient",
      desc: "High-R SIPs & thermal seal",
      accent: "from-emerald-400 to-teal-500",
    },
    {
      icon: CheckCircle2,
      label: "Nationwide Delivery",
      desc: "Delivered to all 50 states",
      accent: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="wrap relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 -mt-6 sm:-mt-10 lg:-mt-14">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden bg-white/98 backdrop-blur-md rounded-2xl lg:rounded-3xl border border-gray-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(252,185,7,0.22)] hover:border-[#fcb907]/80 text-center py-4 sm:py-6 lg:py-7 px-3 sm:px-5 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[145px] lg:min-h-[175px] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out group cursor-pointer select-none"
            >
              {/* Top Animated Gold Accent Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-[#fcb907] via-[#f59e0b] to-[#fcb907] transition-all duration-500 rounded-t-2xl" />

              {/* Shimmer Light Reflection Sweep Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

              {/* Icon with Glowing Squircle Badge */}
              <div className="relative mb-2 sm:mb-3">
                <div className="w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl bg-amber-50 group-hover:bg-[#fcb907] text-[#d97706] group-hover:text-[#101114] flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 stroke-[2.3]" />
                </div>
                {/* Micro-glow ring */}
                <span className="absolute -inset-1 rounded-2xl bg-[#fcb907]/20 opacity-0 group-hover:opacity-100 blur-xs transition-opacity duration-300 -z-10" />
              </div>

              {/* Main Label */}
              <span className="text-[#101114] group-hover:text-[#b45309] font-extrabold text-xs sm:text-sm lg:text-base tracking-tight leading-snug transition-colors duration-200">
                {item.label}
              </span>

              {/* Sub-caption benefit description */}
              <span className="text-[10px] sm:text-[11.5px] text-[#6b7280] group-hover:text-gray-900 font-medium mt-0.5 sm:mt-1 transition-colors duration-200">
                {item.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
