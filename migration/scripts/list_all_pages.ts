import "dotenv/config";
import { query } from "../../src/lib/db";

async function listAll() {
  const res = await query("SELECT id, handle, title, slug, status, body_html, seo_title, seo_description FROM pages;");
  console.log("Total pages in DB:", res?.rows?.length);
  for (const p of res?.rows || []) {
    console.log(`- ID: ${p.id} | Slug: ${p.slug} | Handle: ${p.handle} | Title: ${p.title} | Status: ${p.status}`);
  }
  process.exit(0);
}
listAll();
