import "dotenv/config";
import { query } from "../../src/lib/db";

async function listSections() {
  const res = await query("SELECT id, page_id, type, title, display_order, is_visible FROM page_sections;");
  console.log("Total sections in DB:", res?.rows?.length);
  for (const s of res?.rows || []) {
    console.log(`- Sec ID: ${s.id} | Page ID: ${s.page_id} | Type: ${s.type} | Title: ${s.title}`);
  }
  process.exit(0);
}
listSections();
