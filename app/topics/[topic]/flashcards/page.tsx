import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import FlashcardDeck from "@/components/topic/FlashcardDeck";

export default async function TopicFlashcardsPage({
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
      flashcards: true,
    },
  });

  if (!topic) {
    notFound();
  }

  return (
    <MainLayout>
      <FlashcardDeck
        topicSlug={topic.slug}
        topicTitle={topic.title}
        cards={topic.flashcards.map((card) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
        }))}
      />
    </MainLayout>
  );
}
