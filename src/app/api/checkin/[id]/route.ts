import { getBookingById, saveBooking } from "@/lib/db";
import { effectiveStatus } from "@/lib/booking-utils";
import type { BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

/**
 * POST /api/checkin/[id]
 * Idempotent: marks the booking as "arrived".
 * Re-scanning when already arrived returns the booking without error.
 * Prototype — no staff authentication.
 */
export async function POST(_req: Request, ctx: Context) {
  try {
    const { id } = await ctx.params;
    const booking = await getBookingById(id);

    if (!booking) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    const current = effectiveStatus(booking);

    // Already arrived or completed — idempotent success
    if (current === "arrived" || current === "completed") {
      return Response.json({ booking: { ...booking, status: current }, alreadyArrived: true });
    }

    // Terminal / invalid states
    if (current === "cancelled" || current === "expired" || current === "no_show") {
      return Response.json({ error: "invalid_status", status: current }, { status: 409 });
    }

    // pending or confirmed → mark arrived
    const updated = {
      ...booking,
      status: "arrived" as BookingStatus,
      arrivedAt: new Date().toISOString(),
    };
    await saveBooking(updated);
    return Response.json({ booking: updated, alreadyArrived: false });
  } catch {
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
