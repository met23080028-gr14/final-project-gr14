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
import { getCustomerByPhone, saveCustomer, getAllCustomers } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/customers
 * Returns all customers (admin use — birthday alert panel).
 */
export async function GET() {
  try {
    const customers = await getAllCustomers();
    return Response.json(customers);
  } catch {
    return Response.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

/**
 * PATCH /api/customers
 * Updates mutable profile fields (gender, birthday, email) for an existing customer.
 * Body: { phone, gender?, birthday?, email? }
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json() as {
      phone?: string;
      gender?: string;
      birthday?: string;
      email?: string;
    };

    const phone = body.phone?.replace(/\s/g, "") ?? "";
    if (!phone) return Response.json({ error: "Phone required" }, { status: 400 });

    const existing = await getCustomerByPhone(phone);
    if (!existing) return Response.json({ error: "Customer not found" }, { status: 404 });

    if (body.birthday !== undefined && body.birthday !== "" && !/^\d{2}-\d{2}$/.test(body.birthday)) {
      return Response.json({ error: "Birthday must be MM-DD" }, { status: 400 });
    }
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const updated = {
      ...existing,
      ...(body.gender !== undefined ? { gender: body.gender as "male" | "female" | "other" } : {}),
      ...(body.birthday !== undefined ? { birthday: body.birthday } : {}),
      ...(body.email !== undefined ? { email: body.email } : {}),
    };
    await saveCustomer(updated);
    return Response.json(updated, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}

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
