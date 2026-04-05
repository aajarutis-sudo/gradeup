import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getDateKey, getStreakLength, getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";
import OnboardingResultsButton from "@/components/onboarding/OnboardingResultsButton";

export default async function OnboardingResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const { subject: subjectSlug } = await searchParams;
  if (!subjectSlug) {
    redirect("/onboarding/subjects");
  }

  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });

  if (!subject) {
    notFound();
  }

  const [prediction, focusAreas, streakEntries, xp] = await Promise.all([
    prisma.userSubjectPrediction.findFirst({
      where: { userId: viewer.id, subjectId: subject.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userFocusArea.findMany({
      where: { userId: viewer.id, subjectId: subject.id },
      include: { topic: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.userStreak.findMany({
      where: { userId: viewer.id },
      orderBy: { date: "desc" },
      take: 14,
    }),
    prisma.revisionRPGProfile.findUnique({
      where: { userId: viewer.id },
    }),
  ]);

  const streakLength = getStreakLength(streakEntries.map((entry) => entry.dateKey));
  const startedToday = streakEntries.some((entry) => entry.dateKey === getDateKey());

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge>Results</Badge>
          <PageTitle className="text-4xl">Your first revision snapshot</PageTitle>
          <SubTitle>Here’s your starting point. You can improve from here, and the next steps are already laid out.</SubTitle>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card title="Predicted grade">
            <p className="text-4xl font-extrabold text-[var(--primary)]">{prediction?.predictedGrade ?? "-"}</p>
          </Card>
          <Card title="XP earned">
            <p className="text-4xl font-extrabold text-[var(--success)]">{xp?.totalXP ?? 0}</p>
          </Card>
          <Card title="Streak">
            <p className="text-4xl font-extrabold text-[var(--warning)]">{streakLength}</p>
            <p className="mt-2 text-sm text-muted">{startedToday ? "Your streak has started today." : "Your first session is waiting."}</p>
          </Card>
          <Card title="Focus areas">
            <p className="text-sm text-muted">{focusAreas.length} recommended topics</p>
          </Card>
        </div>

        <Card title="Recommended topics" subtitle="Start here to build the strongest gains.">
          <div className="grid gap-3 md:grid-cols-3">
            {focusAreas.map((focus) => (
              <Link key={focus.id} href={`/topics/${focus.topic.slug}`} className="rounded-3xl bg-[var(--background)] p-4">
                <p className="font-semibold">{focus.topic.title}</p>
                <p className="mt-2 text-sm text-muted">Target this topic first.</p>
              </Link>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          <OnboardingResultsButton />
        </div>
      </div>
    </MainLayout>
  );
}
