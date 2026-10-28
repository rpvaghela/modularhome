import React from "react";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ShopByCategory } from "@/components/sections/ShopByCategory";
import { FeaturedModels } from "@/components/sections/FeaturedModels";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Manufacturers } from "@/components/sections/Manufacturers";
import { FinancingSection } from "@/components/sections/FinancingSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";

export default function HomePage() {
  return (
    <>
      {/* 2. Hero */}
      <Hero />

      {/* 3. Trust Strip */}
      <TrustStrip />

      {/* 4. Shop By Category (White background) */}
      <ShopByCategory />

      {/* 5. Featured Models (White/light background) */}
      <FeaturedModels />

      {/* 6. Two Promo Banners */}
      <PromoBanners />

      {/* 7. How It Works (White background) */}
      <HowItWorks />

      {/* 8. Why Choose BombShelters.com (Dark background) */}
      <WhyChooseUs />

      {/* 9. Trusted Manufacturers & Partners */}
      <Manufacturers />

      {/* 10. Flexible Financing & Consultation Form (Dark background) */}
      <FinancingSection />

      {/* 11. Real Customers. Real Peace of Mind. (Dark background) */}
      <Testimonials />

      {/* 12. FAQ (White background) */}
      <FaqSection />
    </>
  );
}
