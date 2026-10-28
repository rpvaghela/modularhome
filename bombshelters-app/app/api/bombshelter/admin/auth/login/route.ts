import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import {
  createBombShelterSession,
  verifyPassword,
  AdminSessionUser,
} from "@/lib/auth";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginAttempts,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Enforce Serverless & Shared DB Rate Limiting
    const rateCheck = await checkLoginRateLimit(normalizedEmail, ip);
    if (rateCheck.isLocked) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Too many login attempts. Access is temporarily locked. Please try again in ${
              rateCheck.lockedMinutesRemaining || 15
            } minutes.`,
            code: "TOO_MANY_REQUESTS",
          },
        },
        { status: 429 }
      );
    }

    let authenticatedUser: AdminSessionUser | null = null;

    // 2. Check Supabase admin_users table if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: dbUser, error } = await supabaseAdmin
          .from("admin_users")
          .select("id, email, password_hash, name, role, status")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (!error && dbUser && dbUser.status === "ACTIVE") {
          const roleUpper = (dbUser.role || "").toUpperCase();
          if (roleUpper === "BOMBSHELTERS_ADMIN" || roleUpper === "SUPER_ADMIN") {
            const matches = await verifyPassword(password, dbUser.password_hash);
            if (matches) {
              authenticatedUser = {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name || "BombShelters Administrator",
                role: roleUpper === "BOMBSHELTERS_ADMIN" ? "BOMBSHELTERS_ADMIN" : "SUPER_ADMIN",
              };
            }
          }
        }
      } catch (dbErr) {
        console.warn("[BombShelter Auth] Supabase admin auth check note:", dbErr);
      }
    }

    // 3. Fallback to environment variable emergency credentials
    if (!authenticatedUser) {
      const configuredEmail = (
        process.env.BOMBSHELTER_ADMIN_EMAIL || "admin@bombshelters.com"
      ).toLowerCase().trim();

      const configuredPass =
        process.env.BOMBSHELTER_ADMIN_PASSWORD ||
        (process.env.NODE_ENV === "production" ? "" : "BombShelter2026!");

      if (configuredPass && normalizedEmail === configuredEmail && password === configuredPass) {
        authenticatedUser = {
          id: "bs-admin-root",
          email: configuredEmail,
          name: "BombShelter Command Admin",
          role: "BOMBSHELTERS_ADMIN",
        };
      }
    }

    // 4. Handle authentication failure & record for rate limiting
    if (!authenticatedUser) {
      const { isNowLocked, remainingAttempts } = await recordFailedLogin(normalizedEmail, ip);

      if (isNowLocked) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Too many failed attempts. Account has been temporarily locked for 15 minutes.",
              code: "ACCOUNT_LOCKED",
            },
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Invalid email or defense command password. ${remainingAttempts} attempt(s) remaining.`,
            code: "INVALID_CREDENTIALS",
          },
        },
        { status: 401 }
      );
    }

    // 5. Authentication succeeded — clear failed attempt records
    await clearLoginAttempts(normalizedEmail, ip);

    // 6. Issue cryptographic JWT session token and HttpOnly cookie
    const token = await createBombShelterSession(authenticatedUser.id, authenticatedUser);

    return NextResponse.json({
      success: true,
      user: authenticatedUser,
      token,
      message: "BombShelter Command authentication successful.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { message: error?.message || "Authentication error." } },
      { status: 500 }
    );
  }
}
