"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verifiedFilter, setVerifiedFilter] = useState("ALL");
  const [quickVerifyingId, setQuickVerifyingId] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ text: `Customer ${customerToDelete.name} (${customerToDelete.email}) was permanently deleted.` });
        setCustomerToDelete(null);
        fetchCustomers();
      } else {
        throw new Error(data.error?.message || "Failed to delete customer.");
      }
    } catch (err: any) {
      setNotification({ text: err.message || "Failed to delete customer.", isError: true });
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/customers?search=${encodeURIComponent(search)}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
      if (verifiedFilter !== "ALL") url += `&verified=${verifiedFilter === "VERIFIED"}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter, verifiedFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleQuickVerify = async (customerId: string, email: string) => {
    setQuickVerifyingId(customerId);
    setNotification(null);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "manual-verify" }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ text: `Account for ${email} has been verified and synced successfully.` });
        fetchCustomers();
      } else {
        throw new Error(data.error?.message || "Failed to verify account.");
      }
    } catch (err: any) {
      setNotification({ text: err.message || "Failed to verify user.", isError: true });
    } finally {
      setQuickVerifyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in ${
            notification.isError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#e11d1d]">
            <Users className="w-4 h-4" />
            <span>Ecommerce CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
            Customer Accounts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage registered homeowners, purchased blueprint licenses, verification states, and account activity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/admin/customers/export"
            download
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#101114] border border-gray-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#e11d1d]" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={fetchCustomers}
            className="p-2.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-600 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Accounts</div>
            <div className="text-2xl font-black text-[#101114]">{metrics.total}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Verified Emails</div>
            <div className="text-2xl font-black text-emerald-600">{metrics.verified}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Paying Customers</div>
            <div className="text-2xl font-black text-[#e11d1d]">{metrics.purchasers}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Status</div>
            <div className="text-2xl font-black text-[#101114]">{metrics.active}</div>
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#101114] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#e11d1d]"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#101114] focus:outline-none focus:border-[#e11d1d]"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="DISABLED">Disabled Only</option>
          </select>

          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#101114] focus:outline-none focus:border-[#e11d1d]"
          >
            <option value="ALL">All Verification States</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="UNVERIFIED">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#e11d1d]" />
          <span className="text-xs font-mono font-bold">Loading Customers...</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-2">
          <Users className="w-8 h-8 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#101114]">No Customers Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Customers will automatically be listed here upon registering, verifying their email, or completing checkout.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-mono text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Status &amp; Verification</th>
                  <th className="px-5 py-3.5">Orders &amp; LTV</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-black text-[#101114]">{c.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{c.id}</div>
                    </td>
                    <td className="px-5 py-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {c.status === "ACTIVE" ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                            Disabled
                          </span>
                        )}

                        {c.email_verified ? (
                          <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 bg-red-50 text-[#e11d1d] text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                            <AlertCircle className="w-3 h-3 text-[#e11d1d]" /> Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#101114]">
                        {c.orderCount || 0} {c.orderCount === 1 ? "order" : "orders"}
                      </div>
                      <div className="text-[11px] font-black text-[#e11d1d]">
                        ${Number(c.ltv || 0).toLocaleString()} USD LTV
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-[11px]">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!c.email_verified && (
                          <button
                            onClick={() => handleQuickVerify(c.id, c.email)}
                            disabled={quickVerifyingId === c.id}
                            title="Verify customer email and sync status with main website"
                            className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{quickVerifyingId === c.id ? "Verifying..." : "Verify"}</span>
                          </button>
                        )}
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="inline-flex items-center gap-1 font-black text-xs text-[#e11d1d] hover:text-[#b91c1c] hover:underline"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setCustomerToDelete(c)}
                          title="Delete customer account"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-[#101114]">Delete Customer Account?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-gray-900">{customerToDelete.name}</strong> (<span className="font-mono text-gray-700">{customerToDelete.email}</span>)?
              </p>
              <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl text-[11px] text-red-700 mt-2">
                This will delete their customer profile, revoke all active login sessions, and remove their account from both Supabase and the CRM database. This action cannot be undone.
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomer}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? "Deleting..." : "Permanently Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
