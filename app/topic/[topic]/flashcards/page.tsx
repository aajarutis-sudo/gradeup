import { redirect } from "next/navigation";

export default async function TopicFlashcardsAliasPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  redirect(`/topics/${topic}/flashcards`);
}
