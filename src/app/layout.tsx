import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { CustomerProvider } from "@/lib/customer-context";
import { Header } from "@/components/layout/Header";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

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
    <html lang="vi" className={`h-full ${beVietnam.variable}`}>
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
