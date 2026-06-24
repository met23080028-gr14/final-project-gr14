import { nanoid } from "nanoid";
import type { Booking } from "@/lib/types";
import { saveBooking, deleteAllBookings } from "@/lib/db";
import { computeHoldExpiry } from "@/lib/booking-utils";
import { todayHCM } from "@/lib/booking-utils";

export const dynamic = "force-dynamic";

function makeBooking(overrides: Partial<Booking> & Pick<Booking, "branch" | "session" | "date" | "arrivalTime" | "partySize" | "customerName" | "customerPhone" | "status">): Booking {
  const now = new Date().toISOString();
  const needed = Math.ceil(overrides.partySize / 4);
  return {
    id: nanoid(10),
    tablesNeeded: needed,
    createdAt: now,
    holdExpiresAt: computeHoldExpiry(overrides.date, overrides.arrivalTime),
    ...overrides,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { action: "seed" | "reset" };

    if (body.action === "reset") {
      await deleteAllBookings();
      return Response.json({ ok: true, action: "reset" });
    }

    if (body.action === "seed") {
      await deleteAllBookings();
      const today = todayHCM();

      // Compute yesterday and tomorrow
      const todayDate = new Date(`${today}T12:00:00+07:00`);
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrowDate = new Date(todayDate);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const tomorrow = fmt(tomorrowDate);

      const seeds: Booking[] = [
        makeBooking({
          branch: "le-van-luong",
          session: "lunch",
          date: today,
          arrivalTime: "11:30",
          partySize: 4,
          customerName: "Nguyễn Văn An",
          customerPhone: "0901234567",
          status: "confirmed",
          confirmedAt: new Date().toISOString(),
        }),
        makeBooking({
          branch: "le-van-luong",
          session: "dinner",
          date: today,
          arrivalTime: "18:00",
          partySize: 6,
          customerName: "Trần Thị Bình",
          customerPhone: "0912345678",
          status: "pending",
        }),
        makeBooking({
          branch: "my-dinh",
          session: "lunch",
          date: today,
          arrivalTime: "12:00",
          partySize: 2,
          customerName: "Lê Minh Cường",
          customerPhone: "0923456789",
          status: "pending",
        }),
        makeBooking({
          branch: "my-dinh",
          session: "dinner",
          date: today,
          arrivalTime: "19:00",
          partySize: 8,
          customerName: "Phạm Thu Dung",
          customerPhone: "0934567890",
          status: "confirmed",
          confirmedAt: new Date().toISOString(),
        }),
        makeBooking({
          branch: "le-van-luong",
          session: "dinner",
          date: tomorrow,
          arrivalTime: "17:30",
          partySize: 10,
          customerName: "Hoàng Văn Em",
          customerPhone: "0945678901",
          status: "pending",
        }),
        makeBooking({
          branch: "my-dinh",
          session: "lunch",
          date: tomorrow,
          arrivalTime: "11:00",
          partySize: 3,
          customerName: "Vũ Thị Phương",
          customerPhone: "0956789012",
          status: "pending",
        }),
      ];

      for (const b of seeds) {
        await saveBooking(b);
      }

      return Response.json({ ok: true, action: "seed", count: seeds.length });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return Response.json({ error: "Seed failed" }, { status: 500 });
  }
}
