import type { Dictionary } from "./vi";

const en: Dictionary = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  brandName: "Buffet Poseidon",
  headerTagline: "Premium Seafood Buffet",
  tagline: "Book a table online — fast, instant confirmation",

  // ── Navigation ─────────────────────────────────────────────────────────────
  navCustomer: "Book a Table",
  navAdmin: "Admin",

  // ── Booking form ───────────────────────────────────────────────────────────
  formTitle: "Reserve a Table",
  labelBranch: "Branch",
  labelSession: "Session",
  labelDate: "Date",
  labelArrivalTime: "Arrival time",
  labelPartySize: "Party size",
  labelName: "Full name",
  labelPhone: "Phone number",
  placeholderName: "Nguyen Van A",
  placeholderPhone: "0901234567",
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
  confirmationBranch: "Branch",
  confirmationSession: "Session",
  confirmationDate: "Date",
  confirmationArrival: "Arrival",
  confirmationParty: "Party size",
  confirmationStatus: "Status",
  confirmationHold:
    "Your table will be held for 15 minutes after your arrival time. Please arrive on time.",
  confirmationClose: "Close",

  // ── Hold countdown ─────────────────────────────────────────────────────────
  holdTitle: "Your table is being held",
  holdUntilPrefix: "Table held until",
  holdExpires: "Expires in",
  holdExpired: "Hold expired — the table has been released.",

  // ── Kitchen hours rule ─────────────────────────────────────────────────────
  kitchenClosedTitle: "Kitchen is closed for this session",
  kitchenClosedBody:
    "This session has already ended today. We have moved your date to tomorrow.",

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
  statusCancelled: "Cancelled",
  statusExpired: "Hold Expired",

  // ── Table assignment (admin) ───────────────────────────────────────────────
  tableSuggestionLabel: "Table Suggestion",
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
  adminBtnSeedData: "Seed Demo Data",
  adminBtnReset: "Clear All",
  adminEmptyState: "No bookings yet.",
  adminSeedSuccess: "Demo data has been seeded.",
  adminResetSuccess: "All data has been cleared.",

  // ── Errors / validation ────────────────────────────────────────────────────
  errRequired: "Please fill in all required fields.",
  errNoTables: "No tables available for this slot.",
  errInvalidPhone: "Invalid phone number.",
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
  loginBtnSubmit: "Sign In / Register",
  loginBtnGuest: "Continue as Guest",
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

  // ── Misc ───────────────────────────────────────────────────────────────────
  loading: "Loading...",
  guests: "guests",
  tables: "tables",
  of: "/",
  bookedLabel: "tables booked",
};

export default en;
