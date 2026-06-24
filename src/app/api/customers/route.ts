/**
 * POST /api/customers
 * Lightweight prototype auth — phone-based login-or-register.
 * No passwords, no tokens. Frame this clearly as a prototype in all UIs.
 *
 * Body: { phone, name, birthday? }
 * Returns: Customer (200 = existing, 201 = new)
 */

import { nanoid } from "nanoid";
import type { Customer } from "@/lib/types";
import { getCustomerByPhone, saveCustomer } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      phone?: string;
      name?: string;
      birthday?: string;
    };

    const phone = body.phone?.replace(/\s/g, "") ?? "";
    const name = body.name?.trim() ?? "";
    const birthday = body.birthday?.trim() ?? "";

    if (!/^0\d{9}$/.test(phone)) {
      return Response.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (birthday && !/^\d{2}-\d{2}$/.test(birthday)) {
      return Response.json({ error: "Birthday must be MM-DD" }, { status: 400 });
    }

    const existing = await getCustomerByPhone(phone);
    if (existing) {
      // Login: return existing record (name update not needed for prototype)
      return Response.json(existing, { status: 200 });
    }

    const customer: Customer = {
      id: nanoid(10),
      name,
      phone,
      birthday,
      createdAt: new Date().toISOString(),
    };
    await saveCustomer(customer);
    return Response.json(customer, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
