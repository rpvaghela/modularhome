import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export interface ActivityLogInput {
  action: string; // "CREATE", "UPDATE", "DELETE", "PUBLISH", "SYNC", "LOGIN", "EXPORT"
  entityType: string; // "PAGE", "SECTION", "PRODUCT", "BLOG_POST", "PRICING_RULE", "SETTINGS", "LEAD", "QUOTATION"
  entityId?: string;
  details?: any;
  ipAddress?: string;
}

export async function logActivity(input: ActivityLogInput): Promise<void> {
  try {
    let actorId = "system";
    let actorEmail = "system@modularhome.com";

    try {
      const session = await getAdminSession();
      if (session) {
        actorId = session.id || "admin-root";
        actorEmail = session.email || "modularhome.admin@gmail.com";
      }
    } catch {}

    const logId = `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const detailsJson = typeof input.details === "string" ? input.details : JSON.stringify(input.details || {});

    // 1. Direct Postgres insertion
    try {
      const insertSql = `
        INSERT INTO activity_logs (id, actor_id, actor_email, action, entity_type, entity_id, details, ip_address, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `;
      await query(insertSql, [
        logId,
        actorId,
        actorEmail,
        input.action,
        input.entityType,
        input.entityId || null,
        detailsJson,
        input.ipAddress || null,
      ]);
      return;
    } catch (pgErr) {
      console.warn("Postgres activity log note:", pgErr);
    }

    // 2. Supabase fallback
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from("activity_logs").insert({
          id: logId,
          actor_id: actorId,
          actor_email: actorEmail,
          action: input.action,
          entity_type: input.entityType,
          entity_id: input.entityId || null,
          details: input.details || {},
          ip_address: input.ipAddress || null,
        });
      } catch (spErr) {
        console.warn("Supabase activity log note:", spErr);
      }
    }
  } catch (error) {
    console.error("Failed to record activity log:", error);
  }
}
