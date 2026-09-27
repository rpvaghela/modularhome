import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkJunk() {
  const { data: prods } = await supabase
    .from("products")
    .select("id, handle, title, product_type, starting_price, status");

  console.log(`Total products in database: ${prods?.length}`);

  const junk = prods?.filter(p => {
    const t = (p.title + " " + (p.product_type || "") + " " + p.handle).toLowerCase();
    return (
      t.includes("greeting card") ||
      t.includes("candle") ||
      t.includes("jewelry") ||
      t.includes("necklace") ||
      t.includes("ring") ||
      t.includes("cash money") ||
      t.includes("t-shirt") ||
      t.includes("bath bomb")
    );
  }) || [];

  console.log(`Found ${junk.length} junk/unrelated products:`);
  junk.forEach(p => console.log(`- [${p.id}] ${p.title} (${p.handle}) - $${p.starting_price}`));

  // Check approved products
  const approved = prods?.filter(p => !junk.includes(p)) || [];
  console.log(`Total valid modular home products: ${approved.length}`);
}

checkJunk();
