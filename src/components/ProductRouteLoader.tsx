interface ProductRouteLoaderProps {
  title: string;
  kind: "catalog" | "detail";
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#e2e6eb] motion-reduce:animate-none ${className}`} />;
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-2/5" />
            <div className="flex items-center justify-between border-t border-[#edf0f2] pt-3">
              <Skeleton className="h-4 w-20 bg-[#fbe8a7]" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      <div>
        <Skeleton className="aspect-[4/3] rounded-xl" />
        <div className="mt-4 grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3]" />
          ))}
        </div>
      </div>
      <div className="space-y-6 py-1">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28 bg-[#fbe8a7]" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-36 bg-[#fbe8a7]" />
        <div className="grid grid-cols-2 gap-3 border-y border-[#e5e7eb] py-5 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2 py-1">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-lg bg-[#fbe8a7]" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function ProductRouteLoader({ title, kind }: ProductRouteLoaderProps) {
  return (
    <main className="min-h-[75vh] bg-[#f6f7f9] font-sans" aria-busy="true" aria-live="polite">
      <div className="wrap py-10 sm:py-14">
        <div className="mb-8 border-b border-[#e1e5e9] pb-5">
          <p className="mb-2 text-xs font-semibold text-[#6b7280]">{title}</p>
          <h1 className="m-0 text-2xl font-bold tracking-tight text-[#17191d] sm:text-3xl">
            {kind === "catalog" ? "Explore our collection" : "Product details"}
          </h1>
          <p className="mb-0 mt-2 text-sm text-[#6b7280]">Loading product information…</p>
        </div>
        {kind === "catalog" ? <CatalogSkeleton /> : <DetailSkeleton />}
      </div>
    </main>
  );
}
