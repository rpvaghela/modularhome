"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  DollarSign,
  Truck,
  Wrench,
  FileCheck2,
  ArrowRight,
  Phone,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface CategorizedFaq {
  category: string;
  id: string;
  question: string;
  answer: string;
}

const EXTENDED_FAQS: CategorizedFaq[] = [
  // General & Engineering
  {
    category: "General & Blast Ratings",
    id: "gen-1",
    question: "How are bomb shelter blast ratings calculated?",
    answer: "Our subterranean shelters are engineered to withstand blast overpressure waves calculated in pounds per square inch (PSI). Standard models withstand 10 to 30 PSI, while hardened defense shelters are rated up to 50+ PSI. This exceeds the structural overpressure thresholds of severe nuclear thermal blasts at standard tactical radii.",
  },
  {
    category: "General & Blast Ratings",
    id: "gen-2",
    question: "What is the difference between a tornado storm shelter and a bomb shelter?",
    answer: "A tornado storm shelter (FEMA P-320 compliant) is engineered primarily to survive 250 MPH winds and airborne missile impacts. A bomb shelter is an airtight, subterranean pressure vessel engineered for ground shock, EMP hardening, radiation shielding (gamma and neutron attenuation), and positive-pressure NBC (Nuclear, Biological, Chemical) gas filtration.",
  },
  {
    category: "General & Blast Ratings",
    id: "gen-3",
    question: "How long can a family safely live inside an underground bunker?",
    answer: "Shelters are customized for 30-day, 60-day, or multi-year continuous subterranean habitation. Endurance depends on potable water tank capacity, Swiss NBC air filter canister life, battery microgrids, blackwater holding or anaerobic septic integration, and freeze-dried pantry storage volume.",
  },

  // Excavation & Installation
  {
    category: "Excavation & Installation",
    id: "inst-1",
    question: "How deep underground is the shelter installed?",
    answer: "Standard subterranean models are installed with 3 to 10 feet of compacted soil or reinforced concrete overburden above the shelter roof. This soil mantle provides essential thermal insulation (constant 55°F - 62°F year-round) and high radiation protection (half-value thickness attenuation).",
  },
  {
    category: "Excavation & Installation",
    id: "inst-2",
    question: "What happens if my property has a high water table or rock ledge?",
    answer: "Our certified engineers review local soil and water table surveys prior to construction. In high water table areas, we specify concrete anti-buoyancy ballast skirts and cathodic sacrificial zinc anodes. In solid granite or bedrock, we offer semi-subterranean bermed installations or interior ballistic panic rooms.",
  },
  {
    category: "Excavation & Installation",
    id: "inst-3",
    question: "How long does installation take on site?",
    answer: "Once excavation is prepped, our heavy crane and rigging crews typically place and seal the shelter within 1 to 2 business days. Complete backfill, drainage weeping tile hookups, and commissioning take 3 to 5 business days total.",
  },

  // NBC Air & Life Support
  {
    category: "Air & Life Support",
    id: "air-1",
    question: "How does Swiss NBC air filtration work during power grid outages?",
    answer: "Our military-spec Swiss NBC units operate on 110V/220V power with 12V battery backup, and include a manual hand-crank mechanism. If electricity fails completely, an adult can effortlessly crank the positive-pressure blower to maintain safe, fresh, carbon dioxide-scrubbed airflow indefinitely.",
  },
  {
    category: "Air & Life Support",
    id: "air-2",
    question: "What hazards do the NBC filters eliminate?",
    answer: "The multi-stage filtration trains include high-efficiency particulate air (HEPA) filters rated to 99.99% at 0.3 microns (stopping fallout dust, biological bacteria, and anthrax spores), followed by nuclear-grade activated carbon gas adsorbers (neutralizing sarin, VX, mustard gas, and chlorine). Blast valves instantly snap shut during shockwaves to prevent overpressure lung trauma.",
  },

  // Permitting & Privacy
  {
    category: "Permits & Discretion",
    id: "perm-1",
    question: "Will my neighbors or county records know I installed a bomb shelter?",
    answer: "We prioritize client privacy. In most jurisdictions, projects are permitted as private accessory structures, root cellars, or storm safety shelters. Our delivery trailers are discreet and unmarked upon request. We sign Non-Disclosure Agreements (NDAs) for private clients.",
  },
  {
    category: "Permits & Discretion",
    id: "perm-2",
    question: "Do you supply engineered architectural drawings for local building departments?",
    answer: "Yes. Every custom build package includes stamped structural engineering blueprints tailored to your state's building codes and soil conditions.",
  },

  // Pricing & Financing
  {
    category: "Pricing & Financing",
    id: "price-1",
    question: "What is the entry price for a bomb shelter or storm bunker?",
    answer: "Turnkey residential storm shelters start at $12,900. Standard 4-8 person subterranean corrugated steel bomb shelters with NBC filtration start at $49,900. Luxury underground multi-room complexes range from $199,900 to $1M+.",
  },
  {
    category: "Pricing & Financing",
    id: "price-2",
    question: "What financing options are available?",
    answer: "We work with specialized nationwide lenders offering fixed-rate unsecured personal loans, construction loans, and home equity programs up to $250,000+ with flexible 5 to 15-year repayment terms.",
  },
];

const CATEGORIES = [
  "All Categories",
  "General & Blast Ratings",
  "Excavation & Installation",
  "Air & Life Support",
  "Permits & Discretion",
  "Pricing & Financing",
];

export default function FaqsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>("gen-1");
  const [faqsList, setFaqsList] = useState<CategorizedFaq[]>(EXTENDED_FAQS);

  useEffect(() => {
    fetch("/api/bombshelter/faqs")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const dynamicList: CategorizedFaq[] = json.data.map((item: any) => ({
            category: item.category || "General & Blast Ratings",
            id: item.id,
            question: item.question,
            answer: item.answer,
          }));
          setFaqsList(dynamicList);
        }
      })
      .catch(() => {});
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqsList.filter((faq) => {
      const matchesCat =
        selectedCategory === "All Categories" || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery, faqsList]);

  return (
    <>
      <SubPageHeader
        badge="KNOWLEDGE BASE"
        title="FREQUENTLY ASKED"
        highlight="QUESTIONS"
        description="Comprehensive engineering answers covering blast ratings, subterranean excavation, Swiss NBC air filtration, privacy, and turnkey installation."
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <section className="bg-white text-[#0a0a0a] py-16">
        <div className="site-container">
          {/* Search Bar & Category Filters */}
          <div className="max-w-3xl mx-auto mb-12 space-y-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. blast rating, cost, permits, NBC filters)..."
                className="w-full text-sm sm:text-base px-4 py-3.5 pl-11 rounded-lg border border-gray-300 focus:outline-none focus:border-[#e11d1d] focus:ring-2 focus:ring-[#e11d1d]/20 shadow-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0a0a0a] text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-lg bg-gray-50 border border-gray-200">
                <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-display font-bold text-base text-gray-700">No questions matched your search</h4>
                <p className="text-xs text-gray-500 mt-1">Try searching a different term or reset your category filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded bg-[#e11d1d] text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-lg border border-gray-200 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-gray-50 hover:bg-gray-100/80 transition-colors"
                    >
                      <span className="font-display font-bold text-sm sm:text-base text-[#0a0a0a]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#e11d1d]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-4 sm:p-5 bg-white border-t border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Still Have Questions Box */}
          <div className="max-w-3xl mx-auto mt-12 p-6 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-base text-[#0a0a0a]">
                Have a specific site engineering question?
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Our certified blast engineers are available to review your project specs directly.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:812-595-4033"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-gray-300 font-display font-bold text-xs hover:border-black transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#e11d1d]" />
                <span>812-595-4033</span>
              </a>
              <Button asLink href="/contact" size="sm">
                <span>Ask an Engineer</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

