export function slugifyVideoTitle(title: string, youtubeVideoId?: string): string {
  if (!title) return `modular-cabin-tour-${youtubeVideoId || "video"}`;

  let cleaned = title
    // Replace hashtags with word: #logcabin -> logcabin
    .replace(/#([a-zA-Z0-9]+)/g, "$1 ")
    // Convert $69K to 69k
    .replace(/\$([0-9]+k?)/gi, "$1")
    // Replace & with and
    .replace(/&/g, " and ")
    // Remove non-alphanumeric (except dashes and spaces)
    .replace(/[^\w\s-]/g, " ")
    .toLowerCase()
    .trim()
    // Replace multiple spaces and dashes with a single dash
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Max 85 characters without cutting in the middle of a word
  if (cleaned.length > 85) {
    const cut = cleaned.substring(0, 85);
    const lastDash = cut.lastIndexOf("-");
    if (lastDash > 25) {
      cleaned = cut.substring(0, lastDash);
    } else {
      cleaned = cut;
    }
  }

  // Remove consecutive duplicate words (e.g. #logcabin #cabin #logcabin)
  const stopWords = new Set(["in", "of", "to", "the", "a", "for", "by", "or", "and", "on", "with", "at", "is"]);
  const words = cleaned.split("-");
  const filteredWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w) continue;
    // Allow numbers and stop words
    if (/^\d+$/.test(w) || stopWords.has(w)) {
      filteredWords.push(w);
      continue;
    }
    // Check if directly preceding word or immediate context is identical
    const prev = filteredWords[filteredWords.length - 1];
    if (prev === w) continue;

    // Check if root already seen recently
    const root = w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w;
    const prevRoot = prev && prev.length > 4 && prev.endsWith("s") ? prev.slice(0, -1) : prev;
    if (root === prevRoot) continue;

    filteredWords.push(w);
  }

  // Remove trailing dangling stop words (e.g. "-and", "-for", "-the")
  while (filteredWords.length > 0 && stopWords.has(filteredWords[filteredWords.length - 1])) {
    filteredWords.pop();
  }

  cleaned = filteredWords.join("-").replace(/^-+|-+$/g, "");

  if (!cleaned || cleaned.length < 3) {
    cleaned = `modular-cabin-tour-${youtubeVideoId ? youtubeVideoId.toLowerCase() : "video"}`;
  }

  return cleaned;
}

export function generateUniqueSlug(
  title: string,
  youtubeVideoId: string,
  existingSlugs: Set<string>
): string {
  const base = slugifyVideoTitle(title, youtubeVideoId);
  if (!existingSlugs.has(base)) {
    return base;
  }

  // If collision, append clean lowercase youtube id
  const withYt = `${base}-${youtubeVideoId.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  if (!existingSlugs.has(withYt)) {
    return withYt;
  }

  // Counter fallback
  let counter = 2;
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}

/**
 * Format video description for SEO meta tag (<= 155 chars, stripped of URLs, markdown, hashtags)
 */
export function formatVideoMetaDescription(rawDescription?: string, videoTitle?: string): string {
  if (!rawDescription || typeof rawDescription !== "string") {
    const title = (videoTitle || "modular home and cabin").replace(/#/g, "").trim();
    return `Watch official video tour of ${title} by ModularHome.com. Explore floor plans, specs, and prefab construction.`.slice(0, 155);
  }

  let text = rawDescription
    // Clean up domain references in markdown links or URLs to readable brand domain names
    .replace(/\[https?:\/\/(?:www\.)?amishbuiltcabins\.com\/?\]\([^)]+\)/gi, "AmishBuiltCabins.com.")
    .replace(/\[https?:\/\/(?:www\.)?modularhome\.com\/?\]\([^)]+\)/gi, "ModularHome.com.")
    .replace(/https?:\/\/(?:www\.)?amishbuiltcabins\.com\/?/gi, "AmishBuiltCabins.com.")
    .replace(/https?:\/\/(?:www\.)?modularhome\.com\/?/gi, "ModularHome.com.")
    // Strip markdown links: [label](url) -> label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Strip remaining raw URLs
    .replace(/https?:\/\/\S+/gi, "")
    // Strip hashtags: #modularhomes
    .replace(/#[a-zA-Z0-9_]+/g, "")
    // Strip phone numbers like Call Now: 812-595-4033
    .replace(/Call Now:?\s*[\d-() ]+/gi, "")
    // Fix dangling 'at Welcome' -> 'Welcome'
    .replace(/\bat\s+Welcome\b/gi, "Welcome")
    // Fix double periods
    .replace(/([.,])\s*\./g, ".")
    // Normalize whitespace and line breaks to single space
    .replace(/\s+/g, " ")
    .trim();

  // If text became too short after stripping
  if (text.length < 30) {
    const title = (videoTitle || "modular home and cabin").replace(/#/g, "").trim();
    text = `Watch official video tour of ${title} by ModularHome.com. Explore floor plans, turnkey pricing, and modular home features.`;
  }

  // Truncate at word boundary to <= 155 chars
  if (text.length > 155) {
    const truncated = text.substring(0, 150);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 100) {
      return `${truncated.substring(0, lastSpace).trim()}...`;
    }
    return `${truncated.trim()}...`;
  }

  return text;
}

/**
 * Format video title for SEO <title> tag to prevent duplication with root layout template
 */
export function formatVideoMetaTitle(videoTitle: string): string {
  if (!videoTitle) return "Modular Home & Cabin Video Tour";

  let clean = videoTitle
    .replace(/#([a-zA-Z0-9]+)/g, "$1")
    .replace(/\s*\|\s*ModularHome\.com.*$/i, "")
    .replace(/\s*\|\s*Amish Modular.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  // Keep short so "{title} | ModularHome.com" stays under 60-70 characters
  if (clean.length > 55) {
    const cut = clean.substring(0, 52);
    const lastSpace = cut.lastIndexOf(" ");
    if (lastSpace > 35) {
      clean = cut.substring(0, lastSpace).trim();
    } else {
      clean = cut.trim();
    }
  }

  return clean;
}
