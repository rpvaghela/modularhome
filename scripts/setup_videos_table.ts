import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

async function main() {
  const client = new Client({
    host: "aws-0-us-west-1.pooler.supabase.com",
    port: 5432,
    user: "postgres.tbaxtdecjznpqmccldnz",
    password: "OmNIuqIP4ni8d6pv",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL successfully via pooler!");

    // Create videos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.videos (
        id TEXT PRIMARY KEY,
        youtube_video_id TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'Building Tours',
        duration TEXT DEFAULT '4:00',
        description TEXT DEFAULT '',
        thumbnail TEXT,
        model_slug TEXT,
        views TEXT DEFAULT '0 views',
        date TEXT,
        published_at TIMESTAMPTZ,
        youtube_url TEXT,
        embed_url TEXT,
        video_url TEXT,
        channel_id TEXT,
        channel_title TEXT,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_videos_slug ON public.videos(slug);
      CREATE INDEX IF NOT EXISTS idx_videos_youtube_video_id ON public.videos(youtube_video_id);
      CREATE INDEX IF NOT EXISTS idx_videos_is_published ON public.videos(is_published);
    `);
    console.log("public.videos table created or verified successfully!");

    // Enable RLS and add public read policy if not already present
    await client.query(`
      ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Allow public read access'
        ) THEN
          CREATE POLICY "Allow public read access" ON public.videos FOR SELECT USING (true);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Allow all access to service role'
        ) THEN
          CREATE POLICY "Allow all access to service role" ON public.videos FOR ALL USING (true);
        END IF;
      END
      $$;
    `);
    console.log("RLS and policies configured successfully!");
  } catch (err) {
    console.error("Error creating videos table:", err);
  } finally {
    await client.end();
  }
}

main();
