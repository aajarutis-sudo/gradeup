import { redirect } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Badge from "@/components/ui/Badge";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { getViewer } from "@/lib/auth";

export default async function OnboardingPage() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  return (
    <MainLayout>
      <OnboardingShell currentStep={0}>
        <Card className="rounded-[36px] animate-fade-up">
          <Badge>Welcome</Badge>
          <PageTitle className="mt-3 text-4xl">Let’s set up your revision path</PageTitle>
          <SubTitle className="mt-3">
            Start with a short diagnostic quiz. We’ll estimate a grade, suggest focus topics, and build your first dashboard.
          </SubTitle>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/onboarding/subjects" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
              Start diagnostic quiz
            </a>
          </div>
        </Card>
      </OnboardingShell>
    </MainLayout>
  );
}
