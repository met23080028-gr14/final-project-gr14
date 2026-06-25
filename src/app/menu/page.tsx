"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/layout/SiteFooter";

const GALLERY = [
  "/poseidon-1.jpg",
  "/poseidon-2.jpg",
  "/poseidon-3.jpg",
  "/poseidon-4.jpg",
  "/poseidon-5.jpg",
];

const MENU_CATEGORIES_VI = [
  {
    emoji: "🔥",
    title: "Hải sản nướng tại quầy",
    dishes: [
      "Hàu nướng mỡ hành",
      "Ốc mít hấp mắm gừng",
      "Sò chén nướng mỡ hành",
      "Sò méo nướng mỡ hành",
      "Hà gai / sò điệp nướng mỡ hành (theo mùa)",
      "Ốc hương cháy tỏi",
      "Sò tim nướng mỡ hành",
      "Tôm nướng mọi",
      "Hàu bỏ lò nướng phô mai",
      "Ốc nhồi nướng tiêu xanh",
      "Sò sần đỏ nướng mỡ hành",
      "Ốc gai hấp/nướng (theo mùa)",
      "Ghẹ cháy tỏi",
      "Sò dương nướng mỡ hành (theo mùa/vùng)",
      "Bàn mai nướng mỡ hành",
      "Sò sữa nướng",
    ],
  },
  {
    emoji: "♨️",
    title: "Hải sản trên quầy nóng",
    dishes: [
      "Ốc hương hấp sả",
      "Bề bề (tôm tít) hấp/rang muối (theo mùa, Hà Nội)",
      "Ghẹ bơi hấp",
      "Sò lụa hai cùi hấp kiểu Thái",
      "Ghẹ cháy tỏi",
      "Hàu hấp",
      "Sò lông hấp Thái",
      "Sò sữa hấp",
      "Sò huyết sốt me",
      "Tôm càng sen nướng phô mai",
      "Cua Cà Mau hấp",
      "Tôm càng sen hấp",
      "Ốc len xào dừa (miền Trung & miền Nam)",
      "Mực ống hấp trái thơm",
      "Nghêu sò hấp Thái",
      "Cua Cà Mau sốt me",
      "Sò huyết hấp",
    ],
  },
  {
    emoji: "🥣",
    title: "Sốt chấm",
    dishes: [
      "Sốt ớt Hàn Quốc",
      "Sốt xì dầu Thái",
      "Nước mắm chua ngọt",
      "Gia vị muối tiêu",
      "Sốt mayonnaise",
      "Tương cà Cholimex",
      "Sốt mắm me",
      "Sốt ớt xanh hải sản",
      "Xì dầu Nhật",
      "Nước mắm chấm ốc",
      "Mù tạt wasabi",
      "Tương ớt Chinsu",
      "Sốt ớt đỏ hải sản",
    ],
  },
];

const MENU_CATEGORIES_EN = [
  {
    emoji: "🔥",
    title: "Grilled Seafood Station",
    dishes: [
      "Grilled oysters with spring onion oil",
      "Steamed jackfruit snails with ginger fish sauce",
      "Grilled cockles with spring onion oil",
      "Grilled clams with spring onion oil",
      "Grilled scallops / barnacles (seasonal)",
      "Garlic-glazed periwinkles",
      "Grilled blood cockles with spring onion oil",
      "Plain grilled tiger prawns",
      "Oven-baked oysters with cheese",
      "Stuffed snails with green pepper",
      "Grilled red clams with spring onion oil",
      "Steamed/grilled spiny snails (seasonal)",
      "Garlic-glazed swimming crabs",
      "Grilled razor clams with spring onion oil (seasonal/regional)",
      "Grilled sunset clams with spring onion oil",
      "Grilled milk clams",
    ],
  },
  {
    emoji: "♨️",
    title: "Hot Seafood Station",
    dishes: [
      "Lemongrass-steamed periwinkles",
      "Steamed/salt-baked mantis shrimp (seasonal, Hanoi only)",
      "Steamed swimming crab",
      "Thai-style steamed clams",
      "Garlic-glazed swimming crab",
      "Steamed oysters",
      "Thai-style steamed hairy clams",
      "Steamed milk clams",
      "Blood cockles in tamarind sauce",
      "Cheese-grilled freshwater prawns",
      "Steamed Ca Mau crab",
      "Steamed freshwater prawns",
      "Stir-fried mangrove snails with coconut (Central & South)",
      "Pineapple-steamed squid",
      "Thai-style steamed mixed shellfish",
      "Ca Mau crab in tamarind sauce",
      "Steamed blood cockles",
    ],
  },
  {
    emoji: "🥣",
    title: "Dipping Sauces",
    dishes: [
      "Korean chilli sauce",
      "Thai soy sauce",
      "Sweet & sour fish sauce",
      "Salt & pepper seasoning",
      "Mayonnaise",
      "Cholimex ketchup",
      "Tamarind fish sauce",
      "Green chilli seafood sauce",
      "Japanese soy sauce",
      "Snail dipping sauce",
      "Wasabi",
      "Chinsu chilli sauce",
      "Red chilli seafood sauce",
    ],
  },
];

export default function MenuPage() {
  const { t, lang } = useTranslation();
  const categories = lang === "vi" ? MENU_CATEGORIES_VI : MENU_CATEGORIES_EN;

  return (
    <div className="flex flex-col">
      {/* Hero strip with background image */}
      <div className="relative overflow-hidden py-16 sm:py-24" style={{ minHeight: 320 }}>
        <Image
          src="/poseidon-3.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,26,26,0.88) 0%, rgba(26,10,10,0.82) 55%, rgba(26,26,26,0.78) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400/70">
            Buffet Poseidon
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl lg:text-5xl whitespace-nowrap">
            {t("menuPageIntro")}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-white/65">
            {t("menuPageBody")}
          </p>
          <Link
            href="/dat-ban"
            className="mt-7 inline-block rounded-xl bg-brand-gold px-8 py-3 text-sm font-black text-brand-red shadow transition-all hover:bg-brand-gold-light active:scale-95"
          >
            {t("btnBook")}
          </Link>
        </div>
      </div>

      {/* Gallery section */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-xl font-black text-gray-900 sm:text-2xl">
            {t("menuGalleryTitle")}
          </h2>

          {/* Featured large image */}
          <div className="relative mb-4 aspect-[16/7] overflow-hidden rounded-2xl">
            <Image
              src="/poseidon-1.jpg"
              alt="Buffet Poseidon space"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY.slice(1).map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`Poseidon ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight categories */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "🦞", label: lang === "vi" ? "Hải sản cao cấp" : "Premium Seafood", sub: lang === "vi" ? "Tôm hùm, cua hoàng đế, bào ngư" : "Lobster, king crab, abalone" },
              { emoji: "🍣", label: lang === "vi" ? "Sashimi & Sushi" : "Sashimi & Sushi", sub: lang === "vi" ? "Cá hồi, cá ngừ, bạch tuộc tươi" : "Salmon, tuna, fresh octopus" },
              { emoji: "🔥", label: lang === "vi" ? "Món nướng đặc sắc" : "Signature Grills", sub: lang === "vi" ? "Nướng trực tiếp tại bàn theo yêu cầu" : "Live grilling at your table" },
              { emoji: "🍲", label: lang === "vi" ? "Lẩu & Súp" : "Hotpot & Soup", sub: lang === "vi" ? "Lẩu hải sản, súp bào ngư vi cá" : "Seafood hotpot, abalone soup" },
              { emoji: "🥗", label: lang === "vi" ? "Salad & Khai vị" : "Salads & Starters", sub: lang === "vi" ? "Tươi mát, đa dạng theo mùa" : "Fresh, seasonal variety" },
              { emoji: "🍮", label: lang === "vi" ? "Tráng miệng" : "Desserts", sub: lang === "vi" ? "Bánh, kem, hoa quả nhập khẩu" : "Pastries, ice cream, imported fruit" },
            ].map((cat) => (
              <div
                key={cat.label}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <span className="text-3xl leading-none">{cat.emoji}</span>
                <div>
                  <p className="font-black text-gray-900">{cat.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{cat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed menu list */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-2 text-xl font-black text-gray-900 sm:text-2xl">
            {t("menuDetailTitle")}
          </h2>
          <p className="mb-8 text-sm text-gray-500">
            {lang === "vi"
              ? "Thực đơn tự chọn gần 200 món, chủ đạo là hải sản tươi sống chế biến đa phong cách Á – Âu."
              : "~200-dish à-la-buffet menu, centred on fresh seafood prepared across Asian and European styles."}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl leading-none">{cat.emoji}</span>
                  <h3 className="font-black text-gray-900 text-sm">{cat.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {cat.dishes.map((dish) => (
                    <li key={dish} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-red" />
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            {t("menuDetailNote")}
            {" "}
            {lang === "vi"
              ? "Nội dung phỏng theo thực đơn Buffet Poseidon, dùng cho mục đích minh hoạ học tập."
              : "Content adapted from Buffet Poseidon's menu for educational/prototype purposes."}
          </p>

          <div className="mt-8 text-center">
            <Link
              href="/dat-ban"
              className="inline-block rounded-xl bg-brand-red px-8 py-3 text-sm font-black text-white shadow transition-all hover:bg-brand-red-dark active:scale-95"
            >
              {t("btnBook")}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
