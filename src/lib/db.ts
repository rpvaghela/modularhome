import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;

function getDbUrl(): string | undefined {
  const url =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL ||
    (process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("postgres://") ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("postgresql://")
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : undefined);

  return url;
}

export function getPool(): Pool | null {
  const dbUrl = getDbUrl();
  if (!dbUrl) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected Postgres client error on idle connection:", err);
    });
  }

  return pool;
}

/**
 * Execute a SQL query directly against the Postgres database.
 * Returns null if DB is not configured or query fails.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T> | null> {
  const p = getPool();
  if (!p) return null;

  try {
    return await p.query<T>(text, params);
  } catch (error: any) {
    console.error("Postgres query error:", error?.message || error, "SQL:", text);
    throw error;
  }
}
