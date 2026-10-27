"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const consultationFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number (min 10 digits)"),
  interest: z.string().min(1, "Please choose an interest category"),
});

type ConsultationFormData = z.infer<typeof consultationFormSchema>;

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
      interest: "Bomb Shelters",
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

  const checklistItems = [
    "Competitive Fixed-Rate Lending Partnerships",
    "Multiple Specialized Preparedness & Land Lenders",
    "Quick Pre-Qualification with Soft Credit Inquiry",
    "100% Zero-Obligation Custom Build Estimation",
  ];

  return (
    <section id="financing" className="relative bg-[#0a0a0a] py-20 lg:py-28 overflow-hidden border-b border-[#2a2d31]">
      {/* Forest/Family Subdued Background with Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80"
          alt="Peace of mind in nature"
          fill
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.25] contrast-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Financing Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-[#e11d1d]/20 border border-[#e11d1d]/40 text-[#e11d1d] text-xs font-display font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NATIONWIDE FINANCING ASSISTANCE</span>
            </div>

            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              FLEXIBLE FINANCING <br className="hidden sm:inline" />
              <span className="text-[#e11d1d]">OPTIONS AVAILABLE</span>
            </h2>

            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed max-w-xl">
              Protecting your loved ones should never be delayed by upfront capital barriers. We partner with specialized nationwide lenders experienced in manufactured structures, underground shelters, and rural acreage builds.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5 pt-2">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#e11d1d] flex items-center justify-center shrink-0 mt-0.5 shadow-redGlow">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-white font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                asLink
                href="tel:812-595-4033"
                variant="outline"
                size="md"
                showArrow
                className="text-xs sm:text-sm"
              >
                LEARN ABOUT FINANCING
              </Button>
            </div>
          </div>

          {/* Right Column: Get a Free Consultation Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-[6px] bg-[#111214] border border-[#2a2d31] shadow-2xl relative">
              <div className="mb-6">
                <span className="text-[11px] font-display font-black uppercase tracking-widest text-[#e11d1d] block">
                  PRIORITY SCHEDULING
                </span>
                <h3 className="font-display font-extrabold uppercase text-2xl text-white tracking-wide mt-1">
                  GET A FREE CONSULTATION
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1">
                  Connect with a certified defense engineer. Strictly confidential.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-[4px] bg-[#16181b] border border-[#15803d] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#15803d]/20 text-[#22c55e] flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold uppercase text-lg text-white">
                    CONSULTATION REQUEST RECEIVED
                  </h4>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    Thank you! Our structural defense team has received your inquiry and will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-display font-bold uppercase tracking-wider text-[#e11d1d] hover:underline pt-2 block mx-auto"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {serverError && (
                    <div className="p-3 rounded-[3px] bg-red-950/40 border border-red-800 text-red-200 text-xs">
                      {serverError}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#cbd5e1] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Miller"
                      {...register("fullName")}
                      className={`w-full bg-[#181a1d] text-white text-xs border rounded-[4px] px-3.5 py-2.5 focus:outline-none transition-colors ${
                        errors.fullName ? "border-[#e11d1d]" : "border-[#2a2d31] focus:border-[#e11d1d]"
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-[#e11d1d] mt-1 block">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#cbd5e1] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      {...register("email")}
                      className={`w-full bg-[#181a1d] text-white text-xs border rounded-[4px] px-3.5 py-2.5 focus:outline-none transition-colors ${
                        errors.email ? "border-[#e11d1d]" : "border-[#2a2d31] focus:border-[#e11d1d]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-[#e11d1d] mt-1 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#cbd5e1] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. (812) 595-4033"
                      {...register("phone")}
                      className={`w-full bg-[#181a1d] text-white text-xs border rounded-[4px] px-3.5 py-2.5 focus:outline-none transition-colors ${
                        errors.phone ? "border-[#e11d1d]" : "border-[#2a2d31] focus:border-[#e11d1d]"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-[#e11d1d] mt-1 block">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>

                  {/* Select Interest Dropdown */}
                  <div>
                    <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#cbd5e1] mb-1">
                      Select Primary Interest *
                    </label>
                    <select
                      {...register("interest")}
                      className="w-full bg-[#181a1d] text-white text-xs border border-[#2a2d31] rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#e11d1d]"
                    >
                      <option value="Bomb Shelters">Underground Bomb Shelters</option>
                      <option value="Luxury Bunkers">Luxury Subterranean Bunkers</option>
                      <option value="Storm Shelters">FEMA Severe Storm Shelters</option>
                      <option value="Safe Rooms">Ballistic Safe Rooms</option>
                      <option value="Steel Framed Homes">Steel Framed Architectural Homes</option>
                      <option value="Cabins">Off-Grid Modular Cabins</option>
                      <option value="Financing">Financing & Lending Pre-Qualification</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      showArrow={!isSubmitting}
                      className="w-full py-3.5 text-xs sm:text-sm shadow-redGlow"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>SECURING YOUR INQUIRY...</span>
                        </span>
                      ) : (
                        "REQUEST FREE CONSULTATION"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
