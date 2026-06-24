"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, ChefHat, Users, MapPin, Award } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { LoginWidget } from "@/components/customer/LoginWidget";
import { BirthdayBanner } from "@/components/customer/BirthdayBanner";
import { MyBookings } from "@/components/customer/MyBookings";
import { BookingForm } from "@/components/customer/BookingForm";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomerPage() {
  const { customer, loaded } = useCustomerContext();
  const [guestMode, setGuestMode] = useState(false);

  if (!loaded) return <PageSkeleton />;

  const showLogin = !customer && !guestMode;

  function scrollToBooking() {
    setGuestMode(false);
    // Allow React to re-render first, then scroll
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  }

  return (
    <div className="flex flex-col">
      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <HeroSection onCta={scrollToBooking} />

      {/* ── 2-4. Main content column ────────────────────────────────── */}
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        {/* Birthday voucher — logged-in customers only */}
        {customer && <BirthdayBanner customer={customer} />}

        {/* Membership banner — non-members only */}
        {!customer && <MembershipBanner onJoin={scrollToBooking} />}

        {/* Past bookings — logged-in customers only */}
        {customer && <MyBookings customerId={customer.id} />}

        {/* Booking section */}
        <section id="booking" className="scroll-mt-20 space-y-4">
          {showLogin && <LoginWidget onGuest={() => setGuestMode(true)} />}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              <BookingSectionTitle />
            </h2>
            <BookingForm customer={customer} />
          </div>
        </section>
      </div>

      {/* ── 5. Highlights ───────────────────────────────────────────── */}
      <HighlightsSection />

      {/* ── 6. Footer ───────────────────────────────────────────────── */}
      <SiteFooter />

      {/* ── 7. Floating call button ─────────────────────────────────── */}
      <FloatingCallBtn />
    </div>
  );
}

// ── Section components ────────────────────────────────────────────────────────

function HeroSection({ onCta }: { onCta: () => void }) {
  const { t } = useTranslation();
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      style={{
        background:
          "linear-gradient(135deg, #8B1A1A 0%, #1A0A0A 55%, #1A1A1A 100%)",
      }}
    >
      {/* Subtle diagonal stripe overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(245,166,35,0.04) 0, rgba(245,166,35,0.04) 1px, transparent 1px, transparent 40px)",
        }}
      />
      {/* Gold glow bottom-left accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo-poseidon.webp"
            alt="Buffet Poseidon"
            width={96}
            height={96}
            className="rounded-2xl object-contain shadow-2xl"
            priority
          />
        </div>

        {/* Brand badge */}
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-400/70">
          {t("brandName")}
        </p>

        {/* Headline */}
        <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          {t("heroHeadline")}
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">
          {t("heroSubline")}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onCta}
            className="w-full rounded-xl bg-brand-gold px-8 py-3.5 text-base font-black text-brand-red shadow-lg transition-all hover:bg-brand-gold-light hover:shadow-xl active:scale-[0.97] sm:w-auto"
          >
            {t("btnBook")}
          </button>
          <a
            href="tel:0976635533"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white sm:w-auto"
          >
            <Phone size={15} />
            {t("callNow")}: 0976 635 533
          </a>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-xs text-white/30 tracking-wide">{t("tagline")}</p>
      </div>
    </section>
  );
}

function MembershipBanner({ onJoin }: { onJoin: () => void }) {
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
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)",
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

        <button
          onClick={onJoin}
          className="mt-5 w-full rounded-xl bg-brand-red py-3 text-sm font-black text-white shadow-md transition-all hover:bg-brand-red-dark hover:shadow-lg active:scale-[0.98] sm:w-auto sm:px-8"
        >
          {t("memberBannerCta")}
        </button>
      </div>
    </div>
  );
}

function BookingSectionTitle() {
  const { t } = useTranslation();
  return <>{t("bookingSectionTitle")}</>;
}

function HighlightsSection() {
  const { t } = useTranslation();
  const items = [
    { icon: <ChefHat size={22} />, label: t("highlight1Label"), sub: t("highlight1Sub") },
    { icon: <Users size={22} />, label: t("highlight2Label"), sub: t("highlight2Sub") },
    { icon: <MapPin size={22} />, label: t("highlight3Label"), sub: t("highlight3Sub") },
    { icon: <Award size={22} />, label: t("highlight4Label"), sub: t("highlight4Sub") },
  ] as const;

  return (
    <section className="border-t border-amber-100 bg-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-2xl border border-amber-100 bg-amber-50/60 p-5 text-center"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-red text-white shadow-sm">
                {item.icon}
              </div>
              <p className="text-lg font-black text-gray-900">{item.label}</p>
              <p className="mt-1 text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer
      className="border-t border-white/10 py-10 text-white"
      style={{ background: "#1A1A1A" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-7 text-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-poseidon.webp"
              alt="Poseidon"
              width={44}
              height={44}
              className="rounded-lg object-contain"
            />
            <div className="text-left">
              <p className="text-base font-black text-white">BUFFET POSEIDON</p>
              <p className="text-xs text-white/45">{t("footerBrand")}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-1.5 text-sm text-white/55">
            <p>{t("footerAddress")}</p>
            <p>
              {t("footerHotline")}:{" "}
              <a
                href="tel:0976635533"
                className="font-bold text-brand-gold transition-colors hover:text-brand-gold-light"
              >
                0976 635 533
              </a>
            </p>
          </div>

          {/* Social icons */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
              {t("footerFollow")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <SocialLink href="https://www.tiktok.com/@buffet_poseidon" label="TikTok">
                <TikTokIcon />
              </SocialLink>
              <SocialLink href="https://www.facebook.com/buffetposeidon" label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href="https://www.youtube.com/channel/UCBLalYs8FFfg3SrnOHAM7-w" label="YouTube">
                <YouTubeIcon />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/buffet.poseidon" label="Instagram">
                <InstagramIcon />
              </SocialLink>
            </div>
          </div>

          <p className="text-[10px] text-white/20">© {new Date().getFullYear()} Buffet Poseidon</p>
        </div>
      </div>
    </footer>
  );
}

function FloatingCallBtn() {
  const { t } = useTranslation();
  return (
    <a
      href="tel:0976635533"
      aria-label={`${t("callNow")}: 0976 635 533`}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-red px-4 py-3 text-white shadow-2xl transition-all hover:bg-brand-red-dark active:scale-95"
      style={{ animation: "pulse-glow 2.2s ease-in-out infinite" }}
    >
      <Phone size={18} className="shrink-0" />
      <span className="hidden text-sm font-bold sm:inline">{t("callNow")}</span>
    </a>
  );
}

// ── Social icon helpers ───────────────────────────────────────────────────────

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all hover:border-brand-gold hover:text-brand-gold"
    >
      {children}
    </a>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.7a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="h-64 animate-pulse" style={{ background: "#8B1A1A" }} />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        <div className="h-36 animate-pulse rounded-2xl bg-amber-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
