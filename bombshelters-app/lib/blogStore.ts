import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export const BOMBSHELTER_BLOG_HANDLE = "bombshelters";

export interface BombShelterBlogPost {
  id: string;
  handle: string;
  title: string;
  summary: string;
  body_html: string;
  tags: string[];
  image_url: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_BLOGS: BombShelterBlogPost[] = [
  {
    id: "nbc-air-filtration-guide",
    handle: "nbc-air-filtration-guide",
    title: "Understanding NBC Air Filtration for Subterranean Bunkers",
    summary: "A technical overview of Nuclear, Biological, and Chemical air scrubbing systems and positive pressure sealing.",
    body_html: "<p>When designing an underground blast shelter, air filtration is life-critical. Modern systems integrate high-efficiency particulate air (HEPA) filters combined with activated carbon beds designed to eliminate radiological dust, biological pathogens, and chemical weapon agents.</p>",
    tags: ["Filtration", "NBC", "Life Support"],
    image_url: "/images/hero-bunker.png",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "fema-p320-tornado-shelters",
    handle: "fema-p320-tornado-shelters",
    title: "FEMA P-320 Compliance: Engineering EF5 Tornado Resistance",
    summary: "How cold-formed structural steel and impact-resistant doors achieve certified protection against 250 MPH winds.",
    body_html: "<p>FEMA P-320 guidelines mandate stringent structural testing, including resisting 15-lb 2x4 lumber fired at 100 MPH. Our corrugated steel and reinforced concrete shelters exceed ICC 500 standards for extreme wind emergencies.</p>",
    tags: ["FEMA", "Tornado", "Engineering"],
    image_url: "/images/cat-storm-shelters.png",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const BLOGS_FILE = path.join(DATA_DIR, "custom_blogs.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

export function readLocalBlogs(): BombShelterBlogPost[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(BLOGS_FILE)) {
      fs.writeFileSync(BLOGS_FILE, JSON.stringify(DEFAULT_BLOGS, null, 2), "utf-8");
      return DEFAULT_BLOGS;
    }
    const data = fs.readFileSync(BLOGS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BLOGS;
  } catch (error) {
    console.error("Error reading custom_blogs.json:", error);
    return DEFAULT_BLOGS;
  }
}

export function writeLocalBlogs(blogs: BombShelterBlogPost[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_blogs.json:", error);
  }
}

export async function getBombShelterBlogs(onlyPublished = true): Promise<BombShelterBlogPost[]> {
  const localList = readLocalBlogs();

  if (isSupabaseConfigured()) {
    try {
      let query = supabaseAdmin
        .from("blog_posts")
        .select("*")
        .or(`blog_handle.eq.${BOMBSHELTER_BLOG_HANDLE},blog_handle.eq.news,status.eq.PUBLISHED`)
        .order("published_at", { ascending: false });

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        const dbBlogs: BombShelterBlogPost[] = data.map((item: any) => ({
          id: item.id,
          handle: item.handle,
          title: item.title,
          summary: item.summary || "",
          body_html: item.body_html || "",
          tags: Array.isArray(item.tags) ? item.tags : [],
          image_url: item.image_url || "/images/hero-bunker.png",
          published: Boolean(item.published_at),
          published_at: item.published_at || item.created_at,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        const combined = [...dbBlogs];
        for (const local of localList) {
          if (!combined.some((b) => b.handle === local.handle)) {
            combined.push(local);
          }
        }
        return onlyPublished ? combined.filter((b) => b.published) : combined;
      }
    } catch (e) {
      console.warn("Supabase blog fetch error, returning local store:", e);
    }
  }

  return onlyPublished ? localList.filter((b) => b.published) : localList;
}

export async function getBombShelterBlogBySlug(slug: string): Promise<BombShelterBlogPost | null> {
  const all = await getBombShelterBlogs(false);
  return all.find((b) => b.handle === slug || b.id === slug) || null;
}

export async function saveBombShelterBlog(blog: Partial<BombShelterBlogPost> & { title: string; handle: string }): Promise<BombShelterBlogPost> {
  const now = new Date().toISOString();
  const localList = readLocalBlogs();
  const idx = localList.findIndex((b) => b.handle === blog.handle || b.id === blog.id);

  const newBlog: BombShelterBlogPost = {
    id: blog.id || `bs_blog_${Date.now()}`,
    handle: blog.handle.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-"),
    title: blog.title.trim(),
    summary: blog.summary || "",
    body_html: blog.body_html || "",
    tags: blog.tags || [],
    image_url: blog.image_url || "/images/hero-bunker.png",
    published: blog.published ?? true,
    published_at: blog.published_at || now,
    created_at: blog.created_at || now,
    updated_at: now,
  };

  if (idx !== -1) {
    localList[idx] = newBlog;
  } else {
    localList.unshift(newBlog);
  }
  writeLocalBlogs(localList);

  if (isSupabaseConfigured()) {
    try {
      const payload = {
        blog_handle: BOMBSHELTER_BLOG_HANDLE,
        handle: newBlog.handle,
        title: newBlog.title,
        summary: newBlog.summary,
        body_html: newBlog.body_html,
        tags: newBlog.tags,
        image_url: newBlog.image_url,
        published_at: newBlog.published ? newBlog.published_at : null,
        updated_at: now,
      };

      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("id")
        .eq("blog_handle", BOMBSHELTER_BLOG_HANDLE)
        .eq("handle", newBlog.handle)
        .maybeSingle();

      if (existing) {
        await supabaseAdmin
          .from("blog_posts")
          .update(payload)
          .eq("id", existing.id)
          .eq("blog_handle", BOMBSHELTER_BLOG_HANDLE);
      } else {
        await supabaseAdmin.from("blog_posts").insert({
          ...payload,
          id: newBlog.id,
          created_at: newBlog.created_at,
        });
      }
    } catch (e) {
      console.warn("Supabase blog persist error, stored locally:", e);
    }
  }

  return newBlog;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_REGEX = /^[a-z0-9_-]{1,120}$/i;

export async function deleteBombShelterBlog(idOrHandle: string): Promise<boolean> {
  const target = idOrHandle?.trim();
  if (!target) return false;

  const isUuid = UUID_REGEX.test(target);
  const isSlug = SLUG_REGEX.test(target);

  if (!isUuid && !isSlug) {
    console.warn(`[BombShelter Security] Rejected blog deletion with invalid identifier syntax: ${target}`);
    return false;
  }

  const localList = readLocalBlogs();
  const filtered = localList.filter((b) => b.id !== target && b.handle !== target);
  writeLocalBlogs(filtered);

  if (isSupabaseConfigured()) {
    try {
      if (isUuid) {
        // Safe parameterized deletion strictly scoped by blog_handle and UUID primary key
        await supabaseAdmin
          .from("blog_posts")
          .delete()
          .eq("blog_handle", BOMBSHELTER_BLOG_HANDLE)
          .eq("id", target);
      } else {
        // Safe parameterized deletion strictly scoped by blog_handle and verified slug handle
        await supabaseAdmin
          .from("blog_posts")
          .delete()
          .eq("blog_handle", BOMBSHELTER_BLOG_HANDLE)
          .eq("handle", target.toLowerCase());
      }
    } catch (e) {
      console.warn("Supabase blog delete error:", e);
    }
  }

  return true;
}

