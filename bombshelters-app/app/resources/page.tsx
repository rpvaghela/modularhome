import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Download,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Button } from "@/components/ui/Button";
import { RESOURCES } from "@/data/resources";

export const metadata: Metadata = {
  title: "Engineering Resources & Buyer Guides | BombShelters.com",
  description:
    "Download technical guides, subterranean soil evaluation checklists, Swiss NBC maintenance manuals, and FEMA storm shelter standards.",
};

export default function ResourcesPage() {
  return (
    <>
      <SubPageHeader
        badge="TECHNICAL LIBRARY"
        title="RESOURCES, MANUALS &"
        highlight="BUYER GUIDES"
        description="Comprehensive engineering documentation, soil assessment manuals, and certified blast testing literature."
        breadcrumbs={[{ label: "Resources" }]}
      />

      <section className="bg-paper text-[#0a0a0a] py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#0a0a0a]">
              Download Technical Documentation
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Access certified architectural whitepapers and shelter maintenance manuals written by our structural engineering board.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {RESOURCES.map((res) => (
              <div
                key={res.slug}
                className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-[#e11d1d] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#e11d1d] bg-[#e11d1d]/10 px-2 py-0.5 rounded">
                      {res.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {res.fileType} ({res.fileSize})
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#0a0a0a] mb-2">
                    {res.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/resources/${res.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-[#e11d1d] hover:underline"
                  >
                    <span>View Technical Abstract</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button asLink href="/contact" size="sm" variant="outline">
                    <Download className="w-3.5 h-3.5 mr-1" />
                    <span>Request PDF</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
