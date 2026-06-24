"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  holdExpiresAt: string;
}

export function HoldCountdown({ holdExpiresAt }: Props) {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    Math.max(0, Math.floor((new Date(holdExpiresAt).getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const expired = secondsLeft <= 0;

  if (expired) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
        <span className="text-lg">⚠️</span>
        <p className="text-sm text-red-700">{t("holdExpired")}</p>
      </div>
    );
  }

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
