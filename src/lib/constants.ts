import type { Branch, BranchId, Session, SessionId, TableDef } from "./types";

export const TIMEZONE = "Asia/Ho_Chi_Minh";

export const HOLD_MINUTES = 15;

/** Customers may cancel up to this many hours before their arrival time */
export const CANCEL_CUTOFF_HOURS = 2;

/** Number of guests that share one table */
export const GUESTS_PER_TABLE = 4;

export const BRANCHES: Branch[] = [
  {
    id: "le-van-luong",
    nameVi: "Poseidon Lê Văn Lương (Center Point)",
    nameEn: "Poseidon Le Van Luong (Center Point)",
    addressVi: "Tầng 5, Center Point, 27 Lê Văn Lương, Hà Nội",
    addressEn: "5F, Center Point, 27 Le Van Luong, Hanoi",
  },
  {
    id: "my-dinh",
    nameVi: "Poseidon Mỹ Đình (Sky Lake)",
    nameEn: "Poseidon My Dinh (Sky Lake)",
    addressVi: "Tầng 5, Sky Lake, 88 Phạm Hùng, Hà Nội",
    addressEn: "5F, Sky Lake, 88 Pham Hung, Hanoi",
  },
];

export const SESSIONS: Session[] = [
  {
    id: "lunch",
    labelVi: "Bữa trưa",
    labelEn: "Lunch",
    startTime: "11:00",
    endTime: "13:00",
  },
  {
    id: "dinner",
    labelVi: "Bữa tối",
    labelEn: "Dinner",
    startTime: "17:30",
    endTime: "20:00",
  },
];

/** Available tables per branch per session (90 tables × 4 seats ≈ 360 seats) */
export const CAPACITY: Record<BranchId, Record<SessionId, number>> = {
  "le-van-luong": { lunch: 90, dinner: 90 },
  "my-dinh": { lunch: 90, dinner: 90 },
};

/**
 * Physical table inventory used by the smart-assignment heuristic.
 * This is a demo floor plan (~18 tables/branch); CAPACITY above governs
 * overall booking limits independently.
 */
export const TABLES: TableDef[] = [
  // ── Lê Văn Lương (Center Point) ──────────────────────────────────────────
  // Main Hall — 4-seaters
  { id: "LVL-M01", seats: 4, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "LVL-M02", seats: 4, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "LVL-M03", seats: 4, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "LVL-M04", seats: 4, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "LVL-M05", seats: 6, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "LVL-M06", seats: 6, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "LVL-M07", seats: 8, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "LVL-M08", seats: 8, branchId: "le-van-luong", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  // Window — 2 and 4-seaters
  { id: "LVL-W01", seats: 2, branchId: "le-van-luong", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  { id: "LVL-W02", seats: 2, branchId: "le-van-luong", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  { id: "LVL-W03", seats: 4, branchId: "le-van-luong", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  { id: "LVL-W04", seats: 4, branchId: "le-van-luong", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  // VIP Room — 6 and 8-seaters
  { id: "LVL-V01", seats: 6, branchId: "le-van-luong", zoneVi: "Phòng VIP", zoneEn: "VIP Room" },
  { id: "LVL-V02", seats: 6, branchId: "le-van-luong", zoneVi: "Phòng VIP", zoneEn: "VIP Room" },
  { id: "LVL-V03", seats: 8, branchId: "le-van-luong", zoneVi: "Phòng VIP", zoneEn: "VIP Room" },
  { id: "LVL-V04", seats: 8, branchId: "le-van-luong", zoneVi: "Phòng VIP", zoneEn: "VIP Room" },

  // ── Mỹ Đình (Sky Lake) ───────────────────────────────────────────────────
  // Main Hall — 4-seaters
  { id: "MD-M01", seats: 4, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "MD-M02", seats: 4, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "MD-M03", seats: 4, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "MD-M04", seats: 4, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "MD-M05", seats: 6, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "MD-M06", seats: 6, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "MD-M07", seats: 8, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  { id: "MD-M08", seats: 8, branchId: "my-dinh", zoneVi: "Sảnh chính", zoneEn: "Main Hall" },
  // Window
  { id: "MD-W01", seats: 2, branchId: "my-dinh", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  { id: "MD-W02", seats: 2, branchId: "my-dinh", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  { id: "MD-W03", seats: 4, branchId: "my-dinh", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  { id: "MD-W04", seats: 4, branchId: "my-dinh", zoneVi: "Cạnh cửa sổ", zoneEn: "Window" },
  // Near Kids Area — 4 and 6-seaters
  { id: "MD-K01", seats: 4, branchId: "my-dinh", zoneVi: "Gần khu trẻ em", zoneEn: "Near Kids Area" },
  { id: "MD-K02", seats: 4, branchId: "my-dinh", zoneVi: "Gần khu trẻ em", zoneEn: "Near Kids Area" },
  { id: "MD-K03", seats: 6, branchId: "my-dinh", zoneVi: "Gần khu trẻ em", zoneEn: "Near Kids Area" },
  { id: "MD-K04", seats: 6, branchId: "my-dinh", zoneVi: "Gần khu trẻ em", zoneEn: "Near Kids Area" },
];

export const TABLE_MAP: Record<string, TableDef> = Object.fromEntries(
  TABLES.map((t) => [t.id, t])
);

export const BRANCH_MAP: Record<BranchId, Branch> = Object.fromEntries(
  BRANCHES.map((b) => [b.id, b])
) as Record<BranchId, Branch>;

export const SESSION_MAP: Record<SessionId, Session> = Object.fromEntries(
  SESSIONS.map((s) => [s.id, s])
) as Record<SessionId, Session>;
