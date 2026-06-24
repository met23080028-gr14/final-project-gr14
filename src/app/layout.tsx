import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { CustomerProvider } from "@/lib/customer-context";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Poseidon Booking",
  description: "Đặt bàn trực tuyến tại Buffet Poseidon — Buffet Hải Sản Cao Cấp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-surface">
        <I18nProvider>
          <CustomerProvider>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
          </CustomerProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
