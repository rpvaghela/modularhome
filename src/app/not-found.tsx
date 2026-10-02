import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-32 text-center">
      <div className="max-w-lg mx-auto space-y-6 flex flex-col items-center">
        <Link href="/" className="inline-block transition-transform hover:scale-105 mb-2">
          <Image
            src="/newmodularlogo.png"
            alt="ModularHome.com"
            width={200}
            height={46}
            className="h-8 sm:h-9 w-auto object-contain mx-auto"
          />
        </Link>

        <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 text-[#d97706] shadow-sm flex items-center justify-center mx-auto">
          <Building2 className="w-10 h-10" />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#d97706] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-pulse" />
            404 Error • Structure Not Found
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[var(--ink)] mt-2 font-display">
            Off The Blueprint
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
            The architectural model, floor plan, or page you are looking for does not exist or has been relocated to another building series.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-[14px] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/buildings"
            className="w-full sm:w-auto px-6 py-3.5 bg-[var(--soft)] hover:bg-[#0f1218] hover:text-white text-[var(--ink)] border border-[var(--line)] text-xs font-bold uppercase tracking-wider rounded-[14px] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Explore Floor Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
