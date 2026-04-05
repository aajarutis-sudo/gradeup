import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getStreakLength, getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/cards/Card";
import StreakHeatmap from "@/components/streak/StreakHeatmap";

export default async function StreakPage() {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const streakEntries = await prisma.userStreak.findMany({
    where: { userId: viewer.id },
    orderBy: { date: "desc" },
    take: 60,
  });

  const streakLength = getStreakLength(streakEntries.map((entry) => entry.dateKey));
  const activeThisMonth = streakEntries.filter((entry) => {
    const date = new Date(entry.date);
    const now = new Date();
    return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth();
  }).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Streak"
          title={`You are on a ${streakLength}-day streak`}
          description="Every quiz submission and flashcard session logs activity. Keep the chain going."
        />
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card title="Streak stats" subtitle="Momentum matters more than perfect sessions.">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] bg-[var(--surface-strong)] p-5">
                <p className="text-sm text-muted">Current streak</p>
                <p className="mt-2 text-3xl font-semibold">{streakLength}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-strong)] p-5">
                <p className="text-sm text-muted">Activity entries</p>
                <p className="mt-2 text-3xl font-semibold">{streakEntries.length}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-strong)] p-5">
                <p className="text-sm text-muted">Longest streak</p>
                <p className="mt-2 text-3xl font-semibold">
                  {Math.max(streakLength, viewer.rpgProfile?.longestStreak ?? 0)}
                </p>
                <p className="mt-1 text-xs text-muted">{activeThisMonth} active day{activeThisMonth === 1 ? "" : "s"} this month</p>
              </div>
            </div>
          </Card>
          <Card title="Recent activity heatmap" subtitle="The last 8 weeks at a glance, with today highlighted.">
            <StreakHeatmap dateKeys={streakEntries.map((entry) => entry.dateKey)} days={56} />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
