import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspectQuotations() {
  const { data, error } = await supabase.from("quotations").select("*");
  console.log("Quotations in Supabase:", data, "Error:", error);
}

inspectQuotations();
