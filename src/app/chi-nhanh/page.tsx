"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { BRANCHES } from "@/lib/constants";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function ChiNhanhPage() {
  const { t, lang } = useTranslation();

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
        <div className="absolute inset-0 opacity-15">
          <Image src="/poseidon-2.jpg" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400/70">
            Buffet Poseidon
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            {t("branchesPageTitle")}
          </h1>
          <p className="mt-3 text-sm text-white/60">{t("branchesPageSubtitle")}</p>
        </div>
      </div>

      {/* Branch cards */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {BRANCHES.map((branch, idx) => (
              <div
                key={branch.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Branch photo */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={idx === 0 ? "/poseidon-4.jpg" : "/poseidon-5.jpg"}
                    alt={lang === "vi" ? branch.nameVi : branch.nameEn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                    }}
                  />
                  <p className="absolute bottom-3 left-4 text-sm font-black text-white drop-shadow">
                    {lang === "vi" ? branch.nameVi : branch.nameEn}
                  </p>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-brand-red" />
                    <p className="text-sm leading-relaxed text-gray-600">
                      {lang === "vi" ? branch.addressVi : branch.addressEn}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Phone size={14} className="shrink-0 text-brand-red" />
                    <a
                      href="tel:0976635533"
                      className="text-sm font-semibold text-brand-red hover:underline"
                    >
                      0976 635 533
                    </a>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl border border-brand-red py-2.5 text-center text-sm font-bold text-brand-red transition-all hover:bg-brand-red/5"
                    >
                      {t("branchesMapBtn")}
                    </a>
                    <Link
                      href={`/dat-ban?branch=${branch.id}`}
                      className="flex-1 rounded-xl bg-brand-red py-2.5 text-center text-sm font-black text-white shadow transition-all hover:bg-brand-red-dark active:scale-95"
                    >
                      {t("btnBook")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
