import React from "react";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ShopByCategory } from "@/components/sections/ShopByCategory";
import { FeaturedModels } from "@/components/sections/FeaturedModels";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FinancingSection } from "@/components/sections/FinancingSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#ffffff] text-[#0a0a0a]">
      {/* 2. Hero */}
      <Hero />

      {/* 3. Trust Strip (Pure White background) */}
      <TrustStrip />

      {/* 4. Shop By Category (Pure White background) */}
      <ShopByCategory />

      {/* 5. Featured Models (Pure White background) */}
      <FeaturedModels />

      {/* 6. Two Promo Banners (Pure White background) */}
      <PromoBanners />

      {/* 7. How It Works (Pure White background) */}
      <HowItWorks />

      {/* 8. Why Choose BombShelters.com (Pure White background) */}
      <WhyChooseUs />

      {/* 9. Flexible Financing & Consultation Form (Pure White background) */}
      <FinancingSection />

      {/* 11. Real Customers. Real Peace of Mind. (Pure White background) */}
      <Testimonials />

      {/* 12. FAQ (Pure White background) */}
      <FaqSection />
    </div>
  );
}
