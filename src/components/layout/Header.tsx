"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const { t } = useTranslation();
  const { customer, loaded, logout } = useCustomerContext();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const topLinks = [
    { href: "/", label: t("navHome") },
    { href: "/gia-buffet", label: t("navPricing") },
    { href: "/menu", label: t("navMenuLink") },
    { href: "/chi-nhanh", label: t("navBranches") },
    { href: "/dat-ban", label: t("navBooking") },
  ];

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-red text-white shadow-md">
      {/* ── Top site nav bar (desktop only) ─────────────────────────── */}
      <div className="hidden border-b border-white/10 md:block">
        <nav className="mx-auto flex max-w-6xl items-center px-4 sm:px-6">
          {topLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                pathname === link.href
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Main header row ─────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Logo + brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMobile}>
          <Image
            src="/logo-poseidon.webp"
            alt="Poseidon logo"
            width={44}
            height={44}
            className="rounded-sm object-contain"
            priority
          />
          <div className="hidden sm:block">
            <p className="text-sm font-black leading-tight tracking-wide">BUFFET POSEIDON</p>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/60">
              {t("headerTagline")}
            </p>
          </div>
        </Link>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Call button — hidden on xs, shown sm+ */}
          <a
            href="tel:0976635533"
            className="hidden items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white sm:flex md:hidden lg:flex"
          >
            <Phone size={13} />
            {t("callNow")}
          </a>

          {/* Desktop nav links (admin) */}
          <nav className="hidden items-center gap-0.5 md:flex">
            <NavLink href="/dat-ban" active={pathname === "/dat-ban"}>
              {t("navBooking")}
            </NavLink>
            <NavLink href="/admin" active={pathname === "/admin"}>
              {t("navAdmin")}
            </NavLink>
          </nav>

          {/* Auth area — desktop only */}
          {loaded && customer ? (
            <Link
              href="/account"
              className="hidden items-center gap-2 rounded-lg border border-white/25 px-2.5 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:border-white/50 hover:bg-white/10 md:flex"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/25 text-[11px] font-bold">
                {customer.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden lg:inline">{customer.name.split(" ").at(-1)}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg bg-brand-gold px-3 py-1.5 text-xs font-bold text-brand-red shadow transition-all hover:bg-brand-gold-light active:scale-95 md:block md:px-4 md:text-sm"
            >
              {t("headerLoginBtn")}
            </Link>
          )}

          {/* Language toggle — desktop only */}
          <div className="hidden md:block">
            <LanguageToggle />
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? t("mobileMenuClose") : t("mobileMenuOpen")}
            aria-expanded={mobileOpen}
            className="flex items-center justify-center rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-white/15 bg-brand-red pb-4 md:hidden">
          <nav className="flex flex-col px-4 pt-2">
            {/* Site section links */}
            {topLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-white/15" />

            {/* Admin link */}
            <Link
              href="/admin"
              onClick={closeMobile}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t("navAdmin")}
            </Link>

            {/* Call */}
            <a
              href="tel:0976635533"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Phone size={14} />
              {t("callNow")}: 0976 635 533
            </a>

            <div className="my-2 border-t border-white/15" />

            {/* Auth */}
            {loaded && customer ? (
              <div className="space-y-1">
                <p className="px-3 py-1 text-xs text-white/50">
                  {t("loginGreeting")},{" "}
                  <span className="font-semibold text-white/80">{customer.name}</span>
                </p>
                <Link
                  href="/account"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                  {t("accountHub")}
                </Link>
                <button
                  onClick={() => { logout(); closeMobile(); }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {t("logoutBtn")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMobile}
                className="rounded-lg bg-brand-gold px-3 py-2.5 text-center text-sm font-bold text-brand-red transition-all hover:bg-brand-gold-light"
              >
                {t("headerLoginBtn")}
              </Link>
            )}

            <div className="my-2 border-t border-white/15" />

            {/* Language toggle */}
            <div className="px-3 pt-1">
              <LanguageToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
