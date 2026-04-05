import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { getUserPlan, hasPlanFeature } from "@/lib/access";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/cards/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ProgressBar from "@/components/ui/ProgressBar";
import SimpleMarkdown from "@/components/ui/SimpleMarkdown";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const { topic: topicSlug } = await params;
  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: {
      subject: true,
      lessons: true,
      flashcards: { take: 6 },
      questions: { take: 5 },
      subtopics: {
        orderBy: { orderIndex: "asc" },
      },
      progress: { where: { userId: viewer.id } },
    },
  });

  if (!topic) {
    notFound();
  }

  const progress = topic.progress[0];
  const completion = progress?.completed ?? 0;
  const plan = getUserPlan(viewer);
  const hasAINotes = hasPlanFeature(plan, "ai-notes");
  const hasAIPractice = hasPlanFeature(plan, "ai-practice");

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionHeading
          eyebrow={topic.subject.name ?? topic.subject.title}
          title={topic.title}
          description={topic.summary ?? "Use the overview below to revise, then move into quizzes or flashcards."}
        />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Progress snapshot" subtitle="Your latest score and completion status.">
            <div className="space-y-4">
              <ProgressBar value={completion} label="Topic completion" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] bg-[var(--background)] p-4">
                  <p className="text-sm text-muted">Quiz questions</p>
                  <p className="mt-2 text-2xl font-bold">{topic.questions.length}</p>
                </div>
                <div className="rounded-[22px] bg-[var(--background)] p-4">
                  <p className="text-sm text-muted">Flashcards</p>
                  <p className="mt-2 text-2xl font-bold">{topic.flashcards.length}</p>
                </div>
                <div className="rounded-[22px] bg-[var(--background)] p-4">
                  <p className="text-sm text-muted">Focus time</p>
                  <p className="mt-2 text-2xl font-bold">{topic.estimatedMins}m</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Choose your mode" subtitle="Different revision modes for the same topic.">
            <div className="grid gap-3">
              <Link
                href={hasAINotes ? `/topics/${topic.slug}/notes` : "/plans"}
                className="relative overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--background)] px-5 py-4 font-semibold"
              >
                <span className="absolute inset-y-0 left-0 w-2 rounded-l-[22px] bg-[linear-gradient(180deg,var(--secondary),var(--primary))]" />
                <span className="ml-3 flex items-center justify-between gap-3">
                  <span>Read AI notes</span>
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_28%,transparent)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
                    {hasAINotes ? "AI" : "Plus"}
                  </span>
                </span>
              </Link>
              <Link href={`/topics/${topic.slug}/quiz`} className="rounded-[22px] bg-[var(--primary)] px-5 py-4 font-semibold text-white">
                Start quiz
              </Link>
              <Link href={`/topics/${topic.slug}/flashcards`} className="rounded-[22px] bg-[var(--background)] px-5 py-4 font-semibold">
                Review flashcards
              </Link>
              <Link
                href={hasAIPractice ? `/topics/${topic.slug}/practice` : "/plans"}
                className="relative overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--background)] px-5 py-4 font-semibold"
              >
                <span className="absolute inset-y-0 left-0 w-2 rounded-l-[22px] bg-[linear-gradient(180deg,var(--accent),var(--primary))]" />
                <span className="ml-3 flex items-center justify-between gap-3">
                  <span>Practice questions</span>
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_28%,transparent)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
                    {hasAIPractice ? "AI" : "Plus"}
                  </span>
                </span>
              </Link>
              <Link href={`/subjects/${topic.subject.slug}`} className="rounded-[22px] bg-[var(--background)] px-5 py-4 font-semibold">
                Back to {topic.subject.name ?? topic.subject.title}
              </Link>
            </div>
          </Card>
        </div>

        <Card title="Subtopics to master" subtitle="One level deeper so revision feels specific, not vague.">
          <div className="grid gap-4 md:grid-cols-3">
            {topic.subtopics.map((subtopic) => (
              <article key={subtopic.id} className="rounded-[24px] bg-[var(--background)] p-5">
                <h2 className="text-lg font-bold">{subtopic.title}</h2>
                <p className="mt-2 text-sm text-muted">{subtopic.summary ?? "Revisit this subtopic through examples and exam practice."}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card title="Lesson notes" subtitle="Starter lesson content seeded for this topic.">
          <div className="space-y-4">
            {topic.lessons.map((lesson) => (
              <article key={lesson.id} className="rounded-[24px] bg-[var(--background)] p-5">
                <h2 className="text-xl font-bold">{lesson.title}</h2>
                <SimpleMarkdown
                  content={lesson.content ?? "Lesson content coming soon."}
                  className="mt-3"
                />
              </article>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
