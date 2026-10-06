import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;
let lastDbErrorLoggedAt = 0;
let dbDisabledUntil = 0;

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
  const now = Date.now();
  if (now < dbDisabledUntil) {
    return null;
  }

  const dbUrl = getDbUrl();
  if (!dbUrl) {
    return null;
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString: dbUrl,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 1000,
      });

      pool.on("error", (err) => {
        const time = Date.now();
        if (time - lastDbErrorLoggedAt > 60000) {
          console.warn("Postgres idle pool error:", err?.message || err);
          lastDbErrorLoggedAt = time;
        }
      });
    } catch (err: any) {
      console.warn("Postgres pool creation failed:", err?.message || err);
      return null;
    }
  }

  return pool;
}

/**
 * Execute a SQL query directly against the Postgres database.
 * Returns null if DB is not configured, unreachable, or query fails.
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
    const errorMsg = error?.message || String(error);
    const now = Date.now();

    // If DNS resolution fails (e.g. IPv6-only direct Supabase host on IPv4 network)
    if (errorMsg.includes("ENOTFOUND") || errorMsg.includes("ETIMEDOUT") || errorMsg.includes("ECONNREFUSED")) {
      dbDisabledUntil = now + 86400000; // Back off direct postgres for 24 hours to avoid request latency
      
      if (now - lastDbErrorLoggedAt > 60000) {
        lastDbErrorLoggedAt = now;
        if (errorMsg.includes("ENOTFOUND") && errorMsg.includes("supabase.co")) {
          console.warn(
            `\n⚠️  [Postgres Notice] Direct Supabase host resolution failed (${errorMsg}).\n` +
            `👉 Note: 'db.<project>.supabase.co' is IPv6-only. On IPv4 networks, use the Supabase Connection Pooler URL ` +
            `(e.g., 'postgresql://postgres.<project>:[password]@aws-0-[region].pooler.supabase.com:6543/postgres') ` +
            `or rely on the Supabase REST client.\n` +
            `⚡ Falling back to Supabase API / local store gracefully.\n`
          );
        } else {
          console.warn("Direct Postgres query failed (falling back to API/store):", errorMsg);
        }
      }
    } else if (now - lastDbErrorLoggedAt > 60000) {
      lastDbErrorLoggedAt = now;
      console.warn("Direct Postgres query failed (falling back to API/store):", errorMsg);
    }

    return null;
  }
}

