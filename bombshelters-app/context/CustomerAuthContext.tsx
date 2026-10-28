"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CustomerUser {
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

export interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<CustomerUser | null>;
  logout: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType>({
  customer: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => null,
  logout: async () => {},
});

export const CUSTOMER_AUTH_EVENT = "bombshelters_customer_auth_changed";

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchSession = useCallback(async (): Promise<CustomerUser | null> => {
    try {
      const res = await fetch("/api/customer/auth/me", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCustomer(data.user);
          return data.user;
        }
      }
      setCustomer(null);
      return null;
    } catch {
      setCustomer(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();

    const handleAuthEvent = () => {
      fetchSession();
    };

    window.addEventListener(CUSTOMER_AUTH_EVENT, handleAuthEvent);

    const handleFocus = () => {
      fetchSession();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener(CUSTOMER_AUTH_EVENT, handleAuthEvent);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchSession]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/customer/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setCustomer(null);
      window.dispatchEvent(new Event(CUSTOMER_AUTH_EVENT));
      router.push("/account/login");
    }
  }, [router]);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        refreshUser: fetchSession,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function notifyCustomerAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CUSTOMER_AUTH_EVENT));
  }
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
