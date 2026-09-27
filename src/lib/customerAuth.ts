import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import {
  Customer,
  getCustomerById,
  saveCustomerSession,
  deleteCustomerSession,
} from "./customerStore";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

const COOKIE_NAME = "customer_session";
const SESSION_EXPIRY_DAYS = 30; // Customer session lasts 30 days

const JWT_CUSTOMER_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "modularhome_customer_jwt_session_secret_key_2026"
);

export async function hashCustomerPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function verifyCustomerPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export interface CustomerSessionUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  email_verified: boolean;
  status: string;
}

/**
 * Creates customer session and writes HttpOnly cookie
 */
export async function createCustomerSession(customer: Customer): Promise<string> {
  const expiresAt = Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  // 1. Sign cryptographic JWT token (Stateless, works on all serverless environments)
  const sessionToken = await new SignJWT({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    email_verified: customer.email_verified,
    status: customer.status,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_DAYS}d`)
    .sign(JWT_CUSTOMER_SECRET);

  await saveCustomerSession({
    id: `csess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    session_token: sessionToken,
    customer_id: customer.id,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expiresAt),
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });
  } catch {
    // In test runner / non-request context, cookies() is not attached to a request store
  }

  return sessionToken;
}

/**
 * Retrieves the currently authenticated customer from the cookie
 */
export async function getCustomerSession(): Promise<CustomerSessionUser | null> {
  try {
    let token: string | undefined;
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      return null;
    }
    if (!token) return null;

    // 1. Fast stateless JWT verification
    try {
      const { payload } = await jwtVerify(token, JWT_CUSTOMER_SECRET);
      if (payload && payload.id && payload.email) {
        return {
          id: payload.id as string,
          email: payload.email as string,
          name: (payload.name as string) || "Customer",
          phone: (payload.phone as string) || null,
          email_verified: !!payload.email_verified,
          status: (payload.status as string) || "ACTIVE",
        };
      }
    } catch (jwtErr) {
      // Fall through to legacy checks if token is not a JWT
    }

    if (isSupabaseConfigured()) {
      try {
        const { data: sessionData, error } = await supabaseAdmin
          .from("customer_sessions")
          .select(`
            session_token,
            expires_at,
            customer_id,
            customers (
              id,
              email,
              name,
              phone,
              email_verified,
              status
            )
          `)
          .eq("session_token", token)
          .maybeSingle();

        if (!error && sessionData && sessionData.customers) {
          if (Number(sessionData.expires_at) < Date.now()) {
            await supabaseAdmin.from("customer_sessions").delete().eq("session_token", token);
            return null;
          }

          const cust = Array.isArray(sessionData.customers)
            ? sessionData.customers[0]
            : sessionData.customers;

          if (cust && cust.status === "ACTIVE") {
            return {
              id: cust.id,
              email: cust.email,
              name: cust.name,
              phone: cust.phone,
              email_verified: cust.email_verified,
              status: cust.status,
            };
          }
        }
      } catch (e) {
        console.warn("Supabase getCustomerSession note:", e);
      }
    }

    // Fallback: check local session file
    const fs = await import("fs");
    const path = await import("path");
    const sessionsFile = path.join(process.cwd(), "src", "data", "custom_customer_sessions.json");
    if (fs.existsSync(sessionsFile)) {
      const list: Array<{ session_token?: string; expires_at?: number; customer_id?: string }> =
        JSON.parse(fs.readFileSync(sessionsFile, "utf-8")) || [];
      const match = list.find((s) => s.session_token === token);
      if (match && match.customer_id && Number(match.expires_at) > Date.now()) {
        const cust = await getCustomerById(match.customer_id);
        if (cust && cust.status === "ACTIVE") {
          return {
            id: cust.id,
            email: cust.email,
            name: cust.name,
            phone: cust.phone,
            email_verified: cust.email_verified,
            status: cust.status,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error in getCustomerSession:", error);
    return null;
  }
}

/**
 * Route protection helper for customer-only endpoints
 */
export async function requireCustomerAuth(): Promise<NextResponse | CustomerSessionUser> {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Authentication required. Please sign in.", code: "UNAUTHORIZED" },
      },
      { status: 401 }
    );
  }
  return session;
}

/**
 * Destroys customer session and removes cookie
 */
export async function destroyCustomerSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      await deleteCustomerSession(token);
    }
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
  } catch (e) {
    console.error("Error destroying customer session:", e);
  }
}
