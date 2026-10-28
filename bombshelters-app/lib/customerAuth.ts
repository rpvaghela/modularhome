import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import {
  Customer,
  getCustomerById,
  saveCustomerSession,
  deleteCustomerSession,
} from "./customerStore";

export const CUSTOMER_COOKIE_NAME = "bombshelters_customer_session";
export const SESSION_EXPIRY_DAYS = 30;

const JWT_CUSTOMER_SECRET = new TextEncoder().encode(
  process.env.BOMBSHELTER_CUSTOMER_SESSION_SECRET ||
    "bombshelters_customer_jwt_session_secret_key_isolated_2026"
);

export async function hashCustomerPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function verifyCustomerPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export interface CustomerSessionUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  email_verified: boolean;
  status: string;
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  saved_plans?: string[];
  created_at?: string;
}

/**
 * Creates customer session and sets HttpOnly cookie (30-day session)
 */
export async function createCustomerSession(customer: Customer): Promise<string> {
  const expiresAt = Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  // 1. Sign cryptographic JWT token
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

  // 2. Persist session
  await saveCustomerSession({
    id: `csess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    session_token: sessionToken,
    customer_id: customer.id,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  });

  // 3. Set secure HttpOnly cookie
  try {
    const cookieStore = cookies();
    cookieStore.set(CUSTOMER_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expiresAt),
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });
  } catch (err) {
    console.warn("Could not set cookie in current execution context:", err);
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
      const cookieStore = cookies();
      token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
    } catch {
      return null;
    }

    if (!token) {
      return null;
    }

    // Verify cryptographic JWT token
    const { payload } = await jwtVerify(token, JWT_CUSTOMER_SECRET);

    if (!payload || !payload.id) {
      return null;
    }

    // Verify customer still exists and is active
    const customer = await getCustomerById(payload.id as string);
    if (!customer || customer.status === "suspended") {
      return null;
    }

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      email_verified: customer.email_verified,
      status: customer.status,
      billing_address: customer.billing_address,
      saved_plans: customer.saved_plans,
      created_at: customer.created_at,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Clears the customer session cookie
 */
export async function clearCustomerSession(): Promise<void> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
    if (token) {
      await deleteCustomerSession(token);
    }
    cookieStore.delete(CUSTOMER_COOKIE_NAME);
  } catch (err) {
    console.warn("Error clearing customer cookie:", err);
  }
}

