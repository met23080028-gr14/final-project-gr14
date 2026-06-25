"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/layout/SiteFooter";

const SECTIONS_VI = [
  {
    title: "Đa phong cách ẩm thực",
    body: "Buffet Poseidon là hệ thống chuỗi nhà hàng buffet hải sản lớn nhất Việt Nam hiện nay với 24 chi nhánh trên toàn quốc, bao gồm 6 chi nhánh tại Hà Nội, 12 chi nhánh tại TP. HCM, 2 chi nhánh tại Nha Trang, 1 chi nhánh tại Đà Nẵng, 1 chi nhánh ở Hải Phòng, 1 chi nhánh tại Bắc Ninh và 1 chi nhánh tại Biên Hoà (Đồng Nai). Lấy cảm hứng từ tên của vị thần biển Poseidon trong thần thoại Hy Lạp, Poseidon mong muốn mang lại một trải nghiệm ẩm thực đa dạng đến với mọi khách hàng. Tại Poseidon, khách hàng có thể thưởng thức thực đơn tự chọn lên tới gần 200 món ăn được chế biến tỉ mỉ, chủ đạo là các món hải sản – món quà của biển cả: ghẹ, cua, bề bề, ốc hương, cá hồi, tôm, mực cùng hàng chục món hải sản khác.",
    extra: "Thực khách được thưởng thức thỏa thích không giới hạn hàng trăm món hải sản đa phong cách cùng các món lấy cảm hứng từ Á đến Âu qua bàn tay điêu luyện của những đầu bếp hạng nhất. Điểm nhấn ở Poseidon là quầy ẩm thực quốc tế Âu - Trung - Á; quầy sushi, sashimi và salad kiểu Nhật; quầy lẩu phục vụ tại chỗ với lẩu Thái tom yum; và quầy ẩm thực chợ quê truyền thống 3 miền.",
  },
  {
    title: "Dịch vụ hạng nhất",
    body: "Bằng đam mê của những người sáng lập cùng tâm huyết của các đầu bếp, Poseidon đặc biệt chú trọng chất lượng thực phẩm và khắt khe trong các khâu chế biến. Poseidon cam kết dịch vụ chuyên nghiệp qua quy trình đào tạo, kiểm tra, giám sát nghiêm ngặt, chinh phục những thực khách khó tính nhất bằng phong cách ẩm thực khác biệt, dịch vụ tốt và chi phí tối ưu.",
    extra: "",
  },
  {
    title: "Sang trọng và thân thiện",
    body: "Mỗi chi nhánh Poseidon mang đến không gian sang trọng và thân thiện. Với sức chứa lên đến 500 khách mỗi cơ sở, Poseidon sẵn sàng tiếp đón lượng khách lớn, thích hợp cho tiệc, liên hoan doanh nghiệp, hội họp bạn bè và gia đình. Một số nhà hàng còn có khu vui chơi riêng cho trẻ em.",
    extra: "Thành lập từ năm 2017, sau 7 năm phát triển, lấy khách hàng làm trung tâm vẫn là kim chỉ nam trong quá trình nỗ lực học hỏi và liên tục cải tiến của toàn hệ thống.",
  },
];

const SECTIONS_EN = [
  {
    title: "A World of Flavours",
    body: "Buffet Poseidon is Vietnam's largest seafood buffet chain, with 24 branches nationwide — 6 in Hanoi, 12 in Ho Chi Minh City, and others in Nha Trang, Da Nang, Hai Phong, Bac Ninh and Dong Nai. Inspired by the Greek god of the sea, we bring guests an unlimited dining experience across nearly 200 dishes: crab, lobster, shrimp, squid, salmon, abalone, and dozens more fresh seafood items.",
    extra: "Highlights include our international buffet stations (European, Chinese, Japanese), a live sushi & sashimi counter, a Thai tom yum hotpot station, and a traditional three-region Vietnamese street-food stall.",
  },
  {
    title: "First-Class Service",
    body: "Driven by the passion of our founders and chefs, Poseidon places food quality above all else, with rigorous sourcing, preparation, and service standards. Our goal: to win over even the most discerning diners through distinctive cuisine, excellent service, and great value.",
    extra: "",
  },
  {
    title: "Elegant & Welcoming",
    body: "Each Poseidon branch offers an elegant yet welcoming atmosphere. With capacity for up to 500 guests per venue, we comfortably host birthday celebrations, corporate events, family gatherings and friendly get-togethers. Some branches feature dedicated children's play areas.",
    extra: "Founded in 2017, after seven years of growth, putting the customer first remains our guiding principle.",
  },
];

export default function AboutPage() {
  const { t, lang } = useTranslation();
  const sections = lang === "vi" ? SECTIONS_VI : SECTIONS_EN;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden py-16 sm:py-24" style={{ minHeight: 280 }}>
        <Image
          src="/poseidon-1.jpg"
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
              "linear-gradient(135deg, rgba(139,26,26,0.9) 0%, rgba(26,10,10,0.85) 55%, rgba(26,26,26,0.80) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400/70">
            Buffet Poseidon
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            {t("aboutPageTitle")}
          </h1>
        </div>
      </div>

      {/* Content */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-10">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h2 className="text-xl font-black text-gray-900 sm:text-2xl mb-3">{sec.title}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{sec.body}</p>
              {sec.extra && (
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{sec.extra}</p>
              )}
            </div>
          ))}

          {/* Disclaimer */}
          <p className="border-l-4 border-amber-300 bg-amber-50 pl-4 py-2 text-xs italic text-amber-700">
            {lang === "vi"
              ? "Nội dung phỏng theo website Buffet Poseidon, dùng cho mục đích minh hoạ học tập (prototype)."
              : "Content adapted from the Buffet Poseidon website for educational/prototype purposes."}
          </p>

          <div className="pt-2 text-center">
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
