# GradeUp System Design Documentation

## Project Overview

**GradeUp** is a non-profit, completely free GCSE revision platform built by and for students, teachers, and volunteers. Zero paywalls, zero ads, zero data selling.

**Mission:** "Education for everyone."

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GradeUp Frontend (Next.js)               │
│  - Layout: Sidebar Navigation + Main Content                │
│  - Pages: Dashboard, Subjects, Past Papers, Flashcards      │
│  - Community: Notes, Q&A Wall, Study Groups                 │
│  - Community Admin: Moderation, Verification                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─── API Layer (Next.js API Routes)
                  │    - /api/exam-boards
                  │    - /api/papers
                  │    - /api/mark-schemes
                  │    - /api/admin/upload-paper
                  │    - /api/community/*
                  │    - /api/auth/*
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  Backend Services                           │
│  - Prisma ORM (Database abstraction)                         │
│  - Auth: Clerk (free tier for non-profits)                   │
│  - File Storage: Vercel Blob or S3 (free tier)              │
│  - AI: Optional OpenAI integration for moderation           │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  - Exam Boards, Subjects, Papers, Mark Schemes              │
│  - Community Content (Notes, Flashcards, Q&A)               │
│  - Users, Donations, Impact Metrics                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 15 + TypeScript | Full-stack React, excellent performance |
| **Styling** | Tailwind CSS | Fast, utility-first, accessibility-friendly |
| **Database** | PostgreSQL + Prisma | Type-safe ORM, excellent for complex schemas |
| **Auth** | Clerk | Free tier for non-profits, built for modern web |
| **File Storage** | Vercel Blob / AWS S3 | Scalable, reliable PDF hosting |
| **AI (Optional)** | OpenAI API | Moderation, embeddings for search |
| **Hosting** | Vercel | Free tier, serverless, optimal for Next.js |

---

## Core Database Entities

### exam_boards
- AQA, Edexcel, OCR, WJEC, CCEA

### subjects
- Mathematics, English Language, English Literature, Double Science, etc.

### papers
- Past papers with year, tier (Foundation/Higher), paper number
- Linked to `exam_boards` and `subjects`

### mark_schemes
- Mark schemes for papers
- One-to-one relationship with papers
- Can be hidden until paper is attempted

### users
- Students, teachers, volunteers, admins
- Profile: name, email, subjects, accessibility preferences

### community_notes
- User-uploaded revision notes
- Verification workflow (teacher approves)
- Version history

### flashcards
- User/AI-generated
- Community ratings
- Organized by topic/subject

### student_qna
- Anonymous Q&A wall
- AI moderation (spam detection)
- Teacher verification badges

### study_groups
- Create/join groups
- Shared goals and progress tracking

### donations
- Track one-time and monthly donations
- Anonymous option
- Impact attribution

---

## Page Structure

```
/
├── / (Dashboard - Student Hub)
├── /dashboard (Alternative dashboard)
├── /subjects (Subject picker + roadmap)
├── /subject/[slug]
│   ├── /notes (Community notes)
│   ├── /flashcards (Flashcard deck)
│   ├── /papers (All past papers)
│   └── /chatbot (AI tutor)
├── /papers
│   ├── /[paperId] (Paper viewer + mark scheme)
│   └── /[paperId]/attempt (Practice mode)
├── /community
│   ├── /notes (Browse/submit notes)
│   ├── /wall (Q&A wall)
│   ├── /groups (Study groups)
│   └── /groups/[groupId]
├── /admin
│   ├── /upload-paper (Admin panel)
│   ├── /moderation (Community mod dashboard)
│   └── /analytics (Impact metrics)
├── /donate (Donation + transparency)
├── /settings (User settings)
└── /auth/* (Clerk auth pages)
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance
- All components tested with screen readers
- 4.5:1 contrast ratio for text
- Keyboard navigation on all interactive elements
- Semantic HTML throughout

### Dyslexia-Friendly Mode
- Dyslexic-friendly font: OpenDyslexic
- Increased line spacing
- Reduced animations
- Left-aligned text only
- Sans-serif primary

### High-Contrast Mode
- Dark mode variant
- Enhanced colors for visibility
- Clearer component borders

### Simplified English
- Plain language option
- Reduced jargon
- Shorter sentences
- Clearer explanations

### Audio Support
- Text-to-speech for notes
- Audio descriptions for charts
- Captions for videos

---

## Non-Profit Commitment

### Promises
✅ **No Paywalls** — Every student can access everything  
✅ **No Ads** — Pure learning experience  
✅ **No Data Selling** — Your data is your own  
✅ **Open Source** — Code on GitHub (MIT License)  
✅ **Creative Commons Content** — Resources forked and reused  

### Funding Model
- Donations (optional, entirely voluntary)
- Sponsor-a-student program
- Grant funding from educational charities
- Corporate sponsorship (non-invasive)

### Transparency
- Monthly spending breakdown
- Public GitHub roadmap
- Annual impact report
- Community input on priorities

---

## Security & Privacy

### Data Protection
- Encryption in transit (HTTPS)
- User passwords hashed with bcrypt
- No tracking or analytics cookies
- GDPR/UK DPA compliant
- Age-appropriate consent flows (13+/16+)

### Content Moderation
- AI spam detection (optional)
- Community flagging system
- Teacher manual review
- 24-hour response SLA

### Admin Panel Security
- Role-based access control (RBAC)
- Admin audit logs
- Multi-factor authentication
- IP whitelist support

---

## Performance Targets

| Metric | Target |
|--------|--------|
| **Lighthouse Score** | ≥ 90 |
| **Paper Load Time** | < 2s (with PDF) |
| **API Response Time** | < 100ms (p95) |
| **Mobile FCP** | < 1.5s |
| **Accessibility Score** | 100 |

---

## Deployment

### Stages
1. **Development** — Local testing
2. **Staging** — Pre-production verification
3. **Production** — Public release

### Infrastructure
- **Hosting:** Vercel (Next.js optimal)
- **Database:** Vercel Postgres or AWS RDS
- **File Storage:** Vercel Blob
- **CI/CD:** GitHub Actions

### Monitoring
- Sentry for error tracking
- Vercel Analytics for performance
- Custom logging for API requests
- User feedback forms

---

## Roadmap (Phase 1, 6 months)

### Month 1-2: Foundation
- [ ] Setup project structure
- [ ] Auth system (Clerk)
- [ ] Database schema
- [ ] Seed data

### Month 3: Core Features
- [ ] Dashboard & navigation
- [ ] Paper upload/viewer
- [ ] Basic community notes

### Month 4: Community
- [ ] Flashcards
- [ ] Q&A wall
- [ ] Study groups

### Month 5: Polish & Accessibility
- [ ] Accessibility audit
- [ ] Dyslexia-friendly mode
- [ ] Performance optimization

### Month 6: Launch
- [ ] Marketing site
- [ ] Donation system
- [ ] Public launch

---

## Team Structure

- **Core Team:** 1-2 full-stack developers
- **Community Moderators:** 5-10 volunteer teachers
- **Contributors:** Open source community
- **Advisory Board:** Education experts, students, teachers

---

## Success Metrics (Year 1)

- 10,000+ registered students
- 500+ community notes
- 100,000+ papers attempted
- 50+ volunteer moderators
- £10,000 in community support

