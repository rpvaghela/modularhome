"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Search, MapPin } from "lucide-react";

interface OptionItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: OptionItem[];
  onChange: (val: string) => void;
}

function CustomDropdown({ label, value, options, onChange }: CustomDropdownProps) {
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

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`w-full border rounded-[11px] p-3 sm:px-3.5 sm:py-2.5 bg-white flex flex-col justify-center text-left transition-all duration-150 cursor-pointer select-none ${
          open
            ? "border-[#fcb907] ring-2 ring-[#fcb907]/25 shadow-xs"
            : "border-[#dfe2e7] hover:border-[#fcb907]/70"
        }`}
      >
        <span className="block text-[11px] font-bold text-[#6b7280] mb-0.5 uppercase tracking-wider pointer-events-none">
          {label}
        </span>
        <div className="flex items-center justify-between font-extrabold text-sm text-[#101114]">
          <span className="truncate pr-2">{selectedOption?.label || value}</span>
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
          className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#fcb907]/40 rounded-xl shadow-2xl z-[999] py-1.5 max-h-64 overflow-y-auto ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
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
                className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#fcb907] text-[#101114] font-black shadow-2xs"
                    : "text-[#1e293b] hover:bg-[#fef8ee] hover:text-[#b45309]"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#101114] stroke-[3] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const HOME_TYPE_OPTIONS: OptionItem[] = [
  { label: "All Types", value: "All Types" },
  { label: "Modular Homes", value: "Modular Homes" },
  { label: "Prefab Homes", value: "Prefab Homes" },
  { label: "Barndominiums", value: "Barndominiums" },
  { label: "House Kits", value: "House Kits" },
  { label: "Tiny Homes", value: "Tiny Homes" },
  { label: "Park Models", value: "Park Models" },
  { label: "Cabins", value: "Cabins" },
  { label: "ADUs & Granny Pods", value: "ADUs & Granny Pods" },
  { label: "A-Frames", value: "A-Frame Homes" },
  { label: "Commercial Buildings", value: "Commercial Buildings" },
];

const BUDGET_OPTIONS: OptionItem[] = [
  { label: "Any Budget", value: "Any Budget" },
  { label: "Under $75K", value: "under-75k" },
  { label: "$75K – $150K", value: "75k-150k" },
  { label: "$150K – $250K", value: "150k-250k" },
  { label: "$250K+", value: "250k-plus" },
];

const BEDROOM_OPTIONS: OptionItem[] = [
  { label: "Any Beds", value: "Any" },
  { label: "1 Bed", value: "1" },
  { label: "2 Beds", value: "2" },
  { label: "3 Beds", value: "3" },
  { label: "4+ Beds", value: "4" },
];

const BATHROOM_OPTIONS: OptionItem[] = [
  { label: "Any Baths", value: "Any" },
  { label: "1 Bath", value: "1" },
  { label: "2 Baths", value: "2" },
  { label: "3+ Baths", value: "3" },
];

interface HomeSearchBoxProps {
  onFilterChange?: (filters: {
    homeType: string;
    budget: string;
    bedrooms: string;
    bathrooms: string;
    location: string;
  }) => void;
}

export default function HomeSearchBox({ onFilterChange }: HomeSearchBoxProps) {
  const router = useRouter();
  const [homeType, setHomeType] = useState("All Types");
  const [budget, setBudget] = useState("Any Budget");
  const [bedrooms, setBedrooms] = useState("Any");
  const [bathrooms, setBathrooms] = useState("Any");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ homeType, budget, bedrooms, bathrooms, location });
    }

    const params = new URLSearchParams();
    if (homeType !== "All Types") params.set("category", homeType);
    if (budget !== "Any Budget") params.set("budget", budget);
    if (bedrooms !== "Any") params.set("beds", bedrooms);
    if (bathrooms !== "Any") params.set("baths", bathrooms);
    if (location.trim()) params.set("location", location.trim());

    const query = params.toString();
    router.push(`/buildings${query ? `?${query}` : ""}`);
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="wrap">
        <div className="card p-4 sm:p-7">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl xs:text-2xl sm:text-4xl font-black tracking-[-1px] sm:tracking-[-1.3px] text-[#101114] m-0">
              Find Your Perfect Home
            </h2>
            <p className="text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0 font-medium">
              Search hundreds of modular homes across the country.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(5,1fr)_180px] gap-2.5 sm:gap-3 items-stretch"
          >
            {/* 1. Home Type Custom Yellow Dropdown */}
            <CustomDropdown
              label="Home Type"
              value={homeType}
              options={HOME_TYPE_OPTIONS}
              onChange={setHomeType}
            />

            {/* 2. Budget Custom Yellow Dropdown */}
            <CustomDropdown
              label="Budget"
              value={budget}
              options={BUDGET_OPTIONS}
              onChange={setBudget}
            />

            {/* 3. Bedrooms Custom Yellow Dropdown */}
            <CustomDropdown
              label="Bedrooms"
              value={bedrooms}
              options={BEDROOM_OPTIONS}
              onChange={setBedrooms}
            />

            {/* 4. Bathrooms Custom Yellow Dropdown */}
            <CustomDropdown
              label="Bathrooms"
              value={bathrooms}
              options={BATHROOM_OPTIONS}
              onChange={setBathrooms}
            />

            {/* 5. Location */}
            <div className="border border-[#dfe2e7] hover:border-[#fcb907]/70 focus-within:border-[#fcb907] focus-within:ring-2 focus-within:ring-[#fcb907]/25 rounded-[11px] p-3 sm:px-3.5 sm:py-2.5 bg-white flex flex-col justify-center transition-all">
              <label className="block text-[11px] font-bold text-[#6b7280] mb-0.5 uppercase tracking-wider">
                Location
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Enter ZIP or State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-[#101114] focus:outline-none placeholder:text-[#9ca3af] placeholder:font-normal"
                />
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-black w-full h-[52px] sm:h-auto min-h-[50px] text-sm sm:text-base flex items-center justify-center gap-2 rounded-[11px] transition-all shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Search Homes</span>
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
