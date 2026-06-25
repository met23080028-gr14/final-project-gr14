"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { BRANCH_MAP, SESSION_MAP } from "@/lib/constants";
import { makeBookingCode } from "@/lib/booking-utils";
import type { Booking } from "@/lib/types";

type State =
  | { phase: "loading" }
  | { phase: "success"; booking: Booking; alreadyArrived: boolean }
  | { phase: "already" }
  | { phase: "invalid"; status: string }
  | { phase: "notfound" }
  | { phase: "error" };

export const dynamic = "force-dynamic";

export default function CheckinPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useTranslation();
  const [state, setState] = useState<State>({ phase: "loading" });

  useEffect(() => {
    if (!id) { setState({ phase: "notfound" }); return; }
    fetch(`/api/checkin/${id}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error === "not_found") { setState({ phase: "notfound" }); return; }
        if (data.error === "invalid_status") { setState({ phase: "invalid", status: data.status }); return; }
        if (data.error) { setState({ phase: "error" }); return; }
        setState({ phase: "success", booking: data.booking as Booking, alreadyArrived: !!data.alreadyArrived });
      })
      .catch(() => setState({ phase: "error" }));
  }, [id]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {state.phase === "loading" && (
          <Card>
            <Spinner />
            <p className="mt-4 text-center text-sm text-gray-500">{t("loading")}</p>
          </Card>
        )}

        {state.phase === "success" && (
          <Card>
            <StatusIcon success />
            <h1 className="mt-3 text-center text-xl font-bold text-gray-900">
              {state.alreadyArrived ? t("checkinAlreadyTitle") : t("checkinTitle")}
            </h1>
            <p className="mt-1 text-center text-sm text-gray-500">
              {state.alreadyArrived ? t("checkinAlreadyBody") : t("checkinSubtitle")}
            </p>
            <BookingSummary booking={state.booking} lang={lang} />
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {t("checkinProtoNote")}
            </p>
          </Card>
        )}

        {state.phase === "invalid" && (
          <Card>
            <StatusIcon success={false} />
            <h1 className="mt-3 text-center text-xl font-bold text-gray-900">{t("checkinInvalidTitle")}</h1>
            <p className="mt-1 text-center text-sm text-gray-500">{t("checkinInvalidBody")}</p>
          </Card>
        )}

        {state.phase === "notfound" && (
          <Card>
            <StatusIcon success={false} />
            <h1 className="mt-3 text-center text-xl font-bold text-gray-900">{t("checkinNotFoundTitle")}</h1>
            <p className="mt-1 text-center text-sm text-gray-500">{t("checkinNotFoundBody")}</p>
          </Card>
        )}

        {state.phase === "error" && (
          <Card>
            <StatusIcon success={false} />
            <h1 className="mt-3 text-center text-xl font-bold text-gray-900">{t("checkinInvalidTitle")}</h1>
            <p className="mt-1 text-center text-sm text-gray-500">{t("errServer")}</p>
          </Card>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm font-medium text-brand-red hover:underline">
            ← {t("checkinBackHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-red" />
    </div>
  );
}

function StatusIcon({ success }: { success: boolean }) {
  return (
    <div className="flex justify-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
          success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
      >
        {success ? "✓" : "✕"}
      </div>
    </div>
  );
}

function BookingSummary({ booking, lang }: { booking: Booking; lang: string }) {
  const branch = BRANCH_MAP[booking.branch];
  const session = SESSION_MAP[booking.session];
  const bookingCode = makeBookingCode(booking.date, booking.arrivalTime, booking.id);
  const branchName = lang === "vi" ? branch.nameVi : branch.nameEn;
  const sessionName = lang === "vi" ? session.labelVi : session.labelEn;

  return (
    <dl className="mt-4 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
      <Row label="Mã đặt bàn" value={<span className="font-mono font-bold">{bookingCode}</span>} />
      <Row label="Tên" value={booking.customerName} />
      <Row label="Chi nhánh" value={branchName} />
      <Row label="Bữa ăn / Ngày" value={`${sessionName} — ${booking.date}`} />
      <Row label="Giờ đến" value={booking.arrivalTime} />
      <Row label="Số khách" value={`${booking.partySize}`} />
    </dl>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-gray-500 shrink-0 text-xs">{label}</dt>
      <dd className="text-right text-xs font-medium text-gray-900">{value}</dd>
    </div>
  );
}
