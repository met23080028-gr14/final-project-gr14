"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { isBirthdayWeek, generateBirthdayVoucher } from "@/lib/voucher";
import type { Customer } from "@/lib/types";

interface Props {
  customer: Customer;
}

export function BirthdayBanner({ customer }: Props) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (dismissed || !isBirthdayWeek(customer.birthday)) return null;

  const { code, discountPct } = generateBirthdayVoucher(customer.id, customer.birthday);

  return (
    <div className="mb-6 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl shrink-0" aria-hidden>🎂</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-pink-800">{t("birthdayBannerTitle")}</p>
          <p className="text-xs text-pink-600 mt-0.5">{t("birthdayBannerBody")}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="rounded-md border border-pink-200 bg-white px-3 py-1 font-mono text-sm font-bold text-pink-800 tracking-wider">
              {discountPct}% · {code}
            </span>
            <button
              onClick={() => setShowTerms((v) => !v)}
              className="text-[11px] text-pink-400 underline underline-offset-2 hover:text-pink-600 transition-colors"
            >
              {t("voucherClickToSeeTerms")}
            </button>
          </div>
          {showTerms && (
            <p className="mt-2 rounded-md bg-pink-100 px-3 py-2 text-[11px] text-pink-700 leading-relaxed">
              {t("voucherTermsBirthdayTerms")}
              <span className="block mt-1 text-pink-400">{t("birthdayBannerNote")}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label={t("birthdayBannerDismiss")}
          className="shrink-0 rounded-full p-1 text-pink-300 hover:bg-pink-100 hover:text-pink-500 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
