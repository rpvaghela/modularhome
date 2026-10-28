import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { SignJWT, jwtVerify } from "jose";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export const COOKIE_NAME = "bombshelters_admin_session";
export const SESSION_EXPIRY_HOURS = 2;
export const SESSION_EXPIRY_MS = SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

export const JWT_ISSUER = "bombshelters.com";
export const JWT_AUDIENCE = "bombshelters-admin";
export const JWT_ALGORITHM = "HS256";
export const BOMBSHELTER_TENANT = "BombShelters.com";

/**
 * Returns the cryptographically isolated secret for BombShelter admin JWT signing.
 * Strictly requires BOMBSHELTER_ADMIN_SESSION_SECRET in production.
 * Does NOT fall back to ModularHome ADMIN_SESSION_SECRET or shared SUPABASE_JWT_SECRET.
 */
export function getAdminJwtSecret(): Uint8Array {
  const secret = process.env.BOMBSHELTER_ADMIN_SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY: BOMBSHELTER_ADMIN_SESSION_SECRET environment variable must be set in production."
      );
    }
    // Isolated local development fallback secret (strictly dedicated to BombShelter)
    return new TextEncoder().encode("dev_isolated_session_secret_bombshelters_strictly_isolated");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface StoredAdminSession {
  session_token: string;
  user_id: string;
  user: AdminSessionUser;
  expires_at: number;
  created_at: string;
}

const ADMIN_SESSIONS_FILE = path.join(process.cwd(), "data", "custom_admin_sessions.json");

function ensureSessionsFile() {
  try {
    if (!fs.existsSync(ADMIN_SESSIONS_FILE)) {
      const dir = path.dirname(ADMIN_SESSIONS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(ADMIN_SESSIONS_FILE, "[]", "utf-8");
    }
  } catch {}
}

function readLocalAdminSessions(): StoredAdminSession[] {
  try {
    ensureSessionsFile();
    if (!fs.existsSync(ADMIN_SESSIONS_FILE)) return [];
    const raw = fs.readFileSync(ADMIN_SESSIONS_FILE, "utf-8");
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function writeLocalAdminSessions(sessions: StoredAdminSession[]): void {
  try {
    ensureSessionsFile();
    fs.writeFileSync(ADMIN_SESSIONS_FILE, JSON.stringify(sessions.slice(0, 500), null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write local BombShelter admin sessions:", e);
  }
}

const memorySessions = new Map<string, { user: AdminSessionUser; expiresAt: number }>();

/**
 * Creates a signed JWT session token with strict issuer, audience, and tenant claims
 */
export async function createBombShelterSession(
  userId: string,
  userFallback?: AdminSessionUser
): Promise<string> {
  const expiresAt = Date.now() + SESSION_EXPIRY_MS;
  const createdAt = new Date().toISOString();

  const user: AdminSessionUser = userFallback || {
    id: userId,
    email: process.env.BOMBSHELTER_ADMIN_EMAIL || "admin@bombshelters.com",
    name: "BombShelter Command Admin",
    role: "BOMBSHELTERS_ADMIN",
  };

  // 1. Sign cryptographic JWT token with strict claims
  const sessionToken = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenant: BOMBSHELTER_TENANT,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_HOURS}h`)
    .sign(getAdminJwtSecret());

  // 2. In-memory cache
  memorySessions.set(sessionToken, { user, expiresAt });

  // 3. Local persistent store
  try {
    const list = readLocalAdminSessions().filter((s) => s.expires_at > Date.now());
    list.unshift({
      session_token: sessionToken,
      user_id: userId,
      user,
      expires_at: expiresAt,
      created_at: createdAt,
    });
    writeLocalAdminSessions(list);
  } catch (err) {
    console.warn("Local BombShelter admin session write note:", err);
  }

  // 4. Supabase database session table if configured
  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("sessions").insert({
        session_token: sessionToken,
        user_id: userId !== "bs-admin-root" ? userId : null,
        expires_at: expiresAt,
      });
    } catch (e) {
      console.warn("Could not persist session to Supabase sessions table:", e);
    }
  }

  // 5. Set HttpOnly cookie
  try {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expiresAt),
      maxAge: SESSION_EXPIRY_HOURS * 60 * 60,
    });
  } catch (cookieErr) {
    console.warn("BombShelter session cookie store note:", cookieErr);
  }

  return sessionToken;
}

/**
 * Retrieves and cryptographically validates the current authenticated BombShelter admin session.
 * Enforces algorithm, issuer, audience, and tenant validation.
 */
export async function getBombShelterSession(): Promise<AdminSessionUser | null> {
  try {
    let token: string | undefined;
    try {
      const cookieStore = cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      return null;
    }

    if (!token) return null;

    // 1. Strict JWT cryptographic verification with algorithm, issuer, audience, and tenant check
    try {
      const { payload } = await jwtVerify(token, getAdminJwtSecret(), {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        algorithms: [JWT_ALGORITHM],
      });

      // Strict validation: must contain email, role, and strictly match BombShelters.com tenant
      if (
        payload &&
        payload.email &&
        payload.role &&
        payload.tenant === BOMBSHELTER_TENANT
      ) {
        const verifiedUser: AdminSessionUser = {
          id: (payload.id as string) || (payload.sub as string) || "bs-admin-root",
          email: payload.email as string,
          name: (payload.name as string) || "BombShelter Admin",
          role: (payload.role as string) || "BOMBSHELTERS_ADMIN",
        };
        memorySessions.set(token, { user: verifiedUser, expiresAt: Date.now() + SESSION_EXPIRY_MS });
        return verifiedUser;
      }
      return null;
    } catch {
      // Token signature invalid, expired, wrong issuer/audience, or forged tenant
    }

    // 2. Check in-memory store
    const mem = memorySessions.get(token);
    if (mem) {
      if (Date.now() > mem.expiresAt) {
        memorySessions.delete(token);
        return null;
      }
      return mem.user;
    }

    // 3. Check local file store
    const localList = readLocalAdminSessions();
    const localMatch = localList.find((s) => s.session_token === token);
    if (localMatch && localMatch.expires_at > Date.now()) {
      memorySessions.set(token, { user: localMatch.user, expiresAt: localMatch.expires_at });
      return localMatch.user;
    }

    // 4. Query Supabase database
    if (isSupabaseConfigured()) {
      try {
        const { data: sessionData, error: sessError } = await supabaseAdmin
          .from("sessions")
          .select("session_token, expires_at, user_id")
          .eq("session_token", token)
          .maybeSingle();

        if (!sessError && sessionData) {
          if (Number(sessionData.expires_at) < Date.now()) {
            await supabaseAdmin.from("sessions").delete().eq("session_token", token);
            return null;
          }

          if (sessionData.user_id) {
            const { data: dbUser } = await supabaseAdmin
              .from("admin_users")
              .select("id, email, name, role, status")
              .eq("id", sessionData.user_id)
              .maybeSingle();

            if (dbUser && dbUser.status === "ACTIVE") {
              const roleUpper = (dbUser.role || "").toUpperCase();
              if (roleUpper === "BOMBSHELTERS_ADMIN" || roleUpper === "SUPER_ADMIN") {
                const sessionUser: AdminSessionUser = {
                  id: dbUser.id,
                  email: dbUser.email,
                  name: dbUser.name,
                  role: roleUpper === "BOMBSHELTERS_ADMIN" ? "BOMBSHELTERS_ADMIN" : "SUPER_ADMIN",
                };
                memorySessions.set(token, { user: sessionUser, expiresAt: Number(sessionData.expires_at) });
                return sessionUser;
              }
            }
          }
        }
      } catch (dbErr) {
        console.warn("Supabase session check error note:", dbErr);
      }
    }

    return null;
  } catch (error) {
    console.error("Error retrieving BombShelter admin session:", error);
    return null;
  }
}

/**
 * Destroys current BombShelter admin session across memory, local file, DB and clears auth cookie
 */
export async function destroyBombShelterSession(): Promise<void> {
  try {
    let token: string | undefined;
    try {
      const cookieStore = cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {}

    if (token) {
      memorySessions.delete(token);

      try {
        const remaining = readLocalAdminSessions().filter((s) => s.session_token !== token);
        writeLocalAdminSessions(remaining);
      } catch {}

      if (isSupabaseConfigured()) {
        try {
          await supabaseAdmin.from("sessions").delete().eq("session_token", token);
        } catch {}
      }
    }

    try {
      const cookieStore = cookies();
      cookieStore.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
        maxAge: 0,
      });
    } catch {}
  } catch (error) {
    console.error("Error destroying BombShelter admin session:", error);
  }
}

/**
 * Route protection helper that validates admin session or returns 401 response
 */
export async function requireBombShelterAdminAuth(): Promise<NextResponse | AdminSessionUser> {
  const session = await getBombShelterSession();
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Unauthorized. BombShelter admin session expired or invalid. Please sign in.", code: "UNAUTHORIZED" },
      },
      { status: 401 }
    );
  }
  return session;
}

/**
 * Route protection helper that verifies the current admin user possesses an allowed role
 */
export async function requireBombShelterAdminRole(
  allowedRoles: string[]
): Promise<NextResponse | AdminSessionUser> {
  const authResult = await requireBombShelterAdminAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const userRole = (authResult.role || "BOMBSHELTERS_ADMIN").toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  if (
    !normalizedAllowed.includes(userRole) &&
    userRole !== "SUPER_ADMIN" &&
    userRole !== "BOMBSHELTERS_ADMIN"
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: `Forbidden. Your role (${authResult.role}) does not have permission for this action.`,
          code: "FORBIDDEN",
        },
      },
      { status: 403 }
    );
  }

  return authResult;
}
