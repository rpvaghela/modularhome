import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

const MAX_FAILED_ATTEMPTS = 5;
const MAX_IP_FAILED_ATTEMPTS = 15;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface MemoryRateLimitRecord {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

// In-memory fallback cache (used when DB is unreachable or during tests)
const memoryStore = new Map<string, MemoryRateLimitRecord>();

export interface RateLimitCheckResult {
  isLocked: boolean;
  remainingAttempts: number;
  lockedMinutesRemaining?: number;
}

/**
 * Normalizes keys to avoid namespace collisions with ModularHome in the shared DB
 */
function getEmailKey(email: string): string {
  return `bs:account:${email.toLowerCase().trim()}`;
}

function getIpKey(ip: string): string {
  return `bs:ip:${ip.trim()}`;
}

/**
 * Checks whether an account or IP address is currently locked out
 */
export async function checkLoginRateLimit(
  email: string,
  ip: string = "unknown"
): Promise<RateLimitCheckResult> {
  const accountKey = getEmailKey(email);
  const ipKey = getIpKey(ip);
  const now = Date.now();

  // 1. Shared Database Check (Supabase login_attempts table)
  if (isSupabaseConfigured()) {
    try {
      // Check both account and IP records
      const { data: records, error } = await supabaseAdmin
        .from("login_attempts")
        .select("email, attempt_count, last_attempt_at, locked_until")
        .in("email", [accountKey, ipKey]);

      if (!error && Array.isArray(records)) {
        for (const record of records) {
          if (record.locked_until && new Date(record.locked_until).getTime() > now) {
            const lockedMinutes = Math.ceil(
              (new Date(record.locked_until).getTime() - now) / (60 * 1000)
            );
            return {
              isLocked: true,
              remainingAttempts: 0,
              lockedMinutesRemaining: Math.max(1, lockedMinutes),
            };
          }
        }
      }
    } catch (e) {
      console.warn("[BombShelter RateLimit] Shared DB check warning, falling back to secure local limiter:", e);
    }
  }

  // 2. In-Memory Limiter Fallback
  for (const key of [accountKey, ipKey]) {
    const record = memoryStore.get(key);
    if (record) {
      if (record.lockedUntil && record.lockedUntil > now) {
        const lockedMinutes = Math.ceil((record.lockedUntil - now) / (60 * 1000));
        return {
          isLocked: true,
          remainingAttempts: 0,
          lockedMinutesRemaining: Math.max(1, lockedMinutes),
        };
      }
      if (record.lockedUntil && record.lockedUntil <= now) {
        memoryStore.delete(key);
      }
    }
  }

  return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
}

/**
 * Records a failed attempt for both account and IP, setting lockouts if thresholds are exceeded
 */
export async function recordFailedLogin(
  email: string,
  ip: string = "unknown"
): Promise<{ isNowLocked: boolean; remainingAttempts: number }> {
  const accountKey = getEmailKey(email);
  const ipKey = getIpKey(ip);
  const now = Date.now();
  const lockedUntilIso = new Date(now + LOCKOUT_DURATION_MS).toISOString();

  let accountCount = 1;
  let ipCount = 1;

  // 1. Update in Shared Database
  if (isSupabaseConfigured()) {
    try {
      // Record Account attempt
      const { data: accData } = await supabaseAdmin
        .from("login_attempts")
        .select("attempt_count")
        .eq("email", accountKey)
        .maybeSingle();

      accountCount = (accData?.attempt_count || 0) + 1;
      const isAccountLocked = accountCount >= MAX_FAILED_ATTEMPTS;

      await supabaseAdmin.from("login_attempts").upsert({
        email: accountKey,
        ip_address: ip,
        attempt_count: accountCount,
        last_attempt_at: new Date(now).toISOString(),
        locked_until: isAccountLocked ? lockedUntilIso : null,
      });

      // Record IP attempt
      const { data: ipData } = await supabaseAdmin
        .from("login_attempts")
        .select("attempt_count")
        .eq("email", ipKey)
        .maybeSingle();

      ipCount = (ipData?.attempt_count || 0) + 1;
      const isIpLocked = ipCount >= MAX_IP_FAILED_ATTEMPTS;

      await supabaseAdmin.from("login_attempts").upsert({
        email: ipKey,
        ip_address: ip,
        attempt_count: ipCount,
        last_attempt_at: new Date(now).toISOString(),
        locked_until: isIpLocked ? lockedUntilIso : null,
      });

      if (isAccountLocked || isIpLocked) {
        return { isNowLocked: true, remainingAttempts: 0 };
      }
    } catch (e) {
      console.warn("[BombShelter RateLimit] Shared DB record note:", e);
    }
  }

  // 2. Update In-Memory Store
  const accRec = memoryStore.get(accountKey);
  const newAccCount = (accRec?.count || 0) + 1;
  const isAccLocked = newAccCount >= MAX_FAILED_ATTEMPTS;

  memoryStore.set(accountKey, {
    count: newAccCount,
    lastAttempt: now,
    lockedUntil: isAccLocked ? now + LOCKOUT_DURATION_MS : null,
  });

  const ipRec = memoryStore.get(ipKey);
  const newIpCount = (ipRec?.count || 0) + 1;
  const isIpLocked = newIpCount >= MAX_IP_FAILED_ATTEMPTS;

  memoryStore.set(ipKey, {
    count: newIpCount,
    lastAttempt: now,
    lockedUntil: isIpLocked ? now + LOCKOUT_DURATION_MS : null,
  });

  const isLocked = isAccLocked || isIpLocked;
  return {
    isNowLocked: isLocked,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - newAccCount),
  };
}

/**
 * Resets failed attempt counters upon successful login
 */
export async function clearLoginAttempts(email: string, ip: string = "unknown"): Promise<void> {
  const accountKey = getEmailKey(email);
  const ipKey = getIpKey(ip);

  memoryStore.delete(accountKey);
  memoryStore.delete(ipKey);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin
        .from("login_attempts")
        .delete()
        .in("email", [accountKey, ipKey]);
    } catch (e) {
      console.warn("[BombShelter RateLimit] Failed to clear DB login attempts:", e);
    }
  }
}

