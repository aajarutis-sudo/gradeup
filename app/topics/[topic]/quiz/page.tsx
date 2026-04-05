import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import QuizClient from "@/components/topic/QuizClient";

export default async function TopicQuizPage({
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
      questions: true,
    },
  });

  if (!topic) {
    notFound();
  }

  return (
    <MainLayout>
      <QuizClient
        topicSlug={topic.slug}
        topicTitle={topic.title}
        questions={topic.questions.map((question) => ({
          id: question.id,
          prompt: question.prompt ?? question.questionText,
          correctAnswer: question.correctAnswer ?? question.sampleAnswer,
          explanation: question.explanation ?? null,
          options: [question.optionA, question.optionB, question.optionC, question.optionD].filter(Boolean) as string[],
        }))}
      />
    </MainLayout>
  );
}
