"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { AdminGate } from "@/components/admin/AdminGate";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import { makeBookingCode } from "@/lib/booking-utils";
import type { Booking } from "@/lib/types";

type ScanState =
  | { phase: "idle" }
  | { phase: "scanning" }
  | { phase: "processing" }
  | { phase: "success"; booking: Booking; alreadyArrived: boolean }
  | { phase: "already"; booking: Booking }
  | { phase: "error"; message: string };

const SCANNER_ID = "qr-scanner-region";

export default function AdminScanPage() {
  const { t, lang } = useTranslation();
  const [state, setState] = useState<ScanState>({ phase: "idle" });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const processingRef = useRef(false);

  async function startScanner() {
    setCameraError(null);
    setState({ phase: "scanning" });
    processingRef.current = false;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (processingRef.current) return;
          processingRef.current = true;

          // Extract booking ID from URL like https://host/checkin/<id>
          const match = decodedText.match(/\/checkin\/([^/?#]+)/);
          const bookingId = match ? match[1] : null;

          if (!bookingId) {
            setState({ phase: "error", message: t("adminScanError") });
            processingRef.current = false;
            return;
          }

          setState({ phase: "processing" });

          try {
            const res = await fetch(`/api/checkin/${bookingId}`, { method: "POST" });
            const data = await res.json();

            if (data.error === "not_found" || data.error === "invalid_status") {
              setState({ phase: "error", message: t("adminScanError") });
            } else if (data.error) {
              setState({ phase: "error", message: t("adminScanError") });
            } else if (data.alreadyArrived) {
              setState({ phase: "success", booking: data.booking as Booking, alreadyArrived: true });
            } else {
              setState({ phase: "success", booking: data.booking as Booking, alreadyArrived: false });
            }
          } catch {
            setState({ phase: "error", message: t("adminScanError") });
          }
        },
        undefined
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCameraError(msg);
      setState({ phase: "idle" });
    }
  }

  async function stopScanner() {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch { /* already stopped */ }
      scannerRef.current = null;
    }
    setState({ phase: "idle" });
    processingRef.current = false;
  }

  // Cleanup on unmount
  useEffect(() => () => { stopScanner(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("adminScanTitle")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("adminScanSubtitle")}</p>
          </div>
          <Link
            href="/admin"
            className="text-sm font-medium text-brand-red hover:underline"
          >
            ← {t("adminScanBackAdmin")}
          </Link>
        </div>

        {/* Camera region — always rendered so html5-qrcode can attach to it */}
        <div
          id={SCANNER_ID}
          className={`w-full overflow-hidden rounded-2xl bg-gray-900 ${
            state.phase === "scanning" || state.phase === "processing"
              ? "min-h-[280px]"
              : "hidden"
          }`}
        />

        {/* Controls */}
        <div className="mt-4 space-y-4">
          {(state.phase === "idle" || state.phase === "error") && (
            <button
              onClick={startScanner}
              className="w-full rounded-xl bg-brand-red px-4 py-3 text-base font-bold text-white hover:bg-brand-red-dark transition-colors"
            >
              {t("adminScanBtn")}
            </button>
          )}

          {(state.phase === "scanning" || state.phase === "processing") && (
            <button
              onClick={stopScanner}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("adminScanStop")}
            </button>
          )}

          {state.phase === "processing" && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-red" />
              {t("loading")}
            </div>
          )}

          {/* Success */}
          {state.phase === "success" && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white font-bold">✓</span>
                <p className="font-semibold text-green-800">
                  {state.alreadyArrived ? t("adminScanAlready") : t("adminScanSuccess")}
                </p>
              </div>
              <BookingCard booking={state.booking} lang={lang} />
              <button
                onClick={() => { setState({ phase: "idle" }); processingRef.current = false; startScanner(); }}
                className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
              >
                {t("adminScanBtn")}
              </button>
            </div>
          )}

          {/* Error */}
          {state.phase === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{state.message}</p>
            </div>
          )}

          {/* Camera unavailable note */}
          {cameraError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              <p className="font-semibold mb-1">{t("adminScanNoCameraNote")}</p>
              <p className="font-mono text-[10px] text-amber-600 break-all">{cameraError}</p>
            </div>
          )}
        </div>
      </main>
    </AdminGate>
  );
}

function BookingCard({ booking, lang }: { booking: Booking; lang: string }) {
  const branch = BRANCH_MAP[booking.branch];
  const session = SESSION_MAP[booking.session];
  const bookingCode = makeBookingCode(booking.date, booking.arrivalTime, booking.id);
  const branchName = lang === "vi" ? branch.nameVi : branch.nameEn;
  const sessionName = lang === "vi" ? session.labelVi : session.labelEn;

  return (
    <dl className="space-y-1.5 rounded-lg border border-green-200 bg-white p-3 text-sm">
      <InfoRow label="Mã" value={<span className="font-mono font-bold">{bookingCode}</span>} />
      <InfoRow label="Tên" value={booking.customerName} />
      <InfoRow label="Chi nhánh" value={branchName} />
      <InfoRow label="Bữa / Ngày" value={`${sessionName} — ${booking.date}`} />
      <InfoRow label="Giờ" value={booking.arrivalTime} />
      <InfoRow label="Khách" value={`${booking.partySize}`} />
    </dl>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="shrink-0 text-xs text-gray-500">{label}</dt>
      <dd className="text-right text-xs font-medium text-gray-900">{value}</dd>
    </div>
  );
}
