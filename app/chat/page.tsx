import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import { getUserPlan, hasPlanFeature } from "@/lib/access";
import MainLayout from "@/components/layout/MainLayout";
import ChatbotClient from "@/components/chat/ChatbotClient";
import FeatureLockCard from "@/components/access/FeatureLockCard";

export default async function ChatPage() {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/sign-in");
  }

  const plan = getUserPlan(viewer);

  return (
    <MainLayout>
      {hasPlanFeature(plan, "ai-chat") ? (
        <ChatbotClient />
      ) : (
        <FeatureLockCard
          title="AI Coach is part of GradeUp Plus"
          description="Free users still get subjects, quizzes, flashcards, schedules, and past papers. Plus unlocks the live AI tutor so you can keep the more expensive help reserved for paying users."
        />
      )}
    </MainLayout>
  );
}
