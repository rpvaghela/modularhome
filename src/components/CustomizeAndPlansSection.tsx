import Link from "next/link";
import Image from "next/image";

export default function CustomizeAndPlansSection() {
  const plans = [
    {
      title: "3 Bed 2 Bath",
      sqft: "1,586 Sq Ft",
      href: "/upload-floor-plan",
    },
    {
      title: "4 Bed 2 Bath",
      sqft: "2,012 Sq Ft",
      href: "/upload-floor-plan",
    },
    {
      title: "2 Bed 2 Bath",
      sqft: "1,200 Sq Ft",
      href: "/upload-floor-plan",
    },
  ];

  return (
    <section className="py-8 sm:py-14 bg-white">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Left: Customization Feature Card */}
          <div className="card overflow-hidden grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr] bg-white">
            <div className="relative min-h-[190px] xs:min-h-[220px] sm:min-h-full w-full bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
                alt="Modern Modular Home Interior"
                fill
                sizes="(max-width: 640px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-7 flex flex-col justify-between">
              <div>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-[-1px] text-[#101114] mb-1.5 sm:mb-2 leading-tight">
                  Customize Your Dream Home
                </h2>
                <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed mb-3.5 sm:mb-4">
                  Choose your layout, finishes and features. Our team helps create a home that fits your lifestyle and budget.
                </p>
                <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-[#3f4650] font-semibold mb-5 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span>Multiple floor plans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span>Premium finishes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span>Energy-efficient options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span>Expert support</span>
                  </div>
                </div>
              </div>

              <Link
                href="#quote"
                className="btn-primary w-full py-3 text-xs sm:text-sm font-extrabold rounded-[11px] text-center justify-center shadow-sm"
              >
                Start Customizing →
              </Link>
            </div>
          </div>

          {/* Right: Floor Plans & House Plans */}
          <div className="flex flex-col justify-between mt-2 sm:mt-0">
            <div className="mb-3 sm:mb-5">
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-[-1px] text-[#101114] m-0">
                Floor Plans & House Plans
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280] mt-0.5 sm:mt-1 mb-0">
                Explore our collection of home floor plans.
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-3.5 flex-1">
              {plans.map((p, i) => (
                <div
                  key={i}
                  className="card p-3 sm:p-4 text-center flex flex-col justify-between bg-white hover:-translate-y-1 transition-all"
                >
                  <div>
                    {/* Architectural Blueprint Drawing Grid Placeholder */}
                    <div className="drawing-bg h-[115px] sm:h-[120px] rounded-[10px] border border-[#dddddd] mb-3 relative overflow-hidden flex items-center justify-center">
                      <div className="w-[70%] h-[60%] border-2 border-[#b0b5be] border-dashed rounded flex items-center justify-center">
                        <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest opacity-70">
                          BLUEPRINT
                        </span>
                      </div>
                    </div>
                    <h3 className="block text-sm sm:text-[15px] font-black text-[#101114] m-0">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#6b7280] mt-0.5 mb-3 font-medium">
                      {p.sqft}
                    </p>
                  </div>

                  <Link
                    href={p.href}
                    className="btn-outline w-full py-2 px-3 text-xs font-extrabold rounded-[9px] text-center justify-center"
                  >
                    View Plan →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
