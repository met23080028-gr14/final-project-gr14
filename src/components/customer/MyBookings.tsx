"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { BRANCHES, SESSIONS } from "@/lib/constants";
import { canCancel } from "@/lib/booking-utils";
import type { Booking } from "@/lib/types";

interface Props {
  customerId: string;
}

const STATUS_COLORS: Record<Booking["status"], string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  arrived:   "bg-blue-100 text-blue-800",
  no_show:   "bg-orange-100 text-orange-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-gray-100 text-gray-500",
  expired:   "bg-red-100 text-red-700",
};

export function MyBookings({ customerId }: Props) {
  const { t, lang } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [cancelErrors, setCancelErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function fetch_() {
      try {
        const res = await fetch(`/api/bookings?customerId=${encodeURIComponent(customerId)}`);
        if (!res.ok) return;
        const data = await res.json() as Booking[];
        if (!cancelled) setBookings(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch_();
    return () => { cancelled = true; };
  }, [customerId]);

  async function handleCancel(id: string) {
    setCancellingId(id);
    setCancelErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json() as Booking & { error?: string };
      if (!res.ok) {
        setCancelErrors((prev) => ({ ...prev, [id]: data.error ?? t("errServer") }));
        return;
      }
      setBookings((prev) => prev.map((b) => b.id === id ? data : b));
      setCancelConfirmId(null);
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-400">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-base font-bold text-gray-900">{t("myBookingsTitle")}</h2>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-500">{t("myBookingsEmpty")}</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => {
            const branch = BRANCHES.find((br) => br.id === b.branch);
            const session = SESSIONS.find((s) => s.id === b.session);
            const isActive = b.status === "pending" || b.status === "confirmed";
            const cancelable = isActive && canCancel(b);
            const confirming = cancelConfirmId === b.id;

            return (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {lang === "vi" ? branch?.nameVi : branch?.nameEn}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lang === "vi" ? session?.labelVi : session?.labelEn} &bull;{" "}
                      {b.date} &bull; {b.arrivalTime} &bull;{" "}
                      {b.partySize} {t("guests")}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-gray-400">{b.id}</p>
                    {b.notes && (
                      <p className="mt-1 text-xs text-gray-500 italic">{b.notes}</p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status]}`}
                  >
                    {b.status === "pending" ? t("statusPending") :
                     b.status === "confirmed" ? t("statusConfirmed") :
                     b.status === "arrived" ? t("statusArrived") :
                     b.status === "no_show" ? t("statusNoShow") :
                     b.status === "completed" ? t("statusCompleted") :
                     b.status === "cancelled" ? t("statusCancelled") :
                     t("statusExpired")}
                  </span>
                </div>

                {/* Cancel controls */}
                {isActive && !cancelable && (
                  <p className="mt-2 text-[11px] text-orange-600">{t("cancelCutoffNote")}</p>
                )}

                {cancelable && !confirming && (
                  <button
                    onClick={() => setCancelConfirmId(b.id)}
                    className="mt-2 w-full rounded-md border border-red-200 bg-red-50 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    {t("btnCancel")}
                  </button>
                )}

                {cancelable && confirming && (
                  <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2.5 space-y-2">
                    <p className="text-xs font-medium text-red-800">{t("cancelConfirmPrompt")}</p>
                    {cancelErrors[b.id] && (
                      <p className="text-xs text-red-600">{cancelErrors[b.id]}</p>
                    )}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancellingId === b.id}
                        className="flex-1 rounded-md bg-red-600 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                      >
                        {cancellingId === b.id ? t("loading") : t("cancelTitle")}
                      </button>
                      <button
                        onClick={() => setCancelConfirmId(null)}
                        className="flex-1 rounded-md border border-gray-200 bg-white py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {t("confirmationClose")}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
