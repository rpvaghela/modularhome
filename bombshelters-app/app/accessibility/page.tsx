import React from "react";
import { Metadata } from "next";
import { SubPageHeader } from "@/components/ui/SubPageHeader";

export const metadata: Metadata = {
  title: "Accessibility Statement | BombShelters.com",
  description: "Our ongoing commitment to digital accessibility, ADA conformance, and inclusive web standards for all users.",
};

export default function AccessibilityPage() {
  return (
    <>
      <SubPageHeader
        badge="DIGITAL INCLUSION"
        title="ACCESSIBILITY"
        highlight="STATEMENT"
        description="BombShelters.com is committed to digital accessibility and ensuring our website is usable for all individuals, including people with disabilities."
        breadcrumbs={[{ label: "Accessibility" }]}
      />

      <section className="bg-paper text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl prose prose-sm sm:prose-base text-gray-700 space-y-6">
          <p className="text-xs text-gray-400">Effective Date: October 2026</p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">1. Conformance Standards</h3>
          <p>
            We strive to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines outline how to make digital content more accessible for people with visual, auditory, cognitive, and motor disabilities.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">2. Measures Taken</h3>
          <p>
            To achieve this standard across our application, we implement:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>High-contrast color palettes for typography and interactive buttons.</li>
            <li>Semantic HTML landmarks (`header`, `nav`, `main`, `footer`, `article`).</li>
            <li>Keyboard focus indicators and logical tab sequencing across all forms and menus.</li>
            <li>Alternative text descriptions (`alt` attributes) for diagrams, images, and model photos.</li>
            <li>Accessible ARIA labels for buttons, collapsible accordions, and mobile navigation toggles.</li>
          </ul>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">3. Ongoing Improvement</h3>
          <p>
            We continually test and update our web platform to identify and remediate potential accessibility barriers as modern web standards evolve.
          </p>

          <h3 className="font-display font-bold text-xl uppercase text-[#0a0a0a]">4. Feedback &amp; Assistance</h3>
          <p>
            If you encounter any difficulty accessing any part of this website, or if you need assistance submitting an inquiry or reviewing a floor plan, please contact our support desk:
          </p>
          <p>
            Email: <strong>accessibility@bombshelters.com</strong><br />
            Phone: <strong>812-595-4033</strong>
          </p>
        </div>
      </section>
    </>
  );
}

