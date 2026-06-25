"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/layout/SiteFooter";

const GALLERY = [
  "/poseidon-1.jpg",
  "/poseidon-2.jpg",
  "/poseidon-3.jpg",
  "/poseidon-4.jpg",
  "/poseidon-5.jpg",
];

export default function MenuPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Hero strip with background image */}
      <div className="relative overflow-hidden py-16 sm:py-24" style={{ minHeight: 320 }}>
        <Image
          src="/poseidon-3.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,26,26,0.88) 0%, rgba(26,10,10,0.82) 55%, rgba(26,26,26,0.78) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400/70">
            Buffet Poseidon
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl lg:text-5xl whitespace-nowrap">
            {t("menuPageIntro")}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-white/65">
            {t("menuPageBody")}
          </p>
          <Link
            href="/dat-ban"
            className="mt-7 inline-block rounded-xl bg-brand-gold px-8 py-3 text-sm font-black text-brand-red shadow transition-all hover:bg-brand-gold-light active:scale-95"
          >
            {t("btnBook")}
          </Link>
        </div>
      </div>

      {/* Gallery section */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-xl font-black text-gray-900 sm:text-2xl">
            {t("menuGalleryTitle")}
          </h2>

          {/* Featured large image */}
          <div className="relative mb-4 aspect-[16/7] overflow-hidden rounded-2xl">
            <Image
              src="/poseidon-1.jpg"
              alt="Buffet Poseidon space"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY.slice(1).map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`Poseidon ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight categories */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "🦞", label: "Hải sản cao cấp", sub: "Tôm hùm, cua hoàng đế, bào ngư" },
              { emoji: "🍣", label: "Sashimi & Sushi", sub: "Cá hồi, cá ngừ, bạch tuộc tươi" },
              { emoji: "🔥", label: "Món nướng đặc sắc", sub: "Nướng trực tiếp tại bàn theo yêu cầu" },
              { emoji: "🍲", label: "Lẩu & Súp", sub: "Lẩu hải sản, súp bào ngư vi cá" },
              { emoji: "🥗", label: "Salad & Khai vị", sub: "Tươi mát, đa dạng theo mùa" },
              { emoji: "🍮", label: "Tráng miệng", sub: "Bánh, kem, hoa quả nhập khẩu" },
            ].map((cat) => (
              <div
                key={cat.label}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <span className="text-3xl leading-none">{cat.emoji}</span>
                <div>
                  <p className="font-black text-gray-900">{cat.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{cat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/dat-ban"
              className="inline-block rounded-xl bg-brand-red px-8 py-3 text-sm font-black text-white shadow transition-all hover:bg-brand-red-dark active:scale-95"
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
