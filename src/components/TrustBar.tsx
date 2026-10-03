import { Home, DollarSign, Leaf, CheckCircle2 } from "lucide-react";

export default function TrustBar() {
  const items = [
    { 
      icon: Home, 
      label: "Faster Build Times" 
    },
    { 
      icon: DollarSign, 
      label: "Lower Costs" 
    },
    { 
      icon: Leaf, 
      label: "Energy Efficient" 
    },
    { 
      icon: CheckCircle2, 
      label: "Nationwide Delivery" 
    },
  ];

  return (
    <div className="wrap relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 -mt-6 sm:-mt-10 lg:-mt-14">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="card bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_35px_rgba(252,185,7,0.18)] text-center py-3.5 sm:py-6 lg:py-8 px-2.5 sm:px-5 flex flex-col items-center justify-center min-h-[90px] sm:min-h-[135px] lg:min-h-[165px] hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <div className="mb-1.5 sm:mb-3 text-[#fcb907] group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" strokeWidth={2.5} />
              </div>
              <span className="text-[#101114] font-extrabold text-xs sm:text-sm lg:text-base tracking-tight leading-snug">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

