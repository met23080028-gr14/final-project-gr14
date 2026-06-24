"use client";

import { useState, useEffect, useCallback } from "react";
import type { AvailabilityResult, BranchId, SessionId } from "@/lib/types";

const POLL_MS = 4000;

export function useAvailability(
  branch: BranchId | "",
  session: SessionId | "",
  date: string
) {
  const [data, setData] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!branch || !session || !date) {
      setData(null);
      return;
    }
    try {
      const res = await fetch(
        `/api/availability?branch=${branch}&session=${session}&date=${date}`
      );
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json() as AvailabilityResult;
      setData(json);
      setError(null);
    } catch {
      setError("unavailable");
    } finally {
      setLoading(false);
    }
  }, [branch, session, date]);

  useEffect(() => {
    setLoading(true);
    void fetch_();
    const id = setInterval(() => { void fetch_(); }, POLL_MS);
    return () => clearInterval(id);
  }, [fetch_]);

  return { data, loading, error };
}
