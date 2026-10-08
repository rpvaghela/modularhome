let fs: any = null;
let path: any = null;

if (typeof window === "undefined") {
  try {
    fs = require("fs");
    path = require("path");
  } catch {}
}

const DATA_DIR = path ? path.join(process.cwd(), "src", "data") : "";
const ORDERS_FILE = path ? path.join(DATA_DIR, "custom_orders.json") : "";

export interface StoredOrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  floor_plan_id?: string;
  product_id?: string;
  preview_image?: string;
}

export interface StoredDownloadAccess {
  id: string;
  download_token: string;
  expires_at: string;
  download_count: number;
  max_downloads: number;
  file_path?: string;
  file_format?: string;
  title?: string;
}

export interface StoredOrder {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  currency: string;
  payment_status: "PAID" | "PENDING" | "REFUNDED" | "FAILED";
  order_status: "COMPLETED" | "PROCESSING" | "CANCELLED";
  order_items: StoredOrderItem[];
  download_access: StoredDownloadAccess[];
  created_at: string;
  updated_at: string;
}

function ensureDataDirectory() {
  if (!fs || !path) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory for orders:", err);
  }
}

export function readOrdersFromStore(): StoredOrder[] {
  if (!fs || !path || !ORDERS_FILE) return [];
  try {
    ensureDataDirectory();
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error reading custom_orders.json:", error);
    return [];
  }
}

export function writeOrdersToStore(orders: StoredOrder[]): void {
  if (!fs || !path || !ORDERS_FILE) return;
  try {
    ensureDataDirectory();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_orders.json:", error);
  }
}

export function saveCustomOrder(orderData: Partial<StoredOrder> & { customer_email: string; total_amount: number }): StoredOrder {
  const orders = readOrdersFromStore();
  const now = new Date().toISOString();
  const existingIdx = orders.findIndex(
    (o) => (orderData.id && o.id === orderData.id) || (orderData.order_number && o.order_number === orderData.order_number)
  );

  const orderNumber = orderData.order_number || (existingIdx >= 0 ? orders[existingIdx].order_number : `MH-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const orderId = orderData.id || (existingIdx >= 0 ? orders[existingIdx].id : `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);

  const fullOrder: StoredOrder = {
    id: orderId,
    order_number: orderNumber,
    customer_id: orderData.customer_id || (existingIdx >= 0 ? orders[existingIdx].customer_id : undefined),
    customer_email: orderData.customer_email.toLowerCase().trim(),
    customer_name: orderData.customer_name || (existingIdx >= 0 ? orders[existingIdx].customer_name : "Customer"),
    customer_phone: orderData.customer_phone || (existingIdx >= 0 ? orders[existingIdx].customer_phone : undefined),
    total_amount: Number(orderData.total_amount || 0),
    currency: orderData.currency || "USD",
    payment_status: orderData.payment_status || "PAID",
    order_status: orderData.order_status || "COMPLETED",
    order_items: Array.isArray(orderData.order_items) ? orderData.order_items : (existingIdx >= 0 ? orders[existingIdx].order_items : []),
    download_access: Array.isArray(orderData.download_access) ? orderData.download_access : (existingIdx >= 0 ? orders[existingIdx].download_access : []),
    created_at: orderData.created_at || (existingIdx >= 0 ? orders[existingIdx].created_at : now),
    updated_at: now,
  };

  if (existingIdx >= 0) {
    orders[existingIdx] = { ...orders[existingIdx], ...fullOrder };
  } else {
    orders.unshift(fullOrder);
  }

  writeOrdersToStore(orders);
  return fullOrder;
}

export function getOrdersByCustomer(customerIdOrEmail: string): StoredOrder[] {
  if (!customerIdOrEmail) return [];
  const clean = customerIdOrEmail.toLowerCase().trim();
  const allOrders = readOrdersFromStore();

  return allOrders.filter(
    (o) =>
      (o.customer_id && o.customer_id.toLowerCase().trim() === clean) ||
      (o.customer_email && o.customer_email.toLowerCase().trim() === clean)
  );
}

export function getOrderByIdOrNumber(idOrNumber: string): StoredOrder | null {
  if (!idOrNumber) return null;
  const clean = idOrNumber.toLowerCase().trim();
  const allOrders = readOrdersFromStore();

  return allOrders.find(
    (o) => o.id.toLowerCase() === clean || o.order_number.toLowerCase() === clean
  ) || null;
}
