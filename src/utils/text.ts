/**
 * Text and HTML processing utilities for ModularHome.com
 */

/**
 * Strips all HTML tags and decodes common entities to produce clean plain text.
 */
export function stripHtml(input?: string | null): string {
  if (!input) return "";
  
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if a string contains HTML tags
 */
export function isHtml(input?: string | null): boolean {
  if (!input) return false;
  return /<[a-z][\s\S]*>/i.test(input);
}

/**
 * Truncates text to a max character length with an ellipsis
 */
export function truncateText(text: string, maxLength: number = 160): string {
  const clean = stripHtml(text);
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + "...";
}

/**
 * Formats shouty or raw YouTube/Shopify article titles into clean, professional title case
 */
export function formatEditorialTitle(rawTitle?: string | null): string {
  if (!rawTitle) return "Modular Home Architectural Guide";
  
  let clean = rawTitle
    .replace(/\?{2,}/g, "?")
    .replace(/!{2,}/g, "!")
    .replace(/\?!/g, "?")
    .replace(/!\?/g, "?")
    .trim();

  // If title is largely all-caps (e.g., > 60% uppercase characters)
  const lettersOnly = clean.replace(/[^a-zA-Z]/g, "");
  const uppercaseLetters = clean.replace(/[^A-Z]/g, "");
  const isMostlyCaps = lettersOnly.length > 0 && uppercaseLetters.length / lettersOnly.length > 0.55;

  if (isMostlyCaps) {
    const acronyms = new Set([
      "SQ", "FT", "SQFT", "ADU", "ADUS", "SIP", "SIPS", "IRC", "IBC", "HUD",
      "HVAC", "USA", "3D", "CAD", "DWG", "USD", "DOT", "BOL", "MEP", "RV", "RVS"
    ]);
    const lowerWords = new Set([
      "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from",
      "by", "over", "in", "of", "with", "as", "into", "plus"
    ]);

    const words = clean.split(/(\s+|[-|/])/);
    const converted = words.map((word, idx) => {
      const upperWord = word.toUpperCase();
      if (acronyms.has(upperWord)) return upperWord;
      
      // Keep price patterns like $285K or 35K
      if (/^\$?\d+[kKmM]?$/.test(word)) {
        return word.toUpperCase();
      }

      const lower = word.toLowerCase();
      if (idx > 0 && lowerWords.has(lower)) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    });

    clean = converted.join("");
  }

  return clean;
}

export interface ExtractedSpecs {
  price?: string;
  bedrooms?: string;
  bathrooms?: string;
  sqft?: string;
  hasLoft?: boolean;
  tourDuration?: string;
  buildingType?: string;
}

/**
 * Intelligently extracts architectural specs from an article title and content
 */
export function extractArticleSpecs(title?: string | null, content?: string | string[] | null): ExtractedSpecs {
  const fullText = `${title || ""} ${Array.isArray(content) ? content.join(" ") : (content || "")}`;
  const specs: ExtractedSpecs = {};

  // Price match (e.g., "$285K", "$35,000", "$49,500", "Starting at $35K")
  const priceMatch = title?.match(/\$(\d+[\d,]*(?:\.\d+)?[kKmM]?)/i) || fullText.match(/(?:starting at|price|cost|only)\s*\$(\d+[\d,]*(?:\.\d+)?[kKmM]?)/i);
  if (priceMatch) {
    specs.price = `$${priceMatch[1].toUpperCase()}`;
  }

  // Bedroom match (e.g., "3 Bed", "3 Bedroom", "3-Bed")
  const bedMatch = fullText.match(/(\d+)\s*(?:bed|bedroom|beds|bd)\b/i);
  if (bedMatch) {
    specs.bedrooms = `${bedMatch[1]} Bed`;
  }

  // Bathroom match (e.g., "2 Bath", "2 Bathroom", "1.5 Bath")
  const bathMatch = fullText.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom|baths|ba)\b/i);
  if (bathMatch) {
    specs.bathrooms = `${bathMatch[1]} Bath`;
  }

  // Sqft match (e.g., "1,856 SQ FT", "1856 sqft", "1,750 square feet")
  const sqftMatch = fullText.match(/(\d[\d,]*)\s*(?:sq\.?\s*ft\.?|sqft|square\s*feet|sf\b)/i);
  if (sqftMatch) {
    specs.sqft = `${sqftMatch[1]} Sq Ft`;
  }

  // Loft check
  if (/loft\b/i.test(fullText)) {
    specs.hasLoft = true;
  }

  // Tour Duration match (e.g., "8 Minute Tour", "31 Minute Modular Cabin Tour")
  const durationMatch = title?.match(/(\d+)\s*(?:minute|min)\s*(?:tour|walkthrough|video)/i);
  if (durationMatch) {
    specs.tourDuration = `${durationMatch[1]} Min Video Tour`;
  }

  // Building Type classification
  if (/cabin|lodge/i.test(title || "")) {
    specs.buildingType = "Amish Built Cabin";
  } else if (/barndominium|barndo/i.test(title || "")) {
    specs.buildingType = "Barndominium";
  } else if (/adu|granny/i.test(title || "")) {
    specs.buildingType = "Backyard ADU";
  } else if (/tiny/i.test(title || "")) {
    specs.buildingType = "Tiny Home";
  } else {
    specs.buildingType = "Prefab Modular Home";
  }

  return specs;
}

/**
 * Cleans fragmented legacy links, hashtag dumps, and redundant iframes from blog body HTML
 */
export function cleanBlogHtml(html?: string | null, stripFirstIframe: boolean = false): string {
  if (!html) return "";

  let cleaned = html;

  // 1. Repair fragmented links like <a ...>Modular</a><a ...>H</a><a ...>ome.com</a>
  cleaned = cleaned.replace(
    /<a[^>]*>Modular<\/a>\s*<a[^>]*>H<\/a>\s*<a[^>]*>ome\.com<\/a>/gi,
    `<a href="/" class="text-[#d97706] font-bold hover:underline">ModularHome.com</a>`
  );
  cleaned = cleaned.replace(
    /<a[^>]*>Modular<\/a>\s*<a[^>]*>Home\.com<\/a>/gi,
    `<a href="/" class="text-[#d97706] font-bold hover:underline">ModularHome.com</a>`
  );

  // 2. Strip trailing raw hashtag dumps (e.g. #modularhome #prefabhome ...)
  cleaned = cleaned.replace(/<p>\s*(?:#[a-zA-Z0-9_-]+\s*){3,}<\/p>/gi, "");
  cleaned = cleaned.replace(/(?:#[a-zA-Z0-9_-]+\s*){4,}/gi, "");

  // 3. Remove first iframe if already featured as the primary video header
  if (stripFirstIframe) {
    cleaned = cleaned.replace(/<p[^>]*>\s*<iframe[\s\S]*?<\/iframe>\s*<\/p>/i, "");
    cleaned = cleaned.replace(/<iframe[\s\S]*?<\/iframe>/i, "");
  }

  // 4. Wrap any remaining iframe in a responsive 16:9 theater container
  cleaned = cleaned.replace(
    /<iframe([^>]*)src=["']([^"']+)["']([^>]*)><\/iframe>/gi,
    `<div class="my-6 relative aspect-video w-full rounded-[18px] overflow-hidden bg-black shadow-lg border border-[#e7e9ee]"><iframe$1src="$2"$3 class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
  );

  return cleaned.trim();
}
