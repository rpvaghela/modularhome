import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { RESOURCES } from "@/data/resources";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const res = RESOURCES.find((r) => r.slug === params.slug);
  if (!res) return { title: "Resource Not Found | BombShelters.com" };

  return {
    title: `${res.title} | Technical Documentation`,
    description: res.description,
  };
}

export default function ResourceDetailPage({ params }: PageProps) {
  const res = RESOURCES.find((r) => r.slug === params.slug);
  if (!res) {
    notFound();
  }

  return (
    <>
      <SubPageHeader
        badge={res.category.toUpperCase()}
        title={res.title.toUpperCase()}
        description={res.description}
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: res.title },
        ]}
      />

      <section className="bg-paper text-[#0a0a0a] py-16">
        <div className="site-container max-w-4xl">
          <div className="p-8 sm:p-12 rounded-2xl bg-gray-50 border border-gray-200 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e11d1d]">
              <FileText className="w-4 h-4" />
              <span>{res.fileType} • {res.fileSize}</span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#0a0a0a]">
              Document Overview &amp; Abstract
            </h2>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {res.description} This publication has been released by the BombShelters.com Technical Advisory Board for certified contractors, site excavation crews, and private homeowners seeking compliance with international structural defense codes.
            </p>

            <div className="p-6 rounded-xl bg-white border border-gray-200 space-y-3">
              <h4 className="font-display font-bold text-sm uppercase text-[#0a0a0a]">
                Document Contents Include:
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e11d1d]" />
                  <span>Certified formulas for structural overpressure load calculation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e11d1d]" />
                  <span>Soil bearing tables and water table ballast calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e11d1d]" />
                  <span>Permitting checklists and county inspection preparation steps</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button asLink href="/contact" size="md">
                <Download className="w-4 h-4 mr-2" />
                <span>Request Certified PDF Copy</span>
              </Button>
              <Button asLink href="/resources" variant="outline" size="md">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Back to Resources</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
