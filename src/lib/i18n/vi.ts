const vi = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  brandName: "Buffet Poseidon",
  headerTagline: "Buffet Hải Sản Cao Cấp",
  tagline: "Đặt bàn trực tuyến — nhanh chóng, xác nhận tức thì",

  // ── Navigation ─────────────────────────────────────────────────────────────
  navCustomer: "Đặt bàn",
  navAdmin: "Quản lý",

  // ── Booking form ───────────────────────────────────────────────────────────
  formTitle: "Đặt bàn",
  labelBranch: "Chi nhánh",
  labelSession: "Bữa ăn",
  labelDate: "Ngày",
  labelArrivalTime: "Giờ đến",
  labelPartySize: "Số khách",
  labelName: "Họ tên",
  labelPhone: "Số điện thoại",
  placeholderName: "Nguyễn Văn A",
  placeholderPhone: "0901234567",
  btnBook: "Đặt bàn ngay",
  btnCancel: "Hủy đặt bàn",
  btnConfirm: "Xác nhận",

  // ── Availability ───────────────────────────────────────────────────────────
  availabilityLabel: "Bàn còn trống",
  availabilityFull: "Hết bàn",
  tablesUnit: "bàn",

  // ── Confirmation ───────────────────────────────────────────────────────────
  confirmationTitle: "Đặt bàn thành công!",
  confirmationSubtitle: "Chúng tôi đã nhận yêu cầu của bạn.",
  confirmationId: "Mã đặt bàn",
  confirmationBranch: "Chi nhánh",
  confirmationSession: "Bữa ăn",
  confirmationDate: "Ngày",
  confirmationArrival: "Giờ đến",
  confirmationParty: "Số khách",
  confirmationStatus: "Trạng thái",
  confirmationHold:
    "Bàn sẽ được giữ trong 15 phút sau giờ hẹn. Vui lòng đến đúng giờ.",
  confirmationClose: "Đóng",

  // ── Hold countdown ─────────────────────────────────────────────────────────
  holdTitle: "Bàn đang được giữ cho bạn",
  holdUntilPrefix: "Bàn được giữ đến",
  holdExpires: "Hết hạn sau",
  holdExpired: "Hết thời gian giữ bàn — bàn đã được trả lại.",

  // ── Kitchen hours rule ─────────────────────────────────────────────────────
  kitchenClosedTitle: "Bếp đã đóng cửa cho bữa này",
  kitchenClosedBody:
    "Khung giờ bạn chọn đã kết thúc hôm nay. Chúng tôi đã chuyển sang ngày mai.",

  // ── Cancel ─────────────────────────────────────────────────────────────────
  cancelTitle: "Hủy đặt bàn",
  cancelConfirmPrompt: "Bạn có chắc muốn hủy đặt bàn này không?",
  cancelSuccess: "Đặt bàn đã được hủy thành công.",
  cancelTooLate:
    "Không thể hủy trong vòng 2 giờ trước giờ đến. Vui lòng liên hệ nhà hàng.",
  cancelledAlready: "Đặt bàn này đã được hủy.",

  // ── Status labels ──────────────────────────────────────────────────────────
  statusPending: "Chờ xác nhận",
  statusConfirmed: "Đã xác nhận",
  statusCancelled: "Đã hủy",
  statusExpired: "Hết hạn giữ bàn",

  // ── Table assignment (admin) ───────────────────────────────────────────────
  tableSuggestionLabel: "Gợi ý bàn",
  tableAssigned: "Đã giao bàn",
  tableBtnAssign: "Giao bàn",
  tableBtnReassign: "Giao lại",
  tableOverrideLabel: "Chọn thủ công",
  tableOverridePlaceholder: "Chọn bàn...",
  tableBtnConfirmOverride: "Xác nhận chọn",
  tableNoFree: "Hết bàn trong ca này",
  tableOverflow: "Đoàn quá lớn — cần xử lý thủ công",
  tableAssignSuccess: "Đã giao bàn thành công.",
  tableSeats: "chỗ",

  // ── Admin ──────────────────────────────────────────────────────────────────
  adminTitle: "Quản lý đặt bàn",
  adminSubtitle: "Buffet Poseidon",
  adminColId: "Mã",
  adminColBranch: "Chi nhánh",
  adminColSession: "Bữa",
  adminColDate: "Ngày",
  adminColTime: "Giờ đến",
  adminColGuests: "Khách",
  adminColName: "Tên KH",
  adminColPhone: "SĐT",
  adminColStatus: "Trạng thái",
  adminColAction: "Thao tác",
  adminBtnConfirm: "Xác nhận",
  adminBtnSeedData: "Tạo dữ liệu mẫu",
  adminBtnReset: "Xóa tất cả",
  adminEmptyState: "Chưa có đặt bàn nào.",
  adminSeedSuccess: "Đã tạo dữ liệu mẫu.",
  adminResetSuccess: "Đã xóa toàn bộ dữ liệu.",

  // ── Errors / validation ────────────────────────────────────────────────────
  errRequired: "Vui lòng điền đầy đủ thông tin.",
  errNoTables: "Không còn bàn trống cho lịch này.",
  errInvalidPhone: "Số điện thoại không hợp lệ.",
  errInvalidParty: "Số khách phải từ 1 đến 50.",
  errServer: "Có lỗi xảy ra. Vui lòng thử lại.",
  errNotFound: "Không tìm thấy đặt bàn.",

  // ── Analytics / demand chart (admin) ──────────────────────────────────────
  analyticsTitle: "Thống kê nhu cầu",
  analyticsDataNote: "Dữ liệu minh hoạ — 6–8 tuần trước, không phản ánh số liệu thực tế",
  analyticsFilterBranch: "Lọc theo chi nhánh",
  analyticsAllBranches: "Tất cả chi nhánh",
  analyticsHourlyTitle: "Trung bình khách theo giờ trong ngày",
  analyticsWeekdayTitle: "Trung bình lượt đặt theo ngày trong tuần",
  analyticsYAxisGuests: "Khách / ngày",
  analyticsYAxisBookings: "Lượt đặt / tuần",
  analyticsPeak: "Cao điểm",
  analyticsOffPeak: "Thấp điểm",
  analyticsLunchSeries: "Bữa trưa",
  analyticsDinnerSeries: "Bữa tối",

  // ── Customer auth (prototype) ─────────────────────────────────────────────
  loginTitle: "Đăng nhập / Tạo tài khoản",
  loginSubtitle: "Nhập số điện thoại để đặt bàn nhanh hơn",
  loginPrototypeNote: "Prototype — không dùng mật khẩu thực, chỉ mang tính minh hoạ.",
  loginLabelBirthday: "Ngày sinh (không bắt buộc)",
  loginPlaceholderBirthday: "Ví dụ: 06-25 (MM-DD)",
  loginBtnSubmit: "Đăng nhập / Đăng ký",
  loginBtnGuest: "Tiếp tục với tư cách khách",
  loginErrPhone: "Vui lòng nhập số điện thoại hợp lệ.",
  loginErrName: "Vui lòng nhập họ tên.",
  loginGreeting: "Xin chào",
  logoutBtn: "Đăng xuất",

  // ── Birthday banner ───────────────────────────────────────────────────────
  birthdayBannerTitle: "Chúc mừng sinh nhật!",
  birthdayBannerBody: "Hôm nay là sinh nhật của bạn! Dùng mã voucher dưới đây để nhận ưu đãi sinh nhật.",
  birthdayBannerNote: "(Mã minh hoạ — không có giá trị thực tế)",
  birthdayBannerDismiss: "Đã hiểu",
  birthdayVoucherLabel: "Mã voucher",
  birthdayDiscountLabel: "Giảm",

  // ── My bookings ───────────────────────────────────────────────────────────
  myBookingsTitle: "Đặt bàn của tôi",
  myBookingsEmpty: "Bạn chưa có đặt bàn nào.",

  // ── Landing page — hero ───────────────────────────────────────────────────
  heroHeadline: "Trải Nghiệm Buffet Hải Sản Đỉnh Cao",
  heroSubline: "Gần 200 món hải sản cao cấp · 24 chi nhánh toàn quốc · Sức chứa 500 khách/cơ sở",

  // ── Landing page — membership banner ─────────────────────────────────────
  memberBannerTag: "Poseidon Membership",
  memberBannerTitle: "Ưu đãi độc quyền cho thành viên",
  memberBannerBody: "Tạo tài khoản miễn phí để đặt bàn nhanh hơn, nhận voucher sinh nhật và hưởng khuyến mãi thành viên.",
  memberBannerCta: "Tạo tài khoản / Đăng ký thành viên",
  memberBenefit1: "Lưu thông tin — đặt bàn nhanh chỉ vài giây",
  memberBenefit2: "Voucher sinh nhật giảm giá đặc biệt",
  memberBenefit3: "Khuyến mãi & ưu đãi dành riêng thành viên",

  // ── Landing page — booking section ───────────────────────────────────────
  bookingSectionTitle: "Đặt bàn tại Poseidon",

  // ── Landing page — highlights ─────────────────────────────────────────────
  highlight1Label: "Gần 200 món",
  highlight1Sub: "Hải sản tươi sống đa dạng",
  highlight2Label: "500 khách / cơ sở",
  highlight2Sub: "Không gian rộng rãi, sang trọng",
  highlight3Label: "24 chi nhánh",
  highlight3Sub: "Phủ sóng toàn quốc",
  highlight4Label: "Buffet cao cấp",
  highlight4Sub: "Chất lượng 5 sao, phục vụ chuyên nghiệp",

  // ── Landing page — header / call ─────────────────────────────────────────
  headerLoginBtn: "Đăng nhập / Đăng ký",
  callNow: "Gọi ngay",

  // ── Landing page — footer ────────────────────────────────────────────────
  footerBrand: "Hệ thống nhà hàng Buffet Hải Sản Poseidon",
  footerAddress: "Tầng 4 Hanoi Centerpoint, 27 Lê Văn Lương, Thanh Xuân, Hà Nội",
  footerHotline: "Hotline",
  footerFollow: "Theo dõi chúng tôi",

  // ── Misc ───────────────────────────────────────────────────────────────────
  loading: "Đang tải...",
  guests: "khách",
  tables: "bàn",
  of: "/",
  bookedLabel: "bàn đã đặt",
} satisfies Record<string, string>;

/** All UI string keys — TypeScript enforces both dictionaries have every key. */
export type Dictionary = Record<keyof typeof vi, string>;

export default vi;
