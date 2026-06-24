"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { suggestTables, getOccupiedTableIds } from "@/lib/table-assignment";
import { TABLES, TABLE_MAP } from "@/lib/constants";
import type { Booking, TableDef } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/vi";

interface Props {
  booking: Booking;
  allBookings: Booking[];
  onAssign: (bookingId: string, tableIds: string[]) => Promise<void>;
}

export function TableSuggestion({ booking, allBookings, onAssign }: Props) {
  const { t, lang } = useTranslation();
  const [assigning, setAssigning] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideIds, setOverrideIds] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const assigned = booking.assignedTableIds ?? [];
  const isAssigned = assigned.length > 0;

  const suggestion = useMemo(
    () => suggestTables(booking, allBookings, TABLES),
    [booking, allBookings]
  );

  const occupied = useMemo(
    () => getOccupiedTableIds(allBookings, booking.branch, booking.session, booking.date, booking.id),
    [allBookings, booking]
  );

  const freeTables = useMemo(
    () => TABLES.filter((t) => t.branchId === booking.branch && !occupied.has(t.id)),
    [occupied, booking.branch]
  );

  function buildReason(): string {
    if (!suggestion.feasible) {
      return suggestion.kind === "no-free" ? t("tableNoFree") : t("tableOverflow");
    }
    const ids = suggestion.tableIds.join(", ");
    const seats = suggestion.totalSeats;
    const wasted = suggestion.wastedSeats;
    const party = booking.partySize;
    if (lang === "vi") {
      const kindStr = suggestion.tableIds.length === 1 ? "1 bàn" : `${suggestion.tableIds.length} bàn`;
      return `${kindStr} (${ids}) — ${seats} ${t("tableSeats")}, phù hợp ${party} khách, thừa ${wasted} ${t("tableSeats")}`;
    }
    const kindStr = suggestion.tableIds.length === 1 ? "1 table" : `${suggestion.tableIds.length} tables`;
    return `${kindStr} (${ids}) — ${seats} ${t("tableSeats")}, fits ${party} guests, ${wasted} wasted`;
  }

  async function handleAssign(tableIds: string[]) {
    setAssigning(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await onAssign(booking.id, tableIds);
      setSuccessMsg(t("tableAssignSuccess"));
      setShowOverride(false);
      setOverrideIds([]);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : t("errServer"));
    } finally {
      setAssigning(false);
    }
  }

  function toggleOverride(id: string) {
    setOverrideIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Tables available for the override panel = free + currently-assigned (so re-selection works)
  const overrideTables = useMemo(() => {
    const seen = new Set<string>();
    const combined = [
      ...freeTables,
      ...assigned.map((id) => TABLE_MAP[id]).filter(Boolean) as TableDef[],
    ];
    return combined.filter((tbl) => {
      if (seen.has(tbl.id)) return false;
      seen.add(tbl.id);
      return true;
    });
  }, [freeTables, assigned]);

  if (isAssigned) {
    return (
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-emerald-700">{t("tableAssigned")}</p>
        <div className="flex flex-wrap gap-1">
          {assigned.map((tid) => {
            const tbl = TABLE_MAP[tid];
            return (
              <span
                key={tid}
                title={tbl ? (lang === "vi" ? tbl.zoneVi : tbl.zoneEn) : ""}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
              >
                {tid}
                {tbl && <span className="text-emerald-500">·{tbl.seats}{t("tableSeats")}</span>}
              </span>
            );
          })}
        </div>
        <button
          onClick={() => { setShowOverride(true); setOverrideIds(assigned); }}
          className="text-xs text-gray-400 underline hover:text-gray-600"
        >
          {t("tableBtnReassign")}
        </button>
        {showOverride && (
          <OverridePanel
            tables={overrideTables}
            selected={overrideIds}
            onToggle={toggleOverride}
            onConfirm={() => handleAssign(overrideIds)}
            onCancel={() => { setShowOverride(false); setOverrideIds([]); }}
            assigning={assigning}
            lang={lang}
            t={t}
          />
        )}
        {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
        {successMsg && <p className="text-xs text-emerald-600">{successMsg}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {t("tableSuggestionLabel")}
      </p>

      {suggestion.feasible ? (
        <>
          <div className="flex flex-wrap gap-1">
            {suggestion.tableIds.map((tid) => {
              const tbl = TABLE_MAP[tid];
              return (
                <span
                  key={tid}
                  title={tbl ? (lang === "vi" ? tbl.zoneVi : tbl.zoneEn) : ""}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                >
                  {tid}
                  {tbl && <span className="text-blue-400">·{tbl.seats}{t("tableSeats")}</span>}
                </span>
              );
            })}
          </div>
          <p className="text-xs italic text-gray-400">{buildReason()}</p>

          {successMsg && <p className="text-xs text-emerald-600">{successMsg}</p>}
          {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

          {!showOverride ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAssign(suggestion.tableIds)}
                disabled={assigning}
                className="rounded bg-brand-red px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
              >
                {assigning ? "…" : t("tableBtnAssign")}
              </button>
              <button
                onClick={() => setShowOverride(true)}
                className="text-xs text-gray-400 underline hover:text-gray-600"
              >
                {t("tableOverrideLabel")}
              </button>
            </div>
          ) : (
            <OverridePanel
              tables={overrideTables}
              selected={overrideIds}
              onToggle={toggleOverride}
              onConfirm={() => handleAssign(overrideIds)}
              onCancel={() => { setShowOverride(false); setOverrideIds([]); }}
              assigning={assigning}
              lang={lang}
              t={t}
            />
          )}
        </>
      ) : (
        <p className="text-xs font-medium text-red-600">
          {suggestion.kind === "no-free" ? t("tableNoFree") : t("tableOverflow")}
        </p>
      )}
    </div>
  );
}

// ── Override panel ────────────────────────────────────────────────────────────

interface OverridePanelProps {
  tables: TableDef[];
  selected: string[];
  onToggle: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  assigning: boolean;
  lang: string;
  t: (key: keyof Dictionary) => string;
}

function OverridePanel({ tables, selected, onToggle, onConfirm, onCancel, assigning, lang, t }: OverridePanelProps) {
  if (tables.length === 0) {
    return <p className="text-xs text-red-500">{t("tableNoFree")}</p>;
  }
  return (
    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-2 space-y-2">
      <p className="text-xs font-medium text-gray-600">{t("tableOverrideLabel")}:</p>
      <div className="max-h-36 overflow-y-auto space-y-1">
        {tables.map((tbl) => (
          <label key={tbl.id} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(tbl.id)}
              onChange={() => onToggle(tbl.id)}
              className="rounded border-gray-300 accent-brand-red"
            />
            <span className="text-xs text-gray-700">
              <span className="font-medium">{tbl.id}</span>
              {" · "}
              {tbl.seats}{t("tableSeats")}
              {" · "}
              {lang === "vi" ? tbl.zoneVi : tbl.zoneEn}
            </span>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={assigning || selected.length === 0}
          className="rounded bg-brand-red px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
        >
          {assigning ? "…" : t("tableBtnConfirmOverride")}
        </button>
        <button
          onClick={onCancel}
          className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {t("confirmationClose")}
        </button>
      </div>
    </div>
  );
}
