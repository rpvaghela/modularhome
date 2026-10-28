export interface CmsPage {
  id?: string;
  title: string;
  slug: string;
  handle?: string;
  body_html?: string;
  meta_description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export function getPageUrl(page: { slug?: string | null; handle?: string | null } | null | undefined): string | null {
  if (!page) return null;
  const raw = page.slug || page.handle;
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "undefined" || trimmed === "null") return null;
  const clean = trimmed.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9_-]+/g, "-");
  if (!clean || clean === "undefined" || clean === "null") return null;
  return clean === "home" ? "/" : `/${clean}`;
}

