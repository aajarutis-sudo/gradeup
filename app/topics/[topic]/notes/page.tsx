import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { getUserPlan, hasPlanFeature } from "@/lib/access";
import MainLayout from "@/components/layout/MainLayout";
import AILessonNotesClient from "@/components/topic/AILessonNotesClient";
import FeatureLockCard from "@/components/access/FeatureLockCard";

export default async function TopicNotesPage({
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
      subtopics: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!topic) {
    notFound();
  }

  const plan = getUserPlan(viewer);

  return (
    <MainLayout>
      {hasPlanFeature(plan, "ai-notes") ? (
        <AILessonNotesClient
          subjectName={topic.subject.name ?? topic.subject.title}
          examBoard={topic.examBoard ?? topic.subject.examBoard}
          topicTitle={topic.title}
          summary={topic.summary}
          subtopics={topic.subtopics.map((subtopic) => subtopic.title)}
        />
      ) : (
        <FeatureLockCard
          title="AI notes are part of GradeUp Plus"
          description="The free plan still includes seeded lesson content, flashcards, quizzes, schedules, and past papers. Plus unlocks fresh AI notes for each topic when you want deeper revision support."
        />
      )}
    </MainLayout>
  );
}
