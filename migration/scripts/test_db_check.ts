import "dotenv/config";
import { query } from "../../src/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "../../src/lib/supabase";

async function check() {
  console.log("isSupabaseConfigured:", isSupabaseConfigured());
  try {
    const res = await query("SELECT id, handle, title, slug, status, created_at FROM pages ORDER BY created_at DESC LIMIT 10;");
    console.log("Postgres pages count:", res?.rows?.length);
    console.log("Postgres pages:", res?.rows);
  } catch (e: any) {
    console.error("Postgres error:", e.message);
  }
  try {
    const { data, error } = await supabaseAdmin.from("pages").select("id, handle, title, slug, status").limit(10);
    console.log("Supabase pages count:", data?.length, "error:", error);
    console.log("Supabase pages:", data);
  } catch (e: any) {
    console.error("Supabase error:", e.message);
  }
  process.exit(0);
}
check();
