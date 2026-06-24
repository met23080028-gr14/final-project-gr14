/**
 * ILLUSTRATIVE prototype voucher logic.
 * Voucher codes generated here are NOT redeemable and have no monetary value.
 * This module exists only to demonstrate the birthday-offer UX flow.
 */

import { TIMEZONE } from "./constants";

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

/** Returns true when birthday (MM-DD) matches today in Asia/Ho_Chi_Minh. */
export function isBirthday(birthday: string): boolean {
  if (!birthday || !/^\d{2}-\d{2}$/.test(birthday)) return false;
  return birthday === todayMMDD();
}

export interface BirthdayVoucher {
  code: string;
  discountPct: number;
}

/**
 * Generates a deterministic (but illustrative) voucher code for the customer.
 * Same customerId + same month-day always yields the same code.
 */
export function generateBirthdayVoucher(customerId: string): BirthdayVoucher {
  const mmdd = todayMMDD().replace("-", "");
  const suffix = customerId.slice(-4).toUpperCase();
  return { code: `BD${mmdd}${suffix}`, discountPct: 15 };
}
