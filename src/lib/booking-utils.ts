import type { Booking, BranchId, SessionId, AvailabilityResult } from "./types";
import {
  TIMEZONE,
  HOLD_MINUTES,
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

/** YYYY-MM-DD string for tomorrow in Asia/Ho_Chi_Minh. */
export function tomorrowHCM(): string {
  const d = nowInHCM();
  d.setDate(d.getDate() + 1);
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
  // holdExpiresAt is an absolute UTC instant; compare against Date.now(), not the
  // locale-string trick in nowInHCM() which mis-shifts the clock on UTC servers.
  if (new Date(b.holdExpiresAt) < new Date()) return "expired";
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
  return new Date() > holdCutoff;
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

/**
 * True if the booking can still be cancelled.
 * Policy: the customer may cancel any time up until their arrival time.
 * We check arrival directly rather than gating on "expired" status,
 * because "expired" only reflects the 15-min hold window — not the arrival itself.
 */
export function canCancel(b: Booking): boolean {
  if (b.status === "cancelled") return false;
  const arrival = hcmDatetime(b.date, b.arrivalTime);
  return new Date() < arrival;
}

// ── Bookable slot generation ──────────────────────────────────────────────────

/**
 * Returns all arrival-time slots for a session on a given date.
 * Slots run from startTime up to (but not including) cutoffTime, every 30 min.
 * For today, only slots still in the future are returned.
 */
export function availableSlots(sessionId: SessionId, date: string): string[] {
  const s = SESSION_MAP[sessionId];
  if (!s) return [];
  const [sh, sm] = s.startTime.split(":").map(Number);
  const [eh, em] = s.cutoffTime.split(":").map(Number);
  const isToday = date === todayHCM();
  const now = new Date();
  const slots: string[] = [];
  let h = sh, m = sm;
  while (h < eh || (h === eh && m < em)) {
    const slot = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    if (!isToday || hcmDatetime(date, slot) > now) {
      slots.push(slot);
    }
    m += 30;
    if (m >= 60) { h += 1; m -= 60; }
  }
  return slots;
}

/**
 * The correct default booking date: today if any session still has bookable
 * slots today, otherwise tomorrow. Prevents the form from defaulting to a
 * date where the kitchen is fully closed.
 */
export function defaultBookingDate(): string {
  const today = todayHCM();
  const hasSlotsToday = (Object.keys(SESSION_MAP) as SessionId[]).some(
    (id) => availableSlots(id, today).length > 0
  );
  return hasSlotsToday ? today : tomorrowHCM();
}

// ── Booking code ──────────────────────────────────────────────────────────────

/** Human-friendly booking reference: DDMMHHmm-XX (last 2 chars of id). */
export function makeBookingCode(date: string, arrivalTime: string, id: string): string {
  const [, mm, dd] = date.split("-");
  const [hh, min] = arrivalTime.split(":");
  return `${dd}${mm}${hh}${min}-${id.slice(-2).toUpperCase()}`;
}

// ── Customer reliability (rule-based, derived — no separate store) ─────────────

export interface CustomerReliability {
  completedCount: number;
  noShowCount: number;
  totalDue: number;
  /** 0..1; defaults to 1 when no history. */
  score: number;
  /** Neutral key for i18n lookup: "good" | "medium" | "poor". */
  label: "good" | "medium" | "poor";
}

/**
 * Computes a customer's reliability from existing bookings.
 * Keyed by phone so it works for guests and registered customers alike.
 * Pure function — does not mutate or store anything.
 */
export function getCustomerReliability(
  phone: string,
  allBookings: Booking[]
): CustomerReliability {
  const phoneBookings = allBookings.filter((b) => b.customerPhone === phone);
  const completedCount = phoneBookings.filter((b) => b.status === "arrived").length;
  const noShowCount = phoneBookings.filter((b) => b.status === "no_show").length;
  const totalDue = completedCount + noShowCount;
  const score = totalDue > 0 ? completedCount / totalDue : 1;
  const label: CustomerReliability["label"] =
    totalDue === 0 || score >= 0.8 ? "good" :
    score >= 0.5 ? "medium" :
    "poor";
  return { completedCount, noShowCount, totalDue, score, label };
}
