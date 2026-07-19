# Tuition Adda

Find and rate tuition teachers in Kolkata. Teachers post profiles; students and
parents search by pincode, subject, grade, board, solo/group, and mode
(student's home / teacher's place / online), then rate teachers they've studied with.

**Stack:** Next.js 16 (App Router) · Tailwind + shadcn/ui · Supabase (Postgres + Auth) · Drizzle ORM · Vercel

## Setup

### 1. Supabase (free tier)

1. Create a project at [supabase.com](https://supabase.com) (pick the Mumbai region).
2. In **Project Settings → API**, copy the Project URL and anon key.
3. In **Project Settings → Database → Connection string**, copy the
   **Transaction pooler** URI (port 6543) and fill in your DB password.
4. Recommended for the hackathon: in **Authentication → Providers → Email**,
   turn **off** "Confirm email" so signups work instantly.

### 2. Environment

```bash
cp .env.example .env.local
# paste the three values from step 1
```

### 3. Create tables & seed demo data

```bash
npm install
npm run db:push   # creates the 4 tables in Supabase
npm run db:seed   # 16 Kolkata teachers, 6 students, 15 ratings
```

### 4. Run

```bash
npm run dev
```

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add the three env vars from `.env.example` in Vercel project settings.
3. Deploy — that's it.

## How it's organized

```
src/
  app/                 # routes: / /search /teacher/[id] /login /signup /onboarding /dashboard
  components/          # navbar, teacher card, filters, forms, rating widget
  db/schema.ts         # users, teacher_profiles, student_profiles, ratings
  lib/constants.ts     # subjects/grades/boards/modes picklists + Kolkata pincode check
  lib/queries.ts       # search + profile queries (avg rating computed in SQL)
  lib/actions/         # server actions: profiles, ratings, auth user bootstrap
scripts/seed.ts        # demo data
```

Notes:
- Search and teacher profiles are **public** — login is only needed to post a
  profile or rate a teacher.
- One rating per student per teacher (DB unique constraint); re-rating edits in place.
- Seeded demo accounts can't log in (they have random auth ids) — sign up
  fresh to test the flows.
