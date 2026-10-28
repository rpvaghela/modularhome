"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Percent,
  Check,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

export default function FinancingPage() {
  const [loanAmount, setLoanAmount] = useState(65000);
  const [interestRate, setInterestRate] = useState(7.99);
  const [loanTermYears, setLoanTermYears] = useState(10);

  // Calculate monthly payment
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const loanPrograms = [
    {
      title: "Fixed-Rate Preparedness Loan",
      badge: "MOST POPULAR",
      terms: "Up to 15 Years",
      rates: "From 6.99% APR",
      maxAmount: "Up to $100,000",
      features: [
        "Unsecured — zero home equity or appraisal required",
        "Fast electronic approvals within 24-48 hours",
        "No prepayment penalties for early payoff",
        "Direct fund disbursement for site deposit & fabrication",
      ],
    },
    {
      title: "Construction & Land Line",
      badge: "BEST FOR BUNKERS",
      terms: "10 to 20 Years",
      rates: "From 5.75% APR",
      maxAmount: "Up to $500,000+",
      features: [
        "Covers both subterranean shelter & excavation costs",
        "Interest-only payments during factory build phase",
        "Converts to conventional fixed mortgage upon final sign-off",
        "Requires parcel or residential equity verification",
      ],
    },
    {
      title: "Commercial & Municipal Financing",
      badge: "INSTITUTIONAL",
      terms: "Custom Tiers",
      rates: "Competitive Commercial",
      maxAmount: "Up to $2,000,000",
      features: [
        "Tailored for corporate retreats, schools & community shelters",
        "Structured milestone draw disbursements",
        "Tax-advantaged capital equipment depreciation",
        "Dedicated corporate lending advisor assigned",
      ],
    },
  ];

  return (
    <>
      <SubPageHeader
        badge="FLEXIBLE CAPITAL & LOANS"
        title="FINANCING &"
        highlight="PAYMENT PLANS"
        description="Invest in your family's lifelong defense with accessible monthly financing, fixed-rate loans up to $250,000+, and fast 48-hour pre-approvals."
        breadcrumbs={[{ label: "Financing" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container">
          {/* Interactive Calculator */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#0a0a0a]">
                Subterranean Shelter Payment Calculator
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Estimate your monthly investment based on custom shelter dimensions and loan terms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto p-6 sm:p-10 rounded-2xl bg-gray-50 border border-gray-200 shadow-xl">
              {/* Sliders (Left 7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-2">
                    <span>Estimated Project Amount:</span>
                    <span className="text-lg font-display text-[#e11d1d]">
                      ${loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="250000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e11d1d]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>$15,000 (Storm Shelter)</span>
                    <span>$250,000 (Luxury Bunker)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-2">
                    <span>Loan Term (Years):</span>
                    <span className="text-lg font-display text-[#e11d1d]">{loanTermYears} Years</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 7, 10, 15].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setLoanTermYears(yr)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          loanTermYears === yr
                            ? "bg-[#0a0a0a] text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {yr} Years
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-2">
                    <span>Estimated APR:</span>
                    <span className="text-lg font-display text-[#e11d1d]">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4.99"
                    max="14.99"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e11d1d]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>4.99% (Tier 1 Prime)</span>
                    <span>14.99%</span>
                  </div>
                </div>
              </div>

              {/* Result Card (Right 5 cols) */}
              <div className="lg:col-span-5 bg-[#0e1014] text-white p-6 sm:p-8 rounded-xl flex flex-col justify-between border border-[#22252a]">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">
                    Estimated Monthly Payment
                  </div>
                  <div className="text-4xl sm:text-5xl font-display font-black text-[#e11d1d] tracking-tight">
                    ${Math.round(monthlyPayment).toLocaleString()}
                    <span className="text-sm font-normal text-gray-400">/mo</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Principal &amp; Interest based on {loanTermYears}-year term at {interestRate}% APR.
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#22252a] space-y-2 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Financed:</span>
                      <span className="font-semibold text-white">${loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Payments:</span>
                      <span className="font-semibold text-white">
                        ${Math.round(monthlyPayment * totalMonths).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prepayment Penalty:</span>
                      <span className="font-semibold text-green-400">$0 (None)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <Button asLink href="/quote" size="md" className="w-full text-center">
                    <span>Apply for Pre-Approval</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Loan Program Cards */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                Specialized Defense &amp; Construction Loan Programs
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Lending partners vetted specifically for capital survival and structural shelter builds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loanPrograms.map((program) => (
                <div
                  key={program.title}
                  className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white hover:border-[#e11d1d] hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#e11d1d] bg-[#e11d1d]/10 px-2 py-0.5 rounded">
                        {program.badge}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">{program.terms}</span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-[#0a0a0a] mb-2">
                      {program.title}
                    </h4>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-display font-black text-[#0a0a0a]">
                        {program.rates}
                      </span>
                      <span className="text-xs text-gray-500">| {program.maxAmount}</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-gray-600 mb-6">
                      {program.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#e11d1d] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button asLink href="/contact" variant="outline" size="sm" className="w-full">
                    <span>Inquire About Rates</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps to Pre-Approval */}
          <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-center mb-8">
              3 Simple Steps to Pre-Approval
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] text-white font-display font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                  1
                </div>
                <h5 className="font-display font-bold text-sm uppercase">Select Your Model</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Choose your shelter model, dimensions, and optional NBC/ballistic upgrades.
                </p>
              </div>

              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#e11d1d] text-white font-display font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                  2
                </div>
                <h5 className="font-display font-bold text-sm uppercase">Fast Soft-Credit Check</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Submit basic information. Review personalized rates and terms with zero impact on credit score.
                </p>
              </div>

              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] text-white font-display font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                  3
                </div>
                <h5 className="font-display font-bold text-sm uppercase">Fabrication Commences</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Funds disburse directly to secure structural steel and factory fabrication slots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Secure Your Pre-Approval?"
        subtitle="Speak directly with our finance specialists. We help calculate accurate monthly obligations tailored to your household budget."
        ctaText="Start Financing Application"
        ctaHref="/contact"
      />
    </>
  );
}
