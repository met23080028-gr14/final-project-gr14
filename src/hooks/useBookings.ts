"use client";

import { useState, useEffect, useCallback } from "react";
import type { Booking } from "@/lib/types";

const POLL_MS = 4000;

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json() as Booking[];
      setBookings(json);
      setError(null);
    } catch {
      setError("unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch_();
    const id = setInterval(() => { void fetch_(); }, POLL_MS);
    return () => clearInterval(id);
  }, [fetch_]);

  const refresh = useCallback(() => { void fetch_(); }, [fetch_]);

  return { bookings, loading, error, refresh };
}
