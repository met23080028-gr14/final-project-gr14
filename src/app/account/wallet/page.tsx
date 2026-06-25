"use client";

import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { isBirthday, generateBirthdayVoucher } from "@/lib/voucher";

interface Voucher {
  code: string;
  discountPct: number;
  tag: string;
  color: string;
  desc: string;
}

export default function WalletPage() {
  const { t } = useTranslation();
  const { customer } = useCustomerContext();

  if (!customer) return null;

  const hasBirthday = customer.birthday && isBirthday(customer.birthday);
  const bdVoucher = hasBirthday ? generateBirthdayVoucher(customer.id) : null;

  const sampleVouchers: Voucher[] = [
    {
      code: "WELCOME10",
      discountPct: 10,
      tag: t("walletSampleTag"),
      color: "from-blue-500 to-indigo-600",
      desc: t("walletMinSpend"),
    },
    {
      code: "MEMBER20",
      discountPct: 20,
      tag: t("walletSampleTag"),
      color: "from-purple-500 to-pink-600",
      desc: t("walletMinSpend"),
    },
    {
      code: "WEEKEND15",
      discountPct: 15,
      tag: t("walletSampleTag"),
      color: "from-emerald-500 to-teal-600",
      desc: t("walletMinSpend"),
    },
  ];

  const allVouchers: Voucher[] = [
    ...(bdVoucher
      ? [
          {
            code: bdVoucher.code,
            discountPct: bdVoucher.discountPct,
            tag: t("walletBirthdayTag"),
            color: "from-pink-500 to-rose-600",
            desc: t("walletMinSpend"),
          },
        ]
      : []),
    ...sampleVouchers,
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("accountWallet")}</h1>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
          ⚠️ {t("walletProtoLabel")}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {allVouchers.map((v) => (
          <div
            key={v.code}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${v.color} p-5 text-white shadow-md`}
          >
            {/* Decorative circle */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/10" />

            <div className="relative">
              <span className="rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {v.tag}
              </span>
              <p className="mt-3 text-3xl font-black">{v.discountPct}% {t("walletOff")}</p>
              <p className="mt-1 font-mono text-lg font-bold tracking-widest">{v.code}</p>
              <p className="mt-2 text-xs text-white/70">{v.desc}</p>
              <p className="mt-1 text-[10px] text-white/50">
                {t("walletExpiry")}: 31/12/2025
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        ⚠️ {t("birthdayBannerNote")}
      </p>
    </div>
  );
}
