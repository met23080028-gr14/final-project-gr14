"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { parseBirthdayInput, formatBirthday } from "@/lib/voucher";
import { getCustomerReliability, type CustomerReliability } from "@/lib/booking-utils";
import type { Booking } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-red focus:ring-1 focus:ring-brand-red";

const readOnlyCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { customer, updateCustomer } = useCustomerContext();

  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [birthday, setBirthday] = useState("");
  const [birthdayError, setBirthdayError] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [reliability, setReliability] = useState<CustomerReliability | null>(null);

  // Initialise from customer — stored as MM-DD, displayed as DD-MM
  useEffect(() => {
    if (customer) {
      setGender((customer.gender ?? "") as typeof gender);
      setBirthday(customer.birthday ? formatBirthday(customer.birthday) : "");
      setEmail(customer.email ?? "");
    }
  }, [customer]);

  // Fetch this customer's own bookings to compute reliability
  useEffect(() => {
    if (!customer) return;
    let cancelled = false;
    fetch(`/api/bookings?phone=${encodeURIComponent(customer.phone)}`)
      .then((r) => r.ok ? r.json() as Promise<Booking[]> : Promise.reject())
      .then((bookings) => {
        if (!cancelled) setReliability(getCustomerReliability(customer.phone, bookings));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [customer]);

  if (!customer) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // Validate and convert birthday from DD-MM display → MM-DD storage
    let birthdayInternal = "";
    if (birthday.trim()) {
      const parsed = parseBirthdayInput(birthday);
      if (!parsed) {
        setBirthdayError(t("errInvalidBirthday"));
        return;
      }
      birthdayInternal = parsed;
    }
    setBirthdayError("");

    setSaving(true);
    try {
      await updateCustomer({
        gender: gender || undefined,
        birthday: birthdayInternal,
        email,
      });
      setMsg({ text: t("profileSaveSuccess"), ok: true });
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : t("errServer"), ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("accountProfile")}</h1>
        <p className="mt-0.5 text-sm text-gray-500">{t("loginSubtitle")}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Read-only fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("labelName")} hint={<ReadOnlyHint />}>
            <div className="flex items-center gap-2">
              <input readOnly value={customer.name} className={readOnlyCls} />
            </div>
          </Field>

          <Field label={t("labelPhone")} hint={<ReadOnlyHint />}>
            <input readOnly value={customer.phone} className={readOnlyCls} />
          </Field>

          <Field label={t("profileCustomerId")} hint={<ReadOnlyHint />}>
            <input readOnly value={customer.id} className={`${readOnlyCls} font-mono text-xs`} />
          </Field>

          {reliability && (
            <Field label={t("reliabilityLabel")} hint={<ReadOnlyHint />}>
              <div className={`${readOnlyCls} flex flex-col gap-1`}>
                <span className={`font-semibold ${
                  reliability.label === "good" ? "text-emerald-700" :
                  reliability.label === "medium" ? "text-amber-700" :
                  "text-orange-700"
                }`}>
                  {reliability.label === "good" ? t("reliabilityGood") :
                   reliability.label === "medium" ? t("reliabilityMedium") :
                   t("reliabilityPoor")}
                  {reliability.totalDue > 0 && (
                    <span className="ml-2 font-normal text-gray-500">
                      ({reliability.completedCount}/{reliability.totalDue})
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-gray-400">{t("reliabilityProtoNote")}</span>
              </div>
            </Field>
          )}
        </div>

        <div className="border-t border-gray-100 pt-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("profileGender")} / {t("loginLabelBirthday")} / {t("profileEmail")}
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Gender */}
            <Field label={t("profileGender")}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as typeof gender)}
                className={inputCls}
              >
                <option value="">{t("profileGenderUnset")}</option>
                <option value="male">{t("profileGenderMale")}</option>
                <option value="female">{t("profileGenderFemale")}</option>
                <option value="other">{t("profileGenderOther")}</option>
              </select>
            </Field>

            {/* Birthday */}
            <Field label={t("loginLabelBirthday")} hint={<span className="text-gray-400">{t("loginPlaceholderBirthday")}</span>}>
              <input
                type="text"
                value={birthday}
                onChange={(e) => { setBirthday(e.target.value); setBirthdayError(""); }}
                placeholder="02-07"
                maxLength={5}
                className={birthdayError ? "w-full rounded-lg border border-red-500 ring-1 ring-red-500 px-3 py-2.5 text-sm outline-none transition-colors" : inputCls}
              />
              {birthdayError && <p className="mt-1 text-xs text-red-600">{birthdayError}</p>}
            </Field>

            {/* Email */}
            <Field label={t("profileEmail")} className="sm:col-span-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {msg && (
          <p className={`rounded-lg border px-3 py-2 text-sm ${
            msg.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-100 bg-red-50 text-red-600"
          }`}>
            {msg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-red px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-red-dark disabled:opacity-50"
        >
          {saving ? t("loading") : t("profileSaveBtn")}
        </button>
      </form>
    </div>
  );
}

function ReadOnlyHint() {
  const { t } = useTranslation();
  return (
    <span className="flex items-center gap-1 text-[10px] text-gray-400">
      <Lock size={10} />
      {t("profileReadOnlyHint")}
    </span>
  );
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {hint}
      </div>
      {children}
    </div>
  );
}
