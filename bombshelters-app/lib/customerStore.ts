import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  password_hash: string;
  email_verified: boolean;
  status: "active" | "suspended" | "pending";
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  saved_plans?: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomerSession {
  id: string;
  session_token: string;
  customer_id: string;
  expires_at: number;
  created_at: string;
}

const CUSTOMERS_FILE = path.join(process.cwd(), "data", "customers.json");
const SESSIONS_FILE = path.join(process.cwd(), "data", "customer_sessions.json");

// Default seeded demo user for testing: user@bombshelters.com / user123
const DEFAULT_DEMO_HASH = bcrypt.hashSync("user123", 10);

const SEEDED_CUSTOMERS: Customer[] = [
  {
    id: "cust-demo-01",
    email: "user@bombshelters.com",
    name: "Johnathan Vance",
    phone: "812-595-4033",
    password_hash: DEFAULT_DEMO_HASH,
    email_verified: true,
    status: "active",
    billing_address: {
      street: "1250 Defense Parkway",
      city: "Indianapolis",
      state: "IN",
      zip: "46201",
      country: "USA",
    },
    saved_plans: ["bunker-apex-20", "steel-fortified-cabin"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(CUSTOMERS_FILE)) {
      fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(SEEDED_CUSTOMERS, null, 2), "utf8");
      return SEEDED_CUSTOMERS;
    }
    const raw = fs.readFileSync(CUSTOMERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEEDED_CUSTOMERS;
  } catch (err) {
    console.error("Error reading customers:", err);
    return SEEDED_CUSTOMERS;
  }
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const customers = await getAllCustomers();
  const normalized = email.trim().toLowerCase();
  return customers.find((c) => c.email.toLowerCase() === normalized) || null;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const customers = await getAllCustomers();
  return customers.find((c) => c.id === id) || null;
}

export async function saveCustomer(customer: Customer): Promise<Customer> {
  ensureDataDir();
  const customers = await getAllCustomers();
  const index = customers.findIndex((c) => c.id === customer.id || c.email.toLowerCase() === customer.email.toLowerCase());

  if (index >= 0) {
    customers[index] = { ...customers[index], ...customer, updated_at: new Date().toISOString() };
  } else {
    customers.push(customer);
  }

  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), "utf8");
  return customer;
}

export async function saveCustomerSession(session: CustomerSession): Promise<void> {
  try {
    ensureDataDir();
    let sessions: CustomerSession[] = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf8");
      sessions = JSON.parse(raw) || [];
    }
    // Remove expired sessions
    const now = Date.now();
    sessions = sessions.filter((s) => s.expires_at > now);
    sessions.push(session);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf8");
  } catch (err) {
    console.warn("Error saving customer session:", err);
  }
}

export async function deleteCustomerSession(token: string): Promise<void> {
  try {
    ensureDataDir();
    if (!fs.existsSync(SESSIONS_FILE)) return;
    const raw = fs.readFileSync(SESSIONS_FILE, "utf8");
    let sessions: CustomerSession[] = JSON.parse(raw) || [];
    sessions = sessions.filter((s) => s.session_token !== token);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf8");
  } catch (err) {
    console.warn("Error deleting customer session:", err);
  }
}

