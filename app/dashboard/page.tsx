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
              {subjects.map((subject) => {
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
              })}
            </div>
          </Card>

          <div className="grid gap-4">
            <Card title="Predicted grade">
              <p className="text-5xl font-extrabold text-[var(--primary)]">{latestPrediction?.predictedGrade ?? "-"}</p>
              <p className="mt-2 text-sm text-muted">
                Based on your latest diagnostic quiz{latestPrediction?.subject ? ` in ${latestPrediction.subject.name}` : ""}.
              </p>
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
              {focusAreas.length ? (
                focusAreas.map((focus) => (
                  <Link key={focus.id} href={`/topics/${focus.topic.slug}`} className="block rounded-3xl bg-[var(--background)] p-4">
                    <p className="font-semibold">{focus.topic.title}</p>
                    <p className="mt-1 text-sm text-muted">{focus.subject.name ?? focus.subject.title}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted">Finish onboarding or take another quiz to refresh your recommendations.</p>
              )}
            </div>
          </Card>

          <Card title="Continue where you left off" subtitle="Pick up your last topic in one click.">
            {latestProgress ? (
              <Link href={`/topics/${latestProgress.topic.slug}`} className="block rounded-3xl bg-[var(--background)] p-5">
                <p className="text-sm text-muted">{latestProgress.topic.subject.name ?? latestProgress.topic.subject.title}</p>
                <p className="mt-2 text-xl font-bold">{latestProgress.topic.title}</p>
                <p className="mt-2 text-sm text-muted">Saved progress: {latestProgress.completed}% complete</p>
              </Link>
            ) : (
              <p className="text-sm text-muted">No recent progress yet. Start a subject and your next step will appear here.</p>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
