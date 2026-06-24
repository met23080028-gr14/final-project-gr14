"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslation } from "@/lib/i18n/context";
import { BRANCHES } from "@/lib/constants";
import { buildHourlyData, buildWeekdayData } from "@/lib/chart-utils";
import type { BranchId } from "@/lib/types";

type BranchFilter = "all" | BranchId;

// Brand palette
const COLOR_LUNCH  = "#f5a623"; // amber gold
const COLOR_DINNER = "#8b1a1a"; // crimson
const OPACITY_PEAK    = 1;
const OPACITY_OFFPEAK = 0.38;

export default function DemandChart() {
  const { t, lang } = useTranslation();
  const [branch, setBranch] = useState<BranchFilter>("all");

  const hourlyData  = useMemo(() => buildHourlyData(branch, lang),  [branch, lang]);
  const weekdayData = useMemo(() => buildWeekdayData(branch, lang), [branch, lang]);

  return (
    <section className="mt-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-red">
            {t("analyticsTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 italic">
            {t("analyticsDataNote")}
          </p>
        </div>

        {/* Branch filter */}
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="analytics-branch" className="text-gray-600 shrink-0">
            {t("analyticsFilterBranch")}:
          </label>
          <select
            id="analytics-branch"
            value={branch}
            onChange={e => setBranch(e.target.value as BranchFilter)}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
          >
            <option value="all">{t("analyticsAllBranches")}</option>
            {BRANCHES.map(b => (
              <option key={b.id} value={b.id}>
                {lang === "vi" ? b.nameVi : b.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Peak / off-peak legend strip */}
      <PeakLegend
        peakLabel={t("analyticsPeak")}
        offPeakLabel={t("analyticsOffPeak")}
      />

      {/* Hourly chart */}
      <ChartCard title={t("analyticsHourlyTitle")}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={hourlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: t("analyticsYAxisGuests"),
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 11, fill: "#6b7280" },
              }}
              tick={{ fontSize: 12 }}
              width={72}
            />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            <Bar dataKey="lunch" name={t("analyticsLunchSeries")} fill={COLOR_LUNCH} radius={[3, 3, 0, 0]}>
              {hourlyData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLOR_LUNCH}
                  fillOpacity={entry.isPeak ? OPACITY_PEAK : OPACITY_OFFPEAK}
                />
              ))}
            </Bar>

            <Bar dataKey="dinner" name={t("analyticsDinnerSeries")} fill={COLOR_DINNER} radius={[3, 3, 0, 0]}>
              {hourlyData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLOR_DINNER}
                  fillOpacity={entry.isPeak ? OPACITY_PEAK : OPACITY_OFFPEAK}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Weekday chart */}
      <ChartCard title={t("analyticsWeekdayTitle")}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weekdayData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: t("analyticsYAxisBookings"),
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 11, fill: "#6b7280" },
              }}
              tick={{ fontSize: 12 }}
              width={80}
            />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            <Bar dataKey="lunch" name={t("analyticsLunchSeries")} fill={COLOR_LUNCH} radius={[3, 3, 0, 0]}>
              {weekdayData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLOR_LUNCH}
                  fillOpacity={entry.isPeak ? OPACITY_PEAK : OPACITY_OFFPEAK}
                />
              ))}
            </Bar>

            <Bar dataKey="dinner" name={t("analyticsDinnerSeries")} fill={COLOR_DINNER} radius={[3, 3, 0, 0]}>
              {weekdayData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLOR_DINNER}
                  fillOpacity={entry.isPeak ? OPACITY_PEAK : OPACITY_OFFPEAK}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function PeakLegend({ peakLabel, offPeakLabel }: { peakLabel: string; offPeakLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm bg-[#f5a623]" />
        <span>{peakLabel} – {offPeakLabel}</span>
        <span className="ml-1 text-gray-400">
          ({peakLabel.toLowerCase()}: <span className="opacity-100">■</span>{" "}
          {offPeakLabel.toLowerCase()}: <span className="opacity-40">■</span>)
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm bg-[#f5a623]" />
        <span className="text-gray-500">Lunch</span>
        <span className="inline-block h-3 w-3 rounded-sm bg-[#8b1a1a] ml-2" />
        <span className="text-gray-500">Dinner</span>
      </div>
    </div>
  );
}
