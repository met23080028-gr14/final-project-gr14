"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { isBirthdayWeek, generateBirthdayVoucher, generateMemberVoucher, type VoucherDef } from "@/lib/voucher";

interface DisplayVoucher extends VoucherDef {
  tag: string;
  color: string;
  desc: string;
  terms: string;
}

export default function WalletPage() {
  const { t } = useTranslation();
  const { customer } = useCustomerContext();
  const [selectedVoucher, setSelectedVoucher] = useState<DisplayVoucher | null>(null);

  if (!customer) return null;

  const inBirthdayWeek = Boolean(customer.birthday && isBirthdayWeek(customer.birthday));
  const bdVoucher = inBirthdayWeek ? generateBirthdayVoucher(customer.id, customer.birthday) : null;
  const memberVoucher = generateMemberVoucher(customer.id);

  const vouchers: DisplayVoucher[] = [
    ...(bdVoucher
      ? [
          {
            ...bdVoucher,
            tag: t("walletBirthdayTag"),
            color: "from-pink-500 to-rose-600",
            desc: t("walletBirthdayWeekDesc"),
            terms: t("voucherTermsBirthdayTerms"),
          },
        ]
      : []),
    {
      ...memberVoucher,
      tag: t("walletMemberTag"),
      color: "from-indigo-500 to-violet-600",
      desc: t("walletMemberDesc"),
      terms: t("voucherTermsMemberTerms"),
    },
  ];

  function fmtExpiry(iso: string): string {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("accountWallet")}</h1>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
          ⚠️ {t("walletProtoLabel")}
        </span>
      </div>

      {vouchers.length === 0 ? (
        <p className="text-sm text-gray-500">{t("notifEmpty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vouchers.map((v) => (
            <button
              key={v.code}
              onClick={() => setSelectedVoucher(v)}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${v.color} p-5 text-white shadow-md text-left transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60`}
              aria-label={`${v.tag} — ${v.discountPct}% ${t("walletOff")} (${t("voucherClickToSeeTerms")})`}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/10" />

              <div className="relative">
                <span className="rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {v.tag}
                </span>
                <p className="mt-3 text-3xl font-black">{v.discountPct}% {t("walletOff")}</p>
                <p className="mt-1 font-mono text-lg font-bold tracking-widest">{v.code}</p>
                <p className="mt-2 text-xs text-white/80">{v.desc}</p>
                {v.minBillVnd > 0 && (
                  <p className="mt-0.5 text-xs text-white/60">
                    {t("walletMinSpendAmount")}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-white/50">
                  {t("walletExpiry")}: {fmtExpiry(v.expiryDate)}
                </p>
                <p className="mt-2 text-[10px] text-white/60 underline underline-offset-2">
                  {t("voucherClickToSeeTerms")} →
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-400">
        ⚠️ {t("birthdayBannerNote")}
      </p>

      {/* Terms modal */}
      {selectedVoucher && (
        <VoucherTermsModal
          voucher={selectedVoucher}
          fmtExpiry={fmtExpiry}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
}

function VoucherTermsModal({
  voucher,
  fmtExpiry,
  onClose,
}: {
  voucher: DisplayVoucher;
  fmtExpiry: (iso: string) => string;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voucher-modal-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Coloured header */}
        <div className={`bg-gradient-to-br ${voucher.color} p-5 text-white`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {voucher.tag}
              </span>
              <p className="mt-2 text-2xl font-black">{voucher.discountPct}% {t("walletOff")}</p>
              <p className="mt-0.5 font-mono text-base font-bold tracking-widest">{voucher.code}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-full p-1 text-white/70 hover:bg-white/20 hover:text-white"
              aria-label={t("voucherTermsClose")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terms body */}
        <div className="p-5 space-y-3">
          <h2 id="voucher-modal-title" className="text-sm font-bold text-gray-900">
            {t("voucherTermsTitle")}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{voucher.terms}</p>
          <p className="text-xs text-gray-400">{t("walletExpiry")}: {fmtExpiry(voucher.expiryDate)}</p>
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
            ⚠ {t("voucherTermsIllustrative")}
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            {t("voucherTermsClose")}
          </button>
        </div>
      </div>
    </div>
  );
}
