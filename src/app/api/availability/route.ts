import { getAllBookings } from "@/lib/db";
import { computeAvailability } from "@/lib/booking-utils";
import type { BranchId, SessionId } from "@/lib/types";
import { BRANCHES, SESSIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch") as BranchId | null;
    const session = searchParams.get("session") as SessionId | null;
    const date = searchParams.get("date");

    if (!branch || !session || !date) {
      return Response.json(
        { error: "branch, session, and date are required" },
        { status: 400 }
      );
    }
    if (!BRANCHES.find((b) => b.id === branch)) {
      return Response.json({ error: "Invalid branch" }, { status: 400 });
    }
    if (!SESSIONS.find((s) => s.id === session)) {
      return Response.json({ error: "Invalid session" }, { status: 400 });
    }

    const bookings = await getAllBookings();
    const result = computeAvailability(bookings, branch, session, date);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
