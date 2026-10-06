import MIGRATED_ARTICLES from "./migrated_articles.json";

export interface ResourceArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string[];
  image: string;
  date: string;
  author?: string;
  published_at?: string;
  status?: string;
  tags?: string[];
  keyTakeaways?: string[];
  embeddedVideoUrl?: string;
  seoTitle?: string;
  metaDescription?: string;
}

export const RESOURCE_CATEGORIES = [
  "All",
  "Modular Basics",
  "Comparison",
  "Pricing & Budget",
  "Timeline & Process",
  "Design & Customization",
  "Home Styles",
  "Financing",
  "Floor Plans",
  "Land Preparation",
  "Delivery & Setup",
  "Building Guides",
  "Modular Cabins",
  "Modular Homes",
] as const;

export const RESOURCE_ARTICLES: ResourceArticle[] = MIGRATED_ARTICLES as ResourceArticle[];
