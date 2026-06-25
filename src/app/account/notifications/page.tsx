"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import { makeBookingCode } from "@/lib/booking-utils";
import type { Booking } from "@/lib/types";

const STATUS_COLORS: Record<Booking["status"], string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  arrived:   "bg-blue-100 text-blue-800",
  no_show:   "bg-orange-100 text-orange-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-gray-100 text-gray-500",
  expired:   "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<Booking["status"], string> = {
  pending:   "⏳",
  confirmed: "✅",
  arrived:   "🪑",
  no_show:   "⚠️",
  completed: "✓",
  cancelled: "❌",
  expired:   "⚠️",
};

export default function NotificationsPage() {
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

  const statusLabel = (s: Booking["status"]) => ({
    pending:   t("statusPending"),
    confirmed: t("statusConfirmed"),
    arrived:   t("statusArrived"),
    no_show:   t("statusNoShow"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
    expired:   t("statusExpired"),
  })[s];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("notifTitle")}</h1>
        <p className="mt-0.5 text-sm text-gray-500">{t("notifBookingUpdate")}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">{t("loading")}</div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <Bell size={32} className="text-gray-200" />
            <p className="text-sm text-gray-400">{t("notifEmpty")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {bookings.map((b) => {
              const branch = BRANCH_MAP[b.branch];
              const session = SESSION_MAP[b.session];
              const branchShort = (lang === "vi" ? branch.nameVi : branch.nameEn)
                .replace("Poseidon ", "");
              const sessionLabel = lang === "vi" ? session.labelVi : session.labelEn;
              const code = makeBookingCode(b.date, b.arrivalTime, b.id);

              return (
                <li key={b.id} className="flex items-start gap-4 px-5 py-4">
                  <span className="mt-0.5 text-xl leading-none">{STATUS_ICONS[b.status]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gray-800">{code}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[b.status]}`}>
                        {statusLabel(b.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {branchShort} · {sessionLabel} · {b.date} {b.arrivalTime}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {new Date(b.createdAt).toLocaleString(lang === "vi" ? "vi-VN" : "en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
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
