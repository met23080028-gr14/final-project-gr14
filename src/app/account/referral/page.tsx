"use client";

import { useState } from "react";
import { Copy, Check, Users } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";

export default function ReferralPage() {
  const { t } = useTranslation();
  const { customer } = useCustomerContext();
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

  const referralCode = `PSN-${customer.id.slice(0, 6).toUpperCase()}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare() {
    if (navigator.share) {
      void navigator.share({
        title: "Poseidon Buffet",
        text: `Dùng mã ${referralCode} để đăng ký và nhận ưu đãi!`,
        url: typeof window !== "undefined" ? window.location.origin : "",
      });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("accountReferral")}</h1>
        <p className="mt-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          ⚠️ {t("referralProto")}
        </p>
      </div>

      {/* Referral code card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #8B1A1A 0%, #1A0A0A 100%)" }}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-gold/10" />
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
          {t("referralYourCode")}
        </p>
        <p className="mt-2 font-mono text-3xl font-black tracking-widest text-brand-gold">
          {referralCode}
        </p>
        <p className="mt-2 text-sm text-white/70">{t("referralBonus")}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t("referralCopied") : t("referralCopy")}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-gold-light"
          >
            {t("referralShare")}
          </button>
        </div>
      </div>

      {/* Stats (illustrative) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Users size={18} className="text-gray-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">0</p>
          <p className="mt-0.5 text-xs text-gray-500">{t("referralFriendCount")}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-center shadow-sm">
          <div className="mb-2 text-2xl">🏆</div>
          <p className="text-2xl font-black text-amber-800">0</p>
          <p className="mt-0.5 text-xs text-amber-600">{t("activityPointsEarned")}</p>
        </div>
      </div>
    </div>
  );
}
