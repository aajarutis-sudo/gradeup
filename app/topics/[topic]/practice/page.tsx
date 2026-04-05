import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import AIPracticeQuestionsClient from "@/components/topic/AIPracticeQuestionsClient";

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
    },
  });

  if (!topic) {
    notFound();
  }

  const xp = await prisma.revisionRPGProfile.findUnique({
    where: { userId: viewer.id },
  });

  return (
    <MainLayout>
      <AIPracticeQuestionsClient
        topicSlug={topic.slug}
        topicTitle={topic.title}
        subjectName={topic.subject.name ?? topic.subject.title}
        level={xp?.level ?? 1}
      />
    </MainLayout>
  );
}
