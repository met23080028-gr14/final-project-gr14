"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useAvailability } from "@/hooks/useAvailability";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { ConfirmationModal } from "./ConfirmationModal";
import { BRANCHES, SESSIONS } from "@/lib/constants";
import { todayHCM, resolveBookingDate } from "@/lib/booking-utils";
import type { Booking, BranchId, SessionId } from "@/lib/types";

export function BookingForm() {
  const { t, lang } = useTranslation();

  const [branch, setBranch] = useState<BranchId | "">("");
  const [session, setSession] = useState<SessionId | "">("");
  const [date, setDate] = useState(todayHCM());
  const [arrivalTime, setArrivalTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [kitchenBumped, setKitchenBumped] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const { data: avail, loading: availLoading } = useAvailability(branch, session, date);

  // ── Generate arrival-time options for selected session ──────────────────────
  const timeOptions: string[] = (() => {
    if (!session) return [];
    const s = SESSIONS.find((x) => x.id === session);
    if (!s) return [];
    const [sh, sm] = s.startTime.split(":").map(Number);
    const [eh, em] = s.endTime.split(":").map(Number);
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

  // Reset arrival time when session changes
  useEffect(() => {
    setArrivalTime(timeOptions[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Apply kitchen-hours rule when session or date changes
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);

    if (!branch || !session || !date || !arrivalTime || !customerName || !customerPhone) {
      setFieldError(t("errRequired"));
      return;
    }
    if (!/^0\d{9}$/.test(customerPhone.replace(/\s/g, ""))) {
      setFieldError(t("errInvalidPhone"));
      return;
    }
    if (partySize < 1 || partySize > 50) {
      setFieldError(t("errInvalidParty"));
      return;
    }
    if (avail && avail.available === 0) {
      setFieldError(t("errNoTables"));
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
        }),
      });

      const data = await res.json() as Booking & { error?: string };

      if (!res.ok) {
        if (res.status === 409) setFieldError(t("errNoTables"));
        else setFieldError(data.error ?? t("errServer"));
        return;
      }

      setConfirmedBooking(data);
    } catch {
      setFieldError(t("errServer"));
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
        <div className="grid grid-cols-2 gap-4">
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

        {/* Session info */}
        {sessionDef && (
          <p className="text-xs text-gray-500">
            {lang === "vi" ? "Giờ phục vụ" : "Serving hours"}: {sessionDef.startTime}–{sessionDef.endTime}
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
        <Field label={t("labelName")} htmlFor="name">
          <input
            id="name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={t("placeholderName")}
            required
            className={inputCls}
          />
        </Field>

        {/* Phone */}
        <Field label={t("labelPhone")} htmlFor="phone">
          <input
            id="phone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder={t("placeholderPhone")}
            required
            className={inputCls}
          />
        </Field>

        {/* Error */}
        {fieldError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {fieldError}
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
