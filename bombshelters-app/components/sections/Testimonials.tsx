import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";
import { getBombShelterReviews } from "@/lib/reviewsStore";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function Testimonials() {
  let reviewsToDisplay = TESTIMONIALS;
  try {
    const dynamicReviews = await getBombShelterReviews(true);
    if (dynamicReviews && dynamicReviews.length > 0) {
      reviewsToDisplay = dynamicReviews.map((r) => ({
        id: r.id,
        name: r.customer_name,
        roleOrContext: r.project_title || "Homeowner",
        location: r.location || "USA",
        quote: r.review_text,
        rating: r.rating || 5,
        avatarUrl: r.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      }));
    }
  } catch (err) {
    console.warn("Testimonials fallback:", err);
  }

  return (
    <section id="testimonials" className="bg-[#ffffff] text-[#0a0a0a] py-10 sm:py-14 lg:py-16 border-b border-[#e2e8f0] overflow-hidden w-full">
      <div className="site-container">
        <SectionHeading
          title="Real Customers."
          highlight="Real Peace of Mind."
          subtitle="Families, homeowners and businesses across America trust BombShelters.com."
          linkLabel="View All Reviews"
          linkHref="#testimonials"
        />

        <div className="relative">
          {/* Soft blobs behind the cards so the frosted glass has something to blur */}
          <div className="pointer-events-none absolute -top-10 left-[8%] w-72 h-40 rounded-full bg-[#e11d1d]/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-10 right-[12%] w-80 h-40 rounded-full bg-[#64748b]/15 blur-3xl" aria-hidden="true" />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviewsToDisplay.map((item) => (
            <div
              key={item.id}
              // Glassmorphism card (same treatment as How It Works)
              className="flex gap-4 p-5 rounded-[14px] bg-white/55 backdrop-blur-xl backdrop-saturate-150 border border-white/80 ring-1 ring-black/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_rgba(10,10,10,0.06)] hover:bg-white/70 hover:ring-[#e11d1d]/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_36px_rgba(10,10,10,0.1)] transition-all"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-md">
                <Image src={item.avatarUrl} alt={item.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-[13px] text-[#1e293b] leading-relaxed italic line-clamp-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-3 text-[12px] text-[#64748b]">
                  <span className="font-display font-bold text-[#0a0a0a] text-sm mr-2">{item.name}</span>
                  {item.roleOrContext}, {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
