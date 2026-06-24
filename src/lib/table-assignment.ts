import type { Booking, TableDef, TableSuggestion } from "./types";
import { isActive } from "./booking-utils";

/**
 * Suggest the best free table(s) for a booking.
 *
 * Strategy (in priority order):
 *  1. Smallest single table that fits the party (minimise wasted seats).
 *  2. Two-table combination whose combined seats fit the party and whose
 *     waste is minimal.
 *  3. Greedy pack: keep adding the largest available table until the party
 *     is covered (last resort for very large parties).
 *  4. overflow — party exceeds all free inventory, flag for manual handling.
 *  5. no-free  — every table in inventory is already assigned.
 *
 * Tables already assigned to ACTIVE bookings for the same branch/session/date
 * (excluding this booking itself) are treated as occupied.
 */
export function suggestTables(
  booking: Booking,
  allBookings: Booking[],
  inventory: TableDef[]
): TableSuggestion {
  const branchTables = inventory.filter((t) => t.branchId === booking.branch);

  // ── Build occupied set ────────────────────────────────────────────────────
  const occupied = new Set<string>();
  for (const b of allBookings) {
    if (
      b.id !== booking.id &&
      b.branch === booking.branch &&
      b.session === booking.session &&
      b.date === booking.date &&
      isActive(b) &&
      b.assignedTableIds
    ) {
      for (const tid of b.assignedTableIds) occupied.add(tid);
    }
  }

  const free = branchTables.filter((t) => !occupied.has(t.id));

  if (free.length === 0) {
    return { feasible: false, tableIds: [], totalSeats: 0, wastedSeats: 0, kind: "no-free" };
  }

  const party = booking.partySize;

  // ── 1. Single table ───────────────────────────────────────────────────────
  const singleCandidates = free
    .filter((t) => t.seats >= party)
    .sort((a, b) => a.seats - b.seats); // smallest first

  if (singleCandidates.length > 0) {
    const t = singleCandidates[0];
    return {
      feasible: true,
      tableIds: [t.id],
      totalSeats: t.seats,
      wastedSeats: t.seats - party,
      kind: "single",
    };
  }

  // ── 2. Two-table combination (minimum waste) ──────────────────────────────
  // Sort ascending so we try small+small first, giving least waste.
  const asc = [...free].sort((a, b) => a.seats - b.seats);
  let bestPair: [TableDef, TableDef] | null = null;
  let bestPairTotal = Infinity;

  for (let i = 0; i < asc.length; i++) {
    for (let j = i + 1; j < asc.length; j++) {
      const total = asc[i].seats + asc[j].seats;
      if (total >= party && total < bestPairTotal) {
        bestPairTotal = total;
        bestPair = [asc[i], asc[j]];
      }
    }
  }

  if (bestPair) {
    return {
      feasible: true,
      tableIds: [bestPair[0].id, bestPair[1].id],
      totalSeats: bestPairTotal,
      wastedSeats: bestPairTotal - party,
      kind: "multi",
    };
  }

  // ── 3. Three-table combination ────────────────────────────────────────────
  let bestTriple: [TableDef, TableDef, TableDef] | null = null;
  let bestTripleTotal = Infinity;

  for (let i = 0; i < asc.length; i++) {
    for (let j = i + 1; j < asc.length; j++) {
      for (let k = j + 1; k < asc.length; k++) {
        const total = asc[i].seats + asc[j].seats + asc[k].seats;
        if (total >= party && total < bestTripleTotal) {
          bestTripleTotal = total;
          bestTriple = [asc[i], asc[j], asc[k]];
        }
      }
    }
  }

  if (bestTriple) {
    return {
      feasible: true,
      tableIds: [bestTriple[0].id, bestTriple[1].id, bestTriple[2].id],
      totalSeats: bestTripleTotal,
      wastedSeats: bestTripleTotal - party,
      kind: "multi",
    };
  }

  // ── 4. Greedy pack (large parties that need 4+ tables) ───────────────────
  const desc = [...free].sort((a, b) => b.seats - a.seats);
  const totalFreeSeats = desc.reduce((sum, t) => sum + t.seats, 0);

  if (totalFreeSeats < party) {
    return { feasible: false, tableIds: [], totalSeats: totalFreeSeats, wastedSeats: 0, kind: "overflow" };
  }

  let remaining = party;
  const chosen: TableDef[] = [];
  for (const t of desc) {
    if (remaining <= 0) break;
    chosen.push(t);
    remaining -= t.seats;
  }
  const greedyTotal = chosen.reduce((sum, t) => sum + t.seats, 0);

  return {
    feasible: true,
    tableIds: chosen.map((t) => t.id),
    totalSeats: greedyTotal,
    wastedSeats: greedyTotal - party,
    kind: "greedy",
  };
}

/** All table IDs claimed by active bookings for a given branch/session/date. */
export function getOccupiedTableIds(
  allBookings: Booking[],
  branch: string,
  session: string,
  date: string,
  excludeBookingId?: string
): Set<string> {
  const occupied = new Set<string>();
  for (const b of allBookings) {
    if (
      b.branch === branch &&
      b.session === session &&
      b.date === date &&
      b.id !== excludeBookingId &&
      isActive(b) &&
      b.assignedTableIds
    ) {
      for (const tid of b.assignedTableIds) occupied.add(tid);
    }
  }
  return occupied;
}
