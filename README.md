# Poseidon Booking App

Table-reservation web app for the **Buffet Poseidon** seafood buffet chain (Hanoi).  
Built as a school project prototype by Group 14.

## Features

- **Customer (`/`)** — pick branch, session, date, and party size; see live table availability; instant on-screen confirmation; cancel within a 2-hour window.
- **Admin (`/admin`)** — real-time booking list (4 s polling), one-click confirm, seed / reset demo data.
- **15-minute hold** — tables held lazily; expired holds release automatically without any cron job.
- **Kitchen-hours rule** — if the selected session has already ended today, the date is bumped to tomorrow automatically.
- **Bilingual** — Vietnamese (default) / English toggle stored in `localStorage`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 |
| Data | In-memory (local) · Upstash Redis (production) |
| Deploy | Vercel |

---

## Local development (zero config)

```bash
git clone <repo>
cd poseidon-booking
npm install
npm run dev
```

Open **http://localhost:3000** — both routes are on the same server:

| Route | Purpose |
|---|---|
| `/` | Customer booking page |
| `/admin` | Admin dashboard |

> No `.env.local` needed. The app uses an in-memory store when no Redis env vars are present.

---

## Production deploy on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Framework: **Next.js** (auto-detected).
3. Click **Deploy** — the first deploy uses in-memory storage (fine for a quick demo).

### 3. Add Upstash Redis (for persistent data across requests)

1. In the Vercel dashboard → **Storage** → **Create Database** → **Redis (Upstash)**.
2. Link it to your project — Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
3. Re-deploy (vars are picked up on the next deploy).

> The app also reads `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` if you prefer to use your own Upstash account directly.

### 4. Local dev with Redis (optional)

Copy the env vars from Vercel or your Upstash console into `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...
```

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Customer "/"
│   ├── admin/page.tsx              # Admin "/admin"
│   └── api/
│       ├── bookings/route.ts       # GET list, POST create
│       ├── bookings/[id]/route.ts  # PATCH confirm / cancel
│       ├── availability/route.ts   # GET available tables
│       └── seed/route.ts           # POST seed / reset demo data
├── components/
│   ├── layout/                     # Header, LanguageToggle
│   ├── customer/                   # BookingForm, AvailabilityBadge, ConfirmationModal, HoldCountdown
│   └── admin/                      # BookingTable, BookingRow
├── hooks/
│   ├── useAvailability.ts          # Polls /api/availability every 4 s
│   └── useBookings.ts              # Polls /api/bookings every 4 s
└── lib/
    ├── types.ts                    # All TypeScript interfaces
    ├── constants.ts                # Branches, sessions, capacity
    ├── booking-utils.ts            # Availability calc, hold expiry, kitchen-hours rule, timezone
    ├── db.ts                       # Dual-backend: in-memory ↔ Upstash Redis
    └── i18n/                       # vi.ts, en.ts, context.tsx
```

---

## Demo data

On the **Admin** page, click **"Tạo dữ liệu mẫu" / "Seed Demo Data"** to populate 6 sample bookings across both branches and sessions for today and tomorrow. Click **"Xóa tất cả" / "Clear All"** to reset.
