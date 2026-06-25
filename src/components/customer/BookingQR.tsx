"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { makeBookingCode } from "@/lib/booking-utils";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import type { Booking } from "@/lib/types";

interface Props {
  booking: Booking;
}

export function BookingQR({ booking }: Props) {
  const { t, lang } = useTranslation();
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const checkinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/checkin/${booking.id}`
      : `/checkin/${booking.id}`;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(checkinUrl, { width: 256, margin: 2 }).then((url) => {
        if (!cancelled) setDataUrl(url);
      });
    });
    return () => { cancelled = true; };
  }, [open, checkinUrl]);

  const branch = BRANCH_MAP[booking.branch];
  const session = SESSION_MAP[booking.session];
  const bookingCode = makeBookingCode(booking.date, booking.arrivalTime, booking.id);
  const branchName = lang === "vi" ? branch.nameVi : branch.nameEn;
  const sessionName = lang === "vi" ? session.labelVi : session.labelEn;

  function handleDownload() {
    if (!dataUrl || !downloadRef.current) return;
    downloadRef.current.href = dataUrl;
    downloadRef.current.download = `poseidon-checkin-${bookingCode}.png`;
    downloadRef.current.click();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-800"
      >
        <span>🔲 {t("qrExportBtn")}</span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {/* QR image */}
          <div className="flex justify-center">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="QR check-in"
                className="rounded-lg border border-gray-200 shadow-sm"
                width={180}
                height={180}
              />
            ) : (
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-gray-400">
                Generating…
              </div>
            )}
          </div>

          {/* Download */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!dataUrl}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              ⬇ {t("qrDownloadBtn")}
            </button>
            {/* hidden anchor for programmatic download */}
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a ref={downloadRef} className="hidden" aria-hidden="true" />
          </div>

          {/* Booking summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-1.5 text-xs">
            <p className="font-semibold text-gray-700 mb-2">{t("qrSummaryTitle")}</p>
            <SummaryRow label={t("qrSummaryCode")} value={bookingCode} mono />
            <SummaryRow label={t("qrSummaryName")} value={booking.customerName} />
            <SummaryRow label={t("qrSummaryBranch")} value={branchName} />
            <SummaryRow label={t("qrSummarySession")} value={`${sessionName} — ${booking.date}`} />
            <SummaryRow label={t("qrSummaryTime")} value={booking.arrivalTime} />
            <SummaryRow label={t("qrSummaryGuests")} value={String(booking.partySize)} />
          </div>

          <p className="text-center text-xs text-gray-500">{t("qrNote")}</p>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-gray-900 text-right ${mono ? "font-mono font-bold" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}
