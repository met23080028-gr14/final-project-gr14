import { getBookingById, saveBooking } from "@/lib/db";
import { canCancel, effectiveStatus } from "@/lib/booking-utils";
import { TABLE_MAP } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Context) {
  try {
    const { id } = await ctx.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ ...booking, status: effectiveStatus(booking) });
  } catch {
    return Response.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: Context) {
  try {
    const { id } = await ctx.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json() as {
      action: "confirm" | "cancel" | "assign";
      tableIds?: string[];
    };
    const { action } = body;
    const current = effectiveStatus(booking);

    if (action === "confirm") {
      if (current !== "pending") {
        return Response.json(
          { error: `Cannot confirm a ${current} booking` },
          { status: 409 }
        );
      }
      const updated = {
        ...booking,
        status: "confirmed" as BookingStatus,
        confirmedAt: new Date().toISOString(),
      };
      await saveBooking(updated);
      return Response.json(updated);
    }

    if (action === "cancel") {
      if (current === "cancelled") {
        return Response.json({ error: "Already cancelled" }, { status: 409 });
      }
      if (!canCancel(booking)) {
        return Response.json(
          { error: "Cancellation window has passed" },
          { status: 409 }
        );
      }
      const updated = {
        ...booking,
        status: "cancelled" as BookingStatus,
        cancelledAt: new Date().toISOString(),
        // Release assigned tables when cancelled
        assignedTableIds: undefined,
      };
      await saveBooking(updated);
      return Response.json(updated);
    }

    if (action === "assign") {
      if (current === "cancelled" || current === "expired") {
        return Response.json(
          { error: `Cannot assign tables to a ${current} booking` },
          { status: 409 }
        );
      }

      const tableIds = body.tableIds ?? [];

      // Validate all provided IDs exist and belong to the correct branch
      for (const tid of tableIds) {
        const table = TABLE_MAP[tid];
        if (!table) {
          return Response.json({ error: `Unknown table: ${tid}` }, { status: 400 });
        }
        if (table.branchId !== booking.branch) {
          return Response.json(
            { error: `Table ${tid} does not belong to this booking's branch` },
            { status: 400 }
          );
        }
      }

      const updated = {
        ...booking,
        assignedTableIds: tableIds.length > 0 ? tableIds : undefined,
      };
      await saveBooking(updated);
      return Response.json(updated);
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return Response.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
