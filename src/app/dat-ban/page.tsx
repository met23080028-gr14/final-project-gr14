"use client";

import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { BirthdayBanner } from "@/components/customer/BirthdayBanner";
import { MyBookings } from "@/components/customer/MyBookings";
import { BookingForm } from "@/components/customer/BookingForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function DatBanPage() {
  const { customer, loaded } = useCustomerContext();
  const { t } = useTranslation();

  if (!loaded) return <PageSkeleton />;

  return (
    <div className="flex flex-col">
      {/* Page header strip */}
      <div
        className="py-8 sm:py-10"
        style={{
          background:
            "linear-gradient(135deg, #8B1A1A 0%, #1A0A0A 55%, #1A1A1A 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/70">
            Buffet Poseidon
          </p>
          <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {t("datBanPageTitle")}
          </h1>
          <p className="mt-2 text-xs text-white/55 sm:text-sm">{t("tagline")}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        {customer && <BirthdayBanner customer={customer} />}
        {!customer && <MembershipBanner />}
        {customer && <MyBookings customerId={customer.id} />}

        <section id="booking" className="scroll-mt-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">{t("bookingSectionTitle")}</h2>
            <BookingForm customer={customer} />
          </div>
        </section>
      </div>

      <SiteFooter />

      {/* Floating call button */}
      <a
        href="tel:0976635533"
        aria-label={`${t("callNow")}: 0976 635 533`}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-red px-4 py-3 text-white shadow-2xl transition-all hover:bg-brand-red-dark active:scale-95"
        style={{ animation: "pulse-glow 2.2s ease-in-out infinite" }}
      >
        <Phone size={18} className="shrink-0" />
        <span className="hidden text-sm font-bold sm:inline">{t("callNow")}</span>
      </a>
    </div>
  );
}

function MembershipBanner() {
  const { t } = useTranslation();
  const benefits = [
    { icon: "⚡", text: t("memberBenefit1") },
    { icon: "🎂", text: t("memberBenefit2") },
    { icon: "🎁", text: t("memberBenefit3") },
  ] as const;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #F5A623 0%, #E0901A 50%, #C97910 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 65%)",
        }}
      />
      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900/60">
          {t("memberBannerTag")}
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#1A1A1A] sm:text-3xl">
          {t("memberBannerTitle")}
        </h2>
        <p className="mt-2 text-sm text-amber-900/75">{t("memberBannerBody")}</p>
        <ul className="mt-4 space-y-2">
          {benefits.map((b) => (
            <li key={b.text} className="flex items-center gap-2.5 text-sm font-semibold text-amber-900">
              <span className="text-lg leading-none">{b.icon}</span>
              {b.text}
            </li>
          ))}
        </ul>
        <Link
          href="/login"
          className="mt-5 inline-block w-full rounded-xl bg-brand-red py-3 text-center text-sm font-black text-white shadow-md transition-all hover:bg-brand-red-dark hover:shadow-lg active:scale-[0.98] sm:w-auto sm:px-8"
        >
          {t("memberBannerCta")}
        </Link>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="h-40 animate-pulse" style={{ background: "#8B1A1A" }} />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        <div className="h-36 animate-pulse rounded-2xl bg-amber-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
