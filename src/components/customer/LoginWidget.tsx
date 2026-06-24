"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import type { Customer } from "@/lib/types";

interface Props {
  onGuest: () => void;
}

export function LoginWidget({ onGuest }: Props) {
  const { t } = useTranslation();
  const { login } = useCustomerContext();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^0\d{9}$/.test(phone.replace(/\s/g, ""))) {
      setError(t("loginErrPhone"));
      return;
    }
    if (!name.trim()) {
      setError(t("loginErrName"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, birthday }),
      });
      const data = await res.json() as Customer & { error?: string };
      if (!res.ok) {
        setError(data.error ?? t("errServer"));
        return;
      }
      login(data);
    } catch {
      setError(t("errServer"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">{t("loginTitle")}</h2>
      <p className="mt-1 text-sm text-gray-600">{t("loginSubtitle")}</p>

      {/* Prototype disclaimer */}
      <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
        {t("loginPrototypeNote")}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        <Field label={t("labelPhone")} htmlFor="lw-phone">
          <input
            id="lw-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("placeholderPhone")}
            required
            className={inputCls}
          />
        </Field>

        <Field label={t("labelName")} htmlFor="lw-name">
          <input
            id="lw-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("placeholderName")}
            required
            className={inputCls}
          />
        </Field>

        <Field label={t("loginLabelBirthday")} htmlFor="lw-birthday">
          <input
            id="lw-birthday"
            type="text"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            placeholder={t("loginPlaceholderBirthday")}
            maxLength={5}
            className={inputCls}
          />
        </Field>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
          >
            {submitting ? t("loading") : t("loginBtnSubmit")}
          </button>
          <button
            type="button"
            onClick={onGuest}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t("loginBtnGuest")}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}
