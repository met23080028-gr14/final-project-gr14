import { HISTORICAL_DATA, HISTORICAL_DAYS } from "./historical-data";
import type { BranchId } from "./types";

export interface HourlyDataPoint {
  hour: string;          // "11:00", "18:00", etc.
  lunch: number;         // avg total guests at this hour for lunch
  dinner: number;        // avg total guests at this hour for dinner
  isPeak: boolean;       // true for the top-3 hours
}

export interface WeekdayDataPoint {
  day: string;           // localised day label
  lunch: number;         // avg bookings per day (lunch)
  dinner: number;        // avg bookings per day (dinner)
  isPeak: boolean;       // top-2 days marked as peak
}

// ── Hour labels ───────────────────────────────────────────────────────────────

const HOUR_LABELS: Record<number, string> = {
  11: "11:00", 12: "12:00",
  17: "17:30", 18: "18:00", 19: "19:00",
};

const ALL_HOURS = [11, 12, 17, 18, 19];

// ── Weekday labels ────────────────────────────────────────────────────────────

const DOW_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;
const DOW_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

// ── Aggregation helpers ───────────────────────────────────────────────────────

/**
 * Returns average guests by arrival hour, split by session.
 * Averages are per *unique day* that had any record at that branch/session.
 */
export function buildHourlyData(
  branch: BranchId | "all",
  lang: "vi" | "en"
): HourlyDataPoint[] {
  const filtered = branch === "all"
    ? HISTORICAL_DATA
    : HISTORICAL_DATA.filter(r => r.branch === branch);

  // Sum guests per hour per session, track unique days per (session, hour) pair
  const lunchGuests: Record<number, number> = {};
  const lunchDays:   Record<number, Set<string>> = {};
  const dinnerGuests: Record<number, number> = {};
  const dinnerDays:   Record<number, Set<string>> = {};

  for (const hour of ALL_HOURS) {
    lunchGuests[hour]  = 0;
    lunchDays[hour]    = new Set();
    dinnerGuests[hour] = 0;
    dinnerDays[hour]   = new Set();
  }

  for (const rec of filtered) {
    if (rec.session === "lunch") {
      lunchGuests[rec.arrivalHour]  = (lunchGuests[rec.arrivalHour]  ?? 0) + rec.partySize;
      (lunchDays[rec.arrivalHour]   ??= new Set()).add(rec.date);
    } else {
      dinnerGuests[rec.arrivalHour] = (dinnerGuests[rec.arrivalHour] ?? 0) + rec.partySize;
      (dinnerDays[rec.arrivalHour]  ??= new Set()).add(rec.date);
    }
  }

  const points: HourlyDataPoint[] = ALL_HOURS.map(hour => ({
    hour:   HOUR_LABELS[hour] ?? `${hour}:00`,
    lunch:  lunchDays[hour].size  > 0 ? round1(lunchGuests[hour]  / lunchDays[hour].size)  : 0,
    dinner: dinnerDays[hour].size > 0 ? round1(dinnerGuests[hour] / dinnerDays[hour].size) : 0,
    isPeak: false,
  }));

  // Mark top-3 combined-value hours as peak
  const combined = points.map(p => p.lunch + p.dinner);
  const sorted   = [...combined].sort((a, b) => b - a);
  const threshold = sorted[2] ?? 0;
  points.forEach(p => {
    p.isPeak = p.lunch + p.dinner >= threshold && p.lunch + p.dinner > 0;
  });

  void lang; // lang used only for weekday labels; hour labels are already locale-neutral
  return points;
}

/**
 * Returns average bookings per day-of-week, split by session.
 * Averages are over HISTORICAL_DAYS / 7 = 7 weeks.
 */
export function buildWeekdayData(
  branch: BranchId | "all",
  lang: "vi" | "en"
): WeekdayDataPoint[] {
  const filtered = branch === "all"
    ? HISTORICAL_DATA
    : HISTORICAL_DATA.filter(r => r.branch === branch);

  const WEEKS = HISTORICAL_DAYS / 7; // 7

  const lunchSums:  number[] = new Array(7).fill(0);
  const dinnerSums: number[] = new Array(7).fill(0);

  for (const rec of filtered) {
    if (rec.session === "lunch") {
      lunchSums[rec.dayOfWeek]  += 1;
    } else {
      dinnerSums[rec.dayOfWeek] += 1;
    }
  }

  const labels = lang === "vi" ? DOW_VI : DOW_EN;

  const points: WeekdayDataPoint[] = Array.from({ length: 7 }, (_, dow) => ({
    day:    labels[dow],
    lunch:  round1(lunchSums[dow]  / WEEKS),
    dinner: round1(dinnerSums[dow] / WEEKS),
    isPeak: false,
  }));

  // Mark top-2 combined days as peak
  const combined = points.map(p => p.lunch + p.dinner);
  const sorted   = [...combined].sort((a, b) => b - a);
  const threshold = sorted[1] ?? 0;
  points.forEach(p => {
    p.isPeak = p.lunch + p.dinner >= threshold && p.lunch + p.dinner > 0;
  });

  return points;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
