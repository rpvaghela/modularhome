"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Search, MapPin, X, Sparkles, Building2, DollarSign, BedDouble, Bath, ShieldCheck } from "lucide-react";
import { HomeTypeCategoryItem } from "@/lib/publicData";

export interface OptionItem {
  label: string;
  value: string;
  count?: number | string;
  subtitle?: string;
}

interface CustomDropdownProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: OptionItem[];
  onChange: (val: string) => void;
}

function CustomDropdown({ label, icon, value, options, onChange }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const isCustomSelected = value !== options[0]?.value;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`w-full border rounded-[12px] p-3 sm:px-3.5 sm:py-2.5 bg-white flex flex-col justify-center text-left transition-all duration-150 cursor-pointer select-none relative ${
          open
            ? "border-[#fcb907] ring-2 ring-[#fcb907]/25 shadow-xs"
            : isCustomSelected
            ? "border-[#fcb907] bg-[#fffdfa]"
            : "border-[#dfe2e7] hover:border-[#fcb907]/70"
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-0.5 pointer-events-none">
          <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#6b7280] uppercase tracking-wider">
            {icon}
            <span>{label}</span>
          </span>
          {isCustomSelected && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
          )}
        </div>
        <div className="flex items-center justify-between font-extrabold text-sm text-[#101114]">
          <span className="truncate pr-1.5">{selectedOption?.label || value}</span>
          <ChevronDown
            className={`w-4 h-4 text-[#fcb907] shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#fcb907]/40 rounded-xl shadow-2xl z-[999] py-1.5 max-h-72 overflow-y-auto ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#fcb907] text-[#101114] font-black shadow-2xs"
                    : "text-[#1e293b] hover:bg-[#fef8ee] hover:text-[#b45309]"
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="truncate">{option.label}</span>
                  {option.subtitle && (
                    <span className={`text-[10px] font-medium truncate ${isSelected ? "text-[#101114]/80" : "text-[#6b7280]"}`}>
                      {option.subtitle}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {option.count !== undefined && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isSelected ? "bg-black/15 text-[#101114]" : "bg-gray-100 text-[#6b7280]"
                    }`}>
                      {option.count}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#101114] stroke-[3]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const DEFAULT_HOME_TYPES: OptionItem[] = [
  { label: "All Types", value: "All Types", subtitle: "All engineered models" },
  { label: "Modular Homes", value: "Modular Homes", subtitle: "Full factory turnkey residences" },
  { label: "Prefab Homes", value: "Prefab Homes", subtitle: "High-performance modular packages" },
  { label: "Barndominiums", value: "Barndominiums", subtitle: "Steel shop homes & open layouts" },
  { label: "House Kits", value: "House Kits", subtitle: "Ready-to-assemble SIP packages" },
  { label: "Tiny Homes", value: "Tiny Homes", subtitle: "Micro living & compact suites" },
  { label: "Park Models", value: "Park Models", subtitle: "Resort-grade RV & park cottages" },
  { label: "Cabins", value: "Cabins", subtitle: "Milled solid log & mountain cabins" },
  { label: "ADUs & Granny Pods", value: "ADUs & Granny Pods", subtitle: "Backyard suites & guest units" },
  { label: "A-Frames", value: "A-Frame Homes", subtitle: "Glass-gable alpine models" },
  { label: "Commercial Buildings", value: "Commercial Buildings", subtitle: "Steel office & retail facilities" },
];

const BUDGET_OPTIONS: OptionItem[] = [
  { label: "Any Budget", value: "Any Budget", subtitle: "All price tiers" },
  { label: "Under $75K", value: "under-75k", subtitle: "Affordable kits & tiny homes" },
  { label: "$75K – $150K", value: "75k-150k", subtitle: "Solid log cabins & single-family" },
  { label: "$150K – $250K", value: "150k-250k", subtitle: "Popular barndos & ranches" },
  { label: "$250K+", value: "250k-plus", subtitle: "Luxury multi-story estates" },
];

const BEDROOM_OPTIONS: OptionItem[] = [
  { label: "Any Beds", value: "any", subtitle: "All layouts" },
  { label: "1 Bed", value: "1", subtitle: "Studio & micro homes" },
  { label: "2 Beds", value: "2", subtitle: "Compact & ADUs" },
  { label: "3 Beds", value: "3", subtitle: "Family-sized residences" },
  { label: "4+ Beds", value: "4", subtitle: "Multi-room estates" },
];

const BATHROOM_OPTIONS: OptionItem[] = [
  { label: "Any Baths", value: "any", subtitle: "All floor plans" },
  { label: "1 Bath", value: "1", subtitle: "Single bathroom" },
  { label: "2 Baths", value: "2", subtitle: "Dual full bathrooms" },
  { label: "3+ Baths", value: "3", subtitle: "Multi-bath & en-suites" },
];

interface HomeSearchBoxProps {
  categories?: (HomeTypeCategoryItem | { name: string; slug?: string; productCount?: number; tagline?: string })[];
  totalModelsCount?: number;
  onFilterChange?: (filters: {
    homeType: string;
    budget: string;
    bedrooms: string;
    bathrooms: string;
    location: string;
  }) => void;
}

export default function HomeSearchBox({
  categories = [],
  totalModelsCount,
  onFilterChange,
}: HomeSearchBoxProps) {
  const router = useRouter();
  const [homeType, setHomeType] = useState("All Types");
  const [budget, setBudget] = useState("Any Budget");
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [location, setLocation] = useState("");

  // Build dynamic home type options with counts when provided
  const homeTypeOptions = useMemo<OptionItem[]>(() => {
    if (!categories || categories.length === 0) {
      return DEFAULT_HOME_TYPES;
    }

    const dynamicItems: OptionItem[] = [
      {
        label: "All Types",
        value: "All Types",
        count: totalModelsCount || undefined,
        subtitle: "Full engineered catalog",
      },
    ];

    categories.forEach((cat) => {
      dynamicItems.push({
        label: cat.name,
        value: cat.name,
        count: cat.productCount && cat.productCount > 0 ? cat.productCount : undefined,
        subtitle: cat.tagline || undefined,
      });
    });

    return dynamicItems;
  }, [categories, totalModelsCount]);

  const hasActiveFilters =
    homeType !== "All Types" ||
    budget !== "Any Budget" ||
    bedrooms !== "any" ||
    bathrooms !== "any" ||
    location.trim() !== "";

  const handleReset = () => {
    setHomeType("All Types");
    setBudget("Any Budget");
    setBedrooms("any");
    setBathrooms("any");
    setLocation("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ homeType, budget, bedrooms, bathrooms, location });
    }

    const params = new URLSearchParams();
    if (homeType !== "All Types") params.set("category", homeType);
    if (budget !== "Any Budget") params.set("budget", budget);
    if (bedrooms !== "any") params.set("beds", bedrooms);
    if (bathrooms !== "any") params.set("baths", bathrooms);
    if (location.trim()) params.set("location", location.trim());

    const query = params.toString();
    router.push(`/buildings${query ? `?${query}` : ""}`);
  };

  const handleQuickFilter = (type: string, val: string) => {
    if (type === "category") setHomeType(val);
    if (type === "budget") setBudget(val);
    if (type === "beds") setBedrooms(val);
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="wrap">
        <div className="card p-4 sm:p-7 shadow-sm border border-[#e7e9ee]">
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#d97706] mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
                <span>Interactive Model Explorer</span>
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-4xl font-black tracking-[-1px] sm:tracking-[-1.3px] text-[#101114] m-0">
                Find Your Perfect Home
              </h2>
              <p className="text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0 font-medium">
                Search hundreds of engineered modular homes, floor plans, and turnkey kits across the country.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-[#d97706] hover:text-[#b45309] hover:underline self-start sm:self-auto flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(5,1fr)_180px] gap-2.5 sm:gap-3 items-stretch"
          >
            {/* 1. Home Type */}
            <CustomDropdown
              label="Home Type"
              icon={<Building2 className="w-3 h-3 text-[#d97706]" />}
              value={homeType}
              options={homeTypeOptions}
              onChange={setHomeType}
            />

            {/* 2. Budget */}
            <CustomDropdown
              label="Budget"
              icon={<DollarSign className="w-3 h-3 text-[#d97706]" />}
              value={budget}
              options={BUDGET_OPTIONS}
              onChange={setBudget}
            />

            {/* 3. Bedrooms */}
            <CustomDropdown
              label="Bedrooms"
              icon={<BedDouble className="w-3 h-3 text-[#d97706]" />}
              value={bedrooms}
              options={BEDROOM_OPTIONS}
              onChange={setBedrooms}
            />

            {/* 4. Bathrooms */}
            <CustomDropdown
              label="Bathrooms"
              icon={<Bath className="w-3 h-3 text-[#d97706]" />}
              value={bathrooms}
              options={BATHROOM_OPTIONS}
              onChange={setBathrooms}
            />

            {/* 5. Location */}
            <div className={`border rounded-[12px] p-3 sm:px-3.5 sm:py-2.5 bg-white flex flex-col justify-center transition-all ${
              location.trim()
                ? "border-[#fcb907] bg-[#fffdfa]"
                : "border-[#dfe2e7] hover:border-[#fcb907]/70 focus-within:border-[#fcb907] focus-within:ring-2 focus-within:ring-[#fcb907]/25"
            }`}>
              <div className="flex items-center justify-between mb-0.5">
                <label className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#6b7280] uppercase tracking-wider">
                  <MapPin className="w-3 h-3 text-[#d97706]" />
                  <span>Location</span>
                </label>
                {location.trim() && (
                  <button
                    type="button"
                    onClick={() => setLocation("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Enter ZIP or State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-[#101114] focus:outline-none placeholder:text-[#9ca3af] placeholder:font-normal"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black w-full h-[52px] sm:h-auto min-h-[50px] text-sm sm:text-base flex items-center justify-center gap-2 rounded-[12px] transition-all shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Search Homes</span>
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Quick Filter Suggestion Pills & Trust Badge */}
          <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5 text-xs text-[#6b7280]">
            <div className="flex flex-wrap items-center gap-1.5 font-bold">
              <span className="text-[11px] text-[#9ca3af] uppercase tracking-wider mr-1">Popular:</span>
              <button
                type="button"
                onClick={() => handleQuickFilter("category", "Modular Homes")}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  homeType === "Modular Homes"
                    ? "bg-[#fcb907] text-[#101114] font-black"
                    : "bg-gray-100 hover:bg-gray-200 text-[#4b5563]"
                }`}
              >
                Modular Homes
              </button>
              <button
                type="button"
                onClick={() => handleQuickFilter("category", "Barndominiums")}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  homeType === "Barndominiums"
                    ? "bg-[#fcb907] text-[#101114] font-black"
                    : "bg-gray-100 hover:bg-gray-200 text-[#4b5563]"
                }`}
              >
                Barndominiums
              </button>
              <button
                type="button"
                onClick={() => handleQuickFilter("category", "Cabins")}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  homeType === "Cabins"
                    ? "bg-[#fcb907] text-[#101114] font-black"
                    : "bg-gray-100 hover:bg-gray-200 text-[#4b5563]"
                }`}
              >
                Cabins
              </button>
              <button
                type="button"
                onClick={() => handleQuickFilter("budget", "under-75k")}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  budget === "under-75k"
                    ? "bg-[#fcb907] text-[#101114] font-black"
                    : "bg-gray-100 hover:bg-gray-200 text-[#4b5563]"
                }`}
              >
                Under $75K
              </button>
              <button
                type="button"
                onClick={() => handleQuickFilter("beds", "3")}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  bedrooms === "3"
                    ? "bg-[#fcb907] text-[#101114] font-black"
                    : "bg-gray-100 hover:bg-gray-200 text-[#4b5563]"
                }`}
              >
                3 Bedrooms
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#4b5563] ml-auto">
              <ShieldCheck className="w-4 h-4 text-[#d97706]" />
              <span>50-State IRC Certified &amp; Turnkey Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
