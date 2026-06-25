"use client";

import { useTranslation } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/layout/SiteFooter";

const SECTIONS_VI = [
  {
    heading: "Điều khoản chung",
    body: "Chúng tôi tôn trọng và cam kết bảo mật những thông tin riêng tư của bạn. Chính sách này giải thích cách chúng tôi tiếp nhận, sử dụng và (trong một số trường hợp) tiết lộ thông tin cá nhân, các bước bảo mật, cùng quyền lựa chọn của khách hàng về việc thu thập, sử dụng và tiết lộ thông tin. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến hoạt động kinh doanh của Buffet Poseidon.",
  },
  {
    heading: "1. Loại dữ liệu chúng tôi thu thập",
    items: [
      "Dữ liệu cá nhân cơ bản: Họ tên, số điện thoại, email, ngày sinh (để tặng ưu đãi sinh nhật), giới tính.",
      "Dữ liệu giao dịch: Lịch sử đặt bàn, lịch sử sử dụng dịch vụ, thông tin thanh toán (không bao gồm số thẻ tín dụng chi tiết).",
      "Dữ liệu kỹ thuật: Địa chỉ IP, loại trình duyệt, cookie và hành vi sử dụng website nhằm tối ưu trải nghiệm.",
      "Dữ liệu nhạy cảm (nếu có): Thông tin sức khỏe/dị ứng thực phẩm (nếu khách chủ động cung cấp).",
    ],
  },
  {
    heading: "2. Mục đích xử lý dữ liệu",
    items: [
      "Phục vụ dịch vụ: Xác nhận đặt bàn, điều chỉnh yêu cầu món ăn, nhắc lịch.",
      "Chăm sóc khách hàng: Quản lý thẻ thành viên, tích điểm, quà tặng/ưu đãi sinh nhật.",
      "Tiếp thị: Gửi khuyến mãi, món mới (chỉ khi có sự đồng ý của khách).",
      "Cải thiện dịch vụ: Phân tích xu hướng tiêu dùng để nâng cao chất lượng.",
      "An ninh & pháp lý: Ngăn chặn giả mạo và tuân thủ nghĩa vụ pháp lý.",
    ],
  },
  {
    heading: "3. Cách thức xử lý và lưu trữ",
    body: "Dữ liệu được thu thập qua website, hotline hoặc tại quầy lễ tân và lưu trên hệ thống máy chủ nội bộ bảo mật. Thời gian lưu trữ đến khi: nhận yêu cầu xóa từ khách; hoàn thành mục đích thu thập; theo quy định pháp luật kế toán/thuế; hoặc trong vòng 5 năm kể từ giao dịch cuối. Chúng tôi cam kết không mua bán thông tin khách hàng vì mục đích thương mại, và áp dụng các biện pháp kỹ thuật (mã hóa SSL, tường lửa) để bảo vệ dữ liệu.",
  },
  {
    heading: "4. Quyền của khách hàng (theo Nghị định 13/2023/NĐ-CP)",
    items: [
      "Quyền được biết và đồng ý.",
      "Quyền truy cập và chỉnh sửa thông tin.",
      "Quyền rút lại đồng ý và xóa dữ liệu.",
      "Quyền khiếu nại.",
      "Bảo vệ dữ liệu trẻ em: Với khách dưới 16 tuổi, chỉ thu thập khi có sự đồng ý của cha mẹ/người giám hộ.",
    ],
  },
  {
    heading: "5. Cookies",
    body: "Cookies lưu trong trình duyệt giúp thống kê lượt truy cập và cải thiện trải nghiệm. Thông tin cookies được thu thập ẩn danh. Khách có thể từ chối cookies trong thiết lập trình duyệt, song một số tính năng có thể hoạt động không chính xác.",
  },
  {
    heading: "6. Đơn vị kiểm soát và xử lý dữ liệu",
    items: [
      "Công ty Cổ Phần Thần Biển — MST: 0107762787",
      "Trụ sở: Tầng 4, tòa nhà Hanoi Centerpoint, 27 Lê Văn Lương, Thanh Xuân, Hà Nội",
      "Email: info@buffetposeidon.com",
    ],
  },
  {
    heading: "7. Xử lý sự cố & khiếu nại",
    body: "Trong trường hợp rò rỉ dữ liệu, chúng tôi thông báo cho khách và cơ quan chức năng trong vòng 72 giờ. Mọi yêu cầu liên hệ qua Zalo 0966 628 686 hoặc info@buffetposeidon.com; phản hồi trong vòng 30 ngày.",
  },
];

const SECTIONS_EN = [
  {
    heading: "General Terms",
    body: "We respect and are committed to protecting your personal information. This policy explains how we collect, use, and (in some circumstances) disclose personal data, the security measures we take, and your choices regarding that data. We only collect information necessary for Buffet Poseidon's business operations.",
  },
  {
    heading: "1. Data We Collect",
    items: [
      "Basic personal data: full name, phone number, email, date of birth (for birthday offers), gender.",
      "Transaction data: booking history, service usage, payment information (excluding full card details).",
      "Technical data: IP address, browser type, cookies and website usage behaviour for optimisation.",
      "Sensitive data (if provided voluntarily): health/food allergy information.",
    ],
  },
  {
    heading: "2. Purpose of Processing",
    items: [
      "Service delivery: confirming reservations, accommodating dietary requests, sending reminders.",
      "Customer care: managing membership cards, loyalty points, birthday gifts and promotions.",
      "Marketing: sending promotions and new menu items (with consent only).",
      "Service improvement: analysing consumption trends to raise quality.",
      "Security & legal: fraud prevention and regulatory compliance.",
    ],
  },
  {
    heading: "3. Storage & Retention",
    body: "Data is collected via website, hotline, or front desk and stored on a secure internal server. Retention ends when: a deletion request is received; the collection purpose is fulfilled; accounting/tax laws require otherwise; or within 5 years of the last transaction. We do not sell customer data for commercial purposes and apply technical safeguards (SSL encryption, firewalls).",
  },
  {
    heading: "4. Your Rights (Decree 13/2023/NĐ-CP)",
    items: [
      "Right to be informed and to consent.",
      "Right to access and correct your data.",
      "Right to withdraw consent and request deletion.",
      "Right to lodge a complaint.",
      "Child data protection: for guests under 16, data is only collected with parental/guardian consent.",
    ],
  },
  {
    heading: "5. Cookies",
    body: "Cookies stored in your browser help us analyse visit statistics and improve your experience. Cookie data is collected anonymously. You may decline cookies in your browser settings, though some features may not work correctly.",
  },
  {
    heading: "6. Data Controller",
    items: [
      "Than Bien Joint Stock Company — Tax code: 0107762787",
      "Address: 4F Hanoi Centerpoint, 27 Le Van Luong, Thanh Xuan, Hanoi",
      "Email: info@buffetposeidon.com",
    ],
  },
  {
    heading: "7. Incidents & Complaints",
    body: "In the event of a data breach, we will notify affected users and authorities within 72 hours. All enquiries via Zalo 0966 628 686 or info@buffetposeidon.com; responses within 30 days.",
  },
];

type Section = {
  heading: string;
  body?: string;
  items?: string[];
};

export default function PrivacyPolicyPage() {
  const { t, lang } = useTranslation();
  const sections: Section[] = lang === "vi" ? SECTIONS_VI : SECTIONS_EN;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div
        className="py-10 sm:py-14"
        style={{
          background: "linear-gradient(135deg, #8B1A1A 0%, #1A0A0A 55%, #1A1A1A 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400/70">
            Buffet Poseidon
          </p>
          <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {t("privacyPolicyTitle")}
          </h1>
          <p className="mt-2 text-xs text-white/45">
            {lang === "vi" ? "Cập nhật: 15/07/2017" : "Last updated: 15 July 2017"}
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
          {/* Prototype notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            ⚠️{" "}
            {lang === "vi"
              ? "Nội dung phỏng theo chính sách của Buffet Poseidon, dùng cho mục đích minh hoạ học tập (prototype)."
              : "Content adapted from Buffet Poseidon's privacy policy for educational/prototype purposes."}
          </div>

          {sections.map((sec) => (
            <div key={sec.heading}>
              <h2 className="text-base font-black text-gray-900 mb-2">{sec.heading}</h2>
              {sec.body && (
                <p className="text-sm leading-relaxed text-gray-600">{sec.body}</p>
              )}
              {sec.items && (
                <ul className="mt-2 space-y-1.5">
                  {sec.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
