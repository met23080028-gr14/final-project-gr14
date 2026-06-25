const vi = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  brandName: "Buffet Poseidon",
  headerTagline: "Buffet Hải Sản Cao Cấp",
  tagline: "Đặt bàn trực tuyến — nhanh chóng, xác nhận tức thì",

  // ── Navigation ─────────────────────────────────────────────────────────────
  navCustomer: "Đặt bàn",
  navAdmin: "Quản lý",
  navHome: "Trang chủ",
  navAbout: "Về chúng tôi",
  navPricing: "Giá Buffet",
  navMenuLink: "Thực đơn",
  navNews: "Tin tức",
  navBranches: "Chi nhánh",
  navBooking: "Đặt bàn",
  mobileMenuOpen: "Mở menu",
  mobileMenuClose: "Đóng menu",

  // ── Booking form ───────────────────────────────────────────────────────────
  formTitle: "Đặt bàn",
  labelBranch: "Chi nhánh",
  labelSession: "Bữa ăn",
  labelDate: "Ngày",
  labelArrivalTime: "Giờ đến",
  labelPartySize: "Số khách",
  labelName: "Họ tên",
  labelPhone: "Số điện thoại",
  labelEmail: "Email",
  labelNotes: "Ghi chú (không bắt buộc)",
  placeholderName: "Nguyễn Văn A",
  placeholderPhone: "0901234567",
  placeholderEmail: "example@email.com",
  placeholderNotes: "Yêu cầu đặc biệt, dị ứng thực phẩm...",
  errInvalidEmail: "Email không hợp lệ",
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
  confirmationBookingCode: "Mã đặt bàn",
  confirmationBranch: "Chi nhánh",
  confirmationAddress: "Địa chỉ",
  confirmationMapBtn: "Xem bản đồ / Chỉ đường",
  confirmationSession: "Bữa ăn",
  confirmationDate: "Ngày",
  confirmationArrival: "Giờ đến",
  confirmationParty: "Số khách",
  confirmationStatus: "Trạng thái",
  confirmationHold:
    "Bàn sẽ được giữ trong 15 phút sau giờ hẹn. Vui lòng đến đúng giờ.",
  confirmationNotice: "Thông tin đặt bàn sẽ được gửi tới Gmail / SĐT / Zalo của bạn.",
  confirmationOfferBtn: "Đăng ký / Đăng nhập nhận ưu đãi",
  confirmationClose: "Đóng",

  // ── Hold countdown ─────────────────────────────────────────────────────────
  holdTitle: "Bàn đang được giữ cho bạn",
  holdUntilPrefix: "Bàn được giữ đến",
  holdExpires: "Hết hạn sau",
  holdExpired: "Hết thời gian giữ bàn — bàn đã được trả lại.",

  // ── Session hours ──────────────────────────────────────────────────────────
  sessionServes: "Phục vụ",
  sessionCutoffLabel: "Nhận đặt đến",

  // ── Kitchen hours rule ─────────────────────────────────────────────────────
  kitchenClosedTitle: "Hết giờ nhận đặt bàn cho bữa này",
  kitchenClosedBody:
    "Đã qua giờ nhận đặt bàn hôm nay. Chúng tôi đã chuyển sang ngày mai.",

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
  statusArrived: "Đã đến",
  statusNoShow: "Khách không đến",
  statusCompleted: "Đã trả bàn",
  statusCancelled: "Đã hủy",
  statusExpired: "Hết hạn giữ bàn",

  // ── Table assignment (admin) ───────────────────────────────────────────────
  tableSuggestionLabel: "Xếp bàn",
  tableBtnToggle: "Xem gợi ý xếp bàn",
  tableBtnHide: "Ẩn",
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

  // ── Admin login gate ──────────────────────────────────────────────────────
  adminLoginTitle: "Đăng nhập Quản trị",
  adminLoginSubtitle: "Vui lòng đăng nhập để tiếp tục",
  adminLoginUsername: "Tên đăng nhập",
  adminLoginPassword: "Mật khẩu",
  adminLoginBtn: "Đăng nhập",
  adminLoginError: "Sai tên đăng nhập hoặc mật khẩu.",
  adminLoginLogoutBtn: "Đăng xuất quản trị",
  adminLoginPrototypeNote: "Prototype — thông tin đăng nhập demo: admin / poseidon123",

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
  adminBtnArrive: "Khách đã đến",
  adminBtnNoShow: "Không đến",
  adminBtnRelease: "Trả bàn",
  adminBtnSeedData: "Tạo dữ liệu mẫu",
  adminBtnReset: "Xóa tất cả",
  adminEmptyState: "Chưa có đặt bàn nào.",
  adminSeedSuccess: "Đã tạo dữ liệu mẫu.",
  adminResetSuccess: "Đã xóa toàn bộ dữ liệu.",
  adminOverdueWarning: "Quá giờ giữ — chưa nhận bàn",
  adminColNotes: "Ghi chú",
  adminAvailTitle: "Tình trạng bàn hôm nay",
  adminAvailCapacity: "Sức chứa",
  adminAvailBooked: "Đã đặt",
  adminAvailFree: "Còn trống",
  adminBirthdayTitle: "Sắp sinh nhật (2 ngày tới)",
  adminBirthdayEmpty: "Không có khách nào sắp sinh nhật.",

  // ── Errors / validation ────────────────────────────────────────────────────
  errRequired: "Vui lòng điền đầy đủ thông tin.",
  errFieldRequired: "Vui lòng không để trống",
  errNoTables: "Không còn bàn trống cho lịch này.",
  errInvalidPhone: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)",
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
  loginLabelPassword: "Mật khẩu (minh hoạ)",
  loginPlaceholderPassword: "Nhập mật khẩu (ít nhất 6 ký tự)",
  loginErrPassword: "Mật khẩu phải có ít nhất 6 ký tự.",
  loginBtnGoogle: "Tiếp tục với Google",
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
  heroHeadlineLine1: "Trải Nghiệm Buffet",
  heroHeadlineLine2: "Hải Sản Đỉnh Cao",
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
  footerPhotoCredit: "Hình ảnh: Buffet Poseidon",

  // ── Account hub ───────────────────────────────────────────────────────────
  accountHub: "Tài khoản",
  accountProfile: "Thông tin cá nhân",
  accountActivity: "Lịch sử hoạt động",
  accountNotifications: "Thông báo",
  accountWallet: "Ví ưu đãi",
  accountLinked: "Liên kết tài khoản",
  accountTerms: "Điều khoản & chính sách",
  accountReferral: "Giới thiệu bạn bè",
  accountSettings: "Cài đặt",

  // ── Profile section ───────────────────────────────────────────────────────
  profileCustomerId: "Mã khách hàng",
  profileReadOnlyHint: "Chỉ xem, không chỉnh sửa",
  profileGender: "Giới tính",
  profileEmail: "Email",
  profileGenderMale: "Nam",
  profileGenderFemale: "Nữ",
  profileGenderOther: "Khác",
  profileGenderUnset: "Chưa chọn",
  profileSaveBtn: "Lưu thay đổi",
  profileSaveSuccess: "Đã lưu thành công.",

  // ── Activity section ──────────────────────────────────────────────────────
  activityPoints: "Điểm tích luỹ",
  activityPointsNote: "Điểm minh hoạ — không có giá trị thực",
  activityNoBookings: "Chưa có lịch sử đặt bàn.",
  activityPointsEarned: "điểm đã tích",

  // ── Notifications section ─────────────────────────────────────────────────
  notifTitle: "Thông báo",
  notifBookingUpdate: "Cập nhật đặt bàn",
  notifEmpty: "Chưa có thông báo.",

  // ── Wallet section ────────────────────────────────────────────────────────
  walletProtoLabel: "Bản mẫu / Prototype",
  walletBirthdayTag: "Sinh nhật",
  walletSampleTag: "Voucher mẫu",
  walletOff: "giảm",
  walletMinSpend: "Không yêu cầu chi tiêu tối thiểu",
  walletExpiry: "HSD",

  // ── Linked accounts section ───────────────────────────────────────────────
  linkedProto: "Bản mẫu — các nút dưới không thực hiện kết nối thực",
  linkedConnect: "Liên kết",

  // ── Terms section ─────────────────────────────────────────────────────────
  termsUsageTitle: "Điều khoản sử dụng",
  termsMemberTitle: "Chính sách thành viên",
  termsPrivacyTitle: "Chính sách bảo mật",

  // ── Referral section ──────────────────────────────────────────────────────
  referralYourCode: "Mã giới thiệu của bạn",
  referralBonus: "Nhận 50 điểm khi bạn bè đăng ký thành công",
  referralProto: "Bản mẫu — chương trình chưa hoạt động",
  referralShare: "Chia sẻ",
  referralCopy: "Sao chép mã",
  referralCopied: "Đã sao chép!",
  referralFriendCount: "Bạn bè đã giới thiệu",

  // ── Settings section ──────────────────────────────────────────────────────
  settingsPasswordTitle: "Đổi mật khẩu",
  settingsSecurityTitle: "Bảo mật sinh trắc học",
  settingsTouchId: "Touch ID / Vân tay",
  settingsFaceId: "Face ID / Nhận diện khuôn mặt",
  settingsOffersTitle: "Thông báo & ưu đãi",
  settingsOffersToggle: "Nhận thông báo khuyến mãi",
  settingsLocationTitle: "Địa điểm của bạn",
  settingsDevicesTitle: "Quản lý thiết bị đăng nhập",
  settingsDeleteTitle: "Xoá tài khoản",
  settingsDeleteConfirm: "Bạn có chắc muốn xoá tài khoản? Hành động này không thể hoàn tác.",
  settingsDeleteBtn: "Xoá tài khoản",
  settingsProto: "Bản mẫu — cài đặt này không có hiệu lực thực sự",
  settingsLogout: "Đăng xuất khỏi tài khoản",
  settingsSaved: "Đã lưu.",

  // ── Placeholder sections ──────────────────────────────────────────────────
  placeholderComingSoon: "Đang cập nhật",
  placeholderComingSoonNote: "Nội dung mẫu — sẽ được bổ sung sau.",

  // ── Pricing page (/gia-buffet) ────────────────────────────────────────────
  pricingPageTitle: "Giá Buffet",
  pricingPageSubtitle: "Chọn gói buffet phù hợp với bạn",
  pricingNote: "Giá chưa bao gồm đồ uống và thuế VAT bắt buộc",
  pricingLunchWeekday: "Trưa ngày thường",
  pricingLunchWeekdayDesc: "Áp dụng trưa Thứ 2 đến trưa Thứ 6",
  pricingLunchWeekdayPrice: "528.000đ",
  pricingEveningWeekend: "Tối ngày thường & Cuối tuần",
  pricingEveningWeekendDesc: "Tối T2–T6 và cả ngày T7, CN",
  pricingEveningWeekendPrice: "598.000đ",
  pricingHoliday: "Lễ Tết & cận Lễ Tết",
  pricingHolidayDesc: "Các ngày lễ và ngày giáp Lễ Tết",
  pricingHolidayPrice: "648.000đ",
  pricingKids: "Buffet Trẻ Em",
  pricingKidsDesc: "Áp dụng cho trẻ em dưới 10 tuổi",
  pricingKidsPrice: "258.000đ",
  pricingCtaTitle: "Sẵn sàng trải nghiệm?",
  pricingCtaBody: "Đặt bàn ngay hôm nay và tận hưởng bữa buffet hải sản đỉnh cao.",

  // ── Menu page (/menu) ─────────────────────────────────────────────────────
  menuPageTitle: "Thực đơn",
  menuPageIntro: "Gần 200 món hải sản cao cấp",
  menuPageBody: "Từ tôm hùm, cua hoàng đế, bào ngư đến sashimi và các món nướng đặc sắc — tất cả được tuyển chọn tươi sống mỗi ngày.",
  menuGalleryTitle: "Không gian & Món ăn",

  // ── Branches page (/chi-nhanh) ────────────────────────────────────────────
  branchesPageTitle: "Chi nhánh",
  branchesPageSubtitle: "Hai chi nhánh tại Hà Nội",
  branchesMapBtn: "Xem bản đồ",

  // ── About section (landing) ───────────────────────────────────────────────
  aboutTitle: "Về Buffet Poseidon",
  aboutBody: "Poseidon là hệ thống nhà hàng buffet hải sản hàng đầu Việt Nam với 24 chi nhánh toàn quốc. Chúng tôi tự hào mang đến trải nghiệm ẩm thực đẳng cấp với gần 200 món hải sản tươi sống được tuyển chọn kỹ lưỡng mỗi ngày.",

  // ── Booking QR code ───────────────────────────────────────────────────────
  qrExportBtn: "Xuất mã QR",
  qrDownloadBtn: "Tải PNG",
  qrSummaryTitle: "Thông tin đặt bàn",
  qrSummaryCode: "Mã đặt bàn",
  qrSummaryName: "Tên",
  qrSummaryBranch: "Chi nhánh",
  qrSummarySession: "Bữa ăn",
  qrSummaryTime: "Giờ đến",
  qrSummaryGuests: "Số khách",
  qrNote: "Xuất trình mã QR này khi đến để check-in nhanh.",

  // ── Check-in page (/checkin/[id]) ─────────────────────────────────────────
  checkinTitle: "Check-in thành công",
  checkinSubtitle: "Cảm ơn bạn đã đến!",
  checkinAlreadyTitle: "Đã check-in trước đó",
  checkinAlreadyBody: "Đặt bàn này đã được ghi nhận là đã đến.",
  checkinInvalidTitle: "Không thể check-in",
  checkinInvalidBody: "Đặt bàn đã bị hủy hoặc không hợp lệ. Vui lòng liên hệ nhà hàng.",
  checkinNotFoundTitle: "Không tìm thấy đặt bàn",
  checkinNotFoundBody: "Mã QR không hợp lệ hoặc đặt bàn không tồn tại.",
  checkinProtoNote: "⚠️ Bản mẫu — link check-in này không có xác thực nhân viên.",
  checkinBackHome: "Về trang chủ",

  // ── Admin scanner page (/admin/scan) ─────────────────────────────────────
  adminScanTitle: "Quét mã QR check-in",
  adminScanSubtitle: "Hướng camera vào mã QR của khách",
  adminScanBtn: "Mở camera",
  adminScanStop: "Dừng camera",
  adminScanSuccess: "Check-in thành công!",
  adminScanAlready: "Khách đã check-in trước đó.",
  adminScanError: "Không thể check-in. Vui lòng thử lại.",
  adminScanNoCameraNote: "Camera yêu cầu HTTPS hoặc localhost. Nếu camera không khả dụng, hãy kiểm tra giao thức kết nối.",
  adminScanBackAdmin: "Quay lại quản lý",
  adminScanLink: "Quét QR check-in",

  // ── Booking page (/dat-ban) ───────────────────────────────────────────────
  datBanPageTitle: "Đặt bàn tại Poseidon",

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
