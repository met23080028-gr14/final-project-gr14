"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useAvailability } from "@/hooks/useAvailability";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { ConfirmationModal } from "./ConfirmationModal";
import { BRANCHES, SESSIONS } from "@/lib/constants";
import { todayHCM, resolveBookingDate } from "@/lib/booking-utils";
import type { Booking, BranchId, Customer, SessionId } from "@/lib/types";

interface Props {
  customer?: Customer | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^0\d{9}$/;

export function BookingForm({ customer }: Props) {
  const { t, lang } = useTranslation();

  const [branch, setBranch] = useState<BranchId | "">("");
  const [session, setSession] = useState<SessionId | "">("");
  const [date, setDate] = useState(todayHCM());
  const [arrivalTime, setArrivalTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [customerName, setCustomerName] = useState(customer?.name ?? "");
  const [customerPhone, setCustomerPhone] = useState(customer?.phone ?? "");
  const [customerEmail, setCustomerEmail] = useState(customer?.email ?? "");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [kitchenBumped, setKitchenBumped] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Inline blur-validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});

  // Sync auto-fill when customer logs in or logs out
  useEffect(() => {
    setCustomerName(customer?.name ?? "");
    setCustomerPhone(customer?.phone ?? "");
    setCustomerEmail(customer?.email ?? "");
  }, [customer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: avail, loading: availLoading } = useAvailability(branch, session, date);

  // ── Slot generation — stop at cutoffTime ────────────────────────────────────
  const timeOptions: string[] = (() => {
    if (!session) return [];
    const s = SESSIONS.find((x) => x.id === session);
    if (!s) return [];
    const [sh, sm] = s.startTime.split(":").map(Number);
    const [eh, em] = s.cutoffTime.split(":").map(Number);
    const slots: string[] = [];
    let h = sh;
    let m = sm;
    while (h < eh || (h === eh && m < em)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += 30;
      if (m >= 60) { h += 1; m -= 60; }
    }
    return slots;
  })();

  useEffect(() => {
    setArrivalTime(timeOptions[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const { date: resolved, bumped } = resolveBookingDate(date, session as SessionId);
    if (bumped) {
      setDate(resolved);
      setKitchenBumped(true);
    } else {
      setKitchenBumped(false);
    }
  }, [session, date]);

  // ── Inline field validation ────────────────────────────────────────────────
  function validateField(field: string, value: string): string {
    if (field === "name") {
      if (!value.trim()) return t("errFieldRequired");
    }
    if (field === "phone") {
      if (!value.trim()) return t("errFieldRequired");
      if (!PHONE_RE.test(value.replace(/\s/g, ""))) return t("errInvalidPhone");
    }
    if (field === "email") {
      if (!value.trim()) return t("errFieldRequired");
      if (!EMAIL_RE.test(value.trim())) return t("errInvalidEmail");
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

    // Force-touch all required fields before submit
    const allErrors = {
      name: validateField("name", customerName),
      phone: validateField("phone", customerPhone),
      email: validateField("email", customerEmail),
    };
    setTouched({ name: true, phone: true, email: true });
    setInlineErrors(allErrors);
    if (allErrors.name || allErrors.phone || allErrors.email) return;

    if (!branch || !session || !date || !arrivalTime) {
      setSubmitError(t("errRequired"));
      return;
    }
    if (partySize < 1 || partySize > 50) {
      setSubmitError(t("errInvalidParty"));
      return;
    }
    if (avail && avail.available === 0) {
      setSubmitError(t("errNoTables"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch,
          session,
          date,
          arrivalTime,
          partySize,
          customerName,
          customerPhone,
          customerEmail: customerEmail.trim(),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
          ...(customer?.id ? { customerId: customer.id } : {}),
        }),
      });

      const data = await res.json() as Booking & { error?: string };

      if (!res.ok) {
        if (res.status === 409) setSubmitError(t("errNoTables"));
        else setSubmitError(data.error ?? t("errServer"));
        return;
      }

      setConfirmedBooking(data);
    } catch {
      setSubmitError(t("errServer"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(id: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const data = await res.json() as Booking & { error?: string };
    if (!res.ok) throw new Error(data.error ?? t("errServer"));
    setConfirmedBooking(data);
  }

  const sessionDef = SESSIONS.find((s) => s.id === session);
  const minDate = todayHCM();

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Kitchen bumped notice */}
        {kitchenBumped && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <span className="text-lg">🕐</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">{t("kitchenClosedTitle")}</p>
              <p className="mt-0.5 text-xs text-amber-700">{t("kitchenClosedBody")}</p>
            </div>
          </div>
        )}

        {/* Branch */}
        <Field label={t("labelBranch")} htmlFor="branch">
          <Select
            id="branch"
            value={branch}
            onChange={(v) => setBranch(v as BranchId)}
            required
          >
            <option value="">{lang === "vi" ? "Chọn chi nhánh" : "Select branch"}</option>
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {lang === "vi" ? b.nameVi : b.nameEn}
              </option>
            ))}
          </Select>
        </Field>

        {/* Session */}
        <Field label={t("labelSession")} htmlFor="session">
          <Select
            id="session"
            value={session}
            onChange={(v) => setSession(v as SessionId)}
            required
          >
            <option value="">{lang === "vi" ? "Chọn bữa ăn" : "Select session"}</option>
            {SESSIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === "vi" ? s.labelVi : s.labelEn} ({s.startTime}–{s.endTime})
              </option>
            ))}
          </Select>
        </Field>

        {/* Date + time row */}
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
          <Field label={t("labelDate")} htmlFor="date">
            <input
              id="date"
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => { setDate(e.target.value); setKitchenBumped(false); }}
              required
              className={inputCls}
            />
          </Field>
          <Field label={t("labelArrivalTime")} htmlFor="arrival">
            <Select
              id="arrival"
              value={arrivalTime}
              onChange={setArrivalTime}
              disabled={!session}
              required
            >
              {timeOptions.length === 0 ? (
                <option value="">{lang === "vi" ? "Chọn bữa trước" : "Select session first"}</option>
              ) : (
                timeOptions.map((t_) => (
                  <option key={t_} value={t_}>{t_}</option>
                ))
              )}
            </Select>
          </Field>
        </div>

        {/* Session serving info */}
        {sessionDef && (
          <p className="text-xs text-gray-500">
            {t("sessionServes")}: {sessionDef.startTime}–{sessionDef.endTime}
            {" · "}
            {t("sessionCutoffLabel")}: {sessionDef.cutoffTime}
          </p>
        )}

        {/* Party size */}
        <Field label={`${t("labelPartySize")} (${partySize} ${t("guests")})`} htmlFor="party">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPartySize((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              disabled={partySize <= 1}
            >
              −
            </button>
            <input
              id="party"
              type="number"
              min={1}
              max={50}
              value={partySize}
              onChange={(e) => setPartySize(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-16 rounded-lg border border-gray-300 px-2 py-2 text-center text-base font-semibold focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
            />
            <button
              type="button"
              onClick={() => setPartySize((p) => Math.min(50, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              disabled={partySize >= 50}
            >
              +
            </button>
          </div>
        </Field>

        {/* Availability badge */}
        {(branch && session && date) && (
          <AvailabilityBadge data={avail} loading={availLoading} />
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            {t("labelName")} <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={customerName}
            onChange={(e) => handleChange("name", e.target.value, setCustomerName)}
            onBlur={(e) => handleBlur("name", e.target.value)}
            placeholder={t("placeholderName")}
            required
            className={inlineErrors.name ? errorInputCls : inputCls}
          />
          {inlineErrors.name && (
            <p className="text-xs text-red-600">{inlineErrors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            {t("labelPhone")} <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={customerPhone}
            onChange={(e) => handleChange("phone", e.target.value, setCustomerPhone)}
            onBlur={(e) => handleBlur("phone", e.target.value)}
            placeholder={t("placeholderPhone")}
            required
            className={inlineErrors.phone ? errorInputCls : inputCls}
          />
          {inlineErrors.phone && (
            <p className="text-xs text-red-600">{inlineErrors.phone}</p>
          )}
        </div>

        {/* Email (required) */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            {t("labelEmail")} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => handleChange("email", e.target.value, setCustomerEmail)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            placeholder={t("placeholderEmail")}
            required
            className={inlineErrors.email ? errorInputCls : inputCls}
          />
          {inlineErrors.email && (
            <p className="text-xs text-red-600">{inlineErrors.email}</p>
          )}
        </div>

        {/* Notes (optional) */}
        <Field label={t("labelNotes")} htmlFor="notes">
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("placeholderNotes")}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </Field>

        {/* Submit error */}
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || (!!avail && avail.available === 0)}
          className="w-full rounded-xl bg-brand-red px-6 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-red-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? t("loading") : t("btnBook")}
        </button>
      </form>

      {/* Confirmation modal */}
      {confirmedBooking && (
        <ConfirmationModal
          booking={confirmedBooking}
          isGuest={!customer}
          onClose={() => setConfirmedBooking(null)}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors";

const errorInputCls =
  "w-full rounded-lg border border-red-500 ring-1 ring-red-500 px-3 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors";

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

function Select({
  id,
  value,
  onChange,
  disabled,
  required,
  children,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className={`${inputCls} appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400`}
    >
      {children}
    </select>
  );
}
