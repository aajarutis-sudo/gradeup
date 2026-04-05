import { redirect } from "next/navigation";

export default async function TopicQuizAliasPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  redirect(`/topics/${topic}/quiz`);
}
