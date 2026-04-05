import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { getUserPlan, hasPlanFeature } from "@/lib/access";
import MainLayout from "@/components/layout/MainLayout";
import AIPracticeQuestionsClient from "@/components/topic/AIPracticeQuestionsClient";
import FeatureLockCard from "@/components/access/FeatureLockCard";

export default async function TopicPracticePage({
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

  const xp = await prisma.revisionRPGProfile.findUnique({
    where: { userId: viewer.id },
  });

  const plan = getUserPlan(viewer);

  return (
    <MainLayout>
      {hasPlanFeature(plan, "ai-practice") ? (
        <AIPracticeQuestionsClient
          topicSlug={topic.slug}
          topicTitle={topic.title}
          subjectName={topic.subject.name ?? topic.subject.title}
          level={xp?.level ?? 1}
          examBoard={topic.examBoard ?? topic.subject.examBoard}
          summary={topic.summary}
          subtopics={topic.subtopics.map((subtopic) => subtopic.title)}
        />
      ) : (
        <FeatureLockCard
          title="AI practice sets are part of GradeUp Plus"
          description="Free users still have the main quiz flow, flashcards, revision schedule, and past paper tools. Plus adds on-demand AI practice sets for extra retrieval whenever you want them."
        />
      )}
    </MainLayout>
  );
}
