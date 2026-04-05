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
        <div className="space-y-5">
          <FeatureLockCard
            title="AI Coach is part of GradeUp Plus"
            description="Free users still get subjects, quizzes, flashcards, schedules, and past papers. Plus unlocks the live AI tutor so you can keep the more expensive help reserved for paying users."
          />
          <div className="rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_85%,var(--accent)_15%)] p-5 text-sm text-muted">
            You will not be charged anything until GradeUp Plus actually launches. Until then, the free revision core stays open and usable on its own.
          </div>
        </div>
      )}
    </MainLayout>
  );
}
