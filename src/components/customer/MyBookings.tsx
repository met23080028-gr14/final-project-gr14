"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { BRANCHES, SESSIONS } from "@/lib/constants";
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
        <ul className="space-y-2">
          {bookings.map((b) => {
            const branch = BRANCHES.find((br) => br.id === b.branch);
            const session = SESSIONS.find((s) => s.id === b.session);
            return (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {lang === "vi" ? branch?.nameVi : branch?.nameEn}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lang === "vi" ? session?.labelVi : session?.labelEn} &bull;{" "}
                      {b.date} &bull; {b.arrivalTime} &bull;{" "}
                      {b.partySize} {t("guests")}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-gray-400">{b.id}</p>
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
