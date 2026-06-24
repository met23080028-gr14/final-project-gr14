"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { isBirthday, generateBirthdayVoucher } from "@/lib/voucher";
import type { Customer } from "@/lib/types";

interface Props {
  customer: Customer;
}

export function BirthdayBanner({ customer }: Props) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !isBirthday(customer.birthday)) return null;

  const { code, discountPct } = generateBirthdayVoucher(customer.id);

  return (
    <div className="mb-6 rounded-2xl border border-pink-300 bg-pink-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>🎂</span>
          <div>
            <p className="text-base font-bold text-pink-800">{t("birthdayBannerTitle")}</p>
            <p className="mt-1 text-sm text-pink-700">{t("birthdayBannerBody")}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-pink-300 bg-white px-4 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">
                  {t("birthdayVoucherLabel")}
                </p>
                <p className="text-lg font-mono font-bold text-pink-800 tracking-wider">{code}</p>
              </div>
              <div className="rounded-lg border border-pink-300 bg-white px-4 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">
                  {t("birthdayDiscountLabel")}
                </p>
                <p className="text-lg font-bold text-pink-800">{discountPct}%</p>
              </div>
            </div>

            <p className="mt-2 text-xs text-pink-500">{t("birthdayBannerNote")}</p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label={t("birthdayBannerDismiss")}
          className="shrink-0 rounded-full p-1 text-pink-400 hover:bg-pink-100 hover:text-pink-600 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="mt-4 w-full rounded-lg border border-pink-300 bg-white py-2 text-sm font-medium text-pink-700 hover:bg-pink-50 transition-colors"
      >
        {t("birthdayBannerDismiss")}
      </button>
    </div>
  );
}
