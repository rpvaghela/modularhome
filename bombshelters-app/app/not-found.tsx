import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#0a0a0a] text-white">
      <div className="w-16 h-16 rounded-full bg-[#e11d1d]/20 border border-[#e11d1d] flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-[#e11d1d]" />
      </div>
      <h1 className="font-display font-black uppercase text-4xl sm:text-5xl text-white tracking-tight mb-3">
        404 - SECTOR NOT FOUND
      </h1>
      <p className="text-sm sm:text-base text-[#a1a1aa] max-w-md mb-8">
        The tactical page or model blueprint you are looking for does not exist or has been relocated to another sector.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] bg-[#e11d1d] hover:bg-[#ff2b2b] text-white font-display font-bold uppercase tracking-wider text-sm transition-colors shadow-redGlow"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Headquarters</span>
      </Link>
    </div>
  );
}
