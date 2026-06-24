"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useBookings } from "@/hooks/useBookings";
import { BookingRow } from "./BookingRow";
import type { Booking } from "@/lib/types";

export function BookingTable() {
  const { t } = useTranslation();
  const { bookings, loading, refresh } = useBookings();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

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
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${loading ? "bg-yellow-400 animate-pulse" : "bg-emerald-500"}`} />
          <span className="text-xs text-gray-500">
            {loading ? t("loading") : `${bookings.length} bookings`}
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
        {bookings.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-4xl">🦞</span>
            <p className="mt-3 text-sm">{t("adminEmptyState")}</p>
          </div>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {cols.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  allBookings={bookings}
                  onConfirm={confirmBooking}
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
