"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useBookings } from "@/hooks/useBookings";
import { BookingRow } from "./BookingRow";
import { BRANCHES, SESSIONS } from "@/lib/constants";
import { computeAvailability, todayHCM, nowInHCM, formatDateLocal } from "@/lib/booking-utils";
import { formatBirthday } from "@/lib/voucher";
import type { Booking, Customer } from "@/lib/types";

type DateFilter = "all" | "today" | "tomorrow" | "custom";

export function BookingTable() {
  const { t, lang } = useTranslation();
  const { bookings, loading, refresh } = useBookings();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDate, setCustomDate] = useState("");

  // Load customers for birthday panel
  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data as Customer[]); })
      .catch(() => {});
  }, []);

  async function confirmBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirm" }),
    });
    const data = await res.json() as Booking & { error?: string };
    if (!res.ok) throw new Error(data.error ?? t("errServer"));
    refresh();
  }

  async function arriveBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "arrive" }),
    });
    const data = await res.json() as Booking & { error?: string };
    if (!res.ok) throw new Error(data.error ?? t("errServer"));
    refresh();
  }

  async function noShowBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "no_show" }),
    });
    const data = await res.json() as Booking & { error?: string };
    if (!res.ok) throw new Error(data.error ?? t("errServer"));
    refresh();
  }

  async function completeBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    const data = await res.json() as Booking & { error?: string };
    if (!res.ok) throw new Error(data.error ?? t("errServer"));
    refresh();
  }

  async function assignTables(bookingId: string, tableIds: string[]) {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assign", tableIds }),
    });
    const data = await res.json() as Booking & { error?: string };
    if (!res.ok) throw new Error(data.error ?? t("errServer"));
    refresh();
  }

  async function handleSeed(action: "seed" | "reset") {
    setSeeding(true);
    setSeedMsg(null);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      setSeedMsg(action === "seed" ? t("adminSeedSuccess") : t("adminResetSuccess"));
      refresh();
    } catch {
      setSeedMsg(t("errServer"));
    } finally {
      setSeeding(false);
    }
  }

  const today = todayHCM();
  const tomorrow = formatDateLocal(
    (() => { const d = nowInHCM(); d.setDate(d.getDate() + 1); return d; })()
  );

  const filteredBookings = bookings.filter((b) => {
    if (dateFilter === "today") return b.date === today;
    if (dateFilter === "tomorrow") return b.date === tomorrow;
    if (dateFilter === "custom" && customDate) return b.date === customDate;
    return true;
  });

  const cols = [
    t("adminColId"),
    t("adminColBranch"),
    t("adminColSession"),
    t("adminColDate"),
    t("adminColTime"),
    t("adminColGuests"),
    t("adminColName"),
    t("adminColPhone"),
    t("adminColStatus"),
    t("adminColAction"),
    t("tableSuggestionLabel"),
  ];

  return (
    <div className="space-y-6">
      {/* Birthday alerts */}
      <BirthdayAlertPanel customers={customers} />

      {/* Availability summary */}
      <AvailabilityPanel bookings={bookings} />

      {/* Date filter */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-xs font-semibold text-gray-500 shrink-0">{t("filterByDate")}:</span>
        {(["all", "today", "tomorrow"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setDateFilter(f)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              dateFilter === f
                ? "bg-brand-red text-white"
                : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f === "all" ? t("filterAll") : f === "today" ? t("filterToday") : t("filterTomorrow")}
          </button>
        ))}
        <input
          type="date"
          value={customDate}
          onChange={(e) => { setCustomDate(e.target.value); setDateFilter("custom"); }}
          className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
            dateFilter === "custom"
              ? "border-brand-red text-gray-900"
              : "border-gray-200 text-gray-500"
          }`}
          aria-label={t("filterPickDate")}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" aria-live="polite" aria-atomic="true">
          <div
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              loading ? "bg-brand-gold animate-pulse" : "bg-emerald-500"
            }`}
            aria-hidden="true"
          />
          <span className="text-xs text-gray-600">
            {loading ? t("loading") : `${filteredBookings.length}${dateFilter !== "all" ? `/${bookings.length}` : ""} ${lang === "vi" ? "đặt bàn" : "bookings"}`}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSeed("seed")}
            disabled={seeding}
            className="rounded-lg border border-brand-red bg-white px-3 py-1.5 text-xs font-semibold text-brand-red hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {t("adminBtnSeedData")}
          </button>
          <button
            onClick={() => handleSeed("reset")}
            disabled={seeding}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {t("adminBtnReset")}
          </button>
        </div>
      </div>

      {seedMsg && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {seedMsg}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredBookings.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-4xl" aria-hidden="true">🦞</span>
            <p className="mt-3 text-sm">{t("adminEmptyState")}</p>
          </div>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {cols.map((col, i) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap${
                      i === 7 ? " hidden sm:table-cell" : ""
                    }${
                      i === 10 ? " hidden lg:table-cell" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && filteredBookings.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {Array.from({ length: 11 }).map((_, j) => (
                        <td key={j} className={`px-4 py-3${j === 7 ? " hidden sm:table-cell" : ""}${j === 10 ? " hidden lg:table-cell" : ""}`}>
                          <div className="h-4 animate-pulse rounded bg-gray-100" style={{ width: `${60 + (j * 17) % 40}px` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : filteredBookings.map((b) => (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      allBookings={bookings}
                      onConfirm={confirmBooking}
                      onArrive={arriveBooking}
                      onNoShow={noShowBooking}
                      onComplete={completeBooking}
                      onAssign={assignTables}
                    />
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Availability panel — 2 branch blocks, each with lunch + dinner ────────────

function AvailabilityPanel({ bookings }: { bookings: Booking[] }) {
  const { t, lang } = useTranslation();
  const today = todayHCM();

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <h2 className="mb-3 text-sm font-bold text-blue-900">{t("adminAvailTitle")} — {today}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {BRANCHES.map((branch) => {
          const branchName = lang === "vi"
            ? branch.nameVi.replace("Poseidon ", "")
            : branch.nameEn.replace("Poseidon ", "");
          return (
            <div key={branch.id} className="rounded-lg border border-blue-200 bg-white p-3 shadow-sm">
              <h3 className="mb-2 text-xs font-bold text-gray-800 truncate">{branchName}</h3>
              <div className="space-y-3">
                {SESSIONS.map((session) => {
                  const sessionName = lang === "vi" ? session.labelVi : session.labelEn;
                  const avail = computeAvailability(bookings, branch.id, session.id, today);
                  const freeRatio = avail.capacity > 0 ? avail.available / avail.capacity : 1;
                  const barColor = freeRatio > 0.3
                    ? "bg-emerald-500"
                    : freeRatio > 0
                    ? "bg-amber-400"
                    : "bg-red-500";
                  return (
                    <div key={session.id}>
                      <p className="mb-1 text-xs font-semibold text-gray-600">{sessionName}</p>
                      <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-1.5 rounded-full transition-all ${barColor}`}
                          style={{ width: `${Math.round(freeRatio * 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-600">
                        <span>
                          {t("adminAvailFree")}:{" "}
                          <strong className="text-gray-900">{avail.available}</strong>
                        </span>
                        <span>
                          {t("adminAvailBooked")}: {avail.booked}/{avail.capacity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Birthday alert panel ──────────────────────────────────────────────────────

function BirthdayAlertPanel({ customers }: { customers: Customer[] }) {
  const { t, lang } = useTranslation();

  const upcoming = upcomingBirthdays(customers);
  if (upcoming.length === 0) return null;

  return (
    <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-pink-900">
        <span aria-hidden>🎂</span>
        {t("adminBirthdayTitle")}
      </h2>
      <ul className="space-y-2">
        {upcoming.map((c) => (
          <li key={c.id} className="flex items-start gap-3 rounded-lg border border-pink-200 bg-white px-3 py-2.5 text-sm shadow-sm">
            <span className="mt-0.5 text-lg shrink-0" aria-hidden>🎉</span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">
                {c.name}
                <span className="ml-2 text-xs font-normal text-gray-400">({formatBirthday(c.birthday)})</span>
              </p>
              <p className="text-xs text-gray-500">{c.phone}</p>
              <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                {lang === "vi" ? "Mã tài khoản" : "Customer ID"}: {c.id}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-pink-600">
                <span>🎁</span>
                {t("adminBirthdayVoucherIssued")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Returns customers whose birthday (MM-DD) falls within the next 7 days in HCM time. */
function upcomingBirthdays(customers: Customer[]): Customer[] {
  const now = nowInHCM();
  const results: Customer[] = [];

  for (const c of customers) {
    if (!c.birthday || !/^\d{2}-\d{2}$/.test(c.birthday)) continue;
    const [mm, dd] = c.birthday.split("-").map(Number);

    for (let offset = 0; offset <= 7; offset++) {
      const check = new Date(now);
      check.setDate(check.getDate() + offset);
      if (check.getMonth() + 1 === mm && check.getDate() === dd) {
        results.push(c);
        break;
      }
    }
  }
  return results;
}
