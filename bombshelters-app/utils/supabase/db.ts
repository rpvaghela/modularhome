/**
 * PostgreSQL / Supabase Database Connection Configuration
 */

export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  connectionString: string;
}

export const dbConfig: DbConfig = {
  host: process.env.PGHOST || "db.sxrteizeakvrrkmllwgo.supabase.co",
  port: parseInt(process.env.PGPORT || "5432", 10),
  database: process.env.PGDATABASE || "postgres",
  user: process.env.PGUSER || "postgres",
  connectionString:
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL ||
    `postgresql://${process.env.PGUSER || "postgres"}:${encodeURIComponent(
      process.env.PGPASSWORD || ""
    )}@${process.env.PGHOST || "db.sxrteizeakvrrkmllwgo.supabase.co"}:${
      process.env.PGPORT || "5432"
    }/${process.env.PGDATABASE || "postgres"}`
};

/**
 * Helper to build an encoded PostgreSQL connection string given a password.
 * Automatically percent-encodes special characters in the password.
 */
export function buildConnectionString(password: string): string {
  const host = process.env.PGHOST || "db.sxrteizeakvrrkmllwgo.supabase.co";
  const port = process.env.PGPORT || "5432";
  const database = process.env.PGDATABASE || "postgres";
  const user = process.env.PGUSER || "postgres";
  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}
