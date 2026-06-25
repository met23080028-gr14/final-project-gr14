"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Customer } from "./types";

const LS_KEY = "poseidon_customer";

interface CustomerContextValue {
  customer: Customer | null;
  /** True once localStorage has been read (avoids SSR hydration mismatch). */
  loaded: boolean;
  login: (c: Customer) => void;
  logout: () => void;
  /** PATCH mutable profile fields and sync localStorage. Throws on API error. */
  updateCustomer: (updates: Partial<Pick<Customer, "gender" | "birthday" | "email">>) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setCustomer(JSON.parse(raw) as Customer);
    } catch {
      // corrupted storage — ignore
    }
    setLoaded(true);
  }, []);

  const login = useCallback((c: Customer) => {
    localStorage.setItem(LS_KEY, JSON.stringify(c));
    setCustomer(c);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setCustomer(null);
  }, []);

  const updateCustomer = useCallback(
    async (updates: Partial<Pick<Customer, "gender" | "birthday" | "email">>) => {
      if (!customer) throw new Error("Not logged in");
      const res = await fetch("/api/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customer.phone, ...updates }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Update failed");
      }
      const updated = await res.json() as Customer;
      login(updated);
    },
    [customer, login]
  );

  return (
    <CustomerContext.Provider value={{ customer, loaded, login, logout, updateCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerContext(): CustomerContextValue {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomerContext must be used within CustomerProvider");
  return ctx;
}
