import React from "react";
import Image from "next/image";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { FAQS } from "@/data/faqs";
import { getBombShelterFaqs } from "@/lib/faqsStore";

export async function FaqSection() {
  let faqsToDisplay = FAQS;
  try {
    const dynamicFaqs = await getBombShelterFaqs(true);
    if (dynamicFaqs && dynamicFaqs.length > 0) {
      faqsToDisplay = dynamicFaqs;
    }
  } catch (err) {
    console.warn("FaqSection fallback:", err);
  }

  return (
    <section id="faq" className="bg-[#ffffff] text-[#0a0a0a] py-14 lg:py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Heading + Accordion */}
          <div className="lg:col-span-7">
            <h2 className="font-display font-bold uppercase text-[28px] sm:text-[34px] lg:text-[40px] leading-none tracking-tight">
              Frequently Asked <span className="text-[#e11d1d]">Questions</span>
            </h2>
            <p className="mt-2 mb-6 text-sm text-[#4a5568]">
              Find answers to common questions about bomb shelters and safe rooms.
            </p>
            <Accordion items={faqsToDisplay} />
          </div>

          {/* Right Column: CTA card — bunker entrance photo on the left, copy on a dark forest panel on the right */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[380px] rounded-[4px] overflow-hidden grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] bg-[#090c0a] shadow-xl group">
              {/* Banner image: bunker on the left fading into a near-black panel on the right */}
              <div className="relative min-h-[240px] sm:min-h-0 sm:col-span-2 sm:absolute sm:inset-0 overflow-hidden">
                <Image
                  src="/images/cta-banner.jpg"
                  alt="Concrete underground bunker entrance in a forest at sunset"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-left sm:object-[70%_center] group-hover:scale-[1.03] transition-transform duration-700 origin-left"
                />
                <div className="sm:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#090c0a]" />
              </div>

              <div className="hidden sm:block" />

              <div className="relative flex flex-col justify-center px-6 py-8 sm:pl-3 sm:pr-7">
                <div className="relative z-10">
                  <h3 className="font-display font-bold uppercase text-[28px] xl:text-[34px] text-white leading-[0.95] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    Prepare Today.
                    <br />
                    <span className="text-[#ff1f1f]">Protect Tomorrow.</span>
                  </h3>
                  <p className="mt-3 text-[13px] xl:text-sm text-white leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    Explore the best bomb shelters, storm shelters and safe rooms from trusted manufacturers.
                  </p>
                  <Button asLink href="/quote" size="md" showArrow className="mt-5 w-full xl:w-auto whitespace-nowrap px-3 xl:px-5 text-xs xl:text-sm shadow-redGlow">
                    Start Your Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
