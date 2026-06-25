import type { Dictionary } from "./vi";

const en: Dictionary = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  brandName: "Buffet Poseidon",
  headerTagline: "Premium Seafood Buffet",
  tagline: "Book a table online — fast, instant confirmation",

  // ── Navigation ─────────────────────────────────────────────────────────────
  navCustomer: "Book a Table",
  navAdmin: "Admin",
  navHome: "Home",
  navAbout: "About Us",
  navPricing: "Buffet Prices",
  navMenuLink: "Menu",
  navNews: "News",
  navBranches: "Branches",
  navBooking: "Book a Table",
  mobileMenuOpen: "Open menu",
  mobileMenuClose: "Close menu",

  // ── Booking form ───────────────────────────────────────────────────────────
  formTitle: "Reserve a Table",
  labelBranch: "Branch",
  labelSession: "Session",
  labelDate: "Date",
  labelArrivalTime: "Arrival time",
  labelPartySize: "Party size",
  labelName: "Full name",
  labelPhone: "Phone number",
  labelEmail: "Email",
  labelNotes: "Notes (optional)",
  placeholderName: "Nguyen Van A",
  placeholderPhone: "0901234567",
  placeholderEmail: "example@email.com",
  placeholderNotes: "Special requests, food allergies...",
  errInvalidEmail: "Invalid email",
  btnBook: "Book Now",
  btnCancel: "Cancel Booking",
  btnConfirm: "Confirm",

  // ── Availability ───────────────────────────────────────────────────────────
  availabilityLabel: "Tables available",
  availabilityFull: "Fully booked",
  tablesUnit: "tables",

  // ── Confirmation ───────────────────────────────────────────────────────────
  confirmationTitle: "Booking Confirmed!",
  confirmationSubtitle: "We have received your reservation.",
  confirmationId: "Booking ID",
  confirmationBookingCode: "Booking code",
  confirmationBranch: "Branch",
  confirmationAddress: "Address",
  confirmationMapBtn: "View map / Directions",
  confirmationSession: "Session",
  confirmationDate: "Date",
  confirmationArrival: "Arrival",
  confirmationParty: "Party size",
  confirmationStatus: "Status",
  confirmationHold:
    "Your table will be held for 15 minutes after your arrival time. Please arrive on time.",
  confirmationNotice: "Booking details will be sent to your Gmail / Phone / Zalo.",
  confirmationOfferBtn: "Sign up / Sign in for exclusive offers",
  confirmationClose: "Close",

  // ── Hold countdown ─────────────────────────────────────────────────────────
  holdTitle: "Your table is being held",
  holdUntilPrefix: "Table held until",
  holdExpires: "Expires in",
  holdExpired: "Hold expired — the table has been released.",

  // ── Session hours ──────────────────────────────────────────────────────────
  sessionServes: "Serves",
  sessionCutoffLabel: "Bookings until",

  // ── Kitchen hours rule ─────────────────────────────────────────────────────
  kitchenClosedTitle: "Booking cutoff has passed for this session",
  kitchenClosedBody:
    "We have stopped accepting bookings for this session today. Your date has been moved to tomorrow.",

  // ── Cancel ─────────────────────────────────────────────────────────────────
  cancelTitle: "Cancel Booking",
  cancelConfirmPrompt: "Are you sure you want to cancel this booking?",
  cancelSuccess: "Your booking has been successfully cancelled.",
  cancelTooLate:
    "Cancellations are not allowed within 2 hours of arrival. Please contact the restaurant.",
  cancelledAlready: "This booking has already been cancelled.",

  // ── Status labels ──────────────────────────────────────────────────────────
  statusPending: "Pending",
  statusConfirmed: "Confirmed",
  statusArrived: "Arrived",
  statusNoShow: "No-show",
  statusCompleted: "Completed",
  statusCancelled: "Cancelled",
  statusExpired: "Hold Expired",

  // ── Table assignment (admin) ───────────────────────────────────────────────
  tableSuggestionLabel: "Tables",
  tableBtnToggle: "View table suggestions",
  tableBtnHide: "Hide",
  tableAssigned: "Assigned",
  tableBtnAssign: "Assign",
  tableBtnReassign: "Reassign",
  tableOverrideLabel: "Manual override",
  tableOverridePlaceholder: "Select table...",
  tableBtnConfirmOverride: "Confirm selection",
  tableNoFree: "No free tables in this session",
  tableOverflow: "Party too large — needs manual handling",
  tableAssignSuccess: "Table assigned successfully.",
  tableSeats: "seats",

  // ── Admin login gate ──────────────────────────────────────────────────────
  adminLoginTitle: "Admin Login",
  adminLoginSubtitle: "Please sign in to continue",
  adminLoginUsername: "Username",
  adminLoginPassword: "Password",
  adminLoginBtn: "Sign In",
  adminLoginError: "Invalid username or password.",
  adminLoginLogoutBtn: "Admin Logout",
  adminLoginPrototypeNote: "Prototype — demo credentials: admin / poseidon123",

  // ── Admin ──────────────────────────────────────────────────────────────────
  adminTitle: "Booking Management",
  adminSubtitle: "Buffet Poseidon",
  adminColId: "ID",
  adminColBranch: "Branch",
  adminColSession: "Session",
  adminColDate: "Date",
  adminColTime: "Arrival",
  adminColGuests: "Guests",
  adminColName: "Customer",
  adminColPhone: "Phone",
  adminColStatus: "Status",
  adminColAction: "Action",
  adminBtnConfirm: "Confirm",
  adminBtnArrive: "Mark Arrived",
  adminBtnNoShow: "No-show",
  adminBtnRelease: "Release Table",
  adminBtnSeedData: "Seed Demo Data",
  adminBtnReset: "Clear All",
  adminEmptyState: "No bookings yet.",
  adminSeedSuccess: "Demo data has been seeded.",
  adminResetSuccess: "All data has been cleared.",
  adminOverdueWarning: "Hold expired — not yet arrived",
  adminColNotes: "Notes",
  adminAvailTitle: "Today's Table Availability",
  adminAvailCapacity: "Capacity",
  adminAvailBooked: "Booked",
  adminAvailFree: "Available",
  adminBirthdayTitle: "Upcoming Birthdays (next 2 days)",
  adminBirthdayEmpty: "No upcoming birthdays.",

  // ── Errors / validation ────────────────────────────────────────────────────
  errRequired: "Please fill in all required fields.",
  errFieldRequired: "This field is required",
  errNoTables: "No tables available for this slot.",
  errInvalidPhone: "Invalid phone number (10 digits, starting with 0)",
  errInvalidParty: "Party size must be between 1 and 50.",
  errServer: "Something went wrong. Please try again.",
  errNotFound: "Booking not found.",

  // ── Analytics / demand chart (admin) ──────────────────────────────────────
  analyticsTitle: "Demand Analytics",
  analyticsDataNote: "Illustrative data — past 6–8 weeks, does not reflect actual figures",
  analyticsFilterBranch: "Filter by branch",
  analyticsAllBranches: "All branches",
  analyticsHourlyTitle: "Avg. guests by hour of day",
  analyticsWeekdayTitle: "Avg. bookings by day of week",
  analyticsYAxisGuests: "Guests / day",
  analyticsYAxisBookings: "Bookings / week",
  analyticsPeak: "Peak",
  analyticsOffPeak: "Off-peak",
  analyticsLunchSeries: "Lunch",
  analyticsDinnerSeries: "Dinner",

  // ── Customer auth (prototype) ─────────────────────────────────────────────
  loginTitle: "Sign In / Create Account",
  loginSubtitle: "Enter your phone number to book faster",
  loginPrototypeNote: "Prototype — no real passwords, for demo purposes only.",
  loginLabelBirthday: "Birthday (optional)",
  loginPlaceholderBirthday: "e.g. 06-25 (MM-DD)",
  loginLabelPassword: "Password (illustrative)",
  loginPlaceholderPassword: "Enter password (min. 6 characters)",
  loginErrPassword: "Password must be at least 6 characters.",
  loginBtnGoogle: "Continue with Google",
  loginBtnSubmit: "Sign In / Register",
  loginBtnGuest: "Continue as guest",
  loginErrPhone: "Please enter a valid phone number.",
  loginErrName: "Please enter your full name.",
  loginGreeting: "Hello",
  logoutBtn: "Log Out",

  // ── Birthday banner ───────────────────────────────────────────────────────
  birthdayBannerTitle: "Happy Birthday!",
  birthdayBannerBody: "Today is your birthday! Use the voucher code below to enjoy your birthday discount.",
  birthdayBannerNote: "(Illustrative code — no real monetary value)",
  birthdayBannerDismiss: "Got it",
  birthdayVoucherLabel: "Voucher code",
  birthdayDiscountLabel: "Discount",

  // ── My bookings ───────────────────────────────────────────────────────────
  myBookingsTitle: "My Bookings",
  myBookingsEmpty: "You have no bookings yet.",

  // ── Landing page — hero ───────────────────────────────────────────────────
  heroHeadline: "Premium Seafood Buffet Experience",
  heroHeadlineLine1: "Premium Seafood",
  heroHeadlineLine2: "Buffet Experience",
  heroSubline: "~200 premium seafood dishes · 24 branches nationwide · 500 guests per venue",

  // ── Landing page — membership banner ─────────────────────────────────────
  memberBannerTag: "Poseidon Membership",
  memberBannerTitle: "Exclusive Member Benefits",
  memberBannerBody: "Create a free account to book faster, receive a birthday voucher, and enjoy member-only promotions.",
  memberBannerCta: "Create Account / Join Now",
  memberBenefit1: "Save your info — book in seconds",
  memberBenefit2: "Exclusive birthday discount voucher",
  memberBenefit3: "Member deals & promotions",

  // ── Landing page — booking section ───────────────────────────────────────
  bookingSectionTitle: "Reserve a Table at Poseidon",

  // ── Landing page — highlights ─────────────────────────────────────────────
  highlight1Label: "~200 dishes",
  highlight1Sub: "Fresh & diverse seafood",
  highlight2Label: "500 guests / venue",
  highlight2Sub: "Spacious, elegant dining",
  highlight3Label: "24 branches",
  highlight3Sub: "Nationwide coverage",
  highlight4Label: "Premium buffet",
  highlight4Sub: "5-star quality, professional service",

  // ── Landing page — header / call ─────────────────────────────────────────
  headerLoginBtn: "Sign In / Register",
  callNow: "Call now",

  // ── Landing page — footer ────────────────────────────────────────────────
  footerBrand: "Poseidon Premium Seafood Buffet Restaurant Chain",
  footerAddress: "4F Hanoi Centerpoint, 27 Le Van Luong, Thanh Xuan, Hanoi",
  footerHotline: "Hotline",
  footerFollow: "Follow us",
  footerPhotoCredit: "Photos: Buffet Poseidon",

  // ── Account hub ───────────────────────────────────────────────────────────
  accountHub: "Account",
  accountProfile: "Personal Info",
  accountActivity: "Activity History",
  accountNotifications: "Notifications",
  accountWallet: "Rewards Wallet",
  accountLinked: "Linked Accounts",
  accountTerms: "Terms & Policies",
  accountReferral: "Refer a Friend",
  accountSettings: "Settings",

  // ── Profile section ───────────────────────────────────────────────────────
  profileCustomerId: "Customer ID",
  profileReadOnlyHint: "Read only, cannot edit",
  profileGender: "Gender",
  profileEmail: "Email",
  profileGenderMale: "Male",
  profileGenderFemale: "Female",
  profileGenderOther: "Other",
  profileGenderUnset: "Not set",
  profileSaveBtn: "Save changes",
  profileSaveSuccess: "Changes saved.",

  // ── Activity section ──────────────────────────────────────────────────────
  activityPoints: "Points",
  activityPointsNote: "Illustrative points — no real monetary value",
  activityNoBookings: "No booking history yet.",
  activityPointsEarned: "points earned",

  // ── Notifications section ─────────────────────────────────────────────────
  notifTitle: "Notifications",
  notifBookingUpdate: "Booking Update",
  notifEmpty: "No notifications yet.",

  // ── Wallet section ────────────────────────────────────────────────────────
  walletProtoLabel: "Sample / Prototype",
  walletBirthdayTag: "Birthday",
  walletSampleTag: "Sample Voucher",
  walletOff: "off",
  walletMinSpend: "No minimum spend required",
  walletExpiry: "Exp.",

  // ── Linked accounts section ───────────────────────────────────────────────
  linkedProto: "Prototype — buttons below do not perform real connections",
  linkedConnect: "Connect",

  // ── Terms section ─────────────────────────────────────────────────────────
  termsUsageTitle: "Terms of Use",
  termsMemberTitle: "Membership Policy",
  termsPrivacyTitle: "Privacy Policy",

  // ── Referral section ──────────────────────────────────────────────────────
  referralYourCode: "Your referral code",
  referralBonus: "Earn 50 points when a friend registers",
  referralProto: "Prototype — program not yet active",
  referralShare: "Share",
  referralCopy: "Copy code",
  referralCopied: "Copied!",
  referralFriendCount: "Friends referred",

  // ── Settings section ──────────────────────────────────────────────────────
  settingsPasswordTitle: "Change Password",
  settingsSecurityTitle: "Biometric Security",
  settingsTouchId: "Touch ID / Fingerprint",
  settingsFaceId: "Face ID / Face Recognition",
  settingsOffersTitle: "Notifications & Offers",
  settingsOffersToggle: "Receive promotion notifications",
  settingsLocationTitle: "Your Location",
  settingsDevicesTitle: "Manage Login Devices",
  settingsDeleteTitle: "Delete Account",
  settingsDeleteConfirm: "Are you sure you want to delete your account? This cannot be undone.",
  settingsDeleteBtn: "Delete Account",
  settingsProto: "Prototype — these settings have no real effect",
  settingsLogout: "Sign out of account",
  settingsSaved: "Saved.",

  // ── Placeholder sections ──────────────────────────────────────────────────
  placeholderComingSoon: "Coming Soon",
  placeholderComingSoonNote: "Sample content — will be added later.",

  // ── Pricing page (/gia-buffet) ────────────────────────────────────────────
  pricingPageTitle: "Buffet Prices",
  pricingPageSubtitle: "Choose the right buffet package for you",
  pricingNote: "Prices exclude beverages and mandatory VAT",
  pricingLunchWeekday: "Weekday Lunch",
  pricingLunchWeekdayDesc: "Mon–Fri lunch service",
  pricingLunchWeekdayPrice: "528,000đ",
  pricingEveningWeekend: "Weekday Dinner & Weekend",
  pricingEveningWeekendDesc: "Mon–Fri evenings, Sat & Sun all day",
  pricingEveningWeekendPrice: "598,000đ",
  pricingHoliday: "Holidays & Pre-Holiday",
  pricingHolidayDesc: "Public holidays and days surrounding Tết",
  pricingHolidayPrice: "648,000đ",
  pricingKids: "Kids Buffet",
  pricingKidsDesc: "For children under 10 years old",
  pricingKidsPrice: "258,000đ",
  pricingCtaTitle: "Ready to dine?",
  pricingCtaBody: "Book your table today and enjoy a premium seafood buffet experience.",

  // ── Menu page (/menu) ─────────────────────────────────────────────────────
  menuPageTitle: "Menu",
  menuPageIntro: "~200 Premium Seafood Dishes",
  menuPageBody: "From lobster, king crab, abalone to sashimi and signature grilled dishes — all fresh-selected daily.",
  menuGalleryTitle: "Space & Dishes",

  // ── Branches page (/chi-nhanh) ────────────────────────────────────────────
  branchesPageTitle: "Branches",
  branchesPageSubtitle: "Two branches in Hanoi",
  branchesMapBtn: "View Map",

  // ── About section (landing) ───────────────────────────────────────────────
  aboutTitle: "About Buffet Poseidon",
  aboutBody: "Poseidon is Vietnam's leading seafood buffet chain with 24 branches nationwide. We are proud to deliver a premium dining experience with ~200 fresh seafood dishes carefully selected daily.",

  // ── Booking QR code ───────────────────────────────────────────────────────
  qrExportBtn: "Export QR",
  qrDownloadBtn: "Download PNG",
  qrSummaryTitle: "Booking Summary",
  qrSummaryCode: "Booking code",
  qrSummaryName: "Name",
  qrSummaryBranch: "Branch",
  qrSummarySession: "Session",
  qrSummaryTime: "Arrival",
  qrSummaryGuests: "Guests",
  qrNote: "Show this QR code on arrival for quick check-in.",

  // ── Check-in page (/checkin/[id]) ─────────────────────────────────────────
  checkinTitle: "Check-in Successful",
  checkinSubtitle: "Thank you for coming!",
  checkinAlreadyTitle: "Already Checked In",
  checkinAlreadyBody: "This booking has already been marked as arrived.",
  checkinInvalidTitle: "Cannot Check In",
  checkinInvalidBody: "This booking has been cancelled or is no longer valid. Please contact the restaurant.",
  checkinNotFoundTitle: "Booking Not Found",
  checkinNotFoundBody: "Invalid QR code or booking does not exist.",
  checkinProtoNote: "⚠️ Prototype — this check-in link has no staff authentication.",
  checkinBackHome: "Back to Home",

  // ── Admin scanner page (/admin/scan) ─────────────────────────────────────
  adminScanTitle: "QR Check-in Scanner",
  adminScanSubtitle: "Point the camera at the customer's QR code",
  adminScanBtn: "Open Camera",
  adminScanStop: "Stop Camera",
  adminScanSuccess: "Check-in successful!",
  adminScanAlready: "Customer was already checked in.",
  adminScanError: "Check-in failed. Please try again.",
  adminScanNoCameraNote: "Camera requires HTTPS or localhost. If the camera is unavailable, check your connection protocol.",
  adminScanBackAdmin: "Back to Admin",
  adminScanLink: "Scan QR Check-in",

  // ── Booking page (/dat-ban) ───────────────────────────────────────────────
  datBanPageTitle: "Reserve a Table at Poseidon",

  // ── Misc ───────────────────────────────────────────────────────────────────
  loading: "Loading...",
  guests: "guests",
  tables: "tables",
  of: "/",
  bookedLabel: "tables booked",
};

export default en;
