import Link from "next/link";
import Image from "next/image";

export default function BudgetSection() {
  const budgetTiers = [
    {
      range: "Under $75K",
      label: "Affordable Options →",
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=700&q=75",
      href: "/buildings?budget=under-75k",
    },
    {
      range: "$75K – $150K",
      label: "Great Value Homes →",
      image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=700&q=75",
      href: "/buildings?budget=75k-150k",
    },
    {
      range: "$150K – $250K",
      label: "Most Popular →",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=75",
      href: "/buildings?budget=150k-250k",
    },
    {
      range: "$250K+",
      label: "Premium Homes →",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=700&q=75",
      href: "/buildings?budget=250k-plus",
    },
  ];

  return (
    <section className="py-8 sm:py-14 bg-[#f6f7f9]">
      <div className="wrap">
        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl xs:text-2xl sm:text-4xl font-black tracking-[-1px] sm:tracking-[-1.3px] text-[#101114] m-0">
            Find a Home in Your Budget
          </h2>
          <p className="text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0">
            Quality homes for every budget.
          </p>
        </div>

        {/* 4 Budget Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {budgetTiers.map((tier, idx) => (
            <Link
              key={idx}
              href={tier.href}
              className="card overflow-hidden group hover:-translate-y-1 transition-all block"
            >
              <div className="relative h-[120px] xs:h-[140px] sm:h-[190px] w-full overflow-hidden bg-gray-100">
                <Image
                  src={tier.image}
                  alt={tier.range}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                />
              </div>
              <div className="p-3 sm:p-4 bg-white">
                <h3 className="text-sm xs:text-base sm:text-lg font-black text-[#101114] mb-0.5 sm:mb-1 group-hover:text-[#d97706] transition-colors">
                  {tier.range}
                </h3>
                <div className="text-xs sm:text-[13px] text-[#6b7280] font-medium group-hover:text-[#d97706] transition-colors">
                  {tier.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
