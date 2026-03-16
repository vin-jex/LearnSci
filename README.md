# LearnSci - Computer-Assisted Learning System

A full-stack Next.js application for teaching basic science with Igbo terminology support and adaptive quiz feedback.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js (Credentials Provider) + JWT |
| State | Redux Toolkit |
| Forms | React Hook Form + Zod |
| ORM | Prisma |
| Database | PostgreSQL |
| Hosting | Vercel + Railway/Supabase |

---

## Project Structure

```
cal-system/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Shared auth layout (dark botanical bg)
│   │   ├── login/page.tsx      # Sign-in page
│   │   └── register/page.tsx   # Registration page
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth handler
│   │   └── register/           # User registration endpoint
│   ├── dashboard/
│   │   ├── layout.tsx          # Auth-guarded dashboard layout
│   │   └── page.tsx            # Dashboard home
│   ├── globals.css
│   ├── layout.tsx              # Root layout (fonts, providers)
│   └── page.tsx                # Landing page
├── components/
│   ├── auth/
│   │   ├── FormInput.tsx       # Reusable text input
│   │   └── PasswordInput.tsx   # Password input with show/hide
│   ├── dashboard/
│   │   └── DashboardNav.tsx    # Top navbar with sign-out
│   └── providers/
│       ├── ReduxProvider.tsx
│       └── SessionProvider.tsx
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma singleton
│   ├── store/
│   │   ├── index.ts            # Redux store
│   │   ├── hooks.ts            # Typed hooks
│   │   └── slices/authSlice.ts # Auth UI state
│   └── validations/auth.ts     # Zod schemas
├── messages/
│   ├── en.json                 # English UI labels
│   └── ig.json                 # Igbo UI labels
├── prisma/
│   ├── schema.prisma           # Full DB schema
│   └── seed.ts                 # Sample data seed
├── types/
│   ├── index.ts                # Domain types
│   └── next-auth.d.ts          # Session type augmentation
└── middleware.ts               # Route protection
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd cal-system
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/cal_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"    # openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data (Photosynthesis topic + admin user)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Authentication Flow

```
/ (landing)
  └── /register → POST /api/register → auto sign-in → /dashboard
  └── /login    → NextAuth credentials → JWT cookie → /dashboard

Protected routes (middleware.ts):
  /dashboard/*, /topic/*, /quiz/*, /result/*, /admin/*
```

### Demo Account (after seeding)
- **Email:** admin@cal.edu
- **Password:** admin1234

---

## Database Schema Overview

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password |
| `Topic` | id, title, description, duration, order |
| `Lesson` | id, topicId, content (markdown), order |
| `KeyTerm` | id, topicId, englishTerm, igboTerm, igboExplanation |
| `Question` | id, topicId, type, correctAnswer, feedbackRules (JSON) |
| `Attempt` | id, userId, topicId, score, classification, weakAreas |

---

## Development Phases

- [x] **Phase 1** - Database schema + Prisma setup
- [x] **Phase 2** - Authentication (Register, Login, JWT, Middleware)
- [x] **Phase 3** - Topic & Lesson rendering + Igbo Toggle
- [x] **Phase 4** - Quiz Engine (MCQ, True/False, Short Answer)
- [x] **Phase 5** - Rule-based Evaluation Engine (server-side, deterministic)
- [x] **Phase 6** - Performance Summary (STRONG / MODERATE / WEAK + recommendations)
- [x] **Phase 7** - Admin Panel (Topics, Lessons, Key Terms, Questions CRUD)
- [ ] **Phase 8** - Deployment (Vercel + Railway)

---

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number
- Strength meter displayed in real-time on registration

---

## Igbo Support Strategy

- Terminology-level bilingual support (not full page translation)
- `KeyTerm` model stores English + Igbo + Igbo explanation per topic
- `<IgboToggle />` component (Phase 3) shows/hides Igbo terms inline
- UI labels translatable via `messages/en.json` and `messages/ig.json`

---

## Phase 8 - Deployment Guide

### Vercel (Frontend + API)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
gh repo create cal-system --public --push

# 2. Import on vercel.com
# Connect your GitHub repo, then add environment variables:
#   DATABASE_URL=...
#   NEXTAUTH_URL=https://your-app.vercel.app
#   NEXTAUTH_SECRET=...  (openssl rand -base64 32)
```

### Railway (PostgreSQL)

```bash
# 1. Create a new project on railway.app
# 2. Add a PostgreSQL service
# 3. Copy the DATABASE_URL from Railway → paste into Vercel env vars
# 4. Run migrations:
npx prisma migrate deploy
npm run db:seed
```

### Make first user an Admin

After seeding, the default admin credentials are:
- **Email:** admin@cal.edu  
- **Password:** admin1234

To make any other user an admin, run in Prisma Studio or directly in SQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or via Prisma Studio:

```bash
npm run db:studio
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register new learner |
| POST | `/api/auth/...` | NextAuth login/session |
| GET | `/api/topics` | List topics with user progress |
| GET | `/api/topics/:id` | Single topic + lessons + key terms |
| GET | `/api/quiz/:id` | Quiz questions (no answers) |
| POST | `/api/quiz/:id/evaluate` | Evaluate single answer (immediate feedback) |
| POST | `/api/attempt` | Submit full quiz → runs evaluation engine |
| GET | `/api/attempt/:id` | Fetch attempt result |
| GET | `/api/admin/topics` | Admin: list all topics |
| POST | `/api/admin/topics` | Admin: create topic |
| PATCH | `/api/admin/topics/:id` | Admin: update topic |
| DELETE | `/api/admin/topics/:id` | Admin: delete topic |
| POST | `/api/admin/topics/:id/lessons` | Admin: create/update lesson |
| POST | `/api/admin/topics/:id/terms` | Admin: add key term |
| DELETE | `/api/admin/topics/:id/terms` | Admin: remove key term |
| GET | `/api/admin/topics/:id/questions` | Admin: list questions |
| POST | `/api/admin/topics/:id/questions` | Admin: create question |
| PATCH | `/api/admin/topics/:id/questions/:qid` | Admin: update question |
| DELETE | `/api/admin/topics/:id/questions/:qid` | Admin: delete question |
