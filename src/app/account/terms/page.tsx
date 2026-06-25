"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

interface Section {
  title: string;
  content: string;
}

export default function TermsPage() {
  const { t, lang } = useTranslation();

  const sections: Section[] = [
    {
      title: t("termsUsageTitle"),
      content: lang === "vi"
        ? `Bằng việc sử dụng hệ thống đặt bàn trực tuyến của Buffet Poseidon, bạn đồng ý với các điều khoản sau:

• Thông tin đặt bàn phải trung thực và chính xác. Chúng tôi có quyền từ chối đặt bàn nếu phát hiện thông tin sai lệch.
• Mỗi tài khoản được sử dụng cho mục đích cá nhân. Không được chia sẻ tài khoản với người khác.
• Bàn được giữ trong 15 phút sau giờ hẹn. Quá thời gian này, bàn có thể được sắp xếp cho khách khác.
• Poseidon có quyền thay đổi điều khoản này bất cứ lúc nào. Thay đổi sẽ được thông báo trước 7 ngày.
• Hệ thống đặt bàn trực tuyến này là bản mẫu (prototype) dành cho mục đích trình diễn.`
        : `By using Buffet Poseidon's online reservation system, you agree to the following terms:

• Reservation information must be truthful and accurate. We reserve the right to decline reservations if false information is detected.
• Each account is for personal use only. Accounts must not be shared with others.
• Tables are held for 15 minutes after the reserved arrival time. After this period, tables may be reassigned.
• Poseidon reserves the right to amend these terms at any time, with 7 days' prior notice.
• This online reservation system is a prototype for demonstration purposes.`,
    },
    {
      title: t("termsMemberTitle"),
      content: lang === "vi"
        ? `Chương trình thành viên Poseidon (minh hoạ):

• Điểm tích luỹ: Nhận 10 điểm cho mỗi lần đặt bàn được xác nhận thành công.
• Điểm tích luỹ không có giá trị tiền mặt và không thể chuyển nhượng cho người khác.
• Voucher sinh nhật: Thành viên có ngày sinh sẽ nhận voucher giảm giá 15% vào ngày sinh nhật.
• Chương trình giới thiệu: Nhận 50 điểm khi bạn bè đăng ký thành công qua mã giới thiệu.
• Poseidon bảo lưu quyền thay đổi hoặc chấm dứt chương trình thành viên mà không cần thông báo trước.
• Toàn bộ nội dung trên là minh hoạ cho mục đích trình diễn.`
        : `Poseidon Membership Program (illustrative):

• Points: Earn 10 points for each successfully confirmed booking.
• Points have no monetary value and are non-transferable.
• Birthday voucher: Members with a registered birthday receive a 15% discount voucher on their birthday.
• Referral program: Earn 50 points when a friend successfully registers using your referral code.
• Poseidon reserves the right to modify or terminate the membership program without prior notice.
• All content above is illustrative for demonstration purposes.`,
    },
    {
      title: t("termsPrivacyTitle"),
      content: lang === "vi"
        ? `Chính sách bảo mật thông tin (minh hoạ):

• Thông tin thu thập: Họ tên, số điện thoại, ngày sinh, email và lịch sử đặt bàn.
• Mục đích sử dụng: Xử lý đặt bàn, gửi thông báo và cá nhân hoá trải nghiệm.
• Bảo mật dữ liệu: Thông tin được lưu trữ an toàn. Chúng tôi không bán dữ liệu cho bên thứ ba.
• Quyền của bạn: Bạn có quyền yêu cầu xem, sửa đổi hoặc xoá dữ liệu cá nhân của mình.
• Cookie: Chúng tôi sử dụng cookie phiên để duy trì trạng thái đăng nhập.
• Liên hệ: privacy@poseidon.vn (địa chỉ minh hoạ).`
        : `Privacy Policy (illustrative):

• Data collected: Full name, phone number, birthday, email and booking history.
• Purpose: Processing reservations, sending notifications and personalising your experience.
• Data security: Information is stored securely. We do not sell data to third parties.
• Your rights: You may request to view, amend or delete your personal data at any time.
• Cookies: We use session cookies to maintain your logged-in state.
• Contact: privacy@poseidon.vn (illustrative address).`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("accountTerms")}</h1>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
          ⚠️ {t("walletProtoLabel")}
        </span>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <Accordion key={s.title} title={s.title} content={s.content} />
        ))}
      </div>
    </div>
  );
}

function Accordion({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{content}</p>
        </div>
      )}
    </div>
  );
}
