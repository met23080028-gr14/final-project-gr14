"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const { t } = useTranslation();
  const { customer, loaded, logout } = useCustomerContext();
  const pathname = usePathname();
  const isCustomerPage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-brand-red text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Logo + brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
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
          {/* "Gọi ngay" — hidden on very small screens */}
          <a
            href="tel:0976635533"
            className="hidden items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white sm:flex"
          >
            <Phone size={13} />
            {t("callNow")}
          </a>

          {/* Nav links */}
          <nav className="hidden items-center gap-0.5 md:flex">
            <NavLink href="/" active={pathname === "/"}>
              {t("navCustomer")}
            </NavLink>
            <NavLink href="/admin" active={pathname === "/admin"}>
              {t("navAdmin")}
            </NavLink>
          </nav>

          {/* Auth area */}
          {loaded && customer ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden text-sm text-white/75 sm:inline">
                {t("loginGreeting")},{" "}
                <span className="font-bold text-white">{customer.name.split(" ").at(-1)}</span>
              </span>
              <button
                onClick={logout}
                aria-label={t("logoutBtn")}
                className="rounded-md border border-white/30 px-2.5 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {t("logoutBtn")}
              </button>
            </div>
          ) : (
            /* Prominent login CTA — only meaningful on customer page */
            isCustomerPage && (
              <a
                href="#booking"
                className="rounded-lg bg-brand-gold px-3 py-1.5 text-xs font-bold text-brand-red shadow transition-all hover:bg-brand-gold-light active:scale-95 sm:px-4 sm:text-sm"
              >
                {t("headerLoginBtn")}
              </a>
            )
          )}

          <LanguageToggle />
        </div>
      </div>
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
