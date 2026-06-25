"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { canCancel, makeBookingCode } from "@/lib/booking-utils";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import type { Booking } from "@/lib/types";

export function GuestLookup() {
  const { t, lang } = useTranslation();
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function lookup() {
    if (!code.trim()) return;
    setSearching(true);
    setNotFound(false);
    setBooking(null);
    setShowCancelConfirm(false);
    setCancelError(null);
    try {
      const res = await fetch(`/api/bookings?code=${encodeURIComponent(code.trim())}`);
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json() as Booking;
      setBooking(data);
    } finally {
      setSearching(false);
    }
  }

  async function handleCancel() {
    if (!booking) return;
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json() as Booking & { error?: string };
      if (!res.ok) {
        setCancelError(data.error ?? t("errServer"));
        return;
      }
      setBooking(data);
      setShowCancelConfirm(false);
    } finally {
      setCancelling(false);
    }
  }

  const cancelable = booking ? canCancel(booking) : false;
  const isActive = booking?.status === "pending" || booking?.status === "confirmed";

  function getStatusLabel(s: Booking["status"]) {
    return {
      pending:   t("statusPending"),
      confirmed: t("statusConfirmed"),
      arrived:   t("statusArrived"),
      no_show:   t("statusNoShow"),
      completed: t("statusCompleted"),
      cancelled: t("statusCancelled"),
      expired:   t("statusExpired"),
    }[s];
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left gap-2"
      >
        <div>
          <h2 className="text-sm font-bold text-gray-900">{t("guestLookupTitle")}</h2>
          <p className="text-xs text-gray-500">{t("guestLookupSubtitle")}</p>
        </div>
        <span className="shrink-0 text-xs text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                {t("guestLookupLabel")}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setNotFound(false); }}
                placeholder={t("guestLookupPlaceholder")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono uppercase focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                onKeyDown={(e) => { if (e.key === "Enter") lookup(); }}
              />
            </div>
            <button
              onClick={lookup}
              disabled={searching || !code.trim()}
              className="self-end rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
            >
              {searching ? "…" : t("guestLookupBtn")}
            </button>
          </div>

          {notFound && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {t("guestLookupNotFound")}
            </p>
          )}

          {booking && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
              {/* Summary */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{booking.customerName}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                    booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                    booking.status === "arrived"   ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {lang === "vi"
                    ? BRANCH_MAP[booking.branch].nameVi
                    : BRANCH_MAP[booking.branch].nameEn}
                  {" · "}
                  {lang === "vi"
                    ? SESSION_MAP[booking.session].labelVi
                    : SESSION_MAP[booking.session].labelEn}
                  {" · "}
                  {booking.date} {booking.arrivalTime}
                  {" · "}
                  {booking.partySize} {t("guests")}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-gray-400">
                  {t("confirmationBookingCode")}: {makeBookingCode(booking.date, booking.arrivalTime, booking.id)}
                </p>
              </div>

              {/* Cancel actions */}
              {isActive && !cancelable && (
                <p className="rounded-md bg-orange-50 px-3 py-2 text-xs text-orange-700">
                  {t("cancelTooLate")}
                </p>
              )}

              {isActive && cancelable && !showCancelConfirm && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                >
                  {t("btnCancel")}
                </button>
              )}

              {isActive && cancelable && showCancelConfirm && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
                  <p className="text-sm font-medium text-red-800">{t("cancelConfirmPrompt")}</p>
                  {cancelError && <p className="text-xs text-red-600">{cancelError}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                    >
                      {cancelling ? t("loading") : t("cancelTitle")}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t("confirmationClose")}
                    </button>
                  </div>
                </div>
              )}

              {booking.status === "cancelled" && (
                <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  {t("cancelSuccess")}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
