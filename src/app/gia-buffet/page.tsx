"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function GiaBuffetPage() {
  const { t } = useTranslation();

  const tiers = [
    {
      title: t("pricingLunchWeekday"),
      desc: t("pricingLunchWeekdayDesc"),
      price: t("pricingLunchWeekdayPrice"),
      highlight: false,
      icon: "☀️",
    },
    {
      title: t("pricingEveningWeekend"),
      desc: t("pricingEveningWeekendDesc"),
      price: t("pricingEveningWeekendPrice"),
      highlight: true,
      icon: "🌙",
    },
    {
      title: t("pricingHoliday"),
      desc: t("pricingHolidayDesc"),
      price: t("pricingHolidayPrice"),
      highlight: false,
      icon: "🎉",
    },
    {
      title: t("pricingKids"),
      desc: t("pricingKidsDesc"),
      price: t("pricingKidsPrice"),
      highlight: false,
      icon: "🧒",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero strip */}
      <div
        className="relative overflow-hidden py-14 sm:py-20"
        style={{
          background:
            "linear-gradient(135deg, #8B1A1A 0%, #1A0A0A 55%, #1A1A1A 100%)",
        }}
      >
        {/* Background image */}
        <div className="absolute inset-0 opacity-20">
          <Image src="/poseidon-1.jpg" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400/70">
            Buffet Poseidon
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            {t("pricingPageTitle")}
          </h1>
          <p className="mt-3 text-sm text-white/60">{t("pricingPageSubtitle")}</p>
        </div>
      </div>

      {/* Pricing cards */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.title}
                className={`relative flex flex-col rounded-2xl p-6 shadow-sm ${
                  tier.highlight
                    ? "border-2 border-brand-gold bg-white"
                    : "border border-gray-200 bg-white"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-gold px-3 py-0.5 text-[11px] font-black text-brand-red">
                    Phổ biến nhất
                  </span>
                )}
                <div className="mb-4 text-3xl">{tier.icon}</div>
                <h2 className="text-base font-black text-gray-900">{tier.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{tier.desc}</p>
                <p className="mt-4 text-2xl font-black text-brand-red">{tier.price}</p>
                <p className="mt-1 text-[10px] text-gray-400">{t("pricingNote")}</p>
                <Link
                  href="/dat-ban"
                  className={`mt-5 rounded-xl py-2.5 text-center text-sm font-bold transition-all active:scale-95 ${
                    tier.highlight
                      ? "bg-brand-gold text-brand-red hover:bg-brand-gold-light"
                      : "bg-brand-red/10 text-brand-red hover:bg-brand-red/20"
                  }`}
                >
                  {t("btnBook")}
                </Link>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
            <p className="text-sm font-semibold text-amber-800">
              ⚠️ {t("pricingNote")}
            </p>
          </div>

          {/* CTA block */}
          <div className="mt-10 rounded-2xl bg-brand-red p-8 text-center text-white">
            <h2 className="text-xl font-black sm:text-2xl">{t("pricingCtaTitle")}</h2>
            <p className="mt-2 text-sm text-white/70">{t("pricingCtaBody")}</p>
            <Link
              href="/dat-ban"
              className="mt-5 inline-block rounded-xl bg-brand-gold px-8 py-3 text-sm font-black text-brand-red shadow transition-all hover:bg-brand-gold-light active:scale-95"
            >
              {t("btnBook")}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
