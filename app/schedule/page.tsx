import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getStreakLength, getViewer } from "@/lib/auth";
import { buildWeeklySchedule } from "@/lib/study";
import MainLayout from "@/components/layout/MainLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/cards/Card";
import RevisionTimetableGenerator from "@/components/dashboard/RevisionTimetableGenerator";

export default async function SchedulePage() {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const [topics, predictions, streakEntries, xp] = await Promise.all([
    prisma.topic.findMany({
      include: {
        subject: true,
        progress: {
          where: { userId: viewer.id },
        },
      },
    }),
    prisma.weaknessPrediction.findMany({
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

  const schedule = buildWeeklySchedule(topics);
  const streak = getStreakLength(streakEntries.map((entry) => entry.dateKey));
  const aiSubjects = predictions.map((prediction) => ({
    slug: prediction.topic.subject.slug,
    name: prediction.topic.subject.name ?? prediction.topic.subject.title,
    predictedGrade: prediction.riskScore,
    weakTopics: [prediction.topic.title],
    strongTopics: topics
      .filter((topic) => topic.subjectId === prediction.topic.subjectId)
      .sort((a, b) => (b.progress[0]?.completed ?? 0) - (a.progress[0]?.completed ?? 0))
      .slice(0, 3)
      .map((topic) => topic.title),
  }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Schedule"
          title="Your weekly revision map"
          description="Lower-progress topics rise to the top, and the AI timetable keeps sessions short, spaced, and realistic."
        />

        <Card title="AI revision timetable generator" subtitle="Build a weekly plan with shorter sessions, smart spacing, and proper breaks.">
          <RevisionTimetableGenerator subjects={aiSubjects} xp={xp?.currentXP ?? 0} level={xp?.level ?? 1} streak={streak} />
        </Card>

        <Card title="Suggested spaced schedule" subtitle="A built-in fallback plan so you always have a calm, doable week to follow.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {schedule.map((slot, index) => (
              <div key={`${slot.dayLabel}-${slot.topic.id}`} className={`glass-panel rounded-[28px] p-5 animate-fade-up stagger-${(index % 4) + 1}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{slot.dayLabel}</p>
                <h2 className="mt-3 text-xl font-semibold">{slot.topic.title}</h2>
                <p className="mt-2 text-sm text-muted">{slot.topic.subject.name ?? slot.topic.subject.title}</p>
                <p className="mt-4 text-sm text-muted">{slot.sessionLabel}</p>
                <p className="mt-1 text-sm text-muted">Focus block: {slot.focusMinutes} minutes</p>
                <p className="mt-1 text-sm text-muted">Break after session: {slot.breakMinutes} minutes</p>
                <p className="mt-1 text-sm text-muted">
                  Current progress: {slot.topic.progress?.[0]?.completed ?? 0}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
