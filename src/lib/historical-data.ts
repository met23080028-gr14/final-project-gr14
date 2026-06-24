/**
 * ILLUSTRATIVE SEED DATA — does not reflect actual Poseidon figures.
 * Generated once at module load with a deterministic seeded PRNG so the
 * chart looks consistent across hot-reloads and deployments.
 * This data is NEVER written to the DB / KV store.
 */

import type { HistoricalRecord } from "./types";
import { BRANCHES, SESSIONS, TIMEZONE } from "./constants";

// ── Deterministic PRNG (mulberry32) ──────────────────────────────────────────

function createRng(seed: number) {
  let s = seed;
  return (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng(0xdeadbeef);

function randInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  const r = rng();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return items[i];
  }
  return items[items.length - 1];
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Generator ─────────────────────────────────────────────────────────────────

function generateHistoricalData(): HistoricalRecord[] {
  const records: HistoricalRecord[] = [];

  // Anchor to "today" in HCM timezone
  const todayHCM = new Date(
    new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
  );

  // Arrival slots and bell-curve weights
  const lunchSlots  = ["11:00", "11:30", "12:00", "12:30"] as const;
  const lunchW      = [0.15, 0.38, 0.32, 0.15] as const;
  const dinnerSlots = ["17:30", "18:00", "18:30", "19:00", "19:30"] as const;
  const dinnerW     = [0.08, 0.27, 0.33, 0.22, 0.10] as const;

  // Party-size distribution (2–8 pax, 4 most common)
  const partySizes = [2, 3, 4, 5, 6, 8] as const;
  const partyW     = [0.22, 0.14, 0.30, 0.14, 0.13, 0.07] as const;

  for (let daysAgo = 1; daysAgo <= 49; daysAgo++) {
    const d = new Date(todayHCM);
    d.setDate(d.getDate() - daysAgo);
    const dateStr  = formatDate(d);
    const dow      = d.getDay(); // 0 Sun … 6 Sat
    const isWeekend = dow === 0 || dow === 6;
    const isFriSat  = dow === 5 || dow === 6;

    for (const branch of BRANCHES) {
      for (const session of SESSIONS) {
        // Base booking count per session / weekday type
        let count: number;
        if (session.id === "lunch") {
          count = isWeekend ? randInt(8, 14) : randInt(3, 7);
        } else {
          count = isWeekend ? randInt(12, 22) : randInt(5, 10);
          // Friday / Saturday dinner — peak surge
          if (isFriSat) count = Math.round(count * (1.3 + rng() * 0.3));
        }

        const slots  = session.id === "lunch" ? lunchSlots  : dinnerSlots;
        const slotsW = session.id === "lunch" ? lunchW      : dinnerW;

        for (let i = 0; i < count; i++) {
          const slot = weightedPick(slots, slotsW);
          const [h]  = slot.split(":").map(Number);
          records.push({
            date:        dateStr,
            branch:      branch.id,
            session:     session.id,
            arrivalTime: slot,
            arrivalHour: h,
            partySize:   weightedPick(partySizes, partyW),
            dayOfWeek:   dow,
          });
        }
      }
    }
  }

  return records;
}

/** 49 days × 2 branches × 2 sessions of illustrative booking records. */
export const HISTORICAL_DATA: HistoricalRecord[] = generateHistoricalData();

/** Total number of days covered by HISTORICAL_DATA. */
export const HISTORICAL_DAYS = 49;
