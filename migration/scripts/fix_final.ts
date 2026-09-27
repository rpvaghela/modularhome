import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixFinal() {
  // 1. Delete the brochure product or update its price
  await supabase.from("products").delete().eq("handle", "how-our-steel-house-kits-work");
  console.log("Deleted brochure product.");

  // 2. Seed sample quotations if table is empty
  const { data: quotes, count } = await supabase.from("quotations").select("id", { count: "exact" });
  if (!count || count === 0) {
    console.log("Seeding sample quotations...");
    await supabase.from("quotations").insert([
      {
        customer_name: "Robert Anderson",
        customer_email: "robert.anderson@example.com",
        customer_phone: "+1 (555) 234-5678",
        model_name: "Aspire Log Cabin Kit",
        building_location: "Denver, CO",
        status: "PENDING",
        estimated_total: 82900,
        notes: "Interested in 3-bedroom cabin configuration with timber deck option.",
        details: {
          bedrooms: 3,
          bathrooms: 2,
          sqft: 730,
          foundation: "Crawlspace",
          timeline: "3-6 months",
        },
      },
      {
        customer_name: "Sarah Mitchell",
        customer_email: "sarah.m@example.com",
        customer_phone: "+1 (555) 876-5432",
        model_name: "The Ocean Crest Steel House Kit",
        building_location: "Austin, TX",
        status: "REVIEWED",
        estimated_total: 67900,
        notes: "Requesting engineering stamps for Travis County, TX permit application.",
        details: {
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1600,
          foundation: "Slab",
          timeline: "Immediate",
        },
      },
    ]);
    console.log("Seeded sample quotations.");
  }
}

fixFinal();
