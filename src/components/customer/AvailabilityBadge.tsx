"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { AvailabilityResult } from "@/lib/types";

interface Props {
  data: AvailabilityResult | null;
  loading: boolean;
}

export function AvailabilityBadge({ data, loading }: Props) {
  const { t } = useTranslation();

  if (loading && !data) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5">
        <div className="h-3 w-3 animate-pulse rounded-full bg-gray-300" />
        <span className="text-sm text-gray-500">{t("loading")}</span>
      </div>
    );
  }

  if (!data) return null;

  const pct = data.capacity > 0 ? data.available / data.capacity : 0;
  const isFull = data.available === 0;

  const barColor = isFull
    ? "bg-red-500"
    : pct <= 0.25
    ? "bg-orange-500"
    : "bg-emerald-500";

  const textColor = isFull ? "text-red-700" : pct <= 0.25 ? "text-orange-700" : "text-emerald-700";
  const bgColor = isFull ? "bg-red-50" : pct <= 0.25 ? "bg-orange-50" : "bg-emerald-50";
  const borderColor = isFull ? "border-red-200" : pct <= 0.25 ? "border-orange-200" : "border-emerald-200";

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} px-4 py-3`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("availabilityLabel")}
          </p>
          <p className={`text-xl font-bold ${textColor}`}>
            {isFull ? (
              t("availabilityFull")
            ) : (
              <>
                {data.available}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  {t("of")} {data.capacity} {t("tablesUnit")}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${Math.round(pct * 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {data.booked} {t("tables")} booked
          </span>
        </div>
      </div>
    </div>
  );
}
