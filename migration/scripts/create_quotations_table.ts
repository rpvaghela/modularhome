import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

async function createTable() {
  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("No database URL provided in environment.");
    return;
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to PostgreSQL database.");

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.quotations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      customer_zip TEXT,
      model_slug TEXT,
      model_name TEXT,
      sqft NUMERIC,
      dimensions TEXT,
      options JSONB DEFAULT '[]'::jsonb,
      pricing_inputs JSONB DEFAULT '{}'::jsonb,
      estimated_amount NUMERIC,
      timeline TEXT,
      requirements TEXT,
      source TEXT DEFAULT 'QUOTE_WIZARD',
      status TEXT DEFAULT 'PENDING',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_quotations_customer_email ON public.quotations(customer_email);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
    CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON public.quotations(created_at DESC);
  `);

  console.log("Table 'public.quotations' verified/created successfully.");

  // Seed sample quotations
  await client.query(`
    INSERT INTO public.quotations (
      customer_name, customer_email, customer_phone, customer_zip,
      model_slug, model_name, sqft, estimated_amount, timeline, requirements, source, status
    ) VALUES 
    (
      'Robert Anderson', 'robert.anderson@example.com', '+1 (555) 234-5678', '80202',
      'aspire-log-cabin-kit', 'Aspire Log Cabin Kit', 730, 82900, '3-6 months',
      'Interested in 3-bedroom cabin configuration with timber deck option.', 'QUOTE_WIZARD', 'PENDING'
    ),
    (
      'Sarah Mitchell', 'sarah.m@example.com', '+1 (555) 876-5432', '78701',
      'the-ocean-crest-steel-house-kit', 'The Ocean Crest Steel House Kit', 1600, 67900, 'Immediate',
      'Requesting engineering stamps for Travis County, TX permit application.', 'QUOTE_WIZARD', 'REVIEWED'
    )
    ON CONFLICT DO NOTHING;
  `);

  console.log("Sample quotations seeded.");
  await client.end();
}

createTable().catch(console.error);
