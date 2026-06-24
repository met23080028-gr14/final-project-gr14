import { nanoid } from "nanoid";
import type { Booking, BranchId, SessionId } from "@/lib/types";
import { getAllBookings, saveBooking } from "@/lib/db";
import {
  computeAvailability,
  tablesNeeded,
  computeHoldExpiry,
  resolveBookingDate,
  effectiveStatus,
} from "@/lib/booking-utils";
import { BRANCHES, SESSIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = await getAllBookings();
    // Apply lazy expiry before returning
    const resolved = bookings.map((b) => ({
      ...b,
      status: effectiveStatus(b),
    }));
    return Response.json(resolved);
  } catch {
    return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      branch: BranchId;
      session: SessionId;
      date: string;
      arrivalTime: string;
      partySize: number;
      customerName: string;
      customerPhone: string;
    };

    const { branch, session, date, arrivalTime, partySize, customerName, customerPhone } = body;

    // ── Validate inputs ──────────────────────────────────────────────────────
    if (
      !branch || !session || !date || !arrivalTime ||
      !partySize || !customerName || !customerPhone
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!BRANCHES.find((b) => b.id === branch)) {
      return Response.json({ error: "Invalid branch" }, { status: 400 });
    }
    if (!SESSIONS.find((s) => s.id === session)) {
      return Response.json({ error: "Invalid session" }, { status: 400 });
    }
    if (partySize < 1 || partySize > 50) {
      return Response.json({ error: "Party size must be 1–50" }, { status: 400 });
    }
    if (!/^0\d{9}$/.test(customerPhone.replace(/\s/g, ""))) {
      return Response.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // ── Kitchen-hours rule: resolve final date ───────────────────────────────
    const { date: finalDate } = resolveBookingDate(date, session);

    // ── Availability check (recompute on every write to avoid stale cache) ───
    const allBookings = await getAllBookings();
    const avail = computeAvailability(allBookings, branch, session, finalDate);
    const needed = tablesNeeded(partySize);

    if (avail.available < needed) {
      return Response.json({ error: "No tables available" }, { status: 409 });
    }

    // ── Create booking ───────────────────────────────────────────────────────
    const now = new Date().toISOString();
    const booking: Booking = {
      id: nanoid(10),
      branch,
      session,
      date: finalDate,
      arrivalTime,
      partySize,
      tablesNeeded: needed,
      customerName: customerName.trim(),
      customerPhone: customerPhone.replace(/\s/g, ""),
      status: "pending",
      createdAt: now,
      holdExpiresAt: computeHoldExpiry(finalDate, arrivalTime),
    };

    await saveBooking(booking);
    return Response.json(booking, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
