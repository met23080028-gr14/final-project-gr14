"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import { makeBookingCode } from "@/lib/booking-utils";
import type { Booking } from "@/lib/types";

const POINTS_PER_BOOKING = 10;

const STATUS_COLORS: Record<Booking["status"], string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  arrived:   "bg-blue-100 text-blue-800",
  no_show:   "bg-orange-100 text-orange-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-gray-100 text-gray-500",
  expired:   "bg-red-100 text-red-700",
};

export default function ActivityPage() {
  const { t, lang } = useTranslation();
  const { customer } = useCustomerContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) return;
    let cancelled = false;
    fetch(`/api/bookings?customerId=${encodeURIComponent(customer.id)}`)
      .then((r) => r.json())
      .then((data: Booking[]) => { if (!cancelled) setBookings(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [customer]);

  if (!customer) return null;

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const totalPoints = confirmedCount * POINTS_PER_BOOKING;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("accountActivity")}</h1>
      </div>

      {/* Points summary */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              {t("activityPoints")}
            </p>
            <p className="mt-1 text-3xl font-black text-amber-800">{totalPoints}</p>
            <p className="text-xs text-amber-600">{t("activityPointsEarned")}</p>
          </div>
          <div className="text-5xl opacity-30">🏆</div>
        </div>
        <p className="mt-3 rounded-lg border border-amber-200 bg-white/60 px-3 py-1.5 text-[11px] text-amber-700">
          ⚠️ {t("activityPointsNote")}
        </p>
      </div>

      {/* Booking history + per-booking points */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">{t("myBookingsTitle")}</h2>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">{t("loading")}</div>
        ) : bookings.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">{t("activityNoBookings")}</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {bookings.map((b) => {
              const branch = BRANCH_MAP[b.branch];
              const session = SESSION_MAP[b.session];
              const branchName = lang === "vi" ? branch.nameVi : branch.nameEn;
              const sessionLabel = lang === "vi" ? session.labelVi : session.labelEn;
              const code = makeBookingCode(b.date, b.arrivalTime, b.id);
              const pts = b.status === "confirmed" ? POINTS_PER_BOOKING : 0;

              return (
                <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gray-700">{code}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[b.status]}`}>
                        {{ pending: t("statusPending"), confirmed: t("statusConfirmed"), arrived: t("statusArrived"), no_show: t("statusNoShow"), completed: t("statusCompleted"), cancelled: t("statusCancelled"), expired: t("statusExpired") }[b.status]}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {branchName} · {sessionLabel} · {b.date} {b.arrivalTime}
                    </p>
                  </div>
                  <div className={`shrink-0 text-sm font-bold ${pts > 0 ? "text-amber-600" : "text-gray-300"}`}>
                    {pts > 0 ? `+${pts}` : "—"}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
