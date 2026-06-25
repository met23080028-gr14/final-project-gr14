"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { ADMIN_CREDENTIALS } from "@/lib/constants";

const STORAGE_KEY = "poseidon_admin_auth";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoggedIn(localStorage.getItem(STORAGE_KEY) === "1");
    setHydrated(true);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem(STORAGE_KEY, "1");
      setLoggedIn(true);
      setError(null);
    } else {
      setError(t("adminLoginError"));
    }
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setLoggedIn(false);
    setUsername("");
    setPassword("");
  }

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
            ⚠️ {t("adminLoginPrototypeNote")}
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mb-3 text-3xl">🔒</div>
              <h1 className="text-xl font-bold text-gray-900">{t("adminLoginTitle")}</h1>
              <p className="mt-1 text-sm text-gray-500">{t("adminLoginSubtitle")}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {t("adminLoginUsername")}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {t("adminLoginPassword")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                />
              </div>
              {error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-brand-red px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-red-dark"
              >
                {t("adminLoginBtn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-xs text-amber-700">🔑 {t("adminLoginTitle")}</p>
          <button
            onClick={handleLogout}
            className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-50"
          >
            {t("adminLoginLogoutBtn")}
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
