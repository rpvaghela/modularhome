"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const consultationFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number (min 10 digits)"),
  interest: z.string().min(1, "Please choose an interest category"),
});

type ConsultationFormData = z.infer<typeof consultationFormSchema>;

const inputBase =
  "w-full bg-[#1c1f23] text-white text-[13px] placeholder-[#8b8f97] border rounded-[3px] px-3.5 py-3 focus:outline-none transition-colors";

export function FinancingSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
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
    hasError ? "border-[#e11d1d]" : "border-[#33373d] focus:border-[#e11d1d]";

  return (
    <section id="financing" className="relative bg-[#0a0a0a] py-14 lg:py-20 overflow-hidden">
      {/* Family at sunset backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.55] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 site-container">
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
            <div className="p-6 sm:p-7 rounded-[4px] bg-[#111214]/95 border border-[#2a2d31] shadow-2xl backdrop-blur">
              <h3 className="font-display font-bold uppercase text-2xl text-white tracking-wide">
                Get a Free Consultation
              </h3>
              <p className="text-[13px] text-[#a1a1aa] mt-1 mb-5">
                Talk with a shelter specialist about your goals, options and pricing.
              </p>

              {submitSuccess ? (
                <div className="p-6 rounded-[4px] bg-[#16181b] border border-[#15803d] text-center space-y-3">
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
                    <div className="p-3 rounded-[3px] bg-red-950/40 border border-red-800 text-red-200 text-xs">
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
                      <select
                        aria-label="Select Interest"
                        {...register("interest")}
                        className={`${inputBase} ${fieldBorder(!!errors.interest)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23a1a1aa' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center]`}
                      >
                        <option value="" disabled>
                          Select Interest
                        </option>
                        <option value="Bomb Shelters">Underground Bomb Shelters</option>
                        <option value="Luxury Bunkers">Luxury Bunkers</option>
                        <option value="Storm Shelters">Storm Shelters</option>
                        <option value="Safe Rooms">Safe Rooms</option>
                        <option value="Steel Framed Homes">Steel Framed Homes</option>
                        <option value="Cabins">Cabins</option>
                        <option value="Financing">Financing</option>
                      </select>
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
    </section>
  );
}
