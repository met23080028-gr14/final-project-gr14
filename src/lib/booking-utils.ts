import type { Booking, BranchId, SessionId, AvailabilityResult } from "./types";
import {
  TIMEZONE,
  HOLD_MINUTES,
  CANCEL_CUTOFF_HOURS,
  GUESTS_PER_TABLE,
  CAPACITY,
  SESSION_MAP,
} from "./constants";

// ── Timezone helpers ──────────────────────────────────────────────────────────

/** Current wall-clock time in Asia/Ho_Chi_Minh as a Date object. */
export function nowInHCM(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
  );
}

/** YYYY-MM-DD string for today in Asia/Ho_Chi_Minh. */
export function todayHCM(): string {
  const d = nowInHCM();
  return formatDateLocal(d);
}

/** YYYY-MM-DD from a local Date object. */
export function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse "HH:MM" string into { hours, minutes }. */
function parseHHMM(t: string): { hours: number; minutes: number } {
  const [h, m] = t.split(":").map(Number);
  return { hours: h, minutes: m };
}

/**
 * Build a Date in Asia/Ho_Chi_Minh for a given YYYY-MM-DD + HH:MM.
 * We construct it using the offset trick to avoid needing Intl.DateTimeFormat.
 */
export function hcmDatetime(date: string, time: string): Date {
  const { hours, minutes } = parseHHMM(time);
  // Create a Date string that JS will parse as local = HCM wall time
  // by constructing an ISO string with +07:00 offset.
  return new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+07:00`);
}

/** ISO string for arrivalTime + HOLD_MINUTES. */
export function computeHoldExpiry(date: string, arrivalTime: string): string {
  const arrival = hcmDatetime(date, arrivalTime);
  arrival.setMinutes(arrival.getMinutes() + HOLD_MINUTES);
  return arrival.toISOString();
}

// ── Status resolution ─────────────────────────────────────────────────────────

/**
 * Effective status of a booking: if it's "pending" but holdExpiresAt has
 * passed (lazy expiry), treat it as "expired" without a DB write.
 */
export function effectiveStatus(b: Booking): Booking["status"] {
  if (b.status !== "pending") return b.status;
  if (new Date(b.holdExpiresAt) < nowInHCM()) return "expired";
  return "pending";
}

/** True if the booking occupies tables (counts against availability). */
export function isActive(b: Booking): boolean {
  const s = effectiveStatus(b);
  return s === "pending" || s === "confirmed" || s === "arrived";
}

/** True if current HCM time is past arrivalTime + HOLD_MINUTES and booking is not yet arrived. */
export function isOverdue(b: Booking): boolean {
  const s = effectiveStatus(b);
  if (s !== "pending" && s !== "confirmed") return false;
  const holdCutoff = new Date(b.holdExpiresAt);
  return nowInHCM() > holdCutoff;
}

// ── Availability ──────────────────────────────────────────────────────────────

export function computeAvailability(
  bookings: Booking[],
  branch: BranchId,
  session: SessionId,
  date: string
): AvailabilityResult {
  const capacity = CAPACITY[branch][session];
  const booked = bookings
    .filter(
      (b) =>
        b.branch === branch &&
        b.session === session &&
        b.date === date &&
        isActive(b)
    )
    .reduce((sum, b) => sum + b.tablesNeeded, 0);
  return {
    branch,
    session,
    date,
    capacity,
    booked,
    available: Math.max(0, capacity - booked),
  };
}

export function tablesNeeded(partySize: number): number {
  return Math.ceil(partySize / GUESTS_PER_TABLE);
}

// ── Kitchen-hours rule ────────────────────────────────────────────────────────

/**
 * If the chosen session has already ended today (in HCM time), return tomorrow's
 * date string; otherwise return the original date.
 */
export function resolveBookingDate(
  requestedDate: string,
  session: SessionId
): { date: string; bumped: boolean } {
  const today = todayHCM();
  if (requestedDate !== today) return { date: requestedDate, bumped: false };

  const sessionDef = SESSION_MAP[session];
  const cutoff = hcmDatetime(today, sessionDef.cutoffTime);
  const now = new Date();

  if (now >= cutoff) {
    const tomorrow = new Date(
      new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
    );
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { date: formatDateLocal(tomorrow), bumped: true };
  }
  return { date: requestedDate, bumped: false };
}

// ── Cancellation window ───────────────────────────────────────────────────────

/** Returns true if the booking can still be cancelled (before cutoff). */
export function canCancel(b: Booking): boolean {
  const s = effectiveStatus(b);
  if (s === "cancelled" || s === "expired") return false;
  const arrival = hcmDatetime(b.date, b.arrivalTime);
  const cutoff = new Date(arrival.getTime() - CANCEL_CUTOFF_HOURS * 3600 * 1000);
  return new Date() < cutoff;
}

// ── Booking code ──────────────────────────────────────────────────────────────

/** Human-friendly booking reference: DDMMHHmm-XX (last 2 chars of id). */
export function makeBookingCode(date: string, arrivalTime: string, id: string): string {
  const [, mm, dd] = date.split("-");
  const [hh, min] = arrivalTime.split(":");
  return `${dd}${mm}${hh}${min}-${id.slice(-2).toUpperCase()}`;
}
