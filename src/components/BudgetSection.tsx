import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BuildingModel } from "@/data/models";
import { BudgetTierItem, computeBudgetTiers } from "@/lib/publicData";

interface BudgetSectionProps {
  products?: BuildingModel[];
  tiers?: BudgetTierItem[];
}

export default function BudgetSection({ products, tiers }: BudgetSectionProps) {
  const budgetTiers: BudgetTierItem[] = tiers && tiers.length > 0 ? tiers : computeBudgetTiers(products);

  return (
    <section className="py-10 sm:py-16 bg-white font-sans">
      <div className="wrap">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8 font-sans">
          <div>
            <h2 className="font-sans text-2xl sm:text-4xl font-black tracking-[-1.2px] text-[#101114] m-0">
              Find a Home in Your Budget
            </h2>
            <p className="font-sans text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0 font-medium">
              Explore engineered modular homes and building kits matched to your target price range.
            </p>
          </div>
          <Link
            href="/buildings"
            className="font-sans text-[#d97706] hover:text-[#b45309] font-black text-xs sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1 group"
          >
            <span>Explore All Price Ranges</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* 4 Dynamic Budget Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 font-sans">
          {budgetTiers.map((tier) => (
            <Link
              key={tier.id}
              href={tier.href}
              className="group rounded-2xl bg-white border border-gray-200/90 hover:border-[#fcb907] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 block relative"
            >
              <div className="relative h-[140px] xs:h-[160px] sm:h-[195px] w-full overflow-hidden bg-gray-100">
                <Image
                  src={tier.image}
                  alt={tier.range}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Live Count Badge */}
                {tier.count > 0 && (
                  <span className="absolute top-3 right-3 bg-black/65 backdrop-blur-md text-white text-[10.5px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {tier.count} Models
                  </span>
                )}
              </div>
              <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 font-sans">
                <h3 className="font-sans text-base sm:text-lg font-black text-[#101114] group-hover:text-[#b45309] transition-colors mb-0.5">
                  {tier.range}
                </h3>
                <div className="font-sans text-xs sm:text-[13px] text-[#6b7280] group-hover:text-[#d97706] font-bold transition-colors flex items-center justify-between">
                  <span>{tier.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

