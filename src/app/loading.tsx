import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0b0f17] select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#fcb907]/12 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Brand Logo with Glow */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#fcb907]/20 rounded-2xl blur-xl animate-pulse" />
          <Image
            src="/newmodularlogo.png"
            alt="ModularHome.com"
            width={240}
            height={55}
            priority
            className="relative h-11 sm:h-13 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Minimalist Architectural Loader Icon */}
        <div className="relative w-12 h-12 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[#fcb907] animate-spin" />
          <div className="w-5 h-5 rounded-md bg-[#fcb907]/20 border border-[#fcb907]/50 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-xs bg-[#fcb907]" />
          </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-200 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-ping" />
          <span>Loading 2026 Home Models & Blueprint Kits</span>
        </div>

        {/* Shimmering Indeterminate Progress Bar */}
        <div className="w-56 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/10 shadow-inner relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fcb907] to-transparent w-full -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        <div className="flex items-center justify-between w-56 sm:w-64 mt-2 text-[11px] text-gray-400 font-medium">
          <span>Factory Direct Built</span>
          <span className="font-mono text-amber-300 font-bold">Please wait...</span>
        </div>
      </div>
    </div>
  );
}

