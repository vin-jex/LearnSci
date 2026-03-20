# LearnSci — Computer-Assisted Learning System

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
| ORM | Prisma (with `@prisma/adapter-pg`) |
| Database | PostgreSQL (Neon serverless) |
| Hosting | Vercel + Neon |

---

## Project Structure
```
cal-system/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   ├── topics/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── quiz/
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── evaluate/route.ts
│   │   ├── attempt/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── dashboard/
│   │   │   └── stats/route.ts
│   │   └── admin/
│   │       └── topics/ (CRUD + lessons, terms, questions)
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── topics/
│   │       ├── page.tsx
│   │       ├── new/page.tsx
│   │       └── [id]/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── topic/[id]/
│   ├── quiz/[id]/
│   ├── result/[id]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── AdminNav.tsx
│   │   ├── KeyTermsEditor.tsx
│   │   ├── LessonEditor.tsx
│   │   ├── QuestionsEditor.tsx
│   │   └── TopicSettingsEditor.tsx
│   ├── auth/
│   │   ├── FormInput.tsx
│   │   └── PasswordInput.tsx
│   ├── dashboard/
│   │   └── DashboardNav.tsx
│   ├── lesson/
│   │   ├── IgboToggle.tsx
│   │   ├── KeyTermCard.tsx
│   │   ├── KeyTermsPanel.tsx
│   │   ├── LessonContent.tsx
│   │   └── LessonViewer.tsx
│   ├── providers/
│   │   ├── ReduxProvider.tsx
│   │   └── SessionProvider.tsx
│   ├── quiz/
│   │   ├── FeedbackPanel.tsx
│   │   ├── MCQQuestion.tsx
│   │   ├── PerformanceSummary.tsx
│   │   ├── QuizEngine.tsx
│   │   ├── QuizProgress.tsx
│   │   ├── ShortAnswerQuestion.tsx
│   │   └── TrueFalseQuestion.tsx
│   └── topic/
│       ├── TopicCard.tsx
│       └── TopicGrid.tsx
├── lib/
│   ├── adminAuth.ts
│   ├── auth.ts
│   ├── evaluate.ts
│   ├── prisma.ts
│   ├── hooks/
│   │   ├── useTopic.ts
│   │   ├── useTopics.ts
│   │   └── useTranslation.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       └── igboSlice.ts
│   └── validations/auth.ts
├── messages/
│   ├── en.json
│   └── ig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.svg
│   ├── logo.svg
│   └── og-image.svg
├── types/
│   ├── index.ts
│   └── next-auth.d.ts
└── middleware.ts
```

---

## Getting Started

### 1. Clone & Install
```bash
git clone <your-repo>
cd cal-system
pnpm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
```
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."    # openssl rand -base64 32
```

> **Note:** Use a [Neon](https://neon.tech) PostgreSQL connection string. Do not add `channel_binding=require` — it is not supported by the `@prisma/adapter-pg` driver.

### 3. Database Setup
```bash
pnpm db:push
pnpm db:seed
```

### 4. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@cal.edu | admin1234 |
| Learner | learner@cal.edu | learner1234 |

---

## Authentication Flow
```
/ (landing)
  └── /register → POST /api/register → auto sign-in → /dashboard
  └── /login    → NextAuth credentials → JWT cookie → /dashboard

Protected routes (middleware.ts):
  /dashboard/*, /topic/*, /quiz/*, /result/*, /admin/*
```

---

## Database Schema

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password, role (LEARNER \| ADMIN) |
| `Topic` | id, title, description, duration, order, published |
| `Lesson` | id, topicId, content (markdown), order |
| `KeyTerm` | id, topicId, englishTerm, igboTerm, igboExplanation |
| `Question` | id, topicId, type, correctAnswer, feedbackRules (JSON) |
| `Attempt` | id, userId, topicId, score, classification, weakAreas (JSON) |

---

## Seeded Content

The seed populates **14 science topics** covering the Nigerian secondary school curriculum, with a total of **296 quiz questions**:

| # | Topic | Questions |
|---|---|---|
| 1 | Photosynthesis | 20 |
| 2 | Cell Structure | 20 |
| 3 | Human Digestive System | 22 |
| 4 | Ecosystems and Food Chains | 22 |
| 5 | Human Reproductive System | 20 |
| 6 | States of Matter | 22 |
| 7 | Electricity and Circuits | 22 |
| 8 | Genetics and Heredity | 24 |
| 9 | Forces and Motion | 22 |
| 10 | The Atom | 20 |
| 11 | Human Circulatory System | 20 |
| 12 | Plant Biology | 20 |
| 13 | Chemical Reactions | 22 |
| 14 | Human Nervous System | 20 |

Each topic includes a full markdown lesson, 7–8 bilingual Igbo key terms with explanations, and questions spanning MCQ, True/False, and Short Answer types.

---

## Development Phases

- [x] **Phase 1** — Database schema + Prisma setup
- [x] **Phase 2** — Authentication (Register, Login, JWT, Middleware)
- [x] **Phase 3** — Topic & Lesson rendering + Igbo Toggle
- [x] **Phase 4** — Quiz Engine (MCQ, True/False, Short Answer)
- [x] **Phase 5** — Rule-based Evaluation Engine (server-side, deterministic)
- [x] **Phase 6** — Performance Summary (STRONG / MODERATE / WEAK + recommendations)
- [x] **Phase 7** — Admin Panel (Topics, Lessons, Key Terms, Questions CRUD)
- [x] **Phase 8** — Deployment (Vercel + Neon)

---

## Igbo Support

- **Global toggle** in the navigation bar — persists across all learner pages via Redux
- `KeyTerm` model stores English term, Igbo term, and Igbo explanation per topic
- Toggleable bilingual sidebar in lessons and quiz
- UI labels translatable via `messages/en.json` and `messages/ig.json`
- `useTranslation()` hook drives all translatable UI strings

---

## AI Evaluation Engine (`lib/evaluate.ts`)

The quiz uses a **rule-based, deterministic** evaluation engine — no external AI API calls.

For each question, the engine:
1. Normalises the learner's answer (lowercase, trim)
2. Checks against the correct answer
3. If wrong, scans `feedbackRules.misconceptions` for a matching pattern
4. Returns targeted feedback if matched, or `defaultFeedback` otherwise
5. After a full attempt: classifies performance and identifies weak areas

**Classifications:**
- `STRONG` — ≥ 80% → unlocks next topic
- `MODERATE` — 50–79% → directed to weak areas
- `WEAK` — < 50% → directed to review the full lesson

---

## Dashboard Stats

The `/api/dashboard/stats` endpoint computes live per-user stats:

| Stat | Description |
|---|---|
| Topics | Total published topics available |
| Quizzes | Number of distinct topics attempted |
| Avg Score | Mean score across all attempts |
| Streak | Consecutive days with at least one attempt |

---

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number
- Real-time strength meter on registration

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register new learner |
| POST | `/api/auth/...` | NextAuth login/session |
| GET | `/api/topics` | List topics with user progress |
| GET | `/api/topics/:id` | Single topic + lessons + key terms |
| GET | `/api/quiz/:id` | Quiz questions + key terms (no answers) |
| POST | `/api/quiz/:id/evaluate` | Evaluate single answer (immediate feedback) |
| POST | `/api/attempt` | Submit full quiz → runs evaluation engine |
| GET | `/api/attempt/:id` | Fetch attempt result |
| GET | `/api/dashboard/stats` | Live learner stats (topics, quizzes, avg, streak) |
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

---

## Deployment

### Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
4. Deploy

### Neon (PostgreSQL)

1. Create a project on [neon.tech](https://neon.tech)
2. Copy the connection string into `DATABASE_URL`
3. Run `pnpm db:push && pnpm db:seed`

### Promote a user to Admin (post-deploy)
```bash
pnpm db:studio
```

Or directly in SQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```