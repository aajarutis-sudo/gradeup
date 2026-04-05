import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getStreakLength, getViewer, requireOnboardingRedirect } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";
import XPBar from "@/components/ui/XPBar";
import LevelIndicator from "@/components/ui/LevelIndicator";
import StreakCounter from "@/components/ui/StreakCounter";
import ProgressBar from "@/components/ui/ProgressBar";

export default async function DashboardPage() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  if (requireOnboardingRedirect(viewer.onboardedAt)) {
    redirect("/onboarding");
  }

  const [subjects, latestPrediction, focusAreas, latestProgress, streakEntries, xp] = await Promise.all([
    prisma.subject.findMany({
      where: {
        userSelections: {
          some: {
            userId: viewer.id,
          },
        },
      },
      include: {
        topics: {
          include: {
            progress: {
              where: { userId: viewer.id },
            },
          },
        },
        userSelections: {
          where: {
            userId: viewer.id,
          },
        },
      },
      orderBy: { title: "asc" },
    }),
    prisma.userSubjectPrediction.findFirst({
      where: { userId: viewer.id },
      include: { subject: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userFocusArea.findMany({
      where: { userId: viewer.id },
      include: { topic: true, subject: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.userProgress.findFirst({
      where: { userId: viewer.id },
      include: { topic: { include: { subject: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userStreak.findMany({
      where: { userId: viewer.id },
      orderBy: { date: "desc" },
      take: 30,
    }),
    prisma.revisionRPGProfile.findUnique({
      where: { userId: viewer.id },
    }),
  ]);

  const streakLength = getStreakLength(streakEntries.map((entry) => entry.dateKey));
  const hasSubjects = subjects.length > 0;
  const hasPrediction = Boolean(latestPrediction);
  const hasFocusAreas = focusAreas.length > 0;
  const hasLatestProgress = Boolean(latestProgress);
  const resumeTopic = latestProgress;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge>Dashboard</Badge>
          <PageTitle className="text-4xl">Welcome back, {viewer.name ?? "Student"}</PageTitle>
          <SubTitle>Your subjects, predicted grade, focus areas, XP, and next step are all here.</SubTitle>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Progress overview" subtitle="See where you are across your subjects.">
            <div className="space-y-4">
              {hasSubjects ? (
                subjects.map((subject) => {
                  const completion = subject.topics.length
                    ? Math.round(
                      subject.topics.reduce((total, topic) => total + (topic.progress[0]?.completed ?? 0), 0) /
                      subject.topics.length
                    )
                    : 0;
                  return (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Link href={`/subjects/${subject.slug}`} className="font-semibold">
                          {subject.name ?? subject.title}
                        </Link>
                        <span className="text-sm text-muted">{completion}%</span>
                      </div>
                      <ProgressBar value={completion} />
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[24px] bg-[var(--background)] p-5">
                  <p className="font-semibold">Add your subjects to unlock your dashboard.</p>
                  <p className="mt-2 text-sm text-muted">
                    Pick the courses and exam boards you actually study, then GradeUp can build your progress view properly.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/onboarding/subjects" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
                      Choose subjects
                    </Link>
                    <Link href="/subjects" className="rounded-full bg-[var(--background-elevated)] px-4 py-2 text-sm font-semibold">
                      Browse subjects
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-4">
            <Card title="Predicted grade">
              {hasPrediction ? (
                <>
                  <p className="text-5xl font-extrabold text-[var(--primary)]">{latestPrediction?.predictedGrade}</p>
                  <p className="mt-2 text-sm text-muted">
                    Based on your latest diagnostic quiz{latestPrediction?.subject ? ` in ${latestPrediction.subject.name}` : ""}.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-extrabold text-[var(--primary)]">No grade yet</p>
                  <p className="mt-2 text-sm text-muted">
                    Take your first diagnostic so GradeUp can estimate a starting point and recommend the right topics.
                  </p>
                  <Link href="/onboarding/quiz" className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
                    Take diagnostic
                  </Link>
                </>
              )}
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <LevelIndicator level={xp?.level ?? 1} />
              <StreakCounter streak={streakLength} />
            </div>
            <Card title="XP bar">
              <XPBar xp={xp?.totalXP ?? 0} level={xp?.level ?? 1} />
            </Card>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Recommended topics" subtitle="Start with these to tighten your weakest areas.">
            <div className="space-y-3">
              {hasFocusAreas ? (
                focusAreas.map((focus) => (
                  <Link key={focus.id} href={`/topics/${focus.topic.slug}`} className="block rounded-3xl bg-[var(--background)] p-4">
                    <p className="font-semibold">{focus.topic.title}</p>
                    <p className="mt-1 text-sm text-muted">{focus.subject.name ?? focus.subject.title}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[24px] bg-[var(--background)] p-5">
                  <p className="font-semibold">No focus topics yet.</p>
                  <p className="mt-2 text-sm text-muted">Once you finish a diagnostic, your weakest areas will appear here with direct links into revision.</p>
                  <Link href="/onboarding/quiz" className="mt-4 inline-flex rounded-full bg-[var(--background-elevated)] px-4 py-2 text-sm font-semibold">
                    Start diagnostic
                  </Link>
                </div>
              )}
            </div>
          </Card>

          <Card title="Keep studying" subtitle="Pick up your last topic in one click.">
            {hasLatestProgress && resumeTopic ? (
              <Link href={`/topics/${resumeTopic.topic.slug}`} className="block rounded-3xl bg-[var(--background)] p-5">
                <p className="text-sm text-muted">{resumeTopic.topic.subject.name ?? resumeTopic.topic.subject.title}</p>
                <p className="mt-2 text-xl font-bold">{resumeTopic.topic.title}</p>
                <p className="mt-2 text-sm text-muted">Saved progress: {resumeTopic.completed}% complete</p>
              </Link>
            ) : (
              <div className="rounded-[24px] bg-[var(--background)] p-5">
                <p className="font-semibold">No recent study session yet.</p>
                <p className="mt-2 text-sm text-muted">Open a subject and start one unit. We’ll surface it here so you can jump back in next time.</p>
                <Link href="/subjects" className="mt-4 inline-flex rounded-full bg-[var(--background-elevated)] px-4 py-2 text-sm font-semibold">
                  Open subjects
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
