import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { ResourceArticle } from "@/data/resources";

interface HomeArticlesSectionProps {
  articles?: ResourceArticle[];
}

export default function HomeArticlesSection({ articles = [] }: HomeArticlesSectionProps) {
  const displayArticles = articles.slice(0, 4);

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-16 bg-[#f6f7f9] font-sans">
      <div className="wrap">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8 font-sans">
          <div>
            <div className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#d97706] mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fcb907]"></span>
              <span>Educational Knowledge Base</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-4xl font-black tracking-[-1.2px] text-[#101114] m-0">
              Latest News &amp; Resources
            </h2>
            <p className="font-sans text-xs sm:text-base text-[#6b7280] mt-1 sm:mt-1.5 mb-0 font-medium">
              Expert guides, pricing breakdowns, and architectural tips for your modular home project.
            </p>
          </div>
          <Link
            href="/resources"
            className="font-sans text-[#d97706] hover:text-[#b45309] font-black text-xs sm:text-base hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5 group"
          >
            <span>View All Articles ({articles.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Featured Article Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
          {displayArticles.map((art) => (
            <Link
              key={art.id || art.slug}
              href={`/resources/${art.slug}`}
              className="group rounded-2xl bg-white border border-gray-200/90 hover:border-[#fcb907] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 flex flex-col justify-between block"
            >
              <div>
                <div className="relative h-[180px] sm:h-[190px] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={art.image || "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"}
                    alt={art.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  {art.category && (
                    <div className="absolute top-3 left-3 bg-[#fcb907] text-[#101114] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {art.category}
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 space-y-2 font-sans">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#6b7280]">
                    <Clock className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>{art.readTime || "5 min read"}</span>
                  </div>
                  <h3 className="font-sans text-base sm:text-[17px] font-black text-[#101114] group-hover:text-[#b45309] transition-colors leading-snug line-clamp-2 min-h-[44px] sm:min-h-[50px] m-0">
                    {art.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 sm:p-5 pt-0 font-sans">
                <span className="text-xs sm:text-[13px] font-black text-[#d97706] group-hover:text-[#b45309] inline-flex items-center gap-1.5 transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

