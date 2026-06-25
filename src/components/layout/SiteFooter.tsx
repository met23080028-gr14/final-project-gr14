"use client";

import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";

export function SiteFooter() {
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

          <p className="text-[10px] text-white/30">{t("footerPhotoCredit")}</p>
          <p className="text-[10px] text-white/20">© {new Date().getFullYear()} Buffet Poseidon</p>
        </div>
      </div>
    </footer>
  );
}

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
