"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { HOLD_MINUTES, TIMEZONE } from "@/lib/constants";

const HOLD_SECS = HOLD_MINUTES * 60; // 900

interface Props {
  holdExpiresAt: string; // ISO – arrivalTime + 15 min in Asia/Ho_Chi_Minh
}

function secsUntilExpiry(holdExpiresAt: string): number {
  return Math.max(0, Math.floor((new Date(holdExpiresAt).getTime() - Date.now()) / 1000));
}

/** Format an ISO timestamp as HH:MM in Asia/Ho_Chi_Minh. */
function formatHCMTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function HoldCountdown({ holdExpiresAt }: Props) {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    secsUntilExpiry(holdExpiresAt)
  );

  // Recompute from wall clock every second so:
  //  • the value stays accurate across tab suspends
  //  • the phase transition (pre-arrival → countdown) happens automatically
  useEffect(() => {
    const id = setInterval(
      () => setSecondsLeft(secsUntilExpiry(holdExpiresAt)),
      1000
    );
    return () => clearInterval(id);
  }, [holdExpiresAt]);

  // ── Expired ───────────────────────────────────────────────────────────────
  if (secondsLeft <= 0) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
        <span className="text-lg">⚠️</span>
        <p className="text-sm text-red-700">{t("holdExpired")}</p>
      </div>
    );
  }

  // ── Before arrival window: show the wall-clock time the hold runs until ──
  if (secondsLeft > HOLD_SECS) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <span className="text-lg">🕐</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">{t("holdTitle")}</p>
          <p className="mt-0.5 text-sm text-amber-700">
            {t("holdUntilPrefix")}{" "}
            <span className="font-mono font-bold">{formatHCMTime(holdExpiresAt)}</span>
          </p>
        </div>
      </div>
    );
  }

  // ── Within the 15-minute grace period: live MM:SS countdown ──────────────
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <span className="text-lg">⏳</span>
      <div>
        <p className="text-sm font-semibold text-amber-800">{t("holdTitle")}</p>
        <p className="mt-0.5 text-sm text-amber-700">
          {t("holdExpires")}:{" "}
          <span className="font-mono font-bold">
            {mm}:{ss}
          </span>
        </p>
      </div>
    </div>
  );
}
