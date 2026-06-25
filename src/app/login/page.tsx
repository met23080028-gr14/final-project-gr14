"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import type { Customer } from "@/lib/types";

const PHONE_RE = /^0\d{9}$/;

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useCustomerContext();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});

  function validateField(field: string, value: string): string {
    if (field === "phone") {
      if (!value.trim()) return t("errFieldRequired");
      if (!PHONE_RE.test(value.replace(/\s/g, ""))) return t("loginErrPhone");
    }
    if (field === "name") {
      if (!value.trim()) return t("errFieldRequired");
    }
    if (field === "password") {
      if (!value) return t("errFieldRequired");
      if (value.length < 6) return t("loginErrPassword");
    }
    return "";
  }

  function handleBlur(field: string, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setInlineErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }

  function handleChange(field: string, value: string, setter: (v: string) => void) {
    setter(value);
    if (touched[field]) {
      setInlineErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const allErrors = {
      phone: validateField("phone", phone),
      name: validateField("name", name),
      password: validateField("password", password),
    };
    setTouched({ phone: true, name: true, password: true });
    setInlineErrors(allErrors);
    if (allErrors.phone || allErrors.name || allErrors.password) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, birthday }),
      });
      const data = (await res.json()) as Customer & { error?: string };
      if (!res.ok) {
        setSubmitError(data.error ?? t("errServer"));
        return;
      }
      login(data);
      router.push("/");
    } catch {
      setSubmitError(t("errServer"));
    } finally {
      setSubmitting(false);
    }
  }

  // password collected for validation UX only — not transmitted
  void password;

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-sm">
        {/* Logo + title */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo-poseidon.webp"
            alt="Buffet Poseidon"
            width={64}
            height={64}
            className="rounded-xl object-contain shadow-lg"
            priority
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
              Buffet Poseidon
            </p>
            <h1 className="mt-1 text-2xl font-black text-gray-900">{t("loginTitle")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("loginSubtitle")}</p>
          </div>
        </div>

        {/* Prototype disclaimer */}
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700">
          {t("loginPrototypeNote")}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="lp-phone" className="block text-sm font-semibold text-gray-700">
                {t("labelPhone")} <span className="text-red-500">*</span>
              </label>
              <input
                id="lp-phone"
                type="tel"
                value={phone}
                onChange={(e) => handleChange("phone", e.target.value, setPhone)}
                onBlur={(e) => handleBlur("phone", e.target.value)}
                placeholder={t("placeholderPhone")}
                required
                className={inlineErrors.phone ? errorInputCls : inputCls}
              />
              {inlineErrors.phone && (
                <p className="text-xs text-red-600">{inlineErrors.phone}</p>
              )}
            </div>

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="lp-name" className="block text-sm font-semibold text-gray-700">
                {t("labelName")} <span className="text-red-500">*</span>
              </label>
              <input
                id="lp-name"
                type="text"
                value={name}
                onChange={(e) => handleChange("name", e.target.value, setName)}
                onBlur={(e) => handleBlur("name", e.target.value)}
                placeholder={t("placeholderName")}
                required
                className={inlineErrors.name ? errorInputCls : inputCls}
              />
              {inlineErrors.name && (
                <p className="text-xs text-red-600">{inlineErrors.name}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="lp-password" className="block text-sm font-semibold text-gray-700">
                {t("loginLabelPassword")} <span className="text-red-500">*</span>
              </label>
              <input
                id="lp-password"
                type="password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value, setPassword)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                placeholder={t("loginPlaceholderPassword")}
                autoComplete="new-password"
                className={inlineErrors.password ? errorInputCls : inputCls}
              />
              {inlineErrors.password && (
                <p className="text-xs text-red-600">{inlineErrors.password}</p>
              )}
            </div>

            {/* Birthday (optional) */}
            <div className="space-y-1.5">
              <label htmlFor="lp-birthday" className="block text-sm font-semibold text-gray-700">
                {t("loginLabelBirthday")}
              </label>
              <input
                id="lp-birthday"
                type="text"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder={t("loginPlaceholderBirthday")}
                maxLength={5}
                className={inputCls}
              />
            </div>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
            >
              {submitting ? t("loading") : t("loginBtnSubmit")}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">hoặc / or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google (demo placeholder) */}
          <button
            type="button"
            onClick={() => alert("Google OAuth — demo placeholder only")}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon />
            {t("loginBtnGoogle")}
          </button>
        </div>

        {/* Continue as guest */}
        <p className="mt-5 text-center text-sm text-gray-500">
          <Link
            href="/"
            className="font-semibold text-brand-red hover:underline"
          >
            {t("loginBtnGuest")} →
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors";

const errorInputCls =
  "w-full rounded-lg border border-red-500 ring-1 ring-red-500 px-3 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
