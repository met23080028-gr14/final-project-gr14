"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import { effectiveStatus } from "@/lib/booking-utils";
import { TableSuggestion } from "./TableSuggestion";
import type { Booking } from "@/lib/types";

interface Props {
  booking: Booking;
  allBookings: Booking[];
  onConfirm: (id: string) => Promise<void>;
  onAssign: (bookingId: string, tableIds: string[]) => Promise<void>;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
  expired: "bg-red-100 text-red-600",
};

export function BookingRow({ booking, allBookings, onConfirm, onAssign }: Props) {
  const { t, lang } = useTranslation();
  const [confirming, setConfirming] = useState(false);

  const status = effectiveStatus(booking);
  const branch = BRANCH_MAP[booking.branch];
  const session = SESSION_MAP[booking.session];

  const branchShort = lang === "vi"
    ? branch.nameVi.replace("Poseidon ", "")
    : branch.nameEn.replace("Poseidon ", "");
  const sessionLabel = lang === "vi" ? session.labelVi : session.labelEn;

  const statusLabel = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    cancelled: t("statusCancelled"),
    expired: t("statusExpired"),
  }[status];

  const showSuggestion = status === "pending" || status === "confirmed";

  async function handleConfirm() {
    setConfirming(true);
    try {
      await onConfirm(booking.id);
    } finally {
      setConfirming(false);
    }
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors align-top">
      <td className="px-4 py-3 font-mono text-xs text-gray-500">{booking.id}</td>
      <td className="px-4 py-3 text-sm">{branchShort}</td>
      <td className="px-4 py-3 text-sm">{sessionLabel}</td>
      <td className="px-4 py-3 text-sm">{booking.date}</td>
      <td className="px-4 py-3 text-sm font-medium">{booking.arrivalTime}</td>
      <td className="px-4 py-3 text-sm text-center">{booking.partySize}</td>
      <td className="px-4 py-3 text-sm font-medium">{booking.customerName}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{booking.customerPhone}</td>
      <td className="px-4 py-3">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>
          {statusLabel}
        </span>
      </td>
      <td className="px-4 py-3">
        {status === "pending" && (
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="rounded-lg bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
          >
            {confirming ? "…" : t("adminBtnConfirm")}
          </button>
        )}
      </td>
      {/* Table suggestion column */}
      <td className="px-4 py-3 min-w-[200px] max-w-[260px]">
        {showSuggestion && (
          <TableSuggestion
            booking={booking}
            allBookings={allBookings}
            onAssign={onAssign}
          />
        )}
      </td>
    </tr>
  );
}
