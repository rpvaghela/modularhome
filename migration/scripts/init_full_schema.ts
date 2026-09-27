import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

async function initFullSchema() {
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

  // 1. Customers Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      phone TEXT,
      status TEXT DEFAULT 'ACTIVE',
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      verification_sent_at TIMESTAMPTZ,
      reset_token TEXT,
      reset_token_expires_at TIMESTAMPTZ,
      provider TEXT DEFAULT 'EMAIL',
      last_login_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
  `);
  console.log("Verified customers table.");

  // 2. Customer Sessions Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.customer_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_token TEXT UNIQUE NOT NULL,
      customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
      expires_at BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_customer_sessions_token ON public.customer_sessions(session_token);
  `);
  console.log("Verified customer_sessions table.");

  // 3. Quotations Table
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
    CREATE INDEX IF NOT EXISTS idx_quotations_email ON public.quotations(customer_email);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
  `);
  console.log("Verified quotations table.");

  // 4. Leads Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      zip TEXT,
      location TEXT,
      enquiry_details TEXT,
      source TEXT DEFAULT 'CONTACT_FORM',
      status TEXT DEFAULT 'NEW',
      notes TEXT,
      assigned_to TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
  `);
  console.log("Verified leads table.");

  // 5. Orders Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      items JSONB DEFAULT '[]'::jsonb,
      total_amount NUMERIC NOT NULL DEFAULT 0,
      payment_status TEXT DEFAULT 'PENDING',
      fulfillment_status TEXT DEFAULT 'UNFULFILLED',
      stripe_session_id TEXT,
      stripe_payment_intent_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
  `);
  console.log("Verified orders table.");

  // 6. Activity Logs Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.activity_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT,
      user_name TEXT,
      user_role TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      description TEXT NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
  `);
  console.log("Verified activity_logs table.");

  // 7. Seed Sample Records for Quotations & Leads
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

    INSERT INTO public.leads (
      name, email, phone, location, enquiry_details, source, status
    ) VALUES 
    (
      'David Miller', 'david.miller@example.com', '+1 (555) 345-6789', 'Denver, CO',
      'Inquiry about custom 4-bedroom 2,400 sq ft modern modular build timeline and pricing.', 'WEBSITE_INQUIRY', 'NEW'
    ),
    (
      'Jessica Taylor', 'jessica.t@example.com', '+1 (555) 987-6543', 'Nashville, TN',
      'Questions regarding foundation preparation and local builder network in Tennessee.', 'BUILD_ASSISTANT', 'CONTACTED'
    )
    ON CONFLICT DO NOTHING;
  `);
  console.log("Seeded sample quotations and leads.");

  await client.end();
  console.log("All tables initialized successfully!");
}

initFullSchema().catch(console.error);
