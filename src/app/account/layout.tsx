"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User, Clock, Bell, Gift, Link2, FileText, Users, Settings, LogOut,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";

const NAV_ITEMS = [
  { href: "/account/profile",       icon: User,     key: "accountProfile"       },
  { href: "/account/activity",      icon: Clock,    key: "accountActivity"      },
  { href: "/account/notifications", icon: Bell,     key: "accountNotifications" },
  { href: "/account/wallet",        icon: Gift,     key: "accountWallet"        },
  { href: "/account/linked",        icon: Link2,    key: "accountLinked"        },
  { href: "/account/terms",         icon: FileText, key: "accountTerms"         },
  { href: "/account/referral",      icon: Users,    key: "accountReferral"      },
  { href: "/account/settings",      icon: Settings, key: "accountSettings"      },
] as const;

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { customer, loaded, logout } = useCustomerContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loaded && !customer) router.push("/login");
  }, [loaded, customer, router]);

  if (!loaded || !customer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      {/* ── Mobile: horizontal scrollable tab bar ─────────────────────── */}
      <nav
        className="no-scrollbar mb-5 flex w-full gap-1.5 overflow-x-auto pb-1 lg:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? "bg-brand-red text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <Icon size={13} />
              <span className="whitespace-nowrap">{t(key)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex gap-6">
        {/* ── Desktop sidebar ──────────────────────────────────────────── */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Customer card */}
            <div className="border-b border-gray-100 bg-gradient-to-br from-red-50 to-amber-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white shadow-sm">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">{customer.name}</p>
                  <p className="truncate text-xs text-gray-400">{customer.phone}</p>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="py-1.5">
              {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-red-50 font-semibold text-brand-red"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    <span>{t(key)}</span>
                  </Link>
                );
              })}

              <div className="mx-4 my-1.5 border-t border-gray-100" />

              <button
                onClick={() => { logout(); router.push("/"); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-red-600"
              >
                <LogOut size={15} className="shrink-0" />
                <span>{t("logoutBtn")}</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
