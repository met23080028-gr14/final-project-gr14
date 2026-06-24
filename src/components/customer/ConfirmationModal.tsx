"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { HoldCountdown } from "./HoldCountdown";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import type { Booking } from "@/lib/types";

interface Props {
  booking: Booking;
  isGuest: boolean;
  onClose: () => void;
  onCancel: (id: string) => Promise<void>;
}

function makeBookingCode(date: string, arrivalTime: string, id: string): string {
  const [, mm, dd] = date.split("-");
  const [hh, min] = arrivalTime.split(":");
  return `${dd}${mm}${hh}${min}-${id.slice(-2).toUpperCase()}`;
}

export function ConfirmationModal({ booking, isGuest, onClose, onCancel }: Props) {
  const { t, lang } = useTranslation();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const branch = BRANCH_MAP[booking.branch];
  const session = SESSION_MAP[booking.session];

  const branchName = lang === "vi" ? branch.nameVi : branch.nameEn;
  const branchAddress = lang === "vi" ? branch.addressVi : branch.addressEn;
  const sessionName = lang === "vi" ? session.labelVi : session.labelEn;

  const bookingCode = makeBookingCode(booking.date, booking.arrivalTime, booking.id);

  const statusLabel = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    cancelled: t("statusCancelled"),
    expired: t("statusExpired"),
  }[booking.status];

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-600",
  }[booking.status];

  async function handleCancel() {
    setCancelling(true);
    setCancelError(null);
    try {
      await onCancel(booking.id);
      setShowCancelConfirm(false);
    } catch (e: unknown) {
      setCancelError(e instanceof Error ? e.message : t("errServer"));
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl outline-none overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="rounded-t-2xl bg-brand-red px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p id="modal-title" className="text-2xl font-bold">✓ {t("confirmationTitle")}</p>
              <p className="mt-1 text-sm text-white/80">
                {t("confirmationSubtitle")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 rounded-full p-1 text-white/70 hover:bg-white/20 hover:text-white"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prominent booking code */}
          <div className="mt-3 rounded-lg bg-white/15 px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
              {t("confirmationBookingCode")}
            </p>
            <p className="mt-0.5 font-mono text-xl font-black tracking-wider text-white">
              {bookingCode}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Details grid */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {/* Branch + address + map */}
            <div className="col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {t("confirmationBranch")}
              </dt>
              <dd className="mt-0.5 font-semibold text-gray-900">{branchName}</dd>
              <dd className="mt-0.5 flex items-start gap-1.5 text-xs text-gray-500">
                <MapPin size={12} className="mt-0.5 shrink-0 text-brand-red" />
                {branchAddress}
              </dd>
              <dd className="mt-2">
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-red/30 bg-red-50 px-3 py-1.5 text-xs font-semibold text-brand-red hover:bg-red-100 transition-colors"
                >
                  <MapPin size={12} />
                  {t("confirmationMapBtn")}
                </a>
              </dd>
            </div>

            <Detail label={t("confirmationSession")} value={sessionName} />
            <Detail label={t("confirmationDate")} value={booking.date} />
            <Detail label={t("confirmationArrival")} value={booking.arrivalTime} />
            <Detail
              label={t("confirmationParty")}
              value={`${booking.partySize} ${t("guests")}`}
            />
            <Detail
              label={t("confirmationStatus")}
              value={
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor}`}>
                  {statusLabel}
                </span>
              }
            />
          </dl>

          {/* Notice line */}
          <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            {t("confirmationNotice")}
          </p>

          {/* Hold countdown */}
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <HoldCountdown holdExpiresAt={booking.holdExpiresAt} />
          )}

          <p className="text-xs text-gray-500">{t("confirmationHold")}</p>

          {/* Offer button for guests */}
          {isGuest && (
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-xl border border-brand-gold bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
            >
              {t("confirmationOfferBtn")}
            </Link>
          )}

          {/* Cancel section */}
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <div>
              {!showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                >
                  {t("btnCancel")}
                </button>
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
                  <p className="text-sm font-medium text-red-800">
                    {t("cancelConfirmPrompt")}
                  </p>
                  {cancelError && (
                    <p className="text-xs text-red-600">{cancelError}</p>
                  )}
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark transition-colors"
          >
            {t("confirmationClose")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  colSpan,
}: {
  label: string;
  value: React.ReactNode;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-gray-900">{value}</dd>
    </div>
  );
}
