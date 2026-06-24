"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";
import { LoginWidget } from "@/components/customer/LoginWidget";
import { BirthdayBanner } from "@/components/customer/BirthdayBanner";
import { MyBookings } from "@/components/customer/MyBookings";
import { BookingForm } from "@/components/customer/BookingForm";

export default function CustomerPage() {
  const { t } = useTranslation();
  const { customer, loaded } = useCustomerContext();
  // Guest mode: user explicitly skipped login
  const [guestMode, setGuestMode] = useState(false);

  // Avoid hydration mismatch — show skeleton until localStorage is read
  if (!loaded) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-2">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-28 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
      </main>
    );
  }

  const showLogin = !customer && !guestMode;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("formTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">Buffet Poseidon</p>
      </div>

      {/* Login widget — hidden once logged in or guest mode chosen */}
      {showLogin && <LoginWidget onGuest={() => setGuestMode(true)} />}

      {/* Birthday voucher banner — only for logged-in customers */}
      {customer && <BirthdayBanner customer={customer} />}

      {/* My bookings — only for logged-in customers */}
      {customer && <MyBookings customerId={customer.id} />}

      {/* Booking form — always visible (guest or logged-in) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <BookingForm customer={customer} />
      </div>
    </main>
  );
}
