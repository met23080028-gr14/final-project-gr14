"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { AdminGate } from "@/components/admin/AdminGate";
import { BookingTable } from "@/components/admin/BookingTable";
import DemandChartLazy from "@/components/admin/DemandChartLazy";

export default function AdminPage() {
  const { t } = useTranslation();

  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("adminTitle")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("adminSubtitle")}</p>
          </div>
          <Link
            href="/admin/scan"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-red bg-red-50 px-4 py-2.5 text-sm font-semibold text-brand-red hover:bg-red-100 transition-colors"
          >
            🔲 {t("adminScanLink")}
          </Link>
        </div>

        <BookingTable />

        <hr className="my-10 border-gray-200" />

        <DemandChartLazy />
      </main>
    </AdminGate>
  );
}
