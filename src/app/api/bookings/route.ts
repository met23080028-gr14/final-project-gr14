import { nanoid } from "nanoid";
import type { Booking, BranchId, SessionId } from "@/lib/types";
import { getAllBookings, saveBooking } from "@/lib/db";
import {
  computeAvailability,
  tablesNeeded,
  computeHoldExpiry,
  resolveBookingDate,
  effectiveStatus,
  makeBookingCode,
} from "@/lib/booking-utils";
import { BRANCHES, SESSIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const code = searchParams.get("code");

    const phone = searchParams.get("phone");

    const bookings = await getAllBookings();
    const resolved = bookings.map((b) => ({
      ...b,
      status: effectiveStatus(b),
    }));

    if (customerId) {
      return Response.json(resolved.filter((b) => b.customerId === customerId));
    }
    if (phone) {
      return Response.json(resolved.filter((b) => b.customerPhone === phone));
    }
    if (code) {
      const normalised = code.trim().toUpperCase();
      const match = resolved.find(
        (b) => makeBookingCode(b.date, b.arrivalTime, b.id).toUpperCase() === normalised
      );
      if (!match) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json(match);
    }
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
      customerEmail?: string;
      notes?: string;
      customerId?: string;
    };

    const { branch, session, date, arrivalTime, partySize, customerName, customerPhone, customerEmail, notes, customerId } = body;

    // ── Validate inputs ──────────────────────────────────────────────────────
    if (
      !branch || !session || !date || !arrivalTime ||
      !partySize || !customerName || !customerPhone || !customerEmail
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
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
      customerEmail: customerEmail.trim(),
      ...(notes?.trim() ? { notes: notes.trim() } : {}),
      ...(customerId ? { customerId } : {}),
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
