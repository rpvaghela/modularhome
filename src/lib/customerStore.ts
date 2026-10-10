import fs from "fs";
import path from "path";
import crypto from "crypto";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export interface Customer {
  id: string;
  auth_user_id?: string | null;
  email: string;
  password_hash: string;
  name: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  billing_address?: Record<string, unknown> | null;
  status: "ACTIVE" | "DISABLED";
  email_verified: boolean;
  verification_token?: string | null;
  verification_token_expires_at?: string | null;
  terms_accepted_at?: string | null;
  terms_version?: string | null;
  reset_token?: string | null;
  reset_token_expires_at?: string | null;
  provider?: string;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TermsConsent {
  id: string;
  customer_id: string;
  email: string;
  policy_version: string;
  ip_address: string;
  user_agent?: string | null;
  accepted_at: string;
}

export interface CustomerSession {
  id: string;
  session_token: string;
  customer_id: string;
  expires_at: number;
  created_at: string;
}

export interface CustomerEvent {
  id: string;
  customer_id: string;
  event_type: string;
  actor_type: "CUSTOMER" | "ADMIN" | "SYSTEM";
  actor_id?: string | null;
  actor_name?: string | null;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  template_type: string;
  subject: string;
  customer_id?: string | null;
  order_id?: string | null;
  status: "SENT" | "FAILED" | "SIMULATED";
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface WebhookLog {
  id: string;
  stripe_event_id: string;
  event_type: string;
  order_id?: string | null;
  status: "RECEIVED" | "PROCESSED" | "FAILED" | "IGNORED";
  error_message?: string | null;
  payload?: Record<string, unknown>;
  created_at: string;
}

const CUSTOMERS_FILE = path.join(process.cwd(), "src", "data", "custom_customers.json");
const TERMS_FILE = path.join(process.cwd(), "src", "data", "custom_terms_consents.json");
const SESSIONS_FILE = path.join(process.cwd(), "src", "data", "custom_customer_sessions.json");
const EVENTS_FILE = path.join(process.cwd(), "src", "data", "custom_customer_events.json");
const WEBHOOKS_FILE = path.join(process.cwd(), "src", "data", "custom_webhooks.json");

function ensureFile(filePath: string, defaultContent = "[]") {
  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, defaultContent, "utf-8");
  }
}

// ---------------------------------------------------------------------------
// Customer Store Operations
// ---------------------------------------------------------------------------

export function readLocalCustomers(): Customer[] {
  try {
    ensureFile(CUSTOMERS_FILE);
    const data = fs.readFileSync(CUSTOMERS_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

export function writeLocalCustomers(customers: Customer[]): void {
  try {
    ensureFile(CUSTOMERS_FILE);
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing customers to local store:", e);
  }
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const cleanEmail = email.toLowerCase().trim();
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();
      if (!error && data) return data as Customer;
    } catch (e) {
      console.warn("Supabase getCustomerByEmail note:", e);
    }
  }
  const locals = readLocalCustomers();
  return locals.find((c) => (c.email || "").toLowerCase() === cleanEmail) || null;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) return data as Customer;
    } catch (e) {
      console.warn("Supabase getCustomerById note:", e);
    }
  }
  const locals = readLocalCustomers();
  return locals.find((c) => c.id === id) || null;
}

export async function getCustomerByAuthUserId(authUserId: string): Promise<Customer | null> {
  if (!authUserId) return null;
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("auth_user_id", authUserId)
        .maybeSingle();
      if (!error && data) return data as Customer;
    } catch (e) {
      console.warn("Supabase getCustomerByAuthUserId note:", e);
    }
  }
  const locals = readLocalCustomers();
  return locals.find((c) => c.auth_user_id === authUserId) || null;
}

export async function getCustomerByVerificationToken(token: string): Promise<Customer | null> {
  if (!token) return null;
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("verification_token", token)
        .maybeSingle();
      if (!error && data) return data as Customer;
    } catch (e) {
      console.warn("Supabase getCustomerByVerificationToken note:", e);
    }
  }
  const locals = readLocalCustomers();
  return locals.find((c) => c.verification_token === token) || null;
}

export async function getCustomerByResetToken(token: string): Promise<Customer | null> {
  if (!token) return null;
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("reset_token", token)
        .maybeSingle();
      if (!error && data) return data as Customer;
    } catch (e) {
      console.warn("Supabase getCustomerByResetToken note:", e);
    }
  }
  const locals = readLocalCustomers();
  return locals.find((c) => c.reset_token === token) || null;
}

export async function saveCustomer(customer: Customer): Promise<Customer> {
  // Ensure valid UUID for customer.id (required by Supabase PostgreSQL UUID column)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customer.id);
  if (!isUuid) {
    if (customer.auth_user_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customer.auth_user_id)) {
      customer.id = customer.auth_user_id;
    } else {
      customer.id = crypto.randomUUID();
    }
  }

  // Always update local fallback
  const locals = readLocalCustomers();
  const idx = locals.findIndex((c) => c.id === customer.id || c.email === customer.email);
  if (idx >= 0) {
    locals[idx] = { ...locals[idx], ...customer, updated_at: new Date().toISOString() };
  } else {
    locals.unshift(customer);
  }
  writeLocalCustomers(locals);

  if (isSupabaseConfigured()) {
    try {
      // Map columns exactly matching Supabase customers table schema
      const supabasePayload: any = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        password_hash: customer.password_hash,
        phone: customer.phone || null,
        status: customer.status || "ACTIVE",
        email_verified: Boolean(customer.email_verified),
        verification_token: customer.verification_token || null,
        reset_token: customer.reset_token || null,
        reset_token_expires_at: customer.reset_token_expires_at || null,
        provider: customer.provider || "EMAIL",
        last_login_at: customer.last_login_at || null,
        created_at: customer.created_at || new Date().toISOString(),
        updated_at: customer.updated_at || new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("customers")
        .upsert(supabasePayload)
        .select()
        .single();
      if (!error && data) return { ...customer, ...data };
      if (error) console.warn("Supabase saveCustomer error note:", error.message);
    } catch (e) {
      console.warn("Supabase customer upsert fallback to local:", e);
    }
  }
  return customer;
}

export async function deleteCustomer(idOrEmail: string): Promise<boolean> {
  const locals = readLocalCustomers();
  const customer = locals.find(
    (c) => c.id === idOrEmail || c.email.toLowerCase() === idOrEmail.toLowerCase()
  );
  const targetId = customer?.id || idOrEmail;
  const targetEmail = customer?.email || idOrEmail;
  const authUserId = customer?.auth_user_id;

  // 1. Remove from local customers
  const filtered = locals.filter(
    (c) => c.id !== targetId && c.email.toLowerCase() !== targetEmail.toLowerCase()
  );
  writeLocalCustomers(filtered);

  // 2. Revoke all active sessions
  await revokeAllCustomerSessions(targetId);

  // 3. Clean up events locally
  ensureFile(EVENTS_FILE);
  try {
    const rawEvents = fs.readFileSync(EVENTS_FILE, "utf-8");
    const events: CustomerEvent[] = JSON.parse(rawEvents) || [];
    const filteredEvents = events.filter((e) => e.customer_id !== targetId);
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(filteredEvents, null, 2), "utf-8");
  } catch {}

  // 4. Clean up terms consents locally
  ensureFile(TERMS_FILE);
  try {
    const rawTerms = fs.readFileSync(TERMS_FILE, "utf-8");
    const terms: TermsConsent[] = JSON.parse(rawTerms) || [];
    const filteredTerms = terms.filter(
      (t) => t.customer_id !== targetId && t.email.toLowerCase() !== targetEmail.toLowerCase()
    );
    fs.writeFileSync(TERMS_FILE, JSON.stringify(filteredTerms, null, 2), "utf-8");
  } catch {}

  // 5. Delete from Supabase Database & Supabase Auth if configured
  if (isSupabaseConfigured()) {
    try {
      const isTargetIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
      
      // Delete from customers table
      if (isTargetIdUuid) {
        await supabaseAdmin.from("customers").delete().eq("id", targetId);
      }
      if (targetEmail && targetEmail.includes("@")) {
        await supabaseAdmin.from("customers").delete().eq("email", targetEmail.toLowerCase().trim());
      }

      // Delete customer sessions
      await supabaseAdmin.from("customer_sessions").delete().eq("customer_id", targetId);

      // Delete customer events
      try {
        await supabaseAdmin.from("customer_events").delete().eq("customer_id", targetId);
      } catch {}

      // Delete from Supabase Auth
      const userToDelete = authUserId || (isTargetIdUuid ? targetId : null);
      if (userToDelete && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userToDelete)) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(userToDelete);
        } catch {}
      }
    } catch (e) {
      console.warn("Supabase deleteCustomer note:", e);
    }
  }

  return true;
}

export async function getAllCustomers(params?: {
  search?: string;
  status?: string;
  verified?: boolean;
}): Promise<Customer[]> {
  let list: Customer[] = [];
  if (isSupabaseConfigured()) {
    try {
      let query = supabaseAdmin
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (params?.status && params.status !== "ALL") {
        query = query.eq("status", params.status);
      }
      if (typeof params?.verified === "boolean") {
        query = query.eq("email_verified", params.verified);
      }

      const { data, error } = await query;
      if (!error && data) {
        list = data as Customer[];
      }
    } catch (e) {
      console.warn("Supabase getAllCustomers error, using local fallback:", e);
    }
  }

  if (list.length === 0) {
    list = readLocalCustomers();
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
    );
  }

  return list;
}

// ---------------------------------------------------------------------------
// Terms & Conditions Consent Audit
// ---------------------------------------------------------------------------

export async function saveTermsConsent(consent: Omit<TermsConsent, "id" | "accepted_at"> & { id?: string; accepted_at?: string }): Promise<TermsConsent> {
  const newConsent: TermsConsent = {
    id: consent.id || `tc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    customer_id: consent.customer_id,
    email: consent.email.toLowerCase().trim(),
    policy_version: consent.policy_version || "v1.0",
    ip_address: consent.ip_address || "unknown",
    user_agent: consent.user_agent || null,
    accepted_at: consent.accepted_at || new Date().toISOString(),
  };

  ensureFile(TERMS_FILE);
  try {
    const raw = fs.readFileSync(TERMS_FILE, "utf-8");
    const list: TermsConsent[] = JSON.parse(raw) || [];
    list.unshift(newConsent);
    fs.writeFileSync(TERMS_FILE, JSON.stringify(list.slice(0, 5000), null, 2), "utf-8");
  } catch (e) {
    console.warn("Local terms consent error:", e);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("terms_consents").insert(newConsent);
    } catch (e) {
      console.warn("Supabase saveTermsConsent note:", e);
    }
  }

  return newConsent;
}

export async function getTermsConsentsByCustomerId(customerId: string): Promise<TermsConsent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("terms_consents")
        .select("*")
        .eq("customer_id", customerId)
        .order("accepted_at", { ascending: false });
      if (!error && data && data.length > 0) return data as TermsConsent[];
    } catch {}
  }

  ensureFile(TERMS_FILE);
  try {
    const raw = fs.readFileSync(TERMS_FILE, "utf-8");
    const list: TermsConsent[] = JSON.parse(raw) || [];
    return list.filter((t) => t.customer_id === customerId);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Customer Sessions
// ---------------------------------------------------------------------------

export async function saveCustomerSession(session: CustomerSession): Promise<void> {
  ensureFile(SESSIONS_FILE);
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
    const list: CustomerSession[] = JSON.parse(raw) || [];
    list.unshift(session);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list.slice(0, 1000), null, 2), "utf-8");
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("customer_sessions").insert(session);
    } catch (e) {
      console.warn("Supabase saveCustomerSession note:", e);
    }
  }
}

export async function deleteCustomerSession(token: string): Promise<void> {
  ensureFile(SESSIONS_FILE);
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
    let list: CustomerSession[] = JSON.parse(raw) || [];
    list = list.filter((s) => s.session_token !== token);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("customer_sessions").delete().eq("session_token", token);
    } catch {}
  }
}

export async function revokeAllCustomerSessions(customerId: string): Promise<void> {
  ensureFile(SESSIONS_FILE);
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
    let list: CustomerSession[] = JSON.parse(raw) || [];
    list = list.filter((s) => s.customer_id !== customerId);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("customer_sessions").delete().eq("customer_id", customerId);
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// Customer Activity Events Timeline
// ---------------------------------------------------------------------------

export async function logCustomerEvent(event: Omit<CustomerEvent, "id" | "created_at">): Promise<void> {
  const newEvent: CustomerEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...event,
    created_at: new Date().toISOString(),
  };

  ensureFile(EVENTS_FILE);
  try {
    const raw = fs.readFileSync(EVENTS_FILE, "utf-8");
    const list: CustomerEvent[] = JSON.parse(raw) || [];
    list.unshift(newEvent);
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(list.slice(0, 5000), null, 2), "utf-8");
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("customer_events").insert(newEvent);
    } catch (e) {
      console.warn("Supabase logCustomerEvent note:", e);
    }
  }
}

export async function getCustomerEvents(customerId: string): Promise<CustomerEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("customer_events")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as CustomerEvent[];
    } catch {}
  }

  ensureFile(EVENTS_FILE);
  try {
    const raw = fs.readFileSync(EVENTS_FILE, "utf-8");
    const list: CustomerEvent[] = JSON.parse(raw) || [];
    return list.filter((e) => e.customer_id === customerId);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Webhook & Idempotency Store
// ---------------------------------------------------------------------------

export async function isWebhookProcessed(stripeEventId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabaseAdmin
        .from("payment_webhooks")
        .select("id, status")
        .eq("stripe_event_id", stripeEventId)
        .maybeSingle();
      if (data && data.status === "PROCESSED") return true;
    } catch {}
  }

  ensureFile(WEBHOOKS_FILE);
  try {
    const raw = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
    const list: WebhookLog[] = JSON.parse(raw) || [];
    return list.some((w) => w.stripe_event_id === stripeEventId && w.status === "PROCESSED");
  } catch {
    return false;
  }
}

export async function logWebhookEvent(log: Omit<WebhookLog, "id" | "created_at">): Promise<void> {
  const newLog: WebhookLog = {
    id: `whk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...log,
    created_at: new Date().toISOString(),
  };

  ensureFile(WEBHOOKS_FILE);
  try {
    const raw = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
    const list: WebhookLog[] = JSON.parse(raw) || [];
    const idx = list.findIndex((w) => w.stripe_event_id === log.stripe_event_id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...newLog };
    } else {
      list.unshift(newLog);
    }
    fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify(list.slice(0, 2000), null, 2), "utf-8");
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("payment_webhooks").upsert(newLog);
    } catch (e) {
      console.warn("Supabase logWebhookEvent note:", e);
    }
  }
}
