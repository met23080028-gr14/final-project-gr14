/**
 * Dual-backend data layer:
 *  • No Redis env vars  → module-level in-memory store (works out of the box for local demo)
 *  • Env vars present   → @upstash/redis (supports both UPSTASH_REDIS_* and KV_REST_API_*)
 *
 * Public interface:
 *   getAllBookings()          → Booking[]
 *   getBookingById(id)        → Booking | null
 *   saveBooking(booking)      → void
 *   deleteAllBookings()       → void
 */

import type { Booking, Customer } from "./types";

// ── Env-var detection ─────────────────────────────────────────────────────────

function getRedisUrl(): string | undefined {
  return (
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL
  );
}

function getRedisToken(): string | undefined {
  return (
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN
  );
}

const useRedis = Boolean(getRedisUrl() && getRedisToken());

// ── In-memory fallback ────────────────────────────────────────────────────────

const memStore: Map<string, Booking> = new Map();
// Customers keyed by phone (normalized, no spaces)
const customersMap: Map<string, Customer> = new Map();

// ── Upstash client (lazy-initialised only when env vars exist) ────────────────

let _redis: import("@upstash/redis").Redis | null = null;

async function getRedis(): Promise<import("@upstash/redis").Redis> {
  if (_redis) return _redis;
  const { Redis } = await import("@upstash/redis");
  _redis = new Redis({
    url: getRedisUrl()!,
    token: getRedisToken()!,
  });
  return _redis;
}

const KEYS = {
  ids: "poseidon:booking:ids",
  booking: (id: string) => `poseidon:booking:${id}`,
};

const CUSTOMER_KEYS = {
  phones: "poseidon:customer:phones",
  customer: (phone: string) => `poseidon:customer:${phone}`,
};

// ── Public API ────────────────────────────────────────────────────────────────

export async function getAllBookings(): Promise<Booking[]> {
  if (!useRedis) {
    return Array.from(memStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const redis = await getRedis();
  const ids = await redis.lrange<string>(KEYS.ids, 0, -1);
  if (ids.length === 0) return [];

  const bookings = await Promise.all(
    ids.map((id) => redis.get<Booking>(KEYS.booking(id)))
  );
  return bookings
    .filter((b): b is Booking => b !== null)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (!useRedis) {
    return memStore.get(id) ?? null;
  }
  const redis = await getRedis();
  return redis.get<Booking>(KEYS.booking(id));
}

export async function saveBooking(booking: Booking): Promise<void> {
  if (!useRedis) {
    const isNew = !memStore.has(booking.id);
    memStore.set(booking.id, booking);
    if (isNew) {
      // keep ids list in sync for in-memory too (not strictly needed but consistent)
    }
    return;
  }

  const redis = await getRedis();
  const isNew = !(await redis.exists(KEYS.booking(booking.id)));
  await redis.set(KEYS.booking(booking.id), booking);
  if (isNew) {
    await redis.lpush(KEYS.ids, booking.id);
  }
}

export async function deleteAllBookings(): Promise<void> {
  if (!useRedis) {
    memStore.clear();
    return;
  }

  const redis = await getRedis();
  const ids = await redis.lrange<string>(KEYS.ids, 0, -1);
  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.del(KEYS.booking(id));
  }
  pipeline.del(KEYS.ids);
  await pipeline.exec();
}

// ── Customer API ──────────────────────────────────────────────────────────────

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  if (!useRedis) {
    return customersMap.get(phone) ?? null;
  }
  const redis = await getRedis();
  return redis.get<Customer>(CUSTOMER_KEYS.customer(phone));
}

export async function saveCustomer(customer: Customer): Promise<void> {
  if (!useRedis) {
    customersMap.set(customer.phone, customer);
    return;
  }
  const redis = await getRedis();
  const isNew = !(await redis.exists(CUSTOMER_KEYS.customer(customer.phone)));
  await redis.set(CUSTOMER_KEYS.customer(customer.phone), customer);
  if (isNew) {
    await redis.lpush(CUSTOMER_KEYS.phones, customer.phone);
  }
}
