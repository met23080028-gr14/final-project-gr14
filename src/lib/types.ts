export type BranchId = "le-van-luong" | "my-dinh";
export type SessionId = "lunch" | "dinner";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired";

export interface Branch {
  id: BranchId;
  nameVi: string;
  nameEn: string;
  addressVi: string;
  addressEn: string;
}

export interface Session {
  id: SessionId;
  labelVi: string;
  labelEn: string;
  /** HH:MM — when the session begins (earliest arrival) */
  startTime: string;
  /** HH:MM — when serving ends (latest arrival = holdExpiresAt cutoff) */
  endTime: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  /** MM-DD format; empty string if customer skipped it */
  birthday: string;
  /** ISO 8601 */
  createdAt: string;
}

export interface Booking {
  id: string;
  branch: BranchId;
  session: SessionId;
  /** YYYY-MM-DD in Asia/Ho_Chi_Minh */
  date: string;
  /** HH:MM chosen by customer within the session window */
  arrivalTime: string;
  partySize: number;
  tablesNeeded: number;
  customerName: string;
  customerPhone: string;
  /** Set when the customer was logged in at booking time */
  customerId?: string;
  status: BookingStatus;
  /** ISO 8601 */
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  /** ISO 8601 — arrivalTime + HOLD_MINUTES; after this treat as expired if not confirmed */
  holdExpiresAt: string;
  /** Table IDs assigned by admin via the suggestion/override UI */
  assignedTableIds?: string[];
}

export interface AvailabilityResult {
  branch: BranchId;
  session: SessionId;
  date: string;
  capacity: number;
  booked: number;
  available: number;
}

/** One physical table in a branch */
export interface TableDef {
  id: string;
  seats: 2 | 4 | 6 | 8;
  zoneVi: string;
  zoneEn: string;
  branchId: BranchId;
}

/** One record in the historical booking dataset (illustrative seed data, never in DB) */
export interface HistoricalRecord {
  date: string;         // YYYY-MM-DD
  branch: BranchId;
  session: SessionId;
  arrivalTime: string;  // "11:00", "11:30", etc.
  arrivalHour: number;  // integer hour component
  partySize: number;
  dayOfWeek: number;    // 0 = Sunday … 6 = Saturday
}

/** Result returned by the table-assignment heuristic */
export interface TableSuggestion {
  feasible: boolean;
  tableIds: string[];
  totalSeats: number;
  wastedSeats: number;
  /**
   * single   — one table fits the party
   * multi    — fewest combination of tables found (2–3 tables)
   * greedy   — greedy pack (4+ tables, last-resort)
   * no-free  — all tables in inventory are occupied
   * overflow — party is larger than all free tables combined
   */
  kind: "single" | "multi" | "greedy" | "no-free" | "overflow";
}
