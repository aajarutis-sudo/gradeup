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
        <div className="mx-auto max-w-4xl space-y-5">
          <FeatureLockCard
            title="AI Coach is part of GradeUp Plus"
            description="Free users still get subjects, quizzes, flashcards, schedules, and past papers. Plus unlocks the live AI tutor so you can keep the more expensive help reserved for paying users."
          />
          <div className="rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_85%,var(--accent)_15%)] p-5 text-sm text-muted">
            You will not be charged anything until GradeUp Plus actually launches. Until then, the free revision core stays open and usable on its own.
          </div>
          <div className="grid gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--background)] p-5 md:grid-cols-3">
            <div className="rounded-[22px] bg-[var(--surface-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Free now</p>
              <p className="mt-2 text-sm text-muted">Subjects, flashcards, quizzes, schedule planning, and past papers stay usable without paying.</p>
            </div>
            <div className="rounded-[22px] bg-[var(--surface-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Why AI is gated</p>
              <p className="mt-2 text-sm text-muted">Live tutoring costs more to run, so it sits in the paid layer instead of weakening the free revision core.</p>
            </div>
            <div className="rounded-[22px] bg-[var(--surface-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">What happens next</p>
              <p className="mt-2 text-sm text-muted">Use the free tools now, then join the waitlist on Plans if you want early access when Plus launches.</p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
