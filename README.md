# GradeUp - GCSE Revision Platform

[![Next.js](https://img.shields.io/badge/next.js-16-blue.svg)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/prisma-5-green.svg)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3-purple.svg)](https://tailwindcss.com)

A free, non-profit GCSE revision platform with personalized learning paths, past papers, flashcards, quizzes, gamification, and community features.

## 🚀 Features

- **Personalized Dashboard**: Progress tracking, weakness prediction, daily recommendations.
- **Past Papers**: AQA, Edexcel, OCR – timed practice with mark schemes.
- **Spaced Repetition**: AI-powered flashcards with SM-2 algorithm.
- **Quizzes & Progress**: Topic mastery tracking.
- **RPG Gamification**: XP, levels, badges, streaks.
- **Community**: Notes, Q&A, study groups.
- **Accessibility**: Dyslexia mode, high-contrast, keyboard nav.
- **AI Support**: Lesson notes, practice questions, explanations.

## 📋 Quick Start

### 1. Clone & Install
```bash
git clone <repo>
cd GradeUp/gradeup
npm install
```

### 2. Environment Setup
Copy `.env.local.example` to `.env.local` and fill:
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLERK_FRONTEND_API=pk_test_...
CLERK_API_KEY=sk_test_...
GROQ_API_KEY=... (optional for AI)
```

### 3. Database
```bash
npx prisma generate
npx prisma db push
node prisma/seed.mjs
```

### 4. Development Server
```bash
npm run dev
```
Open http://localhost:3000

### 5. Production Build
```bash
npm run build
npm start
```

## 🛠 Schema & Code (Fixed)

**Models:**
- `Subject` (title, slug)
- `Topic`
- `Flashcard` + `SpacedRepetitionCard` (SM-2)
- `PastPaper` (boards, years, tiers)
- `RevisionRPGProfile` (XP/levels)
- `ExamBoard`

**Key Files:**
| Feature | Files |
|---------|-------|
| Core | `lib/prisma.ts`, `prisma/schema.prisma`
| Auth | `lib/auth.ts`, Clerk
| Dashboard | `app/dashboard/page.tsx`
| Subjects | `app/subjects/page.tsx`, `components/subjects/SubjectCard.tsx`
| Gamification | `lib/gamification.ts`
| API | `app/api/papers/route.ts`

**No Errors:**
- Schema synced (no pastPaperSet/userXP).
- Queries fixed (no userProgresses/examBoard).
- Prisma singleton + adapter.

## 🎯 Your GCSEs Seeded

| Board | Subjects |
|-------|----------|
| AQA | English Lit (8702), English Lang (8700), Geography (8035)
| Edexcel | Business (1BS0), Maths (1MA1H)
| OCR | Combined Science (J260H), Computer Science (J277)

## 📱 Usage Guide

1. **Onboard** → Pick subjects → Diagnostic quiz.
2. **Dashboard** → Daily plan, weaknesses, streaks.
3. **Subjects** → Topics → Quizzes/Flashcards/Papers.
4. **Practice** → Timed papers + mark schemes.

## 🔧 Troubleshooting

**Prisma errors:**
```
npx prisma db push
node prisma/seed.mjs
```

**Server port busy:**
Kill PID or use `npm run dev -- -p 3001`

**Clerk dev mode:**
Claim keys: https://dashboard.clerk.com/apps/claim?...

## 🚀 Deploy Vercel

1. Push GitHub.
2. Vercel dashboard → Import.
3. Add env vars (DATABASE_URL PG, Clerk keys).

## 🤝 Contributing

1. Fork → Branch.
2. `npm i && npm run dev`.
3. PR with changes.

**Roadmap:**
- Past paper uploads.
- AI question gen.
- Teacher dashboards.

Non-profit | Transparent | Student-first.
