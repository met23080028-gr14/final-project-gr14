"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BookingTable } from "@/components/admin/BookingTable";
import DemandChartLazy from "@/components/admin/DemandChartLazy";

export default function AdminPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("adminTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("adminSubtitle")}</p>
      </div>

      <BookingTable />

      <hr className="my-10 border-gray-200" />

      <DemandChartLazy />
    </main>
  );
}
