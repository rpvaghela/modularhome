import MIGRATED_ARTICLES from "./migrated_articles.json";

export interface ResourceArticle {
  id: string;
  slug: string;
  handle?: string;
  title: string;
  category: string;
  category_slug?: string;
  readTime: string;
  excerpt: string;
  content: string[];
  body_html?: string;
  image: string;
  date: string;
  author?: string;
  published_at?: string;
  created_at?: string;
  status?: string;
  tags?: string[];
  keyTakeaways?: string[];
  embeddedVideoUrl?: string;
  seoTitle?: string;
  metaDescription?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  old_shopify_url?: string;
  new_nextjs_url?: string;
  // Editorial specs & customization fields
  sqft?: string;
  bedrooms?: string;
  bathrooms?: string;
  stories?: string;
  hasLoft?: boolean | string;
  buildingStyle?: string;
  buildType?: string;
  price?: string;
  startingPrice?: string;
  qualityBadge?: string;
  pullQuote?: string;
  pullQuoteAuthor?: string;
  customFeatures?: Array<{ title: string; desc: string; icon?: string }>;
  heroBackground?: string;
}

export const RESOURCE_CATEGORIES = [
  "All",
  "Modular Cabins",
  "Modular Construction",
  "Modular Homes & Prefab Homes"
] as const;

export const RESOURCE_ARTICLES: ResourceArticle[] = MIGRATED_ARTICLES as unknown as ResourceArticle[];
