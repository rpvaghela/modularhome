import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { data: prods, count: prodCount, error: prodErr } = await supabase
    .from("products")
    .select("id, handle, title, product_type, starting_price, status, created_at", { count: "exact" });
  console.log("Products count in Supabase:", prodCount, "Error:", prodErr);
  if (prods && prods.length > 0) {
    console.log("First 10 products:");
    prods.slice(0, 10).forEach((p, idx) => console.log(`${idx + 1}. [${p.status}] ${p.title} (${p.handle}) - $${p.starting_price}`));
  }

  const { count: colCount } = await supabase.from("collections").select("*", { count: "exact", head: true });
  console.log("Collections count in Supabase:", colCount);

  const { count: blogCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
  console.log("Blog posts count in Supabase:", blogCount);

  const { count: leadCount } = await supabase.from("leads").select("*", { count: "exact", head: true });
  console.log("Leads count in Supabase:", leadCount);

  const { count: floorPlanCount } = await supabase.from("floor_plans").select("*", { count: "exact", head: true });
  console.log("Floor plans count in Supabase:", floorPlanCount);
}

inspect();
