# Poseidon Booking

Online table reservation for **Buffet Poseidon** — a premium seafood buffet chain in Hanoi.  
Built as a school prototype by Group 14.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | **20.9.0 or later** (required by Next.js 16) |
| npm | 10+ (bundled with Node 20) |

No database setup required for local development — the app runs fully in-memory out of the box.

---

## Quick start

```bash
git clone <repo-url>
cd poseidon-booking
npm install
npm run dev
```

Open **http://localhost:3000**. Both routes start immediately — no `.env.local` needed.

| Route | What it does |
|---|---|
| `/` | Customer booking page (book, cancel, birthday voucher, my bookings) |
| `/admin` | Admin dashboard (confirm, assign tables, analytics) |

---

## How the data layer works

### Without env vars — in-memory store (default)

Data lives in Node.js module-level `Map` objects for the lifetime of the process.  
Restarts reset all data. This is the default for local dev and quick Vercel demos.

### With Upstash Redis — persistent across requests and restarts

Set **either** of these pairs:

```env
# Option A — Upstash account directly
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# Option B — Vercel KV integration (auto-injected by Vercel)
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=AXxx...
```

Put them in `.env.local` for local development with Redis, or let Vercel inject them (see deploy steps below).

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "deploy"
git push
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your repo.
2. Framework preset: **Next.js** (auto-detected).
3. Click **Deploy** — the first deploy runs on the in-memory store, which is fine for a demo.

### 3. Add persistent storage (optional but recommended)

In the Vercel dashboard:

1. **Storage → Create Database → Redis (Upstash)** — create a new database.
2. **Link** it to your project — Vercel automatically injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. Trigger a **re-deploy** (the env vars are picked up on the next build).

From that point on, bookings and customer accounts survive across serverless function cold-starts and re-deploys.

> You can also use your own Upstash account: copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the Upstash console into Vercel → Settings → Environment Variables.

---

## Features

### Phase 1 — Core booking flow

- **Branch selector** — Poseidon Lê Văn Lương (Center Point) and Mỹ Đình (Sky Lake)
- **Session selector** — Lunch (11:00–13:00) and Dinner (17:30–20:00)
- **Real-time availability** — polls every 4 seconds; color-coded badge (green / amber / red)
- **15-minute table hold** — expires lazily (no cron job needed); countdown shown to customer
- **Kitchen-hours rule** — if the session has already ended today, the date auto-bumps to tomorrow
- **Cancellation** — allowed up to 2 hours before arrival
- **Bilingual UI** — Vietnamese (default) and English; preference stored in `localStorage`
- **Timezone-aware** — all date logic in `Asia/Ho_Chi_Minh`

### Phase 2 — Admin dashboard + smart table assignment + analytics

- **Admin `/admin`** — live booking list (4 s polling), one-click confirm, seed / reset demo data
- **Smart table assignment** — heuristic minimises wasted seats (single → multi → greedy)
- **Manual override** — admin can select any combination of free tables via checkbox panel
- **Demand analytics** — illustrative bar charts (avg. guests by hour and by weekday) with peak/off-peak highlighting

### Phase 2 Feature 3 — Customer accounts (prototype)

- **Phone-based login** — enter phone + name; existing phone = login, new phone = register
- **Auto-fill** — name and phone pre-populated in the booking form when logged in
- **Booking history** — logged-in customers see their own past/active bookings
- **Birthday voucher** — if today matches the customer's saved birthday (MM-DD), a dismissible banner shows a generated voucher code and discount percentage
- **Guest mode** — login is optional; all booking features work without an account

> **Prototype note:** Customer auth uses no passwords, tokens, or session cookies. The birthday voucher code is illustrative and has no monetary value. The demand-analytics data is generated seed data and does not reflect real booking figures. These features are clearly framed as prototypes in the UI.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                     # Customer page "/"
│   ├── admin/page.tsx               # Admin page "/admin"
│   └── api/
│       ├── bookings/route.ts        # GET list (filter by ?customerId=), POST create
│       ├── bookings/[id]/route.ts   # PATCH confirm / cancel / assign tables
│       ├── availability/route.ts    # GET available tables for a slot
│       ├── customers/route.ts       # POST login-or-register (prototype auth)
│       └── seed/route.ts            # POST seed demo data / reset
├── components/
│   ├── layout/                      # Header (greeting + logout), LanguageToggle
│   ├── customer/                    # BookingForm, AvailabilityBadge, ConfirmationModal,
│   │                                #   HoldCountdown, LoginWidget, BirthdayBanner, MyBookings
│   └── admin/                       # BookingTable, BookingRow, TableSuggestion, DemandChart
├── hooks/
│   ├── useAvailability.ts           # Polls /api/availability every 4 s
│   └── useBookings.ts               # Polls /api/bookings every 4 s
└── lib/
    ├── types.ts                     # TypeScript interfaces (Booking, Customer, …)
    ├── constants.ts                 # Branches, sessions, table inventory, capacity
    ├── booking-utils.ts             # Availability calc, hold expiry, kitchen-hours rule
    ├── db.ts                        # Dual-backend: in-memory Map ↔ Upstash Redis
    ├── voucher.ts                   # Illustrative birthday-voucher logic
    ├── table-assignment.ts          # Smart table heuristic
    ├── historical-data.ts           # Illustrative seed data for demand chart
    ├── chart-utils.ts               # Data aggregation for Recharts
    ├── customer-context.tsx         # React context for logged-in customer state
    └── i18n/                        # vi.ts, en.ts, context.tsx
```

---

## Demo data

On the admin page, click **"Tạo dữ liệu mẫu" / "Seed Demo Data"** to create 6 sample bookings across both branches, sessions, and dates. Click **"Xóa tất cả" / "Clear All"** to reset.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict, Turbopack) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts 3 |
| ID generation | nanoid |
| Data store | In-memory (default) · Upstash Redis (production) |
| Deployment | Vercel |
