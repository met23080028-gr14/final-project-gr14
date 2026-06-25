/**
 * ILLUSTRATIVE prototype voucher logic.
 * Voucher codes generated here are NOT redeemable and have no monetary value.
 * This module exists only to demonstrate the birthday-offer UX flow.
 */

import { TIMEZONE } from "./constants";

function nowHCM(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
}

/** MM-DD string for today in Asia/Ho_Chi_Minh. */
function todayMMDD(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${month}-${day}`;
}

/**
 * Parses a user-entered DD-MM string into the internal MM-DD storage format.
 * Returns null if the input is not a valid day/month combination.
 * Uses year 2000 (a leap year) so that 29-02 is accepted.
 */
export function parseBirthdayInput(input: string): string | null {
  const trimmed = input.trim();
  if (!/^\d{2}-\d{2}$/.test(trimmed)) return null;
  const [dd, mm] = trimmed.split("-").map(Number);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const d = new Date(2000, mm - 1, dd);
  if (d.getMonth() + 1 !== mm || d.getDate() !== dd) return null;
  return `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

/**
 * Formats an internal MM-DD birthday into the user-facing DD-MM display format.
 */
export function formatBirthday(internal: string): string {
  if (!internal || !/^\d{2}-\d{2}$/.test(internal)) return internal;
  const [mm, dd] = internal.split("-");
  return `${dd}-${mm}`;
}

/** Returns true when birthday (MM-DD) matches today in Asia/Ho_Chi_Minh. */
export function isBirthday(birthday: string): boolean {
  if (!birthday || !/^\d{2}-\d{2}$/.test(birthday)) return false;
  return birthday === todayMMDD();
}

/**
 * Returns true when birthday (MM-DD) falls within the next 7 days in HCM time
 * (including today). Checks offsets 0–7 so a birthday exactly 7 days away is included.
 *
 * Example: birthday 06-08 (June 8) → returns true from June 1 through June 8.
 */
export function isBirthdayWeek(birthday: string): boolean {
  if (!birthday || !/^\d{2}-\d{2}$/.test(birthday)) return false;
  const now = nowHCM();
  const [mm, dd] = birthday.split("-").map(Number);
  for (let offset = 0; offset <= 7; offset++) {
    const check = new Date(now);
    check.setDate(check.getDate() + offset);
    if (check.getMonth() + 1 === mm && check.getDate() === dd) return true;
  }
  return false;
}

/**
 * Returns the YYYY-MM-DD expiry date of the birthday voucher (= the birthday itself
 * in the nearest upcoming year in HCM time).
 */
export function birthdayVoucherExpiry(birthday: string): string {
  const now = nowHCM();
  const [mm, dd] = birthday.split("-").map(Number);
  let year = now.getFullYear();
  const candidate = new Date(year, mm - 1, dd);
  if (candidate < now) year += 1;
  const exp = new Date(year, mm - 1, dd);
  return `${exp.getFullYear()}-${String(exp.getMonth() + 1).padStart(2, "0")}-${String(exp.getDate()).padStart(2, "0")}`;
}

export interface VoucherDef {
  code: string;
  discountPct: number;
  /** Minimum bill in VND; 0 = no minimum */
  minBillVnd: number;
  /** YYYY-MM-DD */
  expiryDate: string;
}

/**
 * Generates a deterministic (but illustrative) birthday voucher.
 * 10% off, no minimum spend, valid until the customer's birthday this/next year.
 */
export function generateBirthdayVoucher(customerId: string, birthday: string): VoucherDef {
  const mmdd = todayMMDD().replace("-", "");
  const suffix = customerId.slice(-4).toUpperCase();
  return {
    code: `BD${mmdd}${suffix}`,
    discountPct: 10,
    minBillVnd: 0,
    expiryDate: birthdayVoucherExpiry(birthday),
  };
}

/**
 * General member voucher: 10% off for bills >= 1,000,000đ.
 * Illustrative only.
 */
export function generateMemberVoucher(customerId: string): VoucherDef {
  const suffix = customerId.slice(-4).toUpperCase();
  const now = nowHCM();
  const expYear = now.getFullYear();
  const exp = `${expYear}-12-31`;
  return {
    code: `MEM10${suffix}`,
    discountPct: 10,
    minBillVnd: 1_000_000,
    expiryDate: exp,
  };
}
