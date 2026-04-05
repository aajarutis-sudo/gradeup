# GradeUp - Complete Implementation Guide

## Project Overview

GradeUp is a non-profit, completely free GCSE revision platform. This guide covers the complete system architecture, implementation details, and deployment instructions.

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account (for auth)
- Vercel account (for deployment, optional)

### Installation

```bash
# 1. Clone and install
git clone <repo-url>
cd gradeup
npm install

# 2. Environment setup
cp .env.example .env.local

# 3. Fill in .env.local with:
DATABASE_URL=postgresql://...
CLERK_PUBLIC_KEY=pk_...
CLERK_SECRET_KEY=sk_...
ADMIN_EMAILS=admin@gradeup.org,teacher@gradeup.org

# 4. Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 5. Start development server
npm run dev
```

### Access the Application

- **Main App:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/upload-paper
- **Community Wall:** http://localhost:3000/community/wall
- **Study Groups:** http://localhost:3000/study-groups

---

## User Flow Diagrams

### Student User Flow

```
┌─────────────────┐
│   New Student   │
└────────┬────────┘
         │ Sign up
         ▼
┌─────────────────────────┐
│  Onboarding Flow        │
│  - Select subjects      │
│  - Accessibility prefs  │
│  - Subject roadmap      │
└────────┬────────────────┘
         │ Complete
         ▼
┌────────────────────────────┐
│   Dashboard               │
│  - Quick stats            │
│  - Recent activity        │
│  - Browse subjects        │
└────┬─────────────┬────────┘
     │             │
     │ View Papers │ Join Community
     ▼             ▼
┌──────────────┐  ┌──────────────────┐
│ Papers       │  │ Community        │
│  - Browse    │  │  - Notes         │
│  - Practice  │  │  - Q&A Wall      │
│  - Timed     │  │  - Study Groups  │
└──────────────┘  └──────────────────┘
     │
     │ Complete paper
     ▼
┌──────────────────────┐
│ Mark scheme reveal   │
│ Score calculation    │
│ Progress update      │
└──────────────────────┘
```

### Teacher/Volunteer Flow

```
┌──────────────────┐
│ Logged in + Admin │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Admin Panel             │
│  - Upload Paper          │
│  - Manage Content        │
│  - Moderation Queue      │
│  - View Analytics        │
└────┬─────────┬───────────┘
     │         │
     │ Upload  │ Moderate
     ▼         ▼
┌──────────┐  ┌────────────────┐
│ Paper    │  │ Community      │
│ Storage  │  │ Moderation     │
│          │  │  - Approve     │
│          │  │  - Reject      │
│          │  │  - Flag        │
└──────────┘  └────────────────┘
```

### Community Contribution Flow

```
┌──────────────────┐
│ Student/Teacher  │
└────────┬─────────┘
         │ Create content
         ▼
┌──────────────────┐
│ - Note           │
│ - Flashcard      │
│ - Q&A Post       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ AI Moderation    │
│ - Spam check     │
│ - Content filter │
└────────┬─────────┘
         │
         ├─ Reject (Spam)
         │          ▼
         │    Notify user
         │
         ├─ Needs Review
         │          ▼
         │    Teacher queue
         │          │
         │          ├─ Approve ──┐
         │          │             ▼
         │          └─ Reject  Published
         │
         └─ Auto-approve ────────┐
                                  ▼
                            Community sees
                            content
```

---

## Database Schema Overview

### Core Models

**Users & Auth**
- `User` - Student/teacher profiles
- `UserProgress` - Learning progress tracking
- `UserXP` - Gamification (points & levels)
- `UserBadge` - Achievement system

**Revision Content**
- `Subject` - GCSE subjects
- `ExamBoard` - AQA, Edexcel, OCR, WJEC, CCEA
- `Topic` - Topic breakdown
- `Question` - Quiz questions
- `QuizAttempt` - Attempt tracking

**Past Papers**
- `PastPaperSet` - Paper collection
- `PastPaperResource` - PDF files
- `PastPaperSession` - Practice sessions
- `MarkScheme` - Correct answers

**Community**
- `CommunityNote` - User-shared notes
- `StudentQnA` - Q&A wall posts
- `StudyGroup` - Peer study groups
- `Flashcard` - Flashcard decks
- `ContentFlag` - Moderation reports

**Admin & Donations**
- `Donation` - User contributions
- `ImpactMetric` - System-wide stats

---

## API Routes

### Public API Routes

```
GET /api/exam-boards                 → List all exam boards
GET /api/exam-boards/[boardId]/subjects  → Get subjects for board
GET /api/papers                      → List papers with filters
  ?board=AQA&subject=Maths&year=2024
GET /api/papers/[paperId]            → Single paper details
GET /api/mark-schemes/[paperId]      → Mark scheme for paper
```

### Community API Routes

```
GET  /api/community/notes            → Browse community notes
POST /api/community/notes            → Create note (auth required)
PUT  /api/community/notes/[noteId]   → Update note
GET  /api/community/wall             → Q&A wall posts
POST /api/community/wall             → Post question
GET  /api/community/groups           → List study groups
POST /api/community/groups           → Create group
POST /api/community/flags            → Report content
```

### Admin API Routes

```
POST /api/admin/upload-paper         → Upload past paper
POST /api/admin/moderation/[itemId]  → Approve/reject content
GET  /api/admin/analytics            → System metrics
GET  /api/admin/flags                → Moderation queue
```

---

## Key Features Implementation

### 1. Accessibility First

**Dyslexia-Friendly Mode**
- OpenDyslexic font
- Increased line spacing (1.5-1.8)
- Left-aligned text only
- Reduced animations
- High readability color palette

**High-Contrast Mode**
- WCAG AAA compliant (7:1 contrast ratio)
- Enhanced focus indicators
- Clearer form labels
- Visible focus outlines

**Keyboard Navigation**
- Tab through all interactive elements
- Enter/Space to activate
- Escape to close modals
- Screen reader annotations

**Code Location:** `components/ui/AccessibilityToggle.tsx`

### 2. Community Moderation

**AI Moderation**
- Automatic spam detection
- Offensive language filter
- Misinformation flagging
- Rate limiting on posts

**Teacher Verification**
- Teacher badge on Q&A answers
- Content approval workflow
- Version history tracking
- Edit audit logs

**Code Location:** `api/admin/moderation/`

### 3. Donation System

**Payment Processing**
- Stripe integration (test mode ready)
- One-time donations
- Monthly recurring support
- Anonymous giving option

**Sponsor-a-Student**
- £50/term direct support
- Sends materials to student
- Acknowledges donor (if consented)

**Code Location:** `components/DonationBox.tsx`, `app/donate/`

### 4. Study Groups

**Features**
- Create public/private groups
- Set group goals
- Track member progress
- In-group messaging (future)
- Group leaderboards

**Code Location:** `components/community/StudyGroupCard.tsx`

---

## Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Create Vercel project
vercel --prod

# 3. Set environment variables in Vercel dashboard
# DATABASE_URL
# CLERK_PUBLIC_KEY
# CLERK_SECRET_KEY
# ADMIN_EMAILS

# 4. Database on Vercel Postgres
# Upgrade in dashboard or use external PostgreSQL

# 5. Storage on Vercel Blob
# For PDF hosting
```

### Self-Hosted

```bash
# 1. Setup server (Ubuntu 22.04)
apt update && apt upgrade -y
apt install nodejs npm postgresql postgresql-contrib -y

# 2. Clone repo and install
cd /var/www/gradeup
npm install --production

# 3. Build for production
npm run build

# 4. Setup PM2 for process management
npm install -g pm2
pm2 start npm --name gradeup --cwd /var/www/gradeup -- start

# 5. Setup Nginx reverse proxy
# Create /etc/nginx/sites-available/gradeup
# Configure port 3000 → 80

# 6. SSL with Certbot
sudo certbot certonly --standalone -d gradeup.org
# Auto-renew: certbot renew --dry-run
```

---

## Codebase Structure

```
gradeup/
├── app/
│   ├── api/                    # API routes
│   │   ├── exam-boards/       # Public exam boards API
│   │   ├── papers/            # Papers listing
│   │   ├── mark-schemes/      # Mark schemes
│   │   ├── community/         # Community features
│   │   ├── admin/             # Admin operations
│   │   └── donations/         # Payment processing
│   ├── dashboard/             # Student dashboard
│   ├── admin/                 # Admin pages
│   ├── community/             # Community pages
│   │   ├── notes/
│   │   └── wall/
│   ├── donate/                # Donation page
│   ├── study-groups/          # Study group pages
│   └── layout.tsx             # Root layout
├── components/
│   ├── Sidebar.tsx            # Main navigation
│   ├── MainLayout.tsx         # Layout wrapper
│   ├── ui/                    # Reusable UI components
│   │   ├── SubjectCard.tsx
│   │   ├── PaperCard.tsx
│   │   ├── AccessibilityToggle.tsx
│   │   └── ...
│   └── community/             # Community components
│       ├── CommunityNoteCard.tsx
│       ├── QnACard.tsx
│       └── StudyGroupCard.tsx
├── lib/
│   ├── prisma.ts             # Prisma client
│   ├── auth.ts               # Auth helpers
│   └── utils.ts              # Utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed script
├── styles/
│   └── globals.css           # Global styles + accessibility
├── public/
│   └── ...                   # Static assets
├── .env.local               # Environment variables
├── package.json
└── tsconfig.json
```

---

## Configuration Files

### .env.local Template

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gradeup

# Clerk Auth
CLERK_PUBLIC_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Settings
ADMIN_EMAILS=admin@gradeup.org,teacher1@gradeup.org

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=...

# Optional: OpenAI API for moderation
OPENAI_API_KEY=sk_...

# Optional: Stripe (for donations)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### prisma.config.ts

```typescript
export default {
  database: process.env.DATABASE_URL,
  schemaPath: './prisma/schema.prisma',
}
```

---

## Running the Seed Script

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Or directly:
npx ts-node prisma/seed.ts
```

**Seeded Data:**
- ✅ 5 exam boards (AQA, Edexcel, OCR, WJEC, CCEA)
- ✅ 9 subjects (Maths, English Language, English Literature, Biology, Chemistry, Physics, Geography, History, Computer Science)
- ✅ 1 initial impact metric
- ✅ Ready for paper uploads

---

## File Upload Configuration

### Supported Files
- **Papers:** PDF only, max 50MB
- **Mark Schemes:** PDF only, max 50MB

### Storage Options

**Vercel Blob** (Recommended)
```typescript
import { put } from '@vercel/blob'

const blob = await put(`papers/${year}-${paperNumber}.pdf`, file, {
  access: 'public',
})
return blob.url
```

**AWS S3**
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: 'us-east-1' })
await s3.send(new PutObjectCommand({
  Bucket: 'gradeup-pdfs',
  Key: `papers/${year}-${paperNumber}.pdf`,
  Body: file,
}))
```

---

## Accessibility Compliance

### WCAG 2.1 Level AA Target

| Criterion | Status | Implementation |
|-----------|--------|-----------------|
| 1.4.3 Contrast | ✅ | 4.5:1 for normal text, 3:1 for large |
| 1.4.4 Resize Text | ✅ | Native browser zoom support |
| 2.1.1 Keyboard | ✅ | Full keyboard navigation |
| 2.1.2 No Keyboard Trap | ✅ | Focus management |
| 2.4.3 Focus Order | ✅ | Logical tab order |
| 3.2.4 Consistent Navigation | ✅ | Sidebar always visible |
| 4.1.2 Name, Role, Value | ✅ | ARIA labels on all controls |
| 4.1.3 Status Messages | ✅ | Live regions for alerts |

### Accent Colors (Dyslexia-Friendly Palette)

```css
/* Friendly, warm tones */
--primary: #2563eb (Blue)
--secondary: #8b5cf6 (Purple)
--accent: #ff6348 (Coral)
--success: #10b981 (Emerald)
--warning: #f59e0b (Amber)
--danger: #ef4444 (Red)

/* High contrast backgrounds */
--bg-light: #f9fafb (Light)
--bg-dark: #1f2937 (Dark)
```

---

## Non-Profit Messaging

### Key Messaging

**On Every Page:**
```
"GradeUp is 100% free and always will be. 
No ads, no data selling, no paywalls."
```

**Donation Page:**
```
"Your donation directly supports:
✓ Server costs so students can study anytime
✓ AI moderation to keep community safe
✓ Accessibility improvements for all
✓ Teacher volunteers who build content"
```

**About Page:**
```
"Built by students, teachers, and volunteers.
Funded by community support.
Transparent about everything."
```

### Non-Profit Certification

- [ ] UK Charity Commission registered
- [ ] Annual financial reporting
- [ ] Public board members list
- [ ] Community advisory board
- [ ] Open-source code on GitHub

---

## Monitoring & Analytics

### Health Checks

```bash
# API health
curl http://localhost:3000/api/health

# Database connection
npx prisma db execute --stdin < health-check.sql

# Authentication
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/user
```

### Logging

```typescript
// Use structured logging
console.log({
  level: 'info',
  message: 'Paper uploaded',
  paperId: paper.id,
  size: file.size,
  timestamp: new Date(),
})
```

### Performance Monitoring

- **Lighthouse:** Target 90+ score
- **API Response Time:** < 100ms (p95)
- **Page Load:** < 2s (with PDFs)
- **Core Web Vitals:** All green

---

## Support & Community

### Getting Help

- **GitHub Issues:** Report bugs and feature requests
- **Discord:** Community support channel
- **Email:** support@gradeup.org
- **FAQ:** `/help` page

### Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feat/my-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push and create PR
5. Code review and merge

### Code of Conduct

- Respectful communication
- Inclusive environment
- Focus on student benefit
- Transparency in decisions

