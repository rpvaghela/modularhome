import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  title: string;
  tagline: string;
  image: string;
  count?: number;
  href?: string;
  cta?: string;
}

export default function CategoryCard({ id, title, tagline, image, href, cta }: CategoryCardProps) {
  const targetHref = href || `/${id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
  const ctaText = cta || `View ${title}`;

  return (
    <div className="group relative bg-white border border-[var(--line)] rounded-[18px] overflow-hidden flex flex-row sm:flex-col transition-all duration-300 hover:shadow-lg hover:border-[var(--r)] hover:-translate-y-0.5">
      {/* Image Container */}
      <div className="relative w-28 xs:w-36 sm:w-full aspect-[4/3] shrink-0 overflow-hidden bg-[var(--soft)]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 35vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-left space-y-2 sm:space-y-3 bg-white">
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--r)] transition-colors font-display">
            {title}
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5 sm:mt-1 line-clamp-2 leading-snug sm:leading-relaxed font-body">
            {tagline}
          </p>
        </div>

        {/* Red CTA Text Link */}
        <div className="pt-1">
          <Link
            href={targetHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--r)] hover:text-[var(--r-dark)] transition-colors"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
