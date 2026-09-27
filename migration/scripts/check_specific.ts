import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSpecific() {
  const { data: specific } = await supabase
    .from("products")
    .select("id, handle, title, starting_price, status")
    .ilike("handle", "%greeting%");
  console.log("Greeting card products:", specific);

  const { data: cheap } = await supabase
    .from("products")
    .select("id, handle, title, starting_price, status")
    .lt("starting_price", 1000);
  console.log("Products under $1000:", cheap);
}

checkSpecific();
