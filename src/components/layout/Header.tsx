"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const { t } = useTranslation();
  const { customer, loaded, logout } = useCustomerContext();
  const pathname = usePathname();

  return (
    <header className="bg-brand-red text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo + brand name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-poseidon.webp"
            alt="Poseidon logo"
            width={48}
            height={48}
            className="rounded-sm object-contain"
            priority
          />
          <div className="hidden sm:block">
            <p className="text-base font-bold leading-tight tracking-wide">
              BUFFET POSEIDON
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/70">
              {t("headerTagline")}
            </p>
          </div>
        </Link>

        {/* Nav + auth + language toggle */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            <NavLink href="/" active={pathname === "/"}>
              {t("navCustomer")}
            </NavLink>
            <NavLink href="/admin" active={pathname === "/admin"}>
              {t("navAdmin")}
            </NavLink>
          </nav>

          {/* Customer greeting + logout */}
          {loaded && customer && (
            <div className="flex items-center gap-2">
              {/* Greeting visible only on sm+ */}
              <span className="hidden sm:inline text-sm text-white/80">
                {t("loginGreeting")},{" "}
                <span className="font-semibold text-white">{customer.name.split(" ")[0]}</span>
              </span>
              <button
                onClick={logout}
                aria-label={t("logoutBtn")}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-white/80 border border-white/30 hover:bg-white/10 hover:text-white transition-colors"
              >
                {t("logoutBtn")}
              </button>
            </div>
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
        active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
