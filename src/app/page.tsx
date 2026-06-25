"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ChefHat, Users, MapPin, Award } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/layout/SiteFooter";

const HERO_IMAGES = [
  "/poseidon-1.jpg",
  "/poseidon-2.jpg",
  "/poseidon-3.jpg",
  "/poseidon-4.jpg",
  "/poseidon-5.jpg",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <HighlightsSection />
      <SiteFooter />
      <FloatingCallBtn />
    </div>
  );
}

// ── Hero with auto-advancing background slideshow ─────────────────────────────

function HeroSection() {
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden py-20 sm:py-32" style={{ minHeight: 480 }}>
      {/* Background images — fade between them */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === slide ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark gradient overlay so text stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,26,26,0.82) 0%, rgba(26,10,10,0.78) 55%, rgba(26,26,26,0.75) 100%)",
        }}
      />

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setSlide(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === slide ? "w-5 bg-brand-gold" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Diagonal stripe overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(245,166,35,0.04) 0, rgba(245,166,35,0.04) 1px, transparent 1px, transparent 40px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
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

        {/* Headline — two explicit lines prevent "Hải / Sản Đỉnh Cao" break */}
        <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">{t("heroHeadlineLine1")}</span>
          <span className="block">{t("heroHeadlineLine2")}</span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-4 text-xs text-white/60 sm:text-sm sm:whitespace-nowrap">
          {t("heroSubline")}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dat-ban"
            className="w-full rounded-xl bg-brand-gold px-8 py-3.5 text-base font-black text-brand-red shadow-lg transition-all hover:bg-brand-gold-light hover:shadow-xl active:scale-[0.97] sm:w-auto"
          >
            {t("btnBook")}
          </Link>
          <a
            href="tel:0976635533"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white sm:w-auto"
          >
            <Phone size={15} />
            {t("callNow")}: 0976 635 533
          </a>
        </div>

        <p className="mt-8 text-sm font-semibold tracking-wide text-brand-gold">
          {t("tagline")}
        </p>
      </div>
    </section>
  );
}

// ── About section (folding "Về chúng tôi") ───────────────────────────────────

function AboutSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          {/* Text */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-red/70">
              {t("navAbout")}
            </p>
            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              {t("aboutTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">{t("aboutBody")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dat-ban"
                className="rounded-xl bg-brand-red px-6 py-3 text-sm font-black text-white shadow transition-all hover:bg-brand-red-dark active:scale-95"
              >
                {t("btnBook")}
              </Link>
              <Link
                href="/gia-buffet"
                className="rounded-xl border border-brand-red px-6 py-3 text-sm font-bold text-brand-red transition-all hover:bg-brand-red/5"
              >
                {t("navPricing")}
              </Link>
            </div>
          </div>

          {/* Image collage — 2-column grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {["/poseidon-1.jpg", "/poseidon-2.jpg", "/poseidon-3.jpg", "/poseidon-4.jpg"].map(
              (src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill className="object-cover" sizes="200px" />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Highlights ────────────────────────────────────────────────────────────────

function HighlightsSection() {
  const { t } = useTranslation();
  const items = [
    { icon: <ChefHat size={22} />, label: t("highlight1Label"), sub: t("highlight1Sub") },
    { icon: <Users size={22} />, label: t("highlight2Label"), sub: t("highlight2Sub") },
    { icon: <MapPin size={22} />, label: t("highlight3Label"), sub: t("highlight3Sub") },
    { icon: <Award size={22} />, label: t("highlight4Label"), sub: t("highlight4Sub") },
  ] as const;

  return (
    <section className="border-t border-amber-100 bg-amber-50/40 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-2xl border border-amber-100 bg-white p-5 text-center shadow-sm"
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

// ── Floating call button ──────────────────────────────────────────────────────

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
