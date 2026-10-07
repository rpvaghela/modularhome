"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Download,
  ShoppingBag,
  FileText,
  KeyRound,
  RefreshCw,
  Loader2,
  Activity,
  Send,
  Ban,
  Check,
} from "lucide-react";

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Edit Profile Modal
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fetchCustomerDetail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
        setEditName(json.customer?.name || "");
        setEditPhone(json.customer?.phone || "");
      }
    } catch (err) {
      console.error("Failed to load customer details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetail();
    }
  }, [customerId]);

  const executeAction = async (action: string, payload: any = {}) => {
    setActionLoading(action);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ text: json.message || "Action completed successfully." });
        fetchCustomerDetail();
      } else {
        throw new Error(json.error?.message || "Failed to execute action.");
      }
    } catch (err: any) {
      setActionMessage({ text: err?.message || "Action failed.", isError: true });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("save-profile");
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      const json = await res.json();
      if (json.success) {
        setEditOpen(false);
        setActionMessage({ text: "Profile updated successfully." });
        fetchCustomerDetail();
      } else {
        throw new Error(json.error?.message || "Update failed.");
      }
    } catch (err: any) {
      setActionMessage({ text: err?.message || "Update failed.", isError: true });
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#fcb907]" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#101114]">
          Loading Customer Profile...
        </span>
      </div>
    );
  }

  if (!data?.customer) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-[#101114]">Customer Not Found</h3>
        <Link
          href="/admin/customers"
          className="inline-block bg-[#fcb907] text-[#101114] font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
        >
          ← Return to Customers List
        </Link>
      </div>
    );
  }

  const { customer, orders = [], downloads = [], events = [] } = data;

  const totalPaid = orders
    .filter((o: any) => o.payment_status === "PAID")
    .reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Back link & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#101114]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers Directory</span>
        </Link>
        <button
          onClick={fetchCustomerDetail}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#101114] bg-white px-3 py-1.5 rounded-xl border border-gray-200 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            actionMessage.isError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {actionMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Customer Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        {!customer.email_verified && (
          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-start sm:items-center gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold">Email Verification Pending: </span>
                <span>
                  This user has not clicked the email link. You can verify their account directly to sync with the main website.
                </span>
              </div>
            </div>
            <button
              onClick={() => executeAction("manual-verify")}
              disabled={actionLoading === "manual-verify"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{actionLoading === "manual-verify" ? "Verifying..." : "Verify & Activate Now"}</span>
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase">{customer.id}</span>
              {customer.status === "ACTIVE" ? (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Account
                </span>
              ) : (
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                  Disabled
                </span>
              )}
              {customer.email_verified ? (
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" /> Verified Email
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" /> Unverified Email
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">{customer.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-[#101114]">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 shrink-0">
            <div className="text-center px-3 border-r border-gray-200">
              <div className="text-lg font-black text-[#101114]">{orders.length}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Orders</div>
            </div>
            <div className="text-center px-3 border-r border-gray-200">
              <div className="text-lg font-black text-[#d97706]">${totalPaid.toLocaleString()}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Paid LTV</div>
            </div>
            <div className="text-center px-3">
              <div className="text-lg font-black text-[#101114]">{downloads.length}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Blueprints</div>
            </div>
          </div>
        </div>

        {/* Administrative Action Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setEditOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-[#101114] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Edit Profile
          </button>

          {!customer.email_verified && (
            <>
              <button
                onClick={() => executeAction("manual-verify")}
                disabled={actionLoading === "manual-verify"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Manually verify this customer account and sync verification status with main website"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{actionLoading === "manual-verify" ? "Verifying..." : "Verify Account (Admin Sync)"}</span>
              </button>

              <button
                onClick={() => executeAction("resend-verification")}
                disabled={actionLoading === "resend-verification"}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-amber-600" />
                <span>Resend Verification Email</span>
              </button>
            </>
          )}

          <button
            onClick={() => executeAction("send-reset-password")}
            disabled={actionLoading === "send-reset-password"}
            className="bg-gray-100 hover:bg-gray-200 text-[#101114] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-3.5 h-3.5 text-gray-600" />
            <span>Send Password Reset Email</span>
          </button>

          <button
            onClick={() => executeAction("revoke-sessions")}
            disabled={actionLoading === "revoke-sessions"}
            className="bg-gray-100 hover:bg-gray-200 text-[#101114] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Shield className="w-3.5 h-3.5 text-gray-600" />
            <span>Revoke Active Sessions</span>
          </button>

          <button
            onClick={() => executeAction("toggle-status")}
            disabled={actionLoading === "toggle-status"}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-auto ${
              customer.status === "ACTIVE"
                ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>{customer.status === "ACTIVE" ? "Disable Account" : "Enable Account"}</span>
          </button>
        </div>
      </div>

      {/* Grid: Orders & Downloads vs Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders & Blueprints (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#fcb907]" />
                <h3 className="text-base font-black text-[#101114]">Order History ({orders.length})</h3>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
                No orders placed by this customer yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border-t border-gray-100">
                {orders.map((ord: any) => (
                  <div key={ord.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#101114]">{ord.order_number}</span>
                        {ord.payment_status === "PAID" ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            Paid
                          </span>
                        ) : ord.payment_status === "REFUNDED" ? (
                          <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                            Refunded
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {ord.order_items?.[0]?.title || "Blueprint Package"} • {new Date(ord.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-sm font-black text-[#101114]">
                        ${Number(ord.total_amount).toLocaleString()} USD
                      </div>
                      <Link
                        href={`/account/invoices/${ord.id}`}
                        target="_blank"
                        className="text-[11px] text-[#d97706] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Invoice</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blueprint Downloads */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#fcb907]" />
              <h3 className="text-base font-black text-[#101114]">Active Download Entitlements ({downloads.length})</h3>
            </div>

            {downloads.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
                No active download licenses.
              </div>
            ) : (
              <div className="space-y-3">
                {downloads.map((dl: any) => (
                  <div
                    key={dl.id}
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#101114]">
                        {dl.items?.[0]?.title || "Architectural Blueprint Kit"}
                      </h4>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Token: <span className="font-mono">{dl.download_token?.slice(0, 16)}...</span> • Used:{" "}
                        {dl.download_count || 0}/{dl.max_downloads || 5}
                      </div>
                    </div>
                    <a
                      href={`/api/downloads/${dl.download_token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      Download PDF
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer Activity Timeline (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#fcb907]" />
            <h3 className="text-base font-black text-[#101114]">Customer Timeline</h3>
          </div>

          {events.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
              No timeline events recorded.
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {events.map((evt: any) => {
                let detailsObj: any = null;
                if (evt.details) {
                  if (typeof evt.details === "string") {
                    try {
                      detailsObj = JSON.parse(evt.details);
                    } catch {
                      detailsObj = { notes: evt.details };
                    }
                  } else if (typeof evt.details === "object") {
                    detailsObj = evt.details;
                  }
                }

                const eventType = (evt.event_type || "ACTIVITY").toUpperCase();
                const isCreation = eventType.includes("CREATE") || eventType.includes("SIGNUP");
                const isOrder = eventType.includes("ORDER") || eventType.includes("PURCHASE");
                const isDownload = eventType.includes("DOWNLOAD");
                const isAuth = eventType.includes("LOGIN") || eventType.includes("PASSWORD") || eventType.includes("SESSION");

                return (
                  <div key={evt.id} className="relative pl-7 text-xs space-y-2 group">
                    <div
                      className={`absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        isCreation
                          ? "bg-emerald-500"
                          : isOrder
                          ? "bg-[#fcb907]"
                          : isDownload
                          ? "bg-blue-500"
                          : isAuth
                          ? "bg-purple-500"
                          : "bg-gray-400"
                      }`}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md ${
                            isCreation
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : isOrder
                              ? "bg-amber-50 text-amber-900 border border-amber-200"
                              : isDownload
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {evt.event_type.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="text-gray-500 text-[11px] mt-1">
                        By <span className="font-semibold text-[#101114]">{evt.actor_name || evt.actor_type || "Customer"}</span> •{" "}
                        {new Date(evt.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })},{" "}
                        {new Date(evt.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Formatted Human-Readable Event Details */}
                    {detailsObj && Object.keys(detailsObj).length > 0 && (
                      <div className="bg-[#f8f9fa] p-3 rounded-2xl border border-[#e7e9ee] space-y-2 text-[11px]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {detailsObj.email && (
                            <div className="flex items-center gap-1.5 text-gray-700 bg-white p-2 rounded-xl border border-gray-100 shadow-2xs">
                              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate font-medium">{detailsObj.email}</span>
                            </div>
                          )}

                          {detailsObj.phone && (
                            <div className="flex items-center gap-1.5 text-gray-700 bg-white p-2 rounded-xl border border-gray-100 shadow-2xs">
                              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate font-medium">{detailsObj.phone}</span>
                            </div>
                          )}

                          {detailsObj.terms_version && (
                            <div className="flex items-center gap-1.5 text-gray-700 bg-white p-2 rounded-xl border border-gray-100 shadow-2xs">
                              <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate font-medium">Terms Accepted: {detailsObj.terms_version}</span>
                            </div>
                          )}

                          {detailsObj.order_number && (
                            <div className="flex items-center gap-1.5 text-gray-700 bg-white p-2 rounded-xl border border-gray-100 shadow-2xs">
                              <ShoppingBag className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                              <span className="truncate font-medium">Order: {detailsObj.order_number}</span>
                            </div>
                          )}

                          {/* Render any additional non-standard key-values */}
                          {Object.entries(detailsObj)
                            .filter(([k]) => !["email", "phone", "terms_version", "order_number", "auth_user_id"].includes(k))
                            .map(([key, val]) => (
                              <div key={key} className="flex items-center gap-1.5 text-gray-700 bg-white p-2 rounded-xl border border-gray-100 shadow-2xs">
                                <span className="font-bold uppercase text-[9px] text-gray-400 font-mono">
                                  {key.replace(/_/g, " ")}:
                                </span>
                                <span className="truncate font-medium">{typeof val === "object" ? JSON.stringify(val) : String(val)}</span>
                              </div>
                            ))}
                        </div>

                        {detailsObj.auth_user_id && (
                          <div className="pt-1 text-[10px] text-gray-400 font-mono truncate flex items-center gap-1">
                            <span className="text-gray-300">ID:</span>
                            <span className="truncate">{detailsObj.auth_user_id}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-black text-[#101114]">Edit Customer Information</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#101114] focus:bg-white focus:outline-none focus:border-[#fcb907]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#101114] focus:bg-white focus:outline-none focus:border-[#fcb907]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "save-profile"}
                  className="bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black px-5 py-2.5 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === "save-profile" ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
