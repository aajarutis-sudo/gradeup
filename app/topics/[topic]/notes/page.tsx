import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import AILessonNotesClient from "@/components/topic/AILessonNotesClient";

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

  return (
    <MainLayout>
      <AILessonNotesClient
        subjectName={topic.subject.name ?? topic.subject.title}
        examBoard={topic.examBoard ?? topic.subject.examBoard}
        topicTitle={topic.title}
        summary={topic.summary}
        subtopics={topic.subtopics.map((subtopic) => subtopic.title)}
      />
    </MainLayout>
  );
}
