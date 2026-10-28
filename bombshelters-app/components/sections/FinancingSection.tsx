"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  ChevronDown,
  Bomb,
  Crown,
  Tornado,
  ShieldCheck,
  Building2,
  TreePine,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const consultationFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number (min 10 digits)"),
  interest: z.string().min(1, "Please choose an interest category"),
});

type ConsultationFormData = z.infer<typeof consultationFormSchema>;

const inputBase =
  "w-full bg-white/[0.06] text-white text-[13px] placeholder-white/55 border rounded-[6px] px-3.5 py-3 backdrop-blur-sm focus:outline-none focus:bg-white/[0.1] transition-colors";

const INTEREST_OPTIONS = [
  { value: "Bomb Shelters", label: "Underground Bomb Shelters", Icon: Bomb },
  { value: "Luxury Bunkers", label: "Luxury Bunkers", Icon: Crown },
  { value: "Storm Shelters", label: "Storm Shelters", Icon: Tornado },
  { value: "Safe Rooms", label: "Safe Rooms", Icon: ShieldCheck },
  { value: "Steel Framed Homes", label: "Steel Framed Homes", Icon: Building2 },
  { value: "Cabins", label: "Cabins", Icon: TreePine },
  { value: "Financing", label: "Financing", Icon: CircleDollarSign },
];

// Styled replacement for the native <select>, whose open list can't be themed (blue OS highlight).
// Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter selects, Esc/Tab closes.
function InterestSelect({
  value,
  onChange,
  onBlur,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = INTEREST_OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onBlur]);

  const openList = () => {
    setActiveIndex(Math.max(0, INTEREST_OPTIONS.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(INTEREST_OPTIONS[index].value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % INTEREST_OPTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + INTEREST_OPTIONS.length) % INTEREST_OPTIONS.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(activeIndex);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-label="Select Interest"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={() => !open && onBlur()}
        className={`${inputBase} flex items-center gap-2.5 text-left ${
          hasError
            ? "border-[#e11d1d]"
            : open
              ? "border-[#e11d1d] bg-white/[0.1]"
              : "border-white/15 hover:border-white/25 focus:border-[#e11d1d]"
        }`}
      >
        {selected ? (
          <>
            <selected.Icon className="w-4 h-4 shrink-0 text-[#ff4d4d]" />
            <span className="flex-1 truncate text-white">{selected.label}</span>
          </>
        ) : (
          <span className="flex-1 truncate text-white/55">Select Interest</span>
        )}
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-white" : "text-white/60"}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Interest"
          className="absolute z-30 right-0 min-w-full w-max top-[calc(100%+6px)] p-1.5 rounded-[10px] bg-[#141518]/95 backdrop-blur-xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          {INTEREST_OPTIONS.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(index)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[13px] cursor-pointer select-none transition-colors ${
                  isActive ? "bg-white/[0.08] text-white" : "text-white/80"
                }`}
              >
                <option.Icon
                  className={`w-4 h-4 shrink-0 ${isSelected || isActive ? "text-[#ff4d4d]" : "text-white/45"}`}
                />
                <span className="flex-1 whitespace-nowrap pr-2">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 shrink-0 text-[#ff4d4d]" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function FinancingSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      interest: "",
    },
  });

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit consultation form");
      }

      setSubmitSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checklistItems = ["Competitive Rates", "Multiple Lenders", "Quick Pre-Qualification", "No Obligation"];

  const fieldBorder = (hasError: boolean) =>
    hasError ? "border-[#e11d1d]" : "border-white/15 hover:border-white/25 focus:border-[#e11d1d]";

  return (
    <section id="financing" className="bg-[#ffffff] py-12 lg:py-16">
      <div className="site-container">
        <div className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Family at sunset backdrop */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center brightness-[0.55] saturate-[1.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Financing Benefits */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
              <div>
                <h2 className="font-display font-bold uppercase text-[30px] sm:text-[36px] lg:text-[40px] text-white tracking-tight leading-[1.02]">
                  Flexible Financing <br />
                  <span className="text-[#e11d1d]">Options Available</span>
                </h2>
                <p className="mt-4 text-sm text-[#e2e8f0] leading-relaxed max-w-sm">
                  Turn your protection plans into reality with convenient financing options. Our team can help you
                  explore multiple lenders to find the best solution for your budget.
                </p>
              </div>

              <ul className="space-y-3 sm:pt-2">
                {checklistItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#e11d1d] flex items-center justify-center shrink-0 shadow-redGlow">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </span>
                    <span className="text-sm text-white font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-7">
              <Button asLink href="tel:812-595-4033" size="lg" showArrow className="text-sm shadow-redGlow">
                Learn About Financing
              </Button>
            </div>
          </div>

          {/* Right Column: Get a Free Consultation Card */}
          <div className="lg:col-span-6 xl:col-span-5">
            {/* Glassmorphism card: frosted, translucent panel over the forest photo */}
            <div className="relative p-6 sm:p-8 rounded-[14px] bg-white/[0.07] border border-white/15 backdrop-blur-xl backdrop-saturate-150 shadow-[0_24px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]">
              {/* Soft red glow + top sheen for the glass effect (clipped here so the dropdown can overflow the card) */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]" aria-hidden="true">
                <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-[#e11d1d]/25 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
              <div className="relative">
              <h3 className="font-display font-bold uppercase text-2xl text-white tracking-wide">
                Get a Free Consultation
              </h3>
              <p className="text-[13px] text-white/70 mt-1 mb-5">
                Talk with a shelter specialist about your goals, options and pricing.
              </p>

              {submitSuccess ? (
                <div className="p-6 rounded-[8px] bg-white/[0.06] border border-[#22c55e]/50 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#15803d]/20 text-[#22c55e] flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold uppercase text-lg text-white">
                    Consultation Request Received
                  </h4>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    Thank you! Our team has received your inquiry and will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-display font-bold uppercase tracking-wider text-[#e11d1d] hover:underline pt-2 block mx-auto"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
                  {serverError && (
                    <div className="p-3 rounded-[6px] bg-red-950/40 border border-red-800 text-red-200 text-xs">
                      {serverError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        aria-label="Full Name"
                        {...register("fullName")}
                        className={`${inputBase} ${fieldBorder(!!errors.fullName)}`}
                      />
                      {errors.fullName && (
                        <span className="text-[11px] text-[#ff4d4d] mt-1 block">{errors.fullName.message}</span>
                      )}
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        aria-label="Email Address"
                        {...register("email")}
                        className={`${inputBase} ${fieldBorder(!!errors.email)}`}
                      />
                      {errors.email && (
                        <span className="text-[11px] text-[#ff4d4d] mt-1 block">{errors.email.message}</span>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        aria-label="Phone Number"
                        {...register("phone")}
                        className={`${inputBase} ${fieldBorder(!!errors.phone)}`}
                      />
                      {errors.phone && (
                        <span className="text-[11px] text-[#ff4d4d] mt-1 block">{errors.phone.message}</span>
                      )}
                    </div>

                    <div>
                      <Controller
                        name="interest"
                        control={control}
                        render={({ field }) => (
                          <InterestSelect
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            hasError={!!errors.interest}
                          />
                        )}
                      />
                      {errors.interest && (
                        <span className="text-[11px] text-[#ff4d4d] mt-1 block">{errors.interest.message}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-sm shadow-redGlow disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Request Free Consultation
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
