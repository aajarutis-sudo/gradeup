# Prisma Schema Mismatch Report

## Summary
Found **18+ files** with references to non-existent Prisma models/fields that don't exist in the schema.

---

## Issue 1: `prisma.pastPaperSet` (SHOULD BE `prisma.pastPaper`)

**Status**: ❌ Model does NOT exist in schema  
**Actual**: `PastPaper` model exists  
**Affected Files**: 8 files

### Files with Problematic References:

#### 1. [prisma/seed.mjs](prisma/seed.mjs#L782)
- **Line 782**: `await prisma.pastPaperSet.deleteMany();`
- **Line 915**: `const paperSet = await prisma.pastPaperSet.create({`
- **Line 933**: `pastPaperSetId: paperSet.id,`
- **Line 947**: `pastPaperSetId: paperSet.id,`
- **Context**: Seed script attempting to create `pastPaperSet` records with fields like `subjectId`, `examBoard`, `year`, `paperNumber`, `tier`, `title`, `overview`, `durationMinutes`, `questionFocus`, `isPublished`
- **Issue**: Model is named `PastPaper`, not `PastPaperSet`

#### 2. [app/api/papers/route.ts](app/api/papers/route.ts#L15)
- **Line 15**: `const papers = await prisma.pastPaperSet.findMany({`
- **Context**: 
  ```typescript
  const papers = await prisma.pastPaperSet.findMany({
    where: {
      examBoard: board,
      year: Number.isFinite(year) ? year : undefined,
      paperNumber,
      tier: tier === "NONE" ? undefined : tier,
      subject: subjectSlug ? { slug: subjectSlug } : undefined,
    },
  ```
- **Issue**: Should use `prisma.pastPaper` instead

#### 3. [app/api/papers/[paperId]/route.ts](app/api/papers/[paperId]/route.ts#L9)
- **Line 9**: `const paper = await prisma.pastPaperSet.findUnique({`
- **Context**:
  ```typescript
  const paper = await prisma.pastPaperSet.findUnique({
    where: { id: Number(paperId) },
    include: {
      subject: { select: { id: true, slug: true, name: true, examBoard: true } },
      resources: { orderBy: [{ type: "asc" }] },
    },
  });
  ```
- **Issue**: Should use `prisma.pastPaper`; note that `resources` relation doesn't exist

#### 4. [app/api/mark-schemes/[paperId]/route.ts](app/api/mark-schemes/[paperId]/route.ts#L9)
- **Line 9**: `const paper = await prisma.pastPaperSet.findUnique({`
- **Context**: Same pattern as above
- **Issue**: Should use `prisma.pastPaper`

---

## Issue 2: `prisma.userXP` (MODEL DOES NOT EXIST)

**Status**: ❌ Model does NOT exist in schema  
**Actual**: `RevisionRPGProfile` model exists with XP fields  
**Affected Files**: 9 files

The schema has `RevisionRPGProfile` with fields: `totalXP`, `currentXP`, `xpForNextLevel`, but there is **no separate `UserXP` model**.

### Files with Problematic References:

#### 1. [app/topics/[topic]/practice/page.tsx](app/topics/[topic]/practice/page.tsx#L29)
- **Line 29**: `const xp = await prisma.userXP.findUnique({`
- **Issue**: `userXP` model doesn't exist

#### 2. [app/schedule/page.tsx](app/schedule/page.tsx#L35)
- **Line 35**: `prisma.userXP.findUnique({`
- **Issue**: `userXP` model doesn't exist

#### 3. [app/onboarding/results/page.tsx](app/onboarding/results/page.tsx#L50)
- **Line 50**: `prisma.userXP.findUnique({`
- **Issue**: `userXP` model doesn't exist

#### 4. [lib/gamification.ts](lib/gamification.ts#L24-L36)
- **Line 24**: `const current = await prisma.userXP.upsert({`
  ```typescript
  const current = await prisma.userXP.upsert({
    where: { userId },
    update: { xp: { increment: amount } },
    create: { userId, xp: amount },
  });
  ```
- **Line 36**: `return prisma.userXP.update({`
  ```typescript
  return prisma.userXP.update({
    where: { userId },
    data: { level },
  });
  ```
- **Issue**: Should use `RevisionRPGProfile` instead

#### 5. [lib/auth.ts](lib/auth.ts#L37)
- **Line 37**: `await prisma.userXP.create({`
- **Issue**: `userXP` model doesn't exist

#### 6. [prisma/seed.mjs](prisma/seed.mjs#L777)
- **Line 777**: `await prisma.userXP.deleteMany();`
- **Line 967**: `await prisma.userXP.create({`
- **Issue**: `userXP` model doesn't exist

#### 7. [app/dashboard/page.tsx](app/dashboard/page.tsx#L60)
- **Line 60**: `prisma.userXP.findUnique({`
- **Issue**: `userXP` model doesn't exist

#### 8. [app/api/learning/spaced-repetition/submit-review/route.ts](app/api/learning/spaced-repetition/submit-review/route.ts#L91-L107)
- **Line 91**: `let userXP = await prisma.userXP.findUnique({`
- **Line 96**: `userXP = await prisma.userXP.create({`
- **Line 104**: `userXP = await prisma.userXP.update({`
- **Context**: 
  ```typescript
  let userXP = await prisma.userXP.findUnique({
    where: { userId: user.id },
  })

  if (!userXP) {
    userXP = await prisma.userXP.create({
      data: { userId: user.id, xp: xpReward, level: 1 },
    })
  } else {
    userXP = await prisma.userXP.update({
      where: { userId: user.id },
      data: { xp: userXP.xp + xpReward },
    })
  }
  ```
- **Issue**: Should use `RevisionRPGProfile` instead

---

## Issue 3: `nextReviewAt` FIELD ON `SpacedRepetitionCard`

**Status**: ❌ Field does NOT exist in schema  
**Schema Definition**: `SpacedRepetitionCard` only has: `id`, `userId`, `flashcardId`, `quality`, `createdAt`, `user`, `flashcard`  
**Affected Files**: 5 files

### Files with Problematic References:

#### 1. [lib/spacedRepetition.ts](lib/spacedRepetition.ts#L11)
- **Line 11**: `nextReviewAt: Date;` - Interface definition
- **Line 60-61**: 
  ```typescript
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);
  ```
- **Line 68**: `nextReviewAt,` - Return value
- **Line 78**: `return cards.filter((card) => card.nextReviewAt <= now);`
- **Issue**: Field doesn't exist on model; interface expects it

#### 2. [app/api/learning/spaced-repetition/submit-review/route.ts](app/api/learning/spaced-repetition/submit-review/route.ts#L68)
- **Line 68**: `nextReviewAt: card.nextReviewAt,`
- **Line 82**: `nextReviewAt: newState.nextReviewAt,`
- **Issue**: Field doesn't exist on `SpacedRepetitionCard` model

#### 3. [app/api/learning/spaced-repetition/due/route.ts](app/api/learning/spaced-repetition/due/route.ts#L38)
- **Line 38**: `nextReviewAt: { lte: now }`
- **Line 99**: `nextReviewAt: card.nextReviewAt,`
- **Issue**: Field doesn't exist; query will fail

---

## Issue 4: `slug` FIELD ON `Subject` MODEL

**Status**: ❌ Field does NOT exist in schema  
**Schema Definition**: `Subject` only has: `id`, `title`, `createdAt`, `topics`, `pastPapers`  
**Affected Files**: 13+ files

### Files with Problematic References:

#### 1. [prisma/seed.ts](prisma/seed.ts#L25)
- **Line 25**: `where: { slug: subject.slug },`
- **Line 29**: `slug: subject.slug,`
- **Context**: Attempting to use `slug` in upsert
- **Issue**: `Subject` model doesn't have a `slug` field

#### 2. [app/topics/[topic]/page.tsx](app/topics/[topic]/page.tsx#L104)
- **Line 104**: `<Link href={`/subjects/${topic.subject.slug}`}`
- **Issue**: subject.slug doesn't exist

#### 3. [components/dashboard/RevisionTimetableGenerator.tsx](components/dashboard/RevisionTimetableGenerator.tsx#L42)
- **Line 42**: `subjects.find((subject) => subject.slug === selectedSlug) ?? subjects[0]`
- **Line 99**: `<option key={subject.slug} value={subject.slug}>`
- **Issue**: subject.slug doesn't exist

#### 4. [app/dashboard/page.tsx](app/dashboard/page.tsx#L89)
- **Line 89**: `<Link href={`/subjects/${subject.slug}`}`
- **Issue**: subject.slug doesn't exist

#### 5. [app/schedule/page.tsx](app/schedule/page.tsx#L48)
- **Line 48**: `slug: prediction.subject.slug,`
- **Issue**: subject.slug doesn't exist

#### 6. [app/onboarding/subjects/page.tsx](app/onboarding/subjects/page.tsx#L45)
- **Line 45**: `href={`/onboarding/quiz?subject=${subject.slug}`}`
- **Issue**: subject.slug doesn't exist

#### 7. [app/subjects/page.tsx](app/subjects/page.tsx#L64)
- **Line 64**: `slug={subject.slug}`
- **Issue**: subject.slug doesn't exist

#### 8. [app/subjects/[subject]/papers/[paperId]/page.tsx](app/subjects/[subject]/papers/[paperId]/page.tsx#L68)
- **Line 68**: `<Link href={`/subjects/${paper.subject.slug}`}`
- **Issue**: subject.slug doesn't exist

#### 9. [app/subjects/[subject]/page.tsx](app/subjects/[subject]/page.tsx#L99)
- **Line 99**: `href={`/subjects/${subject.slug}/papers/${paper.id}`}`
- **Issue**: subject.slug doesn't exist

#### 10. [app/onboarding/quiz/page.tsx](app/onboarding/quiz/page.tsx#L38)
- **Line 38**: `subjectSlug={subject.slug}`
- **Issue**: subject.slug doesn't exist

---

## Issue 5: `name` FIELD ON `Subject` MODEL (SHOULD BE `title`)

**Status**: ❌ Field is named `title`, not `name`  
**Schema**:  
```prisma
model Subject {
  id        String   @id @default(cuid())
  title     String      // ← This is the field name
  createdAt DateTime @default(now())
}
```
**Affected Files**: 13+ files

### Files with Problematic References:

#### 1. [prisma/seed.ts](prisma/seed.ts#L28-L31)
- **Line 28**: `name: subject.name,`
- **Line 31**: `description: `${subject.name} GCSE revision materials`,`
- **Line 34**: `console.log(`  ✓ ${subject.name}`)`
- **Issue**: Schema field is `title`, not `name`

#### 2. [components/dashboard/RevisionTimetableGenerator.tsx](components/dashboard/RevisionTimetableGenerator.tsx#L56)
- **Line 56**: `subject: selectedSubject.name,`
- **Line 100**: `{subject.name}`
- **Issue**: Should use `title` instead of `name`

#### 3. [app/topics/[topic]/practice/page.tsx](app/topics/[topic]/practice/page.tsx#L38)
- **Line 38**: `subjectName={topic.subject.name}`
- **Issue**: Should be `topic.subject.title`

#### 4. [app/schedule/page.tsx](app/schedule/page.tsx#L49)
- **Line 49**: `name: prediction.subject.name,`
- **Line 78**: `<p className="mt-2 text-sm text-muted">{slot.topic.subject.name}</p>`
- **Issue**: Should use `title`

#### 5. [app/topics/[topic]/page.tsx](app/topics/[topic]/page.tsx#L46)
- **Line 46**: `eyebrow={topic.subject.name}`
- **Line 105**: `Back to {topic.subject.name}`
- **Issue**: Should be `title`

#### 6. [app/dashboard/page.tsx](app/dashboard/page.tsx#L90)
- **Line 90**: `{subject.name}`
- **Line 105**: `in ${latestPrediction.subject.name}`
- **Line 125**: `<p className="mt-1 text-sm text-muted">{focus.subject.name}</p>`
- **Line 137**: `<p className="text-sm text-muted">{latestProgress.topic.subject.name}</p>`
- **Issue**: All should use `title`

#### 7. [app/topics/[topic]/notes/page.tsx](app/topics/[topic]/notes/page.tsx#L35)
- **Line 35**: `subjectName={topic.subject.name}`
- **Issue**: Should be `title`

#### 8. [app/continue/page.tsx](app/continue/page.tsx#L38)
- **Line 38**: `<p className="text-sm text-muted">{latest.topic.subject.name}</p>`
- **Issue**: Should be `title`

#### 9. [app/onboarding/subjects/page.tsx](app/onboarding/subjects/page.tsx#L50)
- **Line 50**: `<p className="mt-2 text-lg font-bold">{subject.name}</p>`
- **Issue**: Should be `title`

#### 10. [app/onboarding/quiz/page.tsx](app/onboarding/quiz/page.tsx#L39)
- **Line 39**: `subjectName={subject.name}`
- **Issue**: Should be `title`

#### 11. [app/subjects/page.tsx](app/subjects/page.tsx#L65)
- **Line 65**: `name={subject.name}`
- **Issue**: Should be `title`

#### 12. [app/subjects/[subject]/page.tsx](app/subjects/[subject]/page.tsx#L51)
- **Line 51**: `title={subject.name}`
- **Issue**: Should be `title` (field name)

#### 13. [app/subjects/[subject]/papers/[paperId]/page.tsx](app/subjects/[subject]/papers/[paperId]/page.tsx#L48)
- **Line 48**: `description={`Practice paper for ${paper.subject.name}.`}`
- **Issue**: Should be `title`

---

## Issue 6: `prisma.impactMetric` (MODEL DOES NOT EXIST)

**Status**: ❌ Model does NOT exist in schema  
**Affected Files**: 1+ files

### Files with Problematic References:

#### 1. [components/ImpactDashboard.tsx](components/ImpactDashboard.tsx#L27)
- **Line 27**: `fetchImpactMetrics();` (method call)
- **Line 30**: `const fetchImpactMetrics = async () => {`
- **Issue**: Component fetches from `/api/impact/metrics` but there's no corresponding `impactMetric` model in Prisma

---

## Issue 7: SCHEMA.PRISMA SEED DATA MISMATCHES

**File**: [prisma/seed.mjs](prisma/seed.mjs#L809-L815)

The seed file tries to create `Subject` records with fields that don't exist in the schema:
- **Line 809-815**: Creating Subject with: `slug`, `name`, `description`, `examBoard`, `color`, `icon`
- **Schema Definition**: Subject only has `id`, `title`, `createdAt`
- **Missing Relations**: `topics`, `pastPapers`

```typescript
const subject = await prisma.subject.create({
  data: {
    slug: subjectBlueprint.slug,           // ❌ Doesn't exist
    name: subjectBlueprint.name,           // ❌ Should be `title`
    description: subjectBlueprint.description,  // ❌ Doesn't exist
    examBoard: subjectBlueprint.examBoard,      // ❌ Doesn't exist
    color: subjectBlueprint.color,             // ❌ Doesn't exist
    icon: subjectBlueprint.name.charAt(0),     // ❌ Doesn't exist
  },
});
```

---

## Summary Table

| Issue | Severity | Files Affected | Status |
|-------|----------|-----------------|--------|
| `pastPaperSet` → `pastPaper` | 🔴 Critical | 4 | Model renamed |
| `userXP` model missing | 🔴 Critical | 8 | Model doesn't exist; should use `RevisionRPGProfile` |
| `Subject.slug` missing | 🟠 High | 10+ | Field not in schema |
| `Subject.name` → `title` | 🟠 High | 13+ | Wrong field name |
| `SpacedRepetitionCard.nextReviewAt` | 🟠 High | 5 | Field not in schema |
| `impactMetric` model | 🟡 Medium | 1+ | Model not in schema |

---

## Recommendations

### Priority Fixes:

1. **Add missing fields to models** or update all references:
   - Add `slug` and `title` to Subject model, or update all code
   - Add `nextReviewAt` to SpacedRepetitionCard or refactor review logic
   - Create proper `UserXP` model or consolidate into `RevisionRPGProfile`

2. **Update seed files** ([prisma/seed.mjs](prisma/seed.mjs) and [prisma/seed.ts](prisma/seed.ts)) to match actual schema

3. **Replace all `pastPaperSet` with `pastPaper`** across API routes

4. **Create or document** the `impactMetric` data source (API endpoint vs. database model)

