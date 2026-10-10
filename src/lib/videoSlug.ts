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
