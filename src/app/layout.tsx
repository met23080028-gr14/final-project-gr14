import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { CustomerProvider } from "@/lib/customer-context";
import { Header } from "@/components/layout/Header";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
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
    <html lang="vi" className={`h-full ${jakartaSans.variable} ${lora.variable}`}>
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
