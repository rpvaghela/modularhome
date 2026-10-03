"use client";

import { useState } from "react";
import Link from "next/link";

export default function FinancingSection() {
  const [homePrice, setHomePrice] = useState<number>(200000);
  const [downPayment, setDownPayment] = useState<number>(20000);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [rate, setRate] = useState<number>(6.5);

  // Amortization calculation
  const principal = Math.max(0, homePrice - downPayment);
  const monthlyRate = rate / 100 / 12;
  const totalMonths = loanTermYears * 12;

  const monthlyPayment = principal > 0 && monthlyRate > 0
    ? Math.round(
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
      )
    : 0;

  return (
    <section className="py-8 sm:py-14 bg-white" id="financing">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-center">
          {/* Left: Financing Information */}
          <div className="space-y-3.5 sm:space-y-4">
            <div>
              <h2 className="text-xl xs:text-2xl sm:text-4xl font-black tracking-[-1px] sm:tracking-[-1.3px] text-[#101114] m-0 leading-tight">
                Financing Your Modular Home
              </h2>
              <p className="text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0">
                Flexible options to make your dream home a reality.
              </p>
            </div>

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-[#3f4650] font-semibold py-1 sm:py-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-black">✓</span>
                <span>Competitive rates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-black">✓</span>
                <span>Multiple loan options (FHA, VA, Conventional, Construction)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-black">✓</span>
                <span>Fast approval process</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-black">✓</span>
                <span>Work with trusted modular lenders</span>
              </div>
            </div>

            <div className="pt-1 sm:pt-2">
              <Link
                href="/contact"
                className="btn-outline py-2.5 sm:py-3 px-5 sm:px-6 text-xs sm:text-sm font-extrabold rounded-[11px]"
              >
                Learn More →
              </Link>
            </div>
          </div>

          {/* Right: Interactive Mortgage Calculator Card */}
          <div className="card p-4 sm:p-7 bg-white mt-2 sm:mt-0">
            <h3 className="text-lg sm:text-xl font-black text-[#101114] mb-3 sm:mb-4">
              Estimate Your Monthly Payment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* Home Price */}
              <div className="border border-[#dfe2e7] rounded-[11px] p-3 bg-white focus-within:border-[#fcb907] focus-within:ring-1 focus-within:ring-[#fcb907] transition-all">
                <label className="block text-[11px] font-semibold text-[#6b7280] mb-0.5">
                  Home Price
                </label>
                <div className="flex items-center gap-1 font-bold text-sm text-[#101114]">
                  <span>$</span>
                  <input
                    type="number"
                    value={homePrice}
                    step={5000}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div className="border border-[#dfe2e7] rounded-[11px] p-3 bg-white focus-within:border-[#fcb907] focus-within:ring-1 focus-within:ring-[#fcb907] transition-all">
                <label className="block text-[11px] font-semibold text-[#6b7280] mb-0.5">
                  Down Payment
                </label>
                <div className="flex items-center gap-1 font-bold text-sm text-[#101114]">
                  <span>$</span>
                  <input
                    type="number"
                    value={downPayment}
                    step={2500}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div className="border border-[#dfe2e7] rounded-[11px] p-3 bg-white focus-within:border-[#fcb907] focus-within:ring-1 focus-within:ring-[#fcb907] transition-all">
                <label className="block text-[11px] font-semibold text-[#6b7280] mb-0.5">
                  Loan Term
                </label>
                <select
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-transparent font-bold text-sm text-[#101114] focus:outline-none cursor-pointer"
                >
                  <option value={30}>30 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={10}>10 Years</option>
                </select>
              </div>

              {/* Interest Rate */}
              <div className="border border-[#dfe2e7] rounded-[11px] p-3 bg-white focus-within:border-[#fcb907] focus-within:ring-1 focus-within:ring-[#fcb907] transition-all">
                <label className="block text-[11px] font-semibold text-[#6b7280] mb-0.5">
                  Interest Rate
                </label>
                <div className="flex items-center gap-1 font-bold text-sm text-[#101114]">
                  <input
                    type="number"
                    step={0.1}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            {/* Calculated Monthly Payment Output */}
            <div className="pt-2 border-t border-[#e7e9ee]">
              <div className="text-xs sm:text-sm text-[#6b7280] font-semibold">
                Estimated Monthly Payment
              </div>
              <div className="text-3xl sm:text-[35px] font-black text-[#101114] tracking-tight mt-1">
                ${new Intl.NumberFormat("en-US").format(monthlyPayment)}
                <span className="text-sm font-semibold text-[#6b7280] ml-1.5 font-normal">
                  / month
                </span>
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">
                Based on ${new Intl.NumberFormat("en-US").format(principal)} financed over {loanTermYears} years. Taxes & insurance excluded.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
