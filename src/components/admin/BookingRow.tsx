"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import { effectiveStatus, makeBookingCode, isOverdue } from "@/lib/booking-utils";
import { TableSuggestion } from "./TableSuggestion";
import type { Booking } from "@/lib/types";

interface Props {
  booking: Booking;
  allBookings: Booking[];
  onConfirm: (id: string) => Promise<void>;
  onArrive: (id: string) => Promise<void>;
  onNoShow: (id: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  onAssign: (bookingId: string, tableIds: string[]) => Promise<void>;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  arrived: "bg-blue-100 text-blue-800",
  no_show: "bg-orange-100 text-orange-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-gray-100 text-gray-600",
  expired: "bg-red-100 text-red-600",
};

export function BookingRow({ booking, allBookings, onConfirm, onArrive, onNoShow, onComplete, onAssign }: Props) {
  const { t, lang } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);

  const status = effectiveStatus(booking);
  const overdue = isOverdue(booking);
  const branch = BRANCH_MAP[booking.branch];
  const session = SESSION_MAP[booking.session];

  const branchShort = lang === "vi"
    ? branch.nameVi.replace("Poseidon ", "")
    : branch.nameEn.replace("Poseidon ", "");
  const sessionLabel = lang === "vi" ? session.labelVi : session.labelEn;

  const statusLabel: Record<string, string> = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    arrived: t("statusArrived"),
    no_show: t("statusNoShow"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
    expired: t("statusExpired"),
  };

  const canAssign = status === "pending" || status === "confirmed";

  async function act(fn: () => Promise<void>) {
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors align-top">
      <td
        className="px-4 py-3 font-mono text-xs text-gray-700 font-semibold"
        title={booking.id}
      >
        {makeBookingCode(booking.date, booking.arrivalTime, booking.id)}
      </td>
      <td className="px-4 py-3 text-sm">{branchShort}</td>
      <td className="px-4 py-3 text-sm">{sessionLabel}</td>
      <td className="px-4 py-3 text-sm">{booking.date}</td>
      <td className="px-4 py-3 text-sm font-medium">{booking.arrivalTime}</td>
      <td className="px-4 py-3 text-sm text-center">{booking.partySize}</td>
      <td className="px-4 py-3 text-sm font-medium">
        <div>{booking.customerName}</div>
        {booking.notes && (
          <div className="mt-0.5 text-xs text-gray-400 italic max-w-[120px] truncate" title={booking.notes}>
            {booking.notes}
          </div>
        )}
      </td>
      <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-500">{booking.customerPhone}</td>
      <td className="px-4 py-3">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] ?? ""}`}>
          {statusLabel[status] ?? status}
        </span>
        {overdue && (
          <div className="mt-1 flex items-center gap-1 text-xs text-amber-700 font-semibold whitespace-nowrap">
            <span aria-hidden>⚠</span>
            {t("adminOverdueWarning")}
          </div>
        )}
      </td>
      {/* Lifecycle action buttons — primary */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          {status === "pending" && (
            <button
              onClick={() => act(() => onConfirm(booking.id))}
              disabled={busy}
              className="rounded-lg bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
            >
              {busy ? "…" : t("adminBtnConfirm")}
            </button>
          )}
          {status === "confirmed" && (
            <button
              onClick={() => act(() => onArrive(booking.id))}
              disabled={busy}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {busy ? "…" : t("adminBtnArrive")}
            </button>
          )}
          {(status === "confirmed" || (status === "pending" && overdue)) && (
            <button
              onClick={() => act(() => onNoShow(booking.id))}
              disabled={busy}
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {busy ? "…" : t("adminBtnNoShow")}
            </button>
          )}
          {status === "arrived" && (
            <button
              onClick={() => act(() => onComplete(booking.id))}
              disabled={busy}
              className="rounded-lg bg-gray-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {busy ? "…" : t("adminBtnRelease")}
            </button>
          )}
        </div>
      </td>
      {/* Table assignment — secondary, collapsed by default */}
      <td className="hidden lg:table-cell px-4 py-3 min-w-[200px] max-w-[260px]">
        {canAssign && (
          <div>
            <button
              type="button"
              onClick={() => setShowAssignment((v) => !v)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
            >
              {showAssignment ? t("tableBtnHide") : t("tableBtnToggle")}
            </button>
            {showAssignment && (
              <div className="mt-2">
                <TableSuggestion
                  booking={booking}
                  allBookings={allBookings}
                  onAssign={onAssign}
                />
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
