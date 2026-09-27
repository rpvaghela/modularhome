import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

async function fixOrders() {
  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows } = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders';
  `);
  console.log("Existing columns in orders table:", rows);

  // Add missing columns if needed
  await client.query(`
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'PENDING';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'UNFULFILLED';
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
  `);

  console.log("Updated orders table columns.");

  // Activity logs table
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
  `);
  console.log("Verified activity_logs table.");

  await client.end();
}

fixOrders().catch(console.error);
