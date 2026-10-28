import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${title} | BombShelters.com`,
  };
}

export default function DynamicCmsPage({ params }: PageProps) {
  const formattedTitle = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <SubPageHeader
        badge="INFORMATION"
        title={formattedTitle.toUpperCase()}
        description="Official documentation and architectural guidelines from BombShelters.com."
        breadcrumbs={[{ label: formattedTitle }]}
      />

      <section className="bg-[#ffffff] text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl">
          <div className="p-8 sm:p-12 rounded-2xl bg-gray-50 border border-gray-200">
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-[#0a0a0a] mb-4">
              {formattedTitle}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              BombShelters.com designs, manufactures, and installs certified subterranean blast shelters, storm bunkers, and resilient steel cabins across all 50 states. For personalized assistance, contact our direct dispatch line at 812-595-4033.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

